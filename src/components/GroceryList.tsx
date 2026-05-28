import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  PlusCircle, 
  Check, 
  FileText, 
  RefreshCw, 
  Tag, 
  MoreHorizontal,
  Eraser
} from "lucide-react";
import { GroceryEntry, Item, Unit } from "../types";

interface GroceryListProps {
  token: string;
  triggerToast: (msg: string, type: "success" | "error") => void;
  triggerSync: () => void;
  syncTriggerId: number; // Increment triggers list refresh from other tabs (Dashboard, Recsys)
}

export default function GroceryList({ token, triggerToast, triggerSync, syncTriggerId }: GroceryListProps) {
  const [listId, setListId] = useState("");
  const [entries, setEntries] = useState<GroceryEntry[]>([]);
  const [catalog, setCatalog] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isCustomMode, setIsCustomMode] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [customText, setCustomText] = useState("");
  const [newQty, setNewQty] = useState(1);
  const [newUnit, setNewUnit] = useState(Unit.PIECE);

  const fetchListAndCatalog = async () => {
    try {
      setLoading(true);
      // 1. Fetch grocery list
      const listRes = await fetch("/api/list/current", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (listRes.ok) {
        const data = await listRes.json();
        setListId(data.listId);
        setEntries(data.entries);
      }

      // 2. Fetch catalog list for reference drop-downs
      const catalogRes = await fetch("/api/inventory/items", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (catalogRes.ok) {
        const itemData = await catalogRes.json();
        setCatalog(itemData);
      }
    } catch (e) {
      triggerToast("Error updating grocery archives", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListAndCatalog();
  }, [token, syncTriggerId]);

  // Toggle item check status
  const handleToggleCheck = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic state update for fluid UX
      setEntries(prev => prev.map(e => e.id === id ? { ...e, checked: !currentStatus } : e));

      const res = await fetch(`/api/list/entry/${id}/check`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ checked: !currentStatus })
      });

      if (!res.ok) throw new Error();
      triggerSync(); // update navbar stat badge
    } catch (e) {
      triggerToast("Failed to check off ingredient", "error");
      fetchListAndCatalog(); // rollback
    }
  };

  // Add item form submit
  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCustomMode && !customText.trim()) {
      triggerToast("Enter name for custom grocery item", "error");
      return;
    }
    if (!isCustomMode && !selectedItemId) {
      triggerToast("Select registered product catalog option", "error");
      return;
    }

    try {
      const payload = isCustomMode 
        ? { customText, qty: newQty, unit: newUnit, source: "manual" }
        : { itemId: selectedItemId, qty: newQty, unit: newUnit, source: "manual" };

      const res = await fetch(`/api/list/${listId}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setCustomText("");
        setNewQty(1);
        triggerToast("Item requested into list!", "success");
        fetchListAndCatalog();
        triggerSync();
      } else {
        throw new Error();
      }
    } catch (e) {
      triggerToast("Failed requesting list element", "error");
    }
  };

  // Update inline quantity
  const handleUpdateQty = async (id: string, qty: number) => {
    if (qty < 0.1) return;
    try {
      setEntries(prev => prev.map(e => e.id === id ? { ...e, qty } : e));
      
      const res = await fetch(`/api/list/entry/${id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ qty })
      });
      if (!res.ok) throw new Error();
    } catch (e) {
      triggerToast("Could not modify item volume", "error");
      fetchListAndCatalog();
    }
  };

  // Delete individual entry
  const handleDeleteEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/list/entry/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setEntries(prev => prev.filter(e => e.id !== id));
        triggerToast("Removed entry", "success");
        triggerSync();
      }
    } catch (e) {
      triggerToast("Clear failed", "error");
    }
  };

  // Bulk purge purchased items
  const handleClearChecked = async () => {
    if (!window.confirm("Purge all ticked element entries?")) return;
    try {
      const res = await fetch("/api/list/clear-checked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ listId })
      });
      if (res.ok) {
        triggerToast("Cleared checked elements successfully!", "success");
        fetchListAndCatalog();
        triggerSync();
      }
    } catch (e) {
      triggerToast("Clear list failed", "error");
    }
  };

  // Organize entries dynamically by Supermarket Aisle for rapid shopping!
  const groupedByAisle: { [key: string]: GroceryEntry[] } = {};
  entries.forEach(entry => {
    const aisle = entry.item ? entry.item.preferredAisle : "General Aisles / Misc";
    if (!groupedByAisle[aisle]) groupedByAisle[aisle] = [];
    groupedByAisle[aisle].push(entry);
  });

  const totalChecked = entries.filter(e => e.checked).length;
  const totalItems = entries.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="grocery-deck">
      
      {/* Left Columns - Detailed Shopping Lists group (2/3 size) */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Shopping Header - Minimalist & Modern */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-3">
            <span className="p-2.5 bg-teal-50 text-teal-600 rounded-xl border border-teal-100">
              <ShoppingCart className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">
                Shared Shopping Checklist
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {totalItems > 0 
                  ? `Acquired ${totalChecked} of ${totalItems} requested products` 
                  : "No active shopping ingredients needed."}
              </p>
            </div>
          </div>

          {totalChecked > 0 && (
            <button
              onClick={handleClearChecked}
              className="relative z-10 flex items-center gap-1.5 px-4 py-2 border border-rose-200/60 hover:border-rose-300 bg-white hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-3xs"
              id="btn-clear-purchased"
            >
              <Eraser className="h-3.5 w-3.5" />
              Flush Purchased 
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-4" id="grocery-skeleton-group">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-xs animate-pulse">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100/30 border-b border-slate-150 px-5 py-4 flex justify-between items-center border-l-4 border-l-slate-300">
                  <div className="h-3.5 bg-slate-200 rounded w-1/4" />
                  <div className="h-5 w-12 bg-slate-150 rounded-full" />
                </div>
                <div className="p-5 space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-b-0">
                      <div className="flex items-center gap-3 w-2/3">
                        <div className="h-4 w-4 bg-slate-200 rounded" />
                        <div className="space-y-1.5 w-1/2">
                          <div className="h-3.5 bg-slate-200 rounded" />
                          <div className="h-2.5 bg-slate-150 rounded w-2/3" />
                        </div>
                      </div>
                      <div className="h-4 w-12 bg-slate-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : totalItems === 0 ? (
          <div className="p-16 text-center bg-white border border-slate-100 rounded-2xl" id="empty-shopping-list-card">
            <ShoppingCart className="h-12 w-12 text-slate-200 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800 mt-4 font-display">Checklist is clean!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-normal">
              Need fresh supplies? Use the request panel on the right to append goods, or try the AI Restock predict modules from Dashboard!
            </p>
          </div>
        ) : (
          /* Aisle-Grouped Render Accordions */
          <div className="space-y-4" id="aisle-accordion-group">
            {Object.entries(groupedByAisle).map(([aisle, list]) => (
              <div key={aisle} className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-350">
                
                {/* Aisle Title banner with elegant left colored accent */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100/30 border-b border-slate-150 px-5 py-3.5 flex items-center justify-between border-l-4 border-l-teal-500">
                  <span className="text-xs font-bold text-slate-800 tracking-tight font-display flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-teal-550" />
                    {aisle}
                  </span>
                  <span className="text-[10px] bg-teal-500/10 text-teal-700 border border-teal-500/20 px-2.5 py-0.5 rounded-full font-bold font-mono">
                    {list.length} {list.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Entry Rows */}
                <div className="divide-y divide-slate-50">
                  {list.map(entry => {
                    const dispText = entry.item ? entry.item.name : entry.customText;
                    const dispUnit = entry.item ? entry.item.defaultUnit : entry.unit || "unit";
                    
                    return (
                      <div 
                        key={entry.id} 
                        className={`flex items-center justify-between p-4 bg-white transition-all group hover:bg-slate-50/10 ${
                          entry.checked ? "bg-slate-50/60 opacity-60" : ""
                        }`}
                        id={`entry-row-${entry.id}`}
                      >
                        <div className="flex items-center gap-3">
                          
                          {/* Circle Custom Checkbox */}
                          <button
                            onClick={() => handleToggleCheck(entry.id, entry.checked)}
                            className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                              entry.checked 
                                ? "bg-teal-500 border-teal-500 text-white" 
                                : "border-slate-300 hover:border-teal-500 group-hover:scale-105"
                            }`}
                          >
                            {entry.checked && <Check className="h-3.5 w-3.5 stroke-[4px]" />}
                          </button>

                          {/* Mini Thumbnail Image */}
                          {entry.item?.imageUrl ? (
                            <img 
                              src={entry.item.imageUrl} 
                              alt={dispText || ""}
                              className="h-9 w-9 rounded-lg object-cover border border-slate-100/60 flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-lg bg-teal-50 text-teal-650 border border-teal-100/50 flex items-center justify-center text-[10px] font-bold flex-shrink-0 uppercase font-mono">
                              {dispText ? dispText.slice(0, 2) : "GP"}
                            </div>
                          )}

                          <div className="space-y-0.5">
                            <span className={`text-xs font-semibold text-slate-800 ${
                              entry.checked ? "line-through text-slate-400 font-normal" : ""
                            }`}>
                              {dispText}
                            </span>
                            <div className="flex gap-1.5 items-center text-[10px] text-slate-400 font-medium">
                              <span className="font-mono bg-slate-100 border border-slate-200 px-1.5 rounded-sm">
                                {entry.qty} {dispUnit}
                              </span>
                              {entry.source && (
                                <span className={`px-1 rounded-sm text-[9px] font-bold ${
                                  entry.source === "lowstock" ? "bg-amber-50 text-amber-600" :
                                  entry.source === "recipe" ? "bg-indigo-50 text-indigo-600" :
                                  entry.source === "replenish" ? "bg-pink-50 text-pink-600" :
                                  "bg-slate-100 text-slate-500"
                                }`}>
                                  via {entry.source}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Inline count modifiers & delete */}
                        <div className="flex items-center gap-2">
                          <div className="flex border border-slate-230 rounded-lg overflow-hidden bg-white shrink-0 group-hover:border-slate-300 transition-all max-h-7">
                            <button
                              onClick={() => handleUpdateQty(entry.id, Number((entry.qty || 1) - 1))}
                              className="px-2 font-mono text-xs bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold active:scale-95 cursor-pointer"
                              disabled={entry.checked}
                            >
                              -
                            </button>
                            <span className="px-2.5 text-xs text-slate-800 font-mono bg-white flex items-center min-w-[2.5rem] justify-center">
                              {entry.qty}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(entry.id, Number((entry.qty || 1) + 1))}
                              className="px-2 font-mono text-xs bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold active:scale-95 cursor-pointer"
                              disabled={entry.checked}
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="p-1 px-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column - Append Action forms (1/3 size) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs max-h-fit space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-800 font-display">Add Grocery Items</h2>
          <p className="text-xs text-slate-400 mt-1">Append required supplies to checklist.</p>
        </div>

        {/* Input Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setIsCustomMode(true);
              setNewUnit(Unit.PIECE);
            }}
            className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              isCustomMode ? "bg-white text-slate-800 shadow-xs" : "text-slate-400"
            }`}
          >
            Custom Text Entry
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCustomMode(false);
              if (catalog.length > 0) {
                setSelectedItemId(catalog[0].id);
                setNewUnit(catalog[0].defaultUnit);
              }
            }}
            className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              !isCustomMode ? "bg-white text-slate-800 shadow-xs" : "text-slate-400"
            }`}
          >
            Match Catalog Item
          </button>
        </div>

        <form onSubmit={handleAddEntry} className="space-y-4">
          
          {isCustomMode ? (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 block">Custom Item Name *</label>
              <input
                type="text"
                placeholder="e.g. Fresh Cilantro bunch"
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl"
                required
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 block">Choose Catalog Product *</label>
              {catalog.length === 0 ? (
                <p className="text-xs text-amber-600">No products declared in Catalog. Add item on Pantry screen first!</p>
              ) : (
                <select
                  value={selectedItemId}
                  onChange={e => {
                    setSelectedItemId(e.target.value);
                    const matchItem = catalog.find(c => c.id === e.target.value);
                    if (matchItem) setNewUnit(matchItem.defaultUnit);
                  }}
                  className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl bg-white text-slate-700"
                  required
                >
                  {catalog.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 block">Quantity Needed</label>
              <input
                type="number"
                step="any"
                value={newQty}
                onChange={e => setNewQty(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl font-mono"
                min="0.1"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 block">Measurement Unit</label>
              <select
                value={newUnit}
                onChange={e => setNewUnit(e.target.value as Unit)}
                className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl bg-white text-slate-700"
                disabled={!isCustomMode} // Locked to parent catalog item default unit if match selected
              >
                {Object.values(Unit).map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isCustomMode && catalog.length === 0}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-all mt-2"
          >
            Add To Checklist
          </button>
        </form>

        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500 leading-normal">
          <ShoppingCart className="h-4 w-4 stroke-[2.2px] text-teal-600 float-left mr-1.5" />
          Synchronized shopping sheets ensure all family members are aligned, automatically sorting purchases as you tour supermarket aisles.
        </div>
      </div>

    </div>
  );
}
