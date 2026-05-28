import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  ShoppingCart, 
  RefreshCw, 
  AlertCircle,
  Clock,
  BookOpen
} from "lucide-react";
import { Recipe } from "../types";

interface RecipesProps {
  token: string;
  triggerToast: (msg: string, type: "success" | "error") => void;
  triggerSync: () => void;
}

export default function Recipes({ token, triggerToast, triggerSync }: RecipesProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);

  // AI formulation fields
  const [promptRecipeName, setPromptRecipeName] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/recipes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRecipes(data);
      }
    } catch (e) {
      triggerToast("Error matching cook recipes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [token]);

  // Request Recipe Sync straight to active grocery list
  const handleSyncToShoppingList = async (recipeId: string, title: string) => {
    try {
      // 1. Get current listId
      const listRes = await fetch("/api/list/current", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!listRes.ok) throw new Error();
      const listData = await listRes.json();
      const listId = listData.listId;

      // 2. Call batch sync API
      const syncRes = await fetch("/api/list/add-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ listId, recipeId })
      });

      if (syncRes.ok) {
        const data = await syncRes.json();
        triggerToast(`Synced ${data.count} ingredients for "${title}" to Grocery List!`, "success");
        triggerSync(); // update navbar stat badges
      } else {
        throw new Error();
      }
    } catch (e) {
      triggerToast("Failed syncing ingredients. Confirm target selection.", "error");
    }
  };

  // Trigger Gemini AI custom cook suggestion formulate
  const handleGenerateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptRecipeName.trim()) {
      triggerToast("Enter a dish name you want to cook!", "error");
      return;
    }

    try {
      setGeneratingAI(true);
      const res = await fetch("/api/ai/suggest-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ recipeName: promptRecipeName })
      });

      if (res.ok) {
        const newRecipe = await res.json();
        triggerToast(`Gemini formulated delicious "${newRecipe.title}" recipe! Added to database.`, "success");
        setPromptRecipeName("");
        fetchRecipes();
        // Auto expand new recipe
        setExpandedRecipeId(newRecipe.id);
      } else {
        const err = await res.json();
        throw new Error(err.error || "Model offline");
      }
    } catch (e: any) {
      console.error(e);
      triggerToast(e.message || "Failed calling recipe builder. check GEMINI_API_KEY.", "error");
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="recipes-deck">
      
      {/* Left Column - Recipes listing & explorer (2/3 size) */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Banner Section - Minimalist & Modern */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-sm font-bold text-slate-855 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <BookOpen className="h-5 w-5 text-teal-600" />
              Kitchen Recipe Book
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
              Explore culinary masterpieces loaded from Gemini suggestions. Press Sync to put ingredients on grocery checklist instantly.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse" id="recipes-skeleton-group">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs space-y-3">
                <div className="flex justify-between items-center">
                  <div className="space-y-2 w-1/2">
                    <div className="h-4 bg-slate-200 rounded w-5/6" />
                    <div className="h-3 bg-slate-150/80 rounded w-1/3" />
                  </div>
                  <div className="h-8 w-18 bg-slate-205 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="p-16 text-center bg-white border border-slate-100 rounded-2xl">
            <FileText className="h-10 w-10 text-slate-200 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800 mt-4">No Recipes Booked</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-normal">
              Get cooking! Create an AI cook helper plan using the panel on the right.
            </p>
          </div>
        ) : (
          /* List cards with left colored accent */
          <div className="space-y-3.5" id="recipes-list">
            {recipes.map(recipe => {
              const isExpanded = expandedRecipeId === recipe.id;
              return (
                <div 
                  key={recipe.id} 
                  className="bg-white border border-slate-150 hover:border-teal-550/30 rounded-2xl text-xs overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md border-l-4 border-l-teal-500"
                  id={`recipe-card-${recipe.id}`}
                >
                  {/* Clickable Card Header */}
                  <div 
                    onClick={() => setExpandedRecipeId(isExpanded ? null : recipe.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2.5 bg-teal-500/10 text-teal-700 border border-teal-500/20 rounded-xl font-extrabold font-mono text-[10px]">
                        MEAL
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm tracking-tight">{recipe.title}</h4>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5 font-mono uppercase tracking-wider">{recipe.ingredients.length} essential items</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent card expand toggle
                          handleSyncToShoppingList(recipe.id, recipe.title);
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-650 hover:border-teal-500 hover:text-teal-650 hover:bg-teal-50/20 rounded-xl text-[10px] font-extrabold bg-white transition-all shadow-2xs cursor-pointer active:scale-95"
                      >
                        <ShoppingCart className="h-3 w-3 text-teal-500" />
                        Sync Checklist
                      </button>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Content View Drawer */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-50 bg-slate-50/50 space-y-4 animate-fade-in divide-y divide-slate-100">
                      
                      {/* Ingredient tags list */}
                      <div className="space-y-2 pb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ingredients Catalog:</span>
                        <div className="flex flex-wrap gap-2">
                          {recipe.ingredients.map(ing => (
                            <span 
                              key={ing.id} 
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200/60 rounded-lg flex items-center gap-1 shadow-2xs font-mono"
                            >
                              <span>{ing.qty} {ing.unit}</span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-700">{ing.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Direction Steps */}
                      <div className="space-y-2 pt-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Instructions:</span>
                        <div className="text-slate-600 leading-relaxed max-w-full font-sans break-words text-xs whitespace-pre-wrap">
                          {recipe.stepsMd}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Column - Gemini Formula Generator panel (1/3 size) */}
      <div className="bg-white p-5 rounded-2xl border border-pink-100/50 shadow-xs max-h-fit space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
          <span className="p-2 rounded-lg bg-pink-50 text-pink-500 animate-pulse">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-1">
              Gemini Chef Assistant
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Dynamically formulate recipe details.</p>
          </div>
        </div>

        <form onSubmit={handleGenerateRecipe} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 block">Dish Name / Prompt *</label>
            <input
              type="text"
              placeholder="e.g. Oatmeal Banana Pancakes"
              value={promptRecipeName}
              onChange={e => setPromptRecipeName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl"
              disabled={generatingAI}
              required
            />
            <span className="text-[10px] text-slate-400 block mt-1">Specify anything! e.g. "Spaghetti Carbonara", "Indian Biryani", "Gluten-free cookies".</span>
          </div>

          <button
            type="submit"
            disabled={generatingAI}
            className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 disabled:bg-slate-100 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            {generatingAI ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Planning culinary details...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate AI Recipe
              </>
            )}
          </button>
        </form>

        <div className="p-3.5 bg-pink-50/50 border border-pink-100/35 rounded-xl text-[11px] text-slate-500 leading-normal">
          <Sparkles className="h-3.5 w-3.5 text-pink-500 float-left mr-1.5" />
          Gemini automatically structures ingredients, quantity proportions, unit scales, and logs them so you can click to buy with zero re-typing!
        </div>
      </div>

    </div>
  );
}
