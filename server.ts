import express from "express";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { 
  dbInstance, 
  Unit, 
  Item, 
  InventoryLot, 
  GroceryEntry, 
  PriceHistory, 
  Recipe, 
  Session, 
  User 
} from "./server/db";
import { 
  parseReceiptImage, 
  parseReceiptText, 
  getRestockPredictions, 
  suggestAIBoughtIngredients 
} from "./server/ai";
import { demoCatalogTemplates } from "./server/demoCatalog";

dotenv.config();

const app = express();
const PORT = 3000;

// Boost body size limits to support raw camera scanned image uploads
app.use(express.json({ limit: "15mb" }));

// ----------------------------------------------------
// AUTHENTICATION MIDDLEWARE
// ----------------------------------------------------
function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.query.token) {
    token = req.query.token as string;
  }

  if (!token) {
    return res.status(401).json({ error: "Missing session token" });
  }

  const sessions = dbInstance.getSessions();
  const session = sessions.find(s => s.token === token);
  if (!session) {
    return res.status(401).json({ error: "Invalid session token" });
  }

  if (new Date(session.expiresAt) < new Date()) {
    // expired session
    dbInstance.save(); // save filtered if we were to clean, let's keep clean for now
    return res.status(401).json({ error: "Session has expired" });
  }

  const users = dbInstance.getUsers();
  const user = users.find(u => u.id === session.userId);
  if (!user) {
    return res.status(401).json({ error: "User account not found" });
  }

  req.user = user;
  next();
}

// ----------------------------------------------------
// AUTH CHANNELS / ROUTERS
// ----------------------------------------------------
app.post("/api/auth/register", (req, res) => {
  const { email, password, name, householdName } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Please offer name, email, and password." });
  }

  const users = dbInstance.getUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "Email already registered." });
  }

  const householdId = `household-${crypto.randomBytes(6).toString("hex")}`;
  dbInstance.getHouseholds().push({
    id: householdId,
    name: householdName || `${name}'s Household`
  });

  const newUser: User = {
    id: `user-${crypto.randomBytes(6).toString("hex")}`,
    email: email.toLowerCase(),
    passwordHash: password, // simple validation
    name,
    householdId
  };
  users.push(newUser);

  // Generate session token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days valid

  dbInstance.getSessions().push({
    token,
    userId: newUser.id,
    expiresAt: expiresAt.toISOString()
  });

  dbInstance.save();
  return res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, householdId: newUser.householdId } });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please enter your email and password." });
  }

  const users = dbInstance.getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.passwordHash !== password) {
    return res.status(400).json({ error: "Invalid email or password." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  dbInstance.getSessions().push({
    token,
    userId: user.id,
    expiresAt: expiresAt.toISOString()
  });

  dbInstance.save();
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, householdId: user.householdId } });
});

app.post("/api/auth/logout", requireAuth, (req: any, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const sessions = dbInstance.getSessions();
    const idx = sessions.findIndex(s => s.token === token);
    if (idx !== -1) {
      sessions.splice(idx, 1);
      dbInstance.save();
    }
  }
  return res.json({ success: true });
});

app.get("/api/auth/current", (req: any, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not logged in" });
  }
  const token = authHeader.split(" ")[1];
  const session = dbInstance.getSessions().find(s => s.token === token);
  if (!session || new Date(session.expiresAt) < new Date()) {
    return res.status(401).json({ error: "Session expired" });
  }
  const user = dbInstance.getUsers().find(u => u.id === session.userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }
  return res.json({ id: user.id, name: user.name, email: user.email, householdId: user.householdId });
});

