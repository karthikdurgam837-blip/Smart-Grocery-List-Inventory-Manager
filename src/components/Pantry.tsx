import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  Package, 
  Calendar,
  X,
  PlusCircle,
  Clock,
  Filter
} from "lucide-react";
import { Item, InventoryLot, Unit } from "../types";

interface PantryProps {
  token: string;
  triggerToast: (msg: string, type: "success" | "error") => void;
  triggerSync: () => void;
}

const SAMPLE_IMAGE_PRESETS = [
  // Dairy
  { name: "Fresh Milk", url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=300&h=300", category: "Dairy", unit: Unit.L },
  { name: "Cheese Blocks", url: "https://images.unsplash.com/photo-1486887396153-fa416526c13b?auto=format&fit=crop&q=80&w=300&h=300", category: "Dairy", unit: Unit.PACK },
  { name: "Butter Cream", url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=300&h=300", category: "Dairy", unit: Unit.GRAM },
  { name: "Yogurt Tubs", url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=300&h=300", category: "Dairy", unit: Unit.PIECE },
  
  // Bakery
  { name: "Wheat Bread", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300&h=300", category: "Bakery", unit: Unit.PIECE },
  { name: "Croissant Bread", url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=300&h=300", category: "Bakery", unit: Unit.PIECE },
  
  // Fruits & Produce
  { name: "Red Apples", url: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=300&h=300", category: "Produce", unit: Unit.KG },
  { name: "Bananas Bunch", url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=300&h=300", category: "Produce", unit: Unit.PIECE },
  { name: "Avocado Slices", url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=300&h=300", category: "Produce", unit: Unit.PIECE },
  { name: "Strawberries Box", url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=300&h=300", category: "Produce", unit: Unit.PACK },
  { name: "Fresh Tomatoes", url: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=300&h=300", category: "Produce", unit: Unit.KG },
  { name: "Orange Slices", url: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=300&h=300", category: "Produce", unit: Unit.KG },
  
  // Grains / Flour
  { name: "Basmati Rice", url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300&h=300", category: "Grains & Pasta", unit: Unit.KG },
  { name: "Spaghetti Pasta", url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=300&h=300", category: "Grains & Pasta", unit: Unit.PACK },
  { name: "Oats Bowl", url: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&q=80&w=300&h=300", category: "Grains & Pasta", unit: Unit.PACK },
  
  // Poultry / Meat
  { name: "Fresh Eggs", url: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&q=80&w=300&h=300", category: "Poultry", unit: Unit.PACK },
  { name: "Chicken Breast", url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=300&h=300", category: "Meat", unit: Unit.KG },
  { name: "Salmon Fillet", url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=300&h=300", category: "Meat", unit: Unit.KG },
  
  // Beverages
  { name: "Coffee Powder", url: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=300&h=300", category: "Beverages", unit: Unit.PACK },
  { name: "Green Tea Bag", url: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=300&h=300", category: "Beverages", unit: Unit.PACK },
  
  // Snacks / Chocolates
  { name: "Cocoa Chocolate", url: "https://images.unsplash.com/photo-1548907040-4d42b52125f0?auto=format&fit=crop&q=80&w=300&h=300", category: "Snacks", unit: Unit.PACK },
  { name: "Potato Chips", url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=300&h=300", category: "Snacks", unit: Unit.PACK },
  
  // Canning / Staple
  { name: "Canned Tomato", url: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=300&h=300", category: "Canned Goods", unit: Unit.PACK },
  { name: "Organic Honey", url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=300&h=300", category: "Baking Supplies", unit: Unit.PIECE },
  
  // Cleaning / Wrapping
  { name: "Liquid Soap", url: "https://images.unsplash.com/photo-1607006342411-9a311043c157?auto=format&fit=crop&q=80&w=300&h=300", category: "Cleaning Products", unit: Unit.PIECE },
  { name: "Paper Towels", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300&h=300", category: "Storage & Packaging", unit: Unit.PACK }
];

export default function Pantry({ token, triggerToast, triggerSync }: PantryProps) {
  // Navigation State
  const [viewMode, setViewMode] = useState<"lots" | "catalog">("lots");

  // Data States
  const [items, setItems] = useState<Item[]>([]);
  const [lots, setLots] = useState<InventoryLot[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Form states and modals
  const [showItemModal, setShowItemModal] = useState(false);
  const [showLotModal, setShowLotModal] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  
  // New Item Fields
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Dairy");
  const [newItemUnit, setNewItemUnit] = useState(Unit.PIECE);
  const [newItemBarcode, setNewItemBarcode] = useState("");
  const [newItemAisle, setNewItemAisle] = useState("");
  const [newItemMinQty, setNewItemMinQty] = useState(1);
  const [newItemImageUrl, setNewItemImageUrl] = useState("");

  // New Lot fields
  const [selectedItemId, setSelectedItemId] = useState("");
  const [newLotQty, setNewLotQty] = useState(1);
  const [newLotUnit, setNewLotUnit] = useState(Unit.PIECE);
  const [newLotExpiry, setNewLotExpiry] = useState("");
  const [newLotNotes, setNewLotNotes] = useState("");

  const [importingCatalog, setImportingCatalog] = useState(false);

  const categories = [
    "All", "Dairy", "Produce", "Bakery", "Poultry", "Meat", "Pantry Staples", 
    "Beverages", "Snacks", "Household", 
    "Grains & Pasta", "Baking Supplies", "Canned Goods", "Soups, Broths & Fruit", 
    "Oils, Vinegars & Condiments", "Spices & Seasonings", "Cleaning Products", 
    "Storage & Packaging", "Laundry Supplies", "Personal Care", "Emergency & Tools", 
    "Medical & First Aid", "Misc"
  ];

  const handleImportDemoCatalog = async () => {
    setImportingCatalog(true);
    try {
      const res = await fetch("/api/inventory/seed-catalog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast(data.message || "Successfully imported demo catalog!", "success");
        fetchItemsAndLots();
        triggerSync();
      } else {
        triggerToast("Failed to load catalog. Please try again.", "error");
      }
    } catch (e) {
      triggerToast("Network error while seeding catalog", "error");
    } finally {
      setImportingCatalog(false);
    }
  };

  const fetchItemsAndLots = async () => {
    try {
      setLoading(true);
      const resItems = await fetch("/api/inventory/items", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resItems.ok) {
        const itemData = await resItems.json();
        setItems(itemData);
      }

      const resLots = await fetch("/api/inventory/overview", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resLots.ok) {
        const lotsData = await resLots.json();
        setLots(lotsData);
      }
    } catch (e) {
      triggerToast("Error matching data records", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemsAndLots();
  }, [token]);

  // Handle register a new catalog product
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) {
      triggerToast("Please enter an item name", "error");
      return;
    }

    try {
      const res = await fetch("/api/inventory/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newItemName,
          category: newItemCategory,
          defaultUnit: newItemUnit,
          barcode: newItemBarcode || null,
          preferredAisle: newItemAisle || `Aisle ${newItemCategory}`,
          minStockQty: Number(newItemMinQty),
          imageUrl: newItemImageUrl || null
        })
      });

      if (res.ok) {
        triggerToast(`Catalog item "${newItemName}" added successfully!`, "success");
        // Reset and refresh
        setNewItemName("");
        setNewItemBarcode("");
        setNewItemAisle("");
        setNewItemMinQty(1);
        setNewItemImageUrl("");
        setShowItemModal(false);
        fetchItemsAndLots();
        triggerSync();
      } else {
        const err = await res.json();
        throw new Error(err.error);
      }
    } catch (e: any) {
      triggerToast(e.message || "Could not register products", "error");
    }
  };

  // Handle Add inventory lot
  const handleAddLot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || !newLotQty) {
      triggerToast("Complete item selection and quantity details", "error");
      return;
    }

    try {
      const res = await fetch("/api/inventory/lots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId: selectedItemId,
          qty: Number(newLotQty),
          unit: newLotUnit,
          expiryAt: newLotExpiry || null,
          notes: newLotNotes || null
        })
      });

      if (res.ok) {
        triggerToast("Stock Lot booked successfully!", "success");
        setNewLotQty(1);
        setNewLotNotes("");
        setNewLotExpiry("");
        setShowLotModal(false);
        fetchItemsAndLots();
        triggerSync();
      } else {
        const err = await res.json();
        throw new Error(err.error);
      }
    } catch (e: any) {
      triggerToast(e.message || "Failed to log stock lot", "error");
    }
  };

  // Consume stock incremental change
  const handleConsume = async (lotId: string, amount: number) => {
    try {
      const res = await fetch("/api/inventory/consume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          lotId,
          qty: amount
        })
      });

      if (res.ok) {
        triggerToast(`Used ${amount} unit from stock lot.`, "success");
        fetchItemsAndLots();
        triggerSync();
      } else {
        throw new Error();
      }
    } catch (e) {
      triggerToast("Deduction error", "error");
    }
  };

  // Delete inventory lot completely
  const handleDeleteLot = async (lotId: string) => {
    if (!window.confirm("Are you sure you want to remove this stock lot?")) return;
    try {
      const res = await fetch(`/api/inventory/lots/${lotId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        triggerToast("Stock lot removed from logs.", "success");
        fetchItemsAndLots();
        triggerSync();
      }
    } catch (e) {
      triggerToast("Delete lot failed", "error");
    }
  };

  // Delete catalogs
  const handleDeleteItem = async (itemId: string, name: string) => {
    if (!window.confirm(`Delete catalog "${name}"? This removes all active pantry stock lots pointing to it!`)) return;
    try {
      const res = await fetch(`/api/inventory/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        triggerToast("Catalog item and stocks purged from database.", "success");
        fetchItemsAndLots();
        triggerSync();
      }
    } catch (e) {
      triggerToast("Removal failed", "error");
    }
  };

  // Live filtering lists
  const filteredLots = lots.filter(lot => {
    const matchesSearch = lot.itemName.toLowerCase().includes(search.toLowerCase()) || 
                          (lot.notes && lot.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || lot.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredItems = items.filter(it => {
    const matchesSearch = it.name.toLowerCase().includes(search.toLowerCase()) ||
                          (it.barcode && it.barcode.includes(search));
    const matchesCategory = selectedCategory === "All" || it.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Days left helper
  const getDaysDiff = (expStr: string | null) => {
    if (!expStr) return null;
    const diffTime = new Date(expStr).getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6 animate-fade-in" id="pantry-deck">
      {/* Upper Navigation Action Deck - Minimalist & Modern */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex bg-slate-105 p-1 rounded-xl relative z-10 shrink-0 border border-slate-200/30">
          <button
            onClick={() => setViewMode("lots")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
              viewMode === "lots" 
                ? "bg-white text-slate-800 shadow-3xs border border-slate-200/40 font-bold" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Active Stock Lots ({lots.length})
          </button>
          <button
            onClick={() => setViewMode("catalog")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
              viewMode === "catalog" 
                ? "bg-white text-slate-800 shadow-3xs border border-slate-200/40 font-bold" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Catalog Registry ({items.length})
          </button>
        </div>

        <div className="flex gap-2.5 w-full sm:w-auto relative z-10">
          <button
            onClick={() => {
              if (items.length > 0) setSelectedItemId(items[0].id);
              setShowLotModal(true);
            }}
            className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-3xs cursor-pointer flex-1 sm:flex-none"
            id="btn-trigger-lot-modal"
          >
            <Plus className="h-4 w-4" />
            Book In Stock
          </button>
          <button
            onClick={() => setShowItemModal(true)}
            className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 border border-slate-200 bg-white hover:bg-slate-55 hover:text-slate-900 rounded-xl text-xs font-bold cursor-pointer flex-1 sm:flex-none shadow-3xs transition-colors"
            id="btn-trigger-item-modal"
          >
            <PlusCircle className="h-4 w-4" />
            Define Product
          </button>
        </div>
      </div>

      {/* Curator Demo Catalog Banner suggestion */}
      {items.length < 20 && (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-3xs animate-fade-in" id="demo-catalog-loader-banner">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-600/10 text-teal-700 uppercase tracking-wider">
              ✨ Curated Suggestion
            </span>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
              Load Household Catalog (110+ Items with Unsplash Photos)
            </h3>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              Instantly populate a comprehensive household catalog across Grains, Baking, Canned Goods, Condiments, Cleaning/Storage, Medical supplies, and Tools. Fully optimized with custom tags and high-res image thumbnails!
            </p>
          </div>
          <button
            onClick={handleImportDemoCatalog}
            disabled={importingCatalog}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold leading-none cursor-pointer shadow-sm transition-all disabled:opacity-50 shrink-0 w-full sm:w-auto"
          >
            {importingCatalog ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Importing...
              </span>
            ) : (
              <span>Populate Catalog</span>
            )}
          </button>
        </div>
      )}

      {/* Filter and query deck */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-100">
        <div className="md:col-span-2 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder={viewMode === "lots" ? "Search items or places..." : "Search product name or barcode..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl text-xs"
          />
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Filter className="h-4 w-4" />
          </span>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl text-xs bg-white text-slate-700"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setSearch("");
            setSelectedCategory("All");
          }}
          className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-800 border border-slate-150 hover:bg-slate-50/50 rounded-xl cursor-pointer transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse" id="inventory-skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-slate-150/80 border-l-4 border-l-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-2/3">
                  <div className="h-4 bg-slate-200 rounded w-5/6" />
                  <div className="h-3 bg-slate-150/80 rounded w-1/2" />
                </div>
                <div className="h-6 w-16 bg-slate-250 rounded-full" />
              </div>
              <div className="p-3 bg-slate-50/50 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <div className="h-3 bg-slate-150/80 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                </div>
                <div className="h-2 bg-slate-100 rounded-full w-full" />
              </div>
              <div className="flex justify-between items-center bg-slate-50/20 p-2 border border-slate-50 rounded-xl opacity-80 animate-pulse">
                <div className="h-3 bg-slate-150/80 rounded w-1/4" />
                <div className="flex gap-1.5">
                  <div className="h-6 w-12 bg-slate-200 rounded-lg" />
                  <div className="h-6 w-12 bg-slate-200 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === "lots" ? (
        /* ==================== ACTIVE LOTS VIEW ==================== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="inventory-lots-grid">
          {filteredLots.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white border border-slate-100 rounded-2xl">
              <Package className="h-10 w-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-800 mt-4">Pantry looks pretty empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-normal">
                Book inside some stocks to monitor expirations, trace shopping thresholds, and prevent bulk-buy food waste!
              </p>
              <button
                onClick={() => {
                  if (items.length > 0) setSelectedItemId(items[0].id);
                  setShowLotModal(true);
                }}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700"
              >
                Add first stockpile
              </button>
            </div>
          ) : (
            filteredLots.map(lot => {
              const daysLeft = getDaysDiff(lot.expiryAt);

              // Category mapping styling
              let badgeColor = "bg-slate-100 text-slate-600 border-slate-200/80";
              let badgeText = "No Expiry";
              let cardAccentClass = "border-l-4 border-l-slate-400";
              let cardBorderClass = "border-slate-150/80 hover:border-slate-300";

              if (daysLeft !== null) {
                if (daysLeft < 0) {
                  badgeColor = "bg-rose-500/10 text-rose-600 border border-rose-200/40 animate-pulse font-bold";
                  badgeText = `Expired (${Math.abs(daysLeft)}d ago)`;
                  cardAccentClass = "border-l-4 border-l-rose-500";
                  cardBorderClass = "border-rose-100 hover:border-rose-300";
                } else if (daysLeft === 0) {
                  badgeColor = "bg-rose-500/10 text-rose-600 border border-rose-250/50 font-bold";
                  badgeText = "Expires TODAY!";
                  cardAccentClass = "border-l-4 border-l-rose-500";
                  cardBorderClass = "border-rose-100 hover:border-rose-300";
                } else if (daysLeft <= 3) {
                  badgeColor = "bg-amber-500/10 text-amber-700 border border-amber-200/50 font-bold";
                  badgeText = `Expires in ${daysLeft}d`;
                  cardAccentClass = "border-l-4 border-l-amber-500";
                  cardBorderClass = "border-amber-100 hover:border-amber-300";
                } else {
                  badgeColor = "bg-emerald-500/10 text-emerald-700 border border-emerald-200/40 font-bold";
                  badgeText = `${daysLeft} days left`;
                  cardAccentClass = "border-l-4 border-l-emerald-500";
                  cardBorderClass = "border-emerald-150 hover:border-emerald-300";
                }
              }

              const itemObj = items.find(i => i.id === lot.itemId);
              const itemImg = itemObj?.imageUrl;

              return (
                <div 
                  key={lot.lotId} 
                  className={`bg-white border ${cardBorderClass} ${cardAccentClass} hover:shadow-lg hover:-translate-y-0.5 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-5 transition-all duration-300 group`}
                  id={`slot-${lot.lotId}`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex gap-3 items-center min-w-0">
                        {itemImg ? (
                          <img 
                            src={itemImg} 
                            alt={lot.itemName}
                            className="h-12 w-12 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-650 flex items-center justify-center font-bold text-sm flex-shrink-0 border border-teal-100/50 uppercase">
                            {lot.itemName.slice(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm tracking-tight truncate">{lot.itemName}</h4>
                          <span className="text-[10px] text-slate-400 font-bold font-mono block mt-1 uppercase tracking-wider truncate">{lot.category} • {lot.preferredAisle}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] border ${badgeColor} flex-shrink-0`}>
                        {badgeText}
                      </span>
                    </div>

                    {/* Stock parameters progress indicator */}
                    <div className="p-3.5 bg-slate-50/50 rounded-xl space-y-2 border border-slate-100/80">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span className="font-medium text-slate-500">Remaining stock level:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {lot.remainingQty} / {lot.qty} {lot.unit}
                        </span>
                      </div>
                      {/* CSS progress bar */}
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-550"
                          style={{ width: `${Math.min(100, Math.round((lot.remainingQty / lot.qty) * 100))}%` }}
                        />
                      </div>
                      {lot.notes && (
                        <p className="text-[10px] text-slate-400 mt-1 italic flex items-center gap-1">
                          <span className="inline-block h-1.5 w-1.5 bg-slate-300 rounded-full"></span>
                          Sourced: {lot.notes} • {new Date(lot.boughtAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Consuming Action Panel */}
                  <div className="flex justify-between items-center bg-slate-50/30 p-2.5 border border-slate-100 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold font-mono tracking-wider uppercase">Consume Actions</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleConsume(lot.lotId, 0.5)}
                        className="px-2.5 py-1.5 text-[10px] font-extrabold bg-white hover:bg-teal-50 hover:text-teal-650 text-slate-600 border border-slate-205 rounded-lg active:scale-90 transition-all cursor-pointer shadow-2xs"
                      >
                        Use 0.5
                      </button>
                      <button
                        onClick={() => handleConsume(lot.lotId, 1)}
                        className="px-2.5 py-1.5 text-[10px] font-extrabold bg-white hover:bg-teal-50 hover:text-teal-650 text-slate-600 border border-slate-205 rounded-lg active:scale-90 transition-all cursor-pointer shadow-2xs"
                      >
                        Use 1
                      </button>
                      <button
                        onClick={() => handleDeleteLot(lot.lotId)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                        title="Remove lot entirely"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* ==================== USER CATALOG REGISTRY VIEW ==================== */
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-600 border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 font-semibold text-xs border-b border-slate-100">
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Default Unit</th>
                  <th className="p-4">Aisle Storage</th>
                  <th className="p-4">Alert Threshold</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No catalog objects match filter query.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(it => {
                    const stock = it.currentStock !== undefined ? it.currentStock : 0;
                    const isLow = stock < it.minStockQty;

                    return (
                      <tr key={it.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-semibold text-slate-800">
                          <div className="flex items-center gap-3">
                            {it.imageUrl ? (
                              <img 
                                src={it.imageUrl} 
                                alt={it.name}
                                className="h-10 w-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-650 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-teal-100/50 uppercase">
                                {it.name.slice(0, 2)}
                              </div>
                            )}
                            <span className="truncate">{it.name}</span>
                          </div>
                        </td>
                        <td className="p-4"><span className="px-2 py-0.5 bg-slate-100 rounded text-[10px]">{it.category}</span></td>
                        <td className="p-4 font-mono">{it.defaultUnit}</td>
                        <td className="p-4 text-slate-400 font-medium">{it.preferredAisle}</td>
                        <td className="p-4 font-mono text-slate-500">Min: {it.minStockQty}</td>
                        <td className="p-4">
                          {isLow ? (
                            <span className="flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100 self-start w-fit">
                              <AlertTriangle className="h-3 w-3" />
                              Low ({stock} left)
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 self-start w-fit">
                              <CheckCircle2 className="h-3 w-3" />
                              Okay ({stock})
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteItem(it.id, it.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== CREATE NEW ITEM FORM MODAL ==================== */}
      {showItemModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800 text-sm font-display flex items-center gap-1.5">
                <Package className="h-4 w-4 text-teal-600" />
                Define Product Catalog
              </h3>
              <button 
                onClick={() => setShowItemModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Whole Wheat Bread"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl"
                  required
                />
                
                {/* Real-time Smart Suggestion for Library images */}
                {newItemName && (
                  (() => {
                    const matchedPreset = SAMPLE_IMAGE_PRESETS.find(
                      p => p.name.toLowerCase().includes(newItemName.toLowerCase()) || 
                           newItemName.toLowerCase().includes(p.name.toLowerCase())
                    );
                    if (matchedPreset && newItemImageUrl !== matchedPreset.url) {
                      return (
                        <div className="flex items-center gap-2 p-2 bg-teal-50/40 border border-teal-100/30 rounded-xl mt-1.5 animate-fade-in text-[11px]">
                          <img
                            src={matchedPreset.url}
                            alt={matchedPreset.name}
                            className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-teal-200/50"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-slate-700 leading-tight">
                              Library Photo available!
                            </p>
                            <p className="text-[9px] text-slate-500 truncate">
                              Auto-apply config for {matchedPreset.name}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setNewItemImageUrl(matchedPreset.url);
                              setNewItemCategory(matchedPreset.category);
                              setNewItemUnit(matchedPreset.unit);
                              setNewItemAisle(`Aisle: ${matchedPreset.category}`);
                              triggerToast(`Applied metadata for "${matchedPreset.name}"!`, "success");
                            }}
                            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[9px] font-bold cursor-pointer transition-colors"
                          >
                            Apply Photo
                          </button>
                        </div>
                      );
                    }
                    return null;
                  })()
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 calendar-field">
                  <label className="text-xs font-semibold text-slate-600 block">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={e => setNewItemCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl bg-white"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Standard Unit</label>
                  <select
                    value={newItemUnit}
                    onChange={e => setNewItemUnit(e.target.value as Unit)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl bg-white-50"
                  >
                    {Object.values(Unit).map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Aisle Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Aisle A: Bakery"
                    value={newItemAisle}
                    onChange={e => setNewItemAisle(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Min Stock Alarm</label>
                  <input
                    type="number"
                    step="any"
                    value={newItemMinQty}
                    onChange={e => setNewItemMinQty(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl font-mono"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-600">Product Image (Optional)</label>
                  <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    className="text-[11px] font-bold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    🖼️ {showPresets ? "Hide Gallery" : "Browse Sample Library"}
                  </button>
                </div>
                
                <input
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  value={newItemImageUrl}
                  onChange={e => setNewItemImageUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl"
                />

                {showPresets && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-h-44 overflow-y-auto grid grid-cols-3 gap-2 animate-fade-in custom-scrollbar">
                    {SAMPLE_IMAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setNewItemImageUrl(preset.url);
                          if (!newItemName) {
                            setNewItemName(preset.name);
                          }
                          setNewItemCategory(preset.category);
                          setNewItemUnit(preset.unit);
                          setNewItemAisle(`Aisle: ${preset.category}`);
                          triggerToast(`Selected "${preset.name}" preset!`, "success");
                        }}
                        className={`flex flex-col items-center p-1 rounded-lg border text-center transition-all bg-white hover:border-teal-500 hover:shadow-2xs cursor-pointer ${
                          newItemImageUrl === preset.url ? "border-teal-600 ring-2 ring-teal-500/10" : "border-slate-100"
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-9 h-9 rounded-md object-cover flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[9px] font-semibold text-slate-700 truncate w-full mt-1">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Link any high-res photo or select from our curated library above to pre-populate name, category, and units!
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block font-mono">Barcode (UPC/EAN - Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 8901234567..."
                  value={newItemBarcode}
                  onChange={e => setNewItemBarcode(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-all mt-4"
              >
                Register Catalog Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CREATE NEW STOCK LOT FORM MODAL ==================== */}
      {showLotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800 text-sm font-display flex items-center gap-1.5">
                <PlusCircle className="h-4 w-4 text-teal-600" />
                Book In Stock Lot
              </h3>
              <button 
                onClick={() => setShowLotModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddLot} className="p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-xs text-rose-500 mb-2 font-medium">Please define some catalog items first!</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLotModal(false);
                      setShowItemModal(true);
                    }}
                    className="text-xs font-bold text-teal-600 underline"
                  >
                    Define Catalog items
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Select Product *</label>
                    <select
                      value={selectedItemId}
                      onChange={e => {
                        setSelectedItemId(e.target.value);
                        // autopopulate defaults
                        const it = items.find(x => x.id === e.target.value);
                        if (it) setNewLotUnit(it.defaultUnit);
                      }}
                      className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl bg-white text-slate-700"
                      required
                    >
                      <option value="" disabled>--- Select Registered Item ---</option>
                      {items.map(it => (
                        <option key={it.id} value={it.id}>{it.name} ({it.category})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Quantity *</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g. 2"
                        value={newLotQty}
                        onChange={e => setNewLotQty(Number(e.target.value))}
                        className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl font-mono"
                        min="0.001"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Usage Unit</label>
                      <select
                        value={newLotUnit}
                        onChange={e => setNewLotUnit(e.target.value as Unit)}
                        className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl bg-white"
                      >
                        {Object.values(Unit).map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 calendar-field">
                    <label className="text-xs font-semibold text-slate-600 block">Expiration Timestamp (Optional)</label>
                    <input
                      type="date"
                      value={newLotExpiry}
                      onChange={e => setNewLotExpiry(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl font-mono"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">Leaves field blank if non-perishable (e.g. sugar, salt)</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Sourcing logs / Store *</label>
                    <input
                      type="text"
                      placeholder="e.g. Zepto, Local Market, OrganicStore"
                      value={newLotNotes}
                      onChange={e => setNewLotNotes(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-all mt-4"
                  >
                    Record Lot stockpile 
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
