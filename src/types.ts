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

export interface User {
  id: string;
  name: string;
  email: string;
  householdId: string;
}

export interface Item {
  id: string;
  householdId: string;
  name: string;
  barcode: string | null;
  defaultUnit: Unit;
  category: string;
  preferredAisle: string;
  minStockQty: number;
  currentStock?: number; // computed
  imageUrl?: string | null;
}

export interface InventoryLot {
  lotId: string;
  itemId: string;
  itemName: string;
  category: string;
  defaultUnit: Unit;
  preferredAisle: string;
  qty: number;
  consumedQty: number;
  remainingQty: number;
  unit: Unit;
  boughtAt: string;
  expiryAt: string | null;
  notes: string | null;
}

export interface GroceryEntry {
  id: string;
  listId: string;
  itemId: string | null;
  customText: string | null;
  qty: number | null;
  unit: Unit | null;
  checked: boolean;
  source: string | null;
  neededBy: string | null;
  item?: Item | null; // resolved
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  itemId: string | null;
  name: string;
  qty: number;
  unit: Unit;
}

export interface Recipe {
  id: string;
  householdId: string;
  title: string;
  stepsMd: string;
  ingredients: RecipeIngredient[];
}

export interface PriceHistory {
  id: string;
  itemId: string;
  store: string | null;
  price: number;
  currency: string;
  recordedAt: string;
}

export interface RestockPrediction {
  itemId: string | null;
  itemName: string;
  confidence: number;
  reason: string;
  recommendedQty: number;
}