// ----------------------------------------------------
// DASHBOARD & ANALYTICS SUMMARY
// ----------------------------------------------------
app.get("/api/dashboard/summary", requireAuth, (req: any, res) => {
  const householdId = req.user.householdId;
  const now = new Date();

  // Active pantry items
  const items = dbInstance.getItems().filter(i => i.householdId === householdId);
  const itemIds = items.map(i => i.id);

  // Filter lots belonging to these items
  const lots = dbInstance.getInventoryLots().filter(l => itemIds.includes(l.itemId));
  
  // Calculate active lots remaining (not fully consumed)
  const activeLots = lots.filter(l => (l.qty - l.consumedQty) > 0.001);
  const totalActiveQuantity = activeLots.reduce((acc, current) => acc + (current.qty - current.consumedQty), 0);

  // Expiring soon count (lots expiring within next 3 days)
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);

  const expiringSoonCount = activeLots.filter(l => {
    if (!l.expiryAt) return false;
    const expDate = new Date(l.expiryAt);
    return expDate >= now && expDate <= threeDaysFromNow;
  }).length;

  const expiredCount = activeLots.filter(l => {
    if (!l.expiryAt) return false;
    const expDate = new Date(l.expiryAt);
    return expDate < now;
  }).length;

  // Compute stock levels per item to find low stock alarms
  let lowStockAlarmCount = 0;
  items.forEach(it => {
    const totalInStock = lots
      .filter(l => l.itemId === it.id)
      .reduce((sum, l) => sum + (l.qty - l.consumedQty), 0);
    if (totalInStock < it.minStockQty) {
      lowStockAlarmCount++;
    }
  });

  // Shopping list entries count
  const lists = dbInstance.getGroceryLists().filter(l => l.householdId === householdId);
  const mainList = lists[0] || { id: "" };
  const entriesCount = dbInstance.getGroceryEntries()
    .filter(e => e.listId === mainList.id && !e.checked).length;

  return res.json({
    totalUniqueItems: items.length,
    activeLotsCount: activeLots.length,
    expiringSoonCount,
    expiredCount,
    lowStockAlarmCount,
    shoppingListItemsCount: entriesCount
  });
});

// ----------------------------------------------------
// PANTRY / CATALOG ITEMS CRUD
// ----------------------------------------------------
app.post("/api/inventory/seed-catalog", requireAuth, (req: any, res) => {
  const householdId = req.user.householdId;
  const existingItems = dbInstance.getItems().filter(i => i.householdId === householdId);
  const existingNames = new Set(existingItems.map(i => i.name.toLowerCase().trim()));

  let addedItemsCount = 0;
  let addedLotsCount = 0;

  const newItems: Item[] = [];

  demoCatalogTemplates.forEach(template => {
    const normName = template.name.toLowerCase().trim();
    if (!existingNames.has(normName)) {
      const newItemId = `item-${crypto.randomBytes(6).toString("hex")}`;
      const newItem: Item = {
        id: newItemId,
        householdId,
        name: template.name,
        barcode: null,
        defaultUnit: template.defaultUnit,
        category: template.category,
        preferredAisle: template.preferredAisle,
        minStockQty: template.minStockQty,
        imageUrl: template.imageUrl
      };
      dbInstance.getItems().push(newItem);
      newItems.push(newItem);
      addedItemsCount++;
    }
  });

  // Seed select lots to make visual experience immediately interesting!
  if (addedItemsCount > 0) {
    const lotSeedingPresets = [
      { name: "Long-grain white rice", qty: 2, daysToExpire: 365, notes: "Pantry Stocked" },
      { name: "Spaghetti", qty: 3, daysToExpire: 180, notes: "Italian Import" },
      { name: "All-purpose flour", qty: 1, daysToExpire: 120, notes: "Baking Shelf" },
      { name: "Canned chickpeas", qty: 4, daysToExpire: 730, notes: "Canned Row B" },
      { name: "Extra virgin olive oil", qty: 1, daysToExpire: 300, notes: "Cold pressed" },
      { name: "AA batteries", qty: 1, daysToExpire: 1000, notes: "Emergency box" },
      { name: "Adhesive bandages", qty: 2, daysToExpire: 1400, notes: "First Aid Kit" },
      { name: "Liquid dish soap", qty: 1, daysToExpire: 500, notes: "Sink Cabinet" },
      { name: "Jasmine rice", qty: 1, daysToExpire: 240, notes: "Aromatic Bag" },
      { name: "Toilet paper", qty: 1, daysToExpire: 400, notes: "Linen Closet" }
    ];

    const now = new Date();
    lotSeedingPresets.forEach(preset => {
      // Look in both existing items and newItems to be safe
      const matchedItem = dbInstance.getItems().find(it => it.householdId === householdId && it.name.toLowerCase() === preset.name.toLowerCase());
      if (matchedItem) {
        // Only seed if no lots already exist for this item to avoid cluttering if clicking again
        const hasExistingLots = dbInstance.getInventoryLots().some(l => l.itemId === matchedItem.id);
        if (!hasExistingLots) {
          const lotId = `lot-${crypto.randomBytes(6).toString("hex")}`;
          const expiryDate = new Date();
          expiryDate.setDate(now.getDate() + preset.daysToExpire);

          dbInstance.getInventoryLots().push({
            id: lotId,
            itemId: matchedItem.id,
            qty: preset.qty,
            unit: matchedItem.defaultUnit,
            boughtAt: now.toISOString(),
            expiryAt: expiryDate.toISOString(),
            notes: preset.notes,
            consumedQty: 0
          });
          addedLotsCount++;
        }
      }
    });
  }

  dbInstance.save();

  return res.json({ 
    success: true, 
    addedItemsCount, 
    addedLotsCount, 
    message: `Successfully loaded ${addedItemsCount} professional catalog products with Unsplash visuals and configured ${addedLotsCount} stock lots!`
  });
});

