import fs from "fs";
import path from "path";
import crypto from "crypto";

export enum Unit {
  PIECE = "PIECE",
  GRAM = "GRAM",
  KG = "KG",
  ML = "ML",
  L = "L",
  TBSP = "TBSP",
  TSP = "TSP",
  PACK = "PACK"
}

export enum Role {
  OWNER = "OWNER",
  MEMBER = "MEMBER"
}

export interface User {
  id: string;
  email: string;
  passwordHash: string; // stored simply
  name: string;
  householdId: string;
}

export interface Household {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  householdId: string;
  name: string;
  barcode: string | null;
  defaultUnit: Unit;
  category: string;
  preferredAisle: string;
  minStockQty: number; // For low stock checks
  imageUrl?: string | null;
}

export interface InventoryLot {
  id: string;
  itemId: string;
  qty: number;
  unit: Unit;
  boughtAt: string;
  expiryAt: string | null;
  notes: string | null;
  consumedQty: number;
}

export interface GroceryList {
  id: string;
  householdId: string;
  title: string;
  createdAt: string;
}

export interface GroceryEntry {
  id: string;
  listId: string;
  itemId: string | null;
  customText: string | null;
  qty: number | null;
  unit: Unit | null;
  checked: boolean;
  source: string | null; // e.g. suggestion, recipe, lowstock, manual
  neededBy: string | null;
}

export interface Recipe {
  id: string;
  householdId: string;
  title: string;
  stepsMd: string;
  ingredients: RecipeIngredient[];
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  itemId: string | null;
  name: string;
  qty: number;
  unit: Unit;
}

export interface PriceHistory {
  id: string;
  itemId: string;
  store: string | null;
  price: number;
  currency: string;
  recordedAt: string;
}

export interface Session {
  token: string;
  userId: string;
  expiresAt: string;
}

interface DatabaseSchema {
  users: User[];
  households: Household[];
  items: Item[];
  inventoryLots: InventoryLot[];
  groceryLists: GroceryList[];
  groceryEntries: GroceryEntry[];
  recipes: Recipe[];
  priceHistories: PriceHistory[];
  sessions: Session[];
}

const DB_FILE = path.join(process.cwd(), "db.json");