app.get("/api/inventory/items", requireAuth, (req: any, res) => {
  const householdId = req.user.householdId;
  const items = dbInstance.getItems().filter(i => i.householdId === householdId);
  
  // Attach total current stock on each item for list rendering
  const lots = dbInstance.getInventoryLots();
  const itemsWithCounts = items.map(it => {
    const totalStock = lots
      .filter(l => l.itemId === it.id)
      .reduce((sum, l) => sum + (l.qty - l.consumedQty), 0);
    return { ...it, currentStock: totalStock };
  });

  return res.json(itemsWithCounts);
});

app.post("/api/inventory/items", requireAuth, (req: any, res) => {
  const householdId = req.user.householdId;
  const { name, barcode, defaultUnit, category, preferredAisle, minStockQty, imageUrl } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Item name is required" });
  }

  const newItem: Item = {
    id: `item-${crypto.randomBytes(6).toString("hex")}`,
    householdId,
    name,
    barcode: barcode || null,
    defaultUnit: (defaultUnit as Unit) || Unit.PIECE,
    category: category || "Misc",
    preferredAisle: preferredAisle || "Aisle Misc",
    minStockQty: Number(minStockQty) >= 0 ? Number(minStockQty) : 1,
    imageUrl: imageUrl || null
  };

  dbInstance.getItems().push(newItem);
  dbInstance.save();
  return res.json(newItem);
});

app.put("/api/inventory/items/:id", requireAuth, (req: any, res) => {
  const householdId = req.user.householdId;
  const { id } = req.params;
  const { name, barcode, defaultUnit, category, preferredAisle, minStockQty, imageUrl } = req.body;

  const item = dbInstance.getItems().find(i => i.id === id && i.householdId === householdId);
  if (!item) {
    return res.status(404).json({ error: "Item not found in household" });
  }

  if (name) item.name = name;
  if (barcode !== undefined) item.barcode = barcode || null;
  if (defaultUnit) item.defaultUnit = defaultUnit as Unit;
  if (category) item.category = category;
  if (preferredAisle) item.preferredAisle = preferredAisle;
  if (minStockQty !== undefined) item.minStockQty = Number(minStockQty) >= 0 ? Number(minStockQty) : 1;
  if (imageUrl !== undefined) item.imageUrl = imageUrl || null;

  dbInstance.save();
  return res.json(item);
});

app.delete("/api/inventory/items/:id", requireAuth, (req: any, res) => {
  const householdId = req.user.householdId;
  const { id } = req.params;

  const items = dbInstance.getItems();
  const idx = items.findIndex(i => i.id === id && i.householdId === householdId);
  if (idx === -1) {
    return res.status(404).json({ error: "Item not found" });
  }

  // Delete all lots pointing to this item
  const lots = dbInstance.getInventoryLots();
  const filteredLots = lots.filter(l => l.itemId !== id);
  // Re-assign array manually to DB instance
  dbInstance.getInventoryLots().length = 0;
  filteredLots.forEach(l => dbInstance.getInventoryLots().push(l));

  // Remove the item
  items.splice(idx, 1);
  dbInstance.save();

  return res.json({ success: true });
});

// ----------------------------------------------------
// PANTRY / LOTS (ADD, CONSUME, EXPIRE)
// ----------------------------------------------------
app.get("/api/inventory/overview", requireAuth, (req: any, res) => {
  const householdId = req.user.householdId;
  
  const items = dbInstance.getItems().filter(i => i.householdId === householdId);
  const itemIds = items.map(i => i.id);

  const lots = dbInstance.getInventoryLots().filter(l => itemIds.includes(l.itemId));
  
  // Form complete overview details of individual non-depleted lots
  const activeLotsView = lots
    .filter(l => (l.qty - l.consumedQty) > 0.001)
    .map(l => {
      const it = items.find(i => i.id === l.itemId)!;
      return {
        lotId: l.id,
        itemId: l.itemId,
        itemName: it.name,
        category: it.category,
        defaultUnit: it.defaultUnit,
        preferredAisle: it.preferredAisle,
        qty: l.qty,
        consumedQty: l.consumedQty,
        remainingQty: l.qty - l.consumedQty,
        unit: l.unit,
        boughtAt: l.boughtAt,
        expiryAt: l.expiryAt,
        notes: l.notes
      };
    });

  // Sort by expiry (items with expiry dates first, then null expiries)
  activeLotsView.sort((a, b) => {
    if (!a.expiryAt) return 1;
    if (!b.expiryAt) return -1;
    return new Date(a.expiryAt).getTime() - new Date(b.expiryAt).getTime();
  });

  return res.json(activeLotsView);
});

app.post("/api/inventory/lots", requireAuth, (req: any, res) => {
  const { itemId, qty, unit, expiryAt, notes } = req.body;
  
  if (!itemId || !qty || !unit) {
    return res.status(400).json({ error: "Missing required lot parameters (itemId, qty, unit)" });
  }

  // Cross-reference item household to secure
  const item = dbInstance.getItems().find(i => i.id === itemId && i.householdId === req.user.householdId);
  if (!item) {
    return res.status(404).json({ error: "Base item not found" });
  }

  const newLot: InventoryLot = {
    id: `lot-${crypto.randomBytes(6).toString("hex")}`,
    itemId,
    qty: Number(qty),
    unit: unit as Unit,
    boughtAt: new Date().toISOString(),
    expiryAt: expiryAt ? new Date(expiryAt).toISOString() : null,
    notes: notes || null,
    consumedQty: 0
  };

  dbInstance.getInventoryLots().push(newLot);
  dbInstance.save();
  return res.json(newLot);
});

// Incremental consumption update APIs
app.post("/api/inventory/consume", requireAuth, (req: any, res) => {
  const { lotId, qty } = req.body;
  if (!lotId || qty === undefined) {
    return res.status(400).json({ error: "Please enter lotId and quantity." });
  }

  const lot = dbInstance.getInventoryLots().find(l => l.id === lotId);
  if (!lot) {
    return res.status(404).json({ error: "Inventory lot not found." });
  }

  // Double check user access via item owner
  const item = dbInstance.getItems().find(i => i.id === lot.itemId && i.householdId === req.user.householdId);
  if (!item) {
    return res.status(403).json({ error: "Access denied." });
  }

  const remaining = lot.qty - lot.consumedQty;
  const requestedConsume = Number(qty);

  if (requestedConsume > remaining) {
    // limit to available
    lot.consumedQty = lot.qty;
  } else {
    lot.consumedQty = Number((lot.consumedQty + requestedConsume).toFixed(3));
  }

  dbInstance.save();
  return res.json({ success: true, remaining: lot.qty - lot.consumedQty });
});

// Delete lot
app.delete("/api/inventory/lots/:id", requireAuth, (req: any, res) => {
  const { id } = req.params;
  const lot = dbInstance.getInventoryLots().find(l => l.id === id);
  if (!lot) {
    return res.status(404).json({ error: "Lot not found" });
  }

  const item = dbInstance.getItems().find(i => i.id === lot.itemId && i.householdId === req.user.householdId);
  if (!item) {
    return res.status(403).json({ error: "Access denied" });
  }

  const lots = dbInstance.getInventoryLots();
  const idx = lots.findIndex(l => l.id === id);
  if (idx !== -1) {
    lots.splice(idx, 1);
    dbInstance.save();
  }

  return res.json({ success: true });
});

// ----------------------------------------------------
// GROCERY SHOPPING LISTS ENDPOINTS
// ----------------------------------------------------
app.get("/api/list/current", requireAuth, (req: any, res) => {
  const householdId = req.user.householdId;
  
  // Find or create a default list for this household
  let lists = dbInstance.getGroceryLists().filter(l => l.householdId === householdId);
  if (lists.length === 0) {
    const listId = `list-${crypto.randomBytes(6).toString("hex")}`;
    const newList = {
      id: listId,
      householdId,
      title: "Main Household List",
      createdAt: new Date().toISOString()
    };
    dbInstance.getGroceryLists().push(newList);
    dbInstance.save();
    lists = [newList];
  }

  const activeList = lists[0];
  const entries = dbInstance.getGroceryEntries()
    .filter(e => e.listId === activeList.id)
    .map(e => {
      let resolvedItem = null;
      if (e.itemId) {
        resolvedItem = dbInstance.getItems().find(i => i.id === e.itemId);
      }
      return {
        ...e,
        item: resolvedItem
      };
    });

  return res.json({
    listId: activeList.id,
    title: activeList.title,
    entries
  });
});