class LocalDB {
  private data: DatabaseSchema = {
    users: [],
    households: [],
    items: [],
    inventoryLots: [],
    groceryLists: [],
    groceryEntries: [],
    recipes: [],
    priceHistories: [],
    sessions:[]
  };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(raw);
      } else {
        this.seed();
      }
    } catch (e) {
      console.error("Failed to load local DB, fallback to seed:", e);
      this.seed();
    }
  }

  public save() {
    try {
      // atomic write to avoid corruption
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), "utf-8");
      fs.renameSync(tempFile, DB_FILE);
    } catch (e) {
      console.error("Critical: Failed to save DB to disk:", e);
    }
  }

  private seed() {
    console.log("Seeding initial data for Smart Grocery List & Inventory Manager...");
    const hhId = "household-demo";
    
    this.data.households.push({
      id: hhId,
      name: "Family Home"
    });

    // Seed default user (demo/demo)
    // password hash is plain text "demo" or simple hash for visual simulation purposes.
    this.data.users.push({
      id: "user-demo",
      email: "demo@example.com",
      passwordHash: "demo", // simple check for demo
      name: "Alex Johnson",
      householdId: hhId
    });

    // Seed items
    const itemsList = [
      { id: "item-milk", name: "Amul Fresh Milk", barcode: "8901262150032", defaultUnit: Unit.L, category: "Dairy", preferredAisle: "Aisle A: Chilled", minStockQty: 2, imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=300&h=300" },
      { id: "item-bread", name: "Whole Wheat Bread", barcode: "8901234567890", defaultUnit: Unit.PIECE, category: "Bakery", preferredAisle: "Aisle C: Breads", minStockQty: 1, imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300&h=300" },
      { id: "item-eggs", name: "Farm Fresh Eggs 6-pack", barcode: "8902233445566", defaultUnit: Unit.PACK, category: "Poultry", preferredAisle: "Aisle A: Chilled", minStockQty: 1, imageUrl: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&q=80&w=300&h=300" },
      { id: "item-apples", name: "Organic Red Apples", barcode: null, defaultUnit: Unit.KG, category: "Produce", preferredAisle: "Aisle B: Fresh Produce", minStockQty: 1.5, imageUrl: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=300&h=300" },
      { id: "item-rice", name: "Basmati Rice 5kg", barcode: "8904433221100", defaultUnit: Unit.KG, category: "Pantry Staples", preferredAisle: "Aisle D: Grains & Spices", minStockQty: 2, imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300&h=300" },
      { id: "item-chicken", name: "Chicken Breast", barcode: null, defaultUnit: Unit.KG, category: "Meat", preferredAisle: "Aisle F: Meats", minStockQty: 1, imageUrl: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=300&h=300" },
      { id: "item-strawberry", name: "Sweet Garden Strawberries", barcode: "8901122334455", defaultUnit: Unit.PACK, category: "Produce", preferredAisle: "Aisle B: Fresh Produce", minStockQty: 1, imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=300&h=300" },
      { id: "item-avocado", name: "Fresh Organic Avocados", barcode: "8902233112233", defaultUnit: Unit.PIECE, category: "Produce", preferredAisle: "Aisle B: Fresh Produce", minStockQty: 2, imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=300&h=300" },
      { id: "item-coffee", name: "Premium Dark Beans Coffee", barcode: "8903344223344", defaultUnit: Unit.PACK, category: "Beverages", preferredAisle: "Aisle H: Beverages", minStockQty: 1, imageUrl: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=300&h=300" },
      { id: "item-pasta", name: "Italian Wheat Pasta", barcode: "8904555334455", defaultUnit: Unit.PACK, category: "Pantry Staples", preferredAisle: "Aisle D: Grains & Spices", minStockQty: 2, imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=300&h=300" },
      { id: "item-cereal", name: "Honey Nut Breakfast Cereal", barcode: "8905666445566", defaultUnit: Unit.PACK, category: "Snacks", preferredAisle: "Aisle E: Snacks & Cereals", minStockQty: 1, imageUrl: "https://images.unsplash.com/photo-1521485950395-bcfb5fc5d291?auto=format&fit=crop&q=80&w=300&h=300" }
    ];

    itemsList.forEach((it) => {
      this.data.items.push({
        id: it.id,
        householdId: hhId,
        name: it.name,
        barcode: it.barcode,
        defaultUnit: it.defaultUnit,
        category: it.category,
        preferredAisle: it.preferredAisle,
        minStockQty: it.minStockQty,
        imageUrl: it.imageUrl
      });
    });

    // Seed inventory lots with varying expiries (some fresh, some expiring soon, one expired)
    const now = new Date();
    
    // 1st lot: Milk - expiring in 2 days
    const milkExpiry = new Date();
    milkExpiry.setDate(now.getDate() + 2);

    // 2nd lot: Expired Bread
    const breadExpiry = new Date();
    breadExpiry.setDate(now.getDate() - 2);

    // 3rd lot: Eggs - fresh
    const eggsExpiry = new Date();
    eggsExpiry.setDate(now.getDate() + 10);

    // 4th lot: Chicken - expiring tomorrow
    const chickenExpiry = new Date();
    chickenExpiry.setDate(now.getDate() + 1);

    this.data.inventoryLots.push(
      {
        id: "lot-milk-1",
        itemId: "item-milk",
        qty: 1, // unit is L
        unit: Unit.L,
        boughtAt: new Date(now.getTime() - 86400000).toISOString(),
        expiryAt: milkExpiry.toISOString(),
        notes: "BigBasket",
        consumedQty: 0
      },
      {
        id: "lot-bread-1",
        itemId: "item-bread",
        qty: 1,
        unit: Unit.PIECE,
        boughtAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
        expiryAt: breadExpiry.toISOString(),
        notes: "Local Bakery",
        consumedQty: 0.8 // mostly eaten
      },
      {
        id: "lot-eggs-1",
        itemId: "item-eggs",
        qty: 2,
        unit: Unit.PACK,
        boughtAt: new Date(now.getTime() - 172800000).toISOString(),
        expiryAt: eggsExpiry.toISOString(),
        notes: "Supermarket",
        consumedQty: 0
      },
      {
        id: "lot-chicken-1",
        itemId: "item-chicken",
        qty: 1.5,
        unit: Unit.KG,
        boughtAt: new Date().toISOString(),
        expiryAt: chickenExpiry.toISOString(),
        notes: "Meat Shop",
        consumedQty: 1.0 // 1kg consumed, 0.5kg left
      },
      {
        id: "lot-rice-1",
        itemId: "item-rice",
        qty: 5,
        unit: Unit.KG,
        boughtAt: new Date(now.getTime() - 15 * 86400000).toISOString(),
        expiryAt: null, // Rice doesn't expire
        notes: "Dmarts",
        consumedQty: 3.5 // 1.5kg left (below minStockQty: 2, will trigger alert!)
      }
    );

    // Seed default grocery list
    const mainListId = "list-main";
    this.data.groceryLists.push({
      id: mainListId,
      householdId: hhId,
      title: "Weekly Essentials",
      createdAt: new Date().toISOString()
    });

    this.data.groceryEntries.push(
      {
        id: "entry-1",
        listId: mainListId,
        itemId: "item-milk",
        customText: null,
        qty: 2,
        unit: Unit.L,
        checked: false,
        source: "lowstock",
        neededBy: null
      },
      {
        id: "entry-2",
        listId: mainListId,
        itemId: null,
        customText: "Corriander leaves & mint bunch",
        qty: 1,
        unit: Unit.PIECE,
        checked: false,
        source: "manual",
        neededBy: null
      },
      {
        id: "entry-3",
        listId: mainListId,
        itemId: "item-eggs",
        customText: null,
        qty: 1,
        unit: Unit.PACK,
        checked: true,
        source: "manual",
        neededBy: null
      }
    );

    // Seed price history
    this.data.priceHistories.push(
      { id: "p-milk-1", itemId: "item-milk", store: "BigBasket", price: 64.00, currency: "INR", recordedAt: new Date(now.getTime() - 10*86400000).toISOString() },
      { id: "p-milk-2", itemId: "item-milk", store: "Zepto", price: 66.00, currency: "INR", recordedAt: new Date(now.getTime() - 2*86400000).toISOString() },
      { id: "p-rice-1", itemId: "item-rice", store: "Dmarts", price: 420.00, currency: "INR", recordedAt: new Date(now.getTime() - 15*86400000).toISOString() }
    );

    // Seed Recipes
    const recId1 = "recipe-kheer";
    this.data.recipes.push({
      id: recId1,
      householdId: hhId,
      title: "Delicious Rice Kheer (Sweet Dessert)",
      stepsMd: "1. Wash and rinse the Basmati rice, soak for 30 minutes.\n2. Boil 1L of milk in a heavy-bottomed pan. Add soaked rice.\n3. Simmer on low heat, stirring occasionally, until milk reduces to half.\n4. Add sugar, cardamoms, and dry fruits. Garnish and serve warm or chilled.",
      ingredients: [
        { id: "ring-k-milk", recipeId: recId1, itemId: "item-milk", name: "Amul Fresh Milk", qty: 1, unit: Unit.L },
        { id: "ring-k-rice", recipeId: recId1, itemId: "item-rice", name: "Basmati Rice", qty: 0.1, unit: Unit.KG },
        { id: "ring-k-nuts", recipeId: recId1, itemId: null, name: "Almonds & Cashews (Mixed)", qty: 50, unit: Unit.GRAM }
      ]
    });

    const recId2 = "recipe-french-toast";
    this.data.recipes.push({
      id: recId2,
      householdId: hhId,
      title: "Quick French Toast",
      stepsMd: "1. Whisk eggs, milk, cinnamon, and vanilla in a shallow bowl.\n2. Dip bread slices into the mixture quickly.\n3. Cook on a greased griddle over medium-high heat until golden brown on both sides.\n4. Serve hot with syrup or butter.",
      ingredients: [
        { id: "ring-f-bread", recipeId: recId2, itemId: "item-bread", name: "Wheat Bread", qty: 4, unit: Unit.PIECE },
        { id: "ring-f-eggs", recipeId: recId2, itemId: "item-eggs", name: "Farm Eggs", qty: 2, unit: Unit.PIECE }, // egg as piece
        { id: "ring-f-milk", recipeId: recId2, itemId: "item-milk", name: "Milk", qty: 0.2, unit: Unit.L }
      ]
    });

    this.save();
  }

  // Getters
  public getUsers() { return this.data.users; }
  public getHouseholds() { return this.data.households; }
  public getItems() { return this.data.items; }
  public getInventoryLots() { return this.data.inventoryLots; }
  public getGroceryLists() { return this.data.groceryLists; }
  public getGroceryEntries() { return this.data.groceryEntries; }
  public getRecipes() { return this.data.recipes; }
  public getPriceHistories() { return this.data.priceHistories; }
  public getSessions() { return this.data.sessions; }
}

export const dbInstance = new LocalDB();