app.post("/api/list/:listId/add", requireAuth, (req: any, res) => {
  const { listId } = req.params;
  const { itemId, customText, qty, unit, source, neededBy } = req.body;

  // Validate list exists and user has access
  const list = dbInstance.getGroceryLists().find(l => l.id === listId && l.householdId === req.user.householdId);
  if (!list) {
    return res.status(404).json({ error: "Grocery list not found" });
  }

  // Create new entry
  const newEntry: GroceryEntry = {
    id: `entry-${crypto.randomBytes(6).toString("hex")}`,
    listId,
    itemId: itemId || null,
    customText: customText || null,
    qty: qty !== undefined ? Number(qty) : 1,
    unit: unit ? (unit as Unit) : null,
    checked: false,
    source: source || "manual",
    neededBy: neededBy || null
  };

  dbInstance.getGroceryEntries().push(newEntry);
  dbInstance.save();
  return res.json(newEntry);
});

app.patch("/api/list/entry/:id/check", requireAuth, (req: any, res) => {
  const { id } = req.params;
  const { checked } = req.body;

  const entry = dbInstance.getGroceryEntries().find(e => e.id === id);
  if (!entry) {
    return res.status(404).json({ error: "Grocery ingredient entry not found" });
  }

  // Validate list household mapping
  const list = dbInstance.getGroceryLists().find(l => l.id === entry.listId && l.householdId === req.user.householdId);
  if (!list) {
    return res.status(403).json({ error: "Access denied" });
  }

  entry.checked = Boolean(checked);
  dbInstance.save();
  return res.json(entry);
});

// Update grocery element quantity
app.post("/api/list/entry/:id/update", requireAuth, (req: any, res) => {
  const { id } = req.params;
  const { qty, customText } = req.body;

  const entry = dbInstance.getGroceryEntries().find(e => e.id === id);
  if (!entry) {
    return res.status(404).json({ error: "Entry not found" });
  }

  const list = dbInstance.getGroceryLists().find(l => l.id === entry.listId && l.householdId === req.user.householdId);
  if (!list) {
    return res.status(403).json({ error: "Access denied" });
  }

  if (qty !== undefined) entry.qty = Number(qty);
  if (customText !== undefined) entry.customText = customText;

  dbInstance.save();
  return res.json(entry);
});

app.delete("/api/list/entry/:id", requireAuth, (req: any, res) => {
  const { id } = req.params;
  const entry = dbInstance.getGroceryEntries().find(e => e.id === id);
  if (!entry) {
    return res.status(404).json({ error: "Entry not found" });
  }

  const list = dbInstance.getGroceryLists().find(l => l.id === entry.listId && l.householdId === req.user.householdId);
  if (!list) {
    return res.status(403).json({ error: "Access denied" });
  }

  const entries = dbInstance.getGroceryEntries();
  const idx = entries.findIndex(e => e.id === id);
  if (idx !== -1) {
    entries.splice(idx, 1);
    dbInstance.save();
  }

  return res.json({ success: true });
});

// Clear checked items from list
app.post("/api/list/clear-checked", requireAuth, (req: any, res) => {
  const { listId } = req.body;
  if (!listId) {
    return res.status(400).json({ error: "Missing listId" });
  }

  const list = dbInstance.getGroceryLists().find(l => l.id === listId && l.householdId === req.user.householdId);
  if (!list) {
    return res.status(403).json({ error: "Access denied" });
  }

  const entries = dbInstance.getGroceryEntries();
  const remaining = entries.filter(e => !(e.listId === listId && e.checked));
  
  dbInstance.getGroceryEntries().length = 0;
  remaining.forEach(e => dbInstance.getGroceryEntries().push(e));

  dbInstance.save();
  return res.json({ success: true });
});

// ----------------------------------------------------
// RECIPES ENDPOINTS
// ----------------------------------------------------
app.get("/api/recipes", requireAuth, (req: any, res) => {
  const recipes = dbInstance.getRecipes().filter(r => r.householdId === req.user.householdId);
  return res.json(recipes);
});

app.post("/api/list/add-recipe", requireAuth, (req: any, res) => {
  const { listId, recipeId } = req.body;
  
  const list = dbInstance.getGroceryLists().find(l => l.id === listId && l.householdId === req.user.householdId);
  const recipe = dbInstance.getRecipes().find(r => r.id === recipeId && r.householdId === req.user.householdId);

  if (!list || !recipe) {
    return res.status(404).json({ error: "List or Recipe not found" });
  }

  // Push each ingredient to list entries
  recipe.ingredients.forEach(ing => {
    // Generate shopping entries
    dbInstance.getGroceryEntries().push({
      id: `entry-${crypto.randomBytes(6).toString("hex")}`,
      listId: list.id,
      itemId: ing.itemId,
      customText: ing.itemId ? null : ing.name,
      qty: ing.qty,
      unit: ing.unit,
      checked: false,
      source: "recipe",
      neededBy: null
    });
  });

  dbInstance.save();
  return res.json({ success: true, count: recipe.ingredients.length });
});

// Helper: Upsert item for scans/OCR with high-fidelity template match (image and default settings)
function findOrCreateItemByName(householdId: string, name: string, category: string, defaultUnit: Unit): Item {
  const formattedName = name.trim();
  const existing = dbInstance.getItems().find(
    i => i.householdId === householdId && i.name.toLowerCase() === formattedName.toLowerCase()
  );

  if (existing) return existing;

  // Search in our curated catalog of 110+ items for a matching image profile!
  let matchedImage: string | null = null;
  let customCategory = category || "Misc";
  let customAisle = `Aisle ${category || "General"}`;
  let customMinStock = 1;

  // Exact or contains match on catalog templates
  const templateMatch = demoCatalogTemplates.find(
    t => t.name.toLowerCase() === formattedName.toLowerCase()
  ) || demoCatalogTemplates.find(
    t => formattedName.toLowerCase().includes(t.name.toLowerCase()) || t.name.toLowerCase().includes(formattedName.toLowerCase())
  );

  if (templateMatch) {
    matchedImage = templateMatch.imageUrl;
    if (!category || category === "Misc") {
      customCategory = templateMatch.category;
    }
    customAisle = templateMatch.preferredAisle;
    customMinStock = templateMatch.minStockQty;
  } else {
    // Basic fallback keywords to assign nice stock images
    const lowercaseName = formattedName.toLowerCase();
    if (lowercaseName.includes("milk") || lowercaseName.includes("dairy") || lowercaseName.includes("curd") || lowercaseName.includes("cheese")) {
      matchedImage = "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=300&h=300";
    } else if (lowercaseName.includes("egg")) {
      matchedImage = "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&q=80&w=300&h=300";
    } else if (lowercaseName.includes("bread") || lowercaseName.includes("croissant") || lowercaseName.includes("bun") || lowercaseName.includes("roti")) {
      matchedImage = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300&h=300";
    } else if (lowercaseName.includes("apple") || lowercaseName.includes("banana") || lowercaseName.includes("orange") || lowercaseName.includes("mango")) {
      matchedImage = "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=300&h=300";
    } else if (lowercaseName.includes("rice") || lowercaseName.includes("quinoa") || lowercaseName.includes("grain") || lowercaseName.includes("flour")) {
      matchedImage = "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300&h=300";
    } else if (lowercaseName.includes("coffee") || lowercaseName.includes("tea") || lowercaseName.includes("beverage")) {
      matchedImage = "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=300&h=300";
    } else if (lowercaseName.includes("soap") || lowercaseName.includes("detergent") || lowercaseName.includes("shampoo")) {
      matchedImage = "https://images.unsplash.com/photo-1607006342411-9a311043c157?auto=format&fit=crop&q=80&w=300&h=300";
    }
  }

  const newItem: Item = {
    id: `item-${crypto.randomBytes(6).toString("hex")}`,
    householdId,
    name: formattedName,
    barcode: null,
    defaultUnit,
    category: customCategory,
    preferredAisle: customAisle,
    minStockQty: customMinStock,
    imageUrl: matchedImage
  };
  dbInstance.getItems().push(newItem);
  // Auto save will occur on caller save()
  return newItem;
}

// ----------------------------------------------------
// AI FEATURES (OCR, PREDICTIONS, GENERATORS)
// ----------------------------------------------------

// Core OCR receipt Scanner using base64 image payload (or fallback helper text scanner)
app.post("/api/import/receipt-image", requireAuth, async (req: any, res) => {
  const { base64Data, mimeType, storeName } = req.body;
  const householdId = req.user.householdId;

  if (!base64Data || !mimeType) {
    return res.status(400).json({ error: "Missing scanned image details." });
  }

  try {
    const rawItems = await parseReceiptImage(base64Data, mimeType);
    console.log("Successfully scanned receipt with Gemini multimodal API: ", rawItems);

    const importedLots: any[] = [];
    rawItems.forEach((ri: any) => {
      // Clean up units
      let matchUnit = Unit.PIECE;
      const cleanUnitStr = String(ri.unit).toUpperCase();
      if (Object.values(Unit).includes(cleanUnitStr as Unit)) {
        matchUnit = cleanUnitStr as Unit;
      }

      // 1. Fetch or create base catalog item
      const item = findOrCreateItemByName(householdId, ri.name, ri.category, matchUnit);
      
      // 2. Add an inventory lot 
      const newLot: InventoryLot = {
        id: `lot-${crypto.randomBytes(6).toString("hex")}`,
        itemId: item.id,
        qty: Number(ri.qty) || 1,
        unit: matchUnit,
        boughtAt: new Date().toISOString(),
        expiryAt: null, // default to none, will calculate soon or user adds on pantry screen
        notes: storeName || "Scanned Receipt",
        consumedQty: 0
      };
      dbInstance.getInventoryLots().push(newLot);

      // 3. Write Price History
      dbInstance.getPriceHistories().push({
        id: `p-${crypto.randomBytes(6).toString("hex")}`,
        itemId: item.id,
        store: storeName || "Receipt Scan",
        price: Number(ri.price) || 0,
        currency: "INR",
        recordedAt: new Date().toISOString()
      });

      importedLots.push({
        itemName: item.name,
        qty: newLot.qty,
        unit: newLot.unit,
        price: ri.price,
        category: item.category
      });
    });

    dbInstance.save();
    return res.json({ success: true, count: rawItems.length, items: importedLots });
  } catch (e: any) {
    return res.status(500).json({ error: `OCR Analysis failed: ${e.message}. Please check your API key.` });
  }
});

// Raw Text OCR Helper (For fast copy-paste on devices with no active camera or emulator)
app.post("/api/import/receipt-text", requireAuth, async (req: any, res) => {
  const { ocrText, storeName } = req.body;
  const householdId = req.user.householdId;

  if (!ocrText) {
    return res.status(400).json({ error: "ocrText text parameter is required" });
  }

  try {
    const rawItems = await parseReceiptText(ocrText);
    const importedLots: any[] = [];
    
    rawItems.forEach((ri: any) => {
      let matchUnit = Unit.PIECE;
      const cleanUnitStr = String(ri.unit).toUpperCase();
      if (Object.values(Unit).includes(cleanUnitStr as Unit)) {
        matchUnit = cleanUnitStr as Unit;
      }

      const item = findOrCreateItemByName(householdId, ri.name, ri.category, matchUnit);
      
      const newLot: InventoryLot = {
        id: `lot-${crypto.randomBytes(6).toString("hex")}`,
        itemId: item.id,
        qty: Number(ri.qty) || 1,
        unit: matchUnit,
        boughtAt: new Date().toISOString(),
        expiryAt: null,
        notes: storeName || "Scanned Bill",
        consumedQty: 0
      };
      dbInstance.getInventoryLots().push(newLot);

      dbInstance.getPriceHistories().push({
        id: `p-${crypto.randomBytes(6).toString("hex")}`,
        itemId: item.id,
        store: storeName || "Bill Text",
        price: Number(ri.price) || 0,
        currency: "INR",
        recordedAt: new Date().toISOString()
      });

      importedLots.push({
        itemName: item.name,
        qty: newLot.qty,
        unit: newLot.unit,
        price: ri.price,
        category: item.category
      });
    });

    dbInstance.save();
    return res.json({ success: true, count: rawItems.length, items: importedLots });
  } catch (e: any) {
    return res.status(500).json({ error: `Text parse failed: ${e.message}` });
  }
});

// Barcode scanner lookup (stub, can also search by model details if needed)
app.get("/api/barcode/:code", requireAuth, (req: any, res) => {
  const { code } = req.params;
  
  // Look up if we have this barcode mapped locally to an item!
  const localItems = dbInstance.getItems().filter(i => i.householdId === req.user.householdId);
  const match = localItems.find(i => i.barcode === code);
  if (match) {
    return res.json({ found: true, itemId: match.id, name: match.name, category: match.category, unit: match.defaultUnit });
  }

  // Fallback scanner API catalog db
  if (code.startsWith("890")) {
    return res.json({ found: true, itemId: null, name: "Amul Fresh Butter 500g", category: "Dairy", unit: Unit.PACK });
  }
  if (code === "8901262150032") {
    return res.json({ found: true, itemId: null, name: "Amul Fresh Milk", category: "Dairy", unit: Unit.L });
  }
  if (code === "8901234567890") {
    return res.json({ found: true, itemId: null, name: "Whole Wheat Bread", category: "Bakery", unit: Unit.PIECE });
  }

  return res.json({ found: false });
});

// Gemini Predictions engine endpoint
app.get("/api/ai/predictive-restocks", requireAuth, async (req: any, res) => {
  const householdId = req.user.householdId;
  const items = dbInstance.getItems().filter(i => i.householdId === householdId);
  const itemIds = items.map(i => i.id);
  const lots = dbInstance.getInventoryLots().filter(l => itemIds.includes(l.itemId));

  // Prepare inventory snapshot context payload
  const currentSummary = items.map(it => {
    const activeLots = lots.filter(l => l.itemId === it.id && (l.qty - l.consumedQty) > 0.01);
    const totalQty = activeLots.reduce((sum, l) => sum + (l.qty - l.consumedQty), 0);
    
    return {
      itemId: it.id,
      itemName: it.name,
      category: it.category,
      minStockLimit: it.minStockQty,
      defaultUnit: it.defaultUnit,
      currentInStock: totalQty,
      lots: activeLots.map(l => ({
        qty: l.qty,
        remaining: l.qty - l.consumedQty,
        boughtAt: l.boughtAt,
        expiryAt: l.expiryAt
      }))
    };
  });

  try {
    const aiPredictions = await getRestockPredictions(JSON.stringify(currentSummary));
    
    // Supplement predictions with matched itemId locally
    const enriched = aiPredictions.map((pred: any) => {
      const match = items.find(i => i.name.toLowerCase().includes(pred.itemName.toLowerCase()));
      return {
        ...pred,
        itemId: match ? match.id : pred.itemId || null
      };
    });

    return res.json(enriched);
  } catch (e: any) {
    return res.status(500).json({ error: `Forecast failed: ${e.message}` });
  }
});

// AI custom cooking recipe creator endpoint
app.post("/api/ai/suggest-recipe", requireAuth, async (req: any, res) => {
  const { recipeName } = req.body;
  const householdId = req.user.householdId;

  if (!recipeName) {
    return res.status(400).json({ error: "Specify a recipe title." });
  }

  try {
    const rawRecipe = await suggestAIBoughtIngredients(recipeName);
    
    // Insert into db!
    const newRecipeId = `recipe-${crypto.randomBytes(6).toString("hex")}`;
    const mappedIngredients = rawRecipe.ingredients.map((ing: any) => {
      // try to resolve local item
      let validatedUnit = Unit.PIECE;
      const unitStr = String(ing.unit).toUpperCase();
      if (Object.values(Unit).includes(unitStr as Unit)) {
        validatedUnit = unitStr as Unit;
      }

      const itemLocal = dbInstance.getItems().find(
        i => i.householdId === householdId && i.name.toLowerCase() === ing.name.toLowerCase()
      );

      return {
        id: `ring-${crypto.randomBytes(6).toString("hex")}`,
        recipeId: newRecipeId,
        itemId: itemLocal ? itemLocal.id : null,
        name: ing.name,
        qty: Number(ing.qty) || 1,
        unit: validatedUnit
      };
    });

    const newRecipe: Recipe = {
      id: newRecipeId,
      householdId,
      title: rawRecipe.title || recipeName,
      stepsMd: rawRecipe.stepsMd || "",
      ingredients: mappedIngredients
    };

    dbInstance.getRecipes().push(newRecipe);
    dbInstance.save();

    return res.json(newRecipe);
  } catch(e: any) {
    return res.status(500).json({ error: `Failed to formulate AI recipe: ${e.message}` });
  }
});

// ----------------------------------------------------
// VITE INTEGRATION MIDDLEWARE
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // production mode static directory serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`====================================================`);
    console.log(` Smart Grocery List & Inventory Manager is RUNNING`);
    console.log(` Port: ${PORT} (0.0.0.0) - Dev Host Mode Connected`);
    console.log(`====================================================`);
  });
}

startServer();
