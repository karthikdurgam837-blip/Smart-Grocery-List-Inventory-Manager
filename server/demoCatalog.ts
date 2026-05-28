import { Unit } from "./db";

export interface DemoItemTemplate {
  name: string;
  category: string;
  preferredAisle: string;
  defaultUnit: Unit;
  minStockQty: number;
  imageUrl: string;
}

export const demoCatalogTemplates: DemoItemTemplate[] = [
  // --- Grains & Pasta ---
  {
    name: "Long-grain white rice",
    category: "Grains & Pasta",
    preferredAisle: "Aisle G: Rice & Grains",
    defaultUnit: Unit.KG,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Jasmine rice",
    category: "Grains & Pasta",
    preferredAisle: "Aisle G: Rice & Grains",
    defaultUnit: Unit.KG,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Basmati rice",
    category: "Grains & Pasta",
    preferredAisle: "Aisle G: Rice & Grains",
    defaultUnit: Unit.KG,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Brown rice",
    category: "Grains & Pasta",
    preferredAisle: "Aisle G: Rice & Grains",
    defaultUnit: Unit.KG,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Quinoa",
    category: "Grains & Pasta",
    preferredAisle: "Aisle G: Grains & Beans",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Couscous",
    category: "Grains & Pasta",
    preferredAisle: "Aisle G: Rice & Grains",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef04bdf44?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Barley",
    category: "Grains & Pasta",
    preferredAisle: "Aisle G: Rice & Grains",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Farro",
    category: "Grains & Pasta",
    preferredAisle: "Aisle G: Rice & Grains",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Rolled oats",
    category: "Grains & Pasta",
    preferredAisle: "Aisle F: Cereals",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Spaghetti",
    category: "Grains & Pasta",
    preferredAisle: "Aisle H: Pasta & Sauces",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Penne",
    category: "Grains & Pasta",
    preferredAisle: "Aisle H: Pasta & Sauces",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1621961404018-c553a1523a1a?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Rigatoni",
    category: "Grains & Pasta",
    preferredAisle: "Aisle H: Pasta & Sauces",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1551462147-37885acc3651?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Macaroni",
    category: "Grains & Pasta",
    preferredAisle: "Aisle H: Pasta & Sauces",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Lasagna sheets",
    category: "Grains & Pasta",
    preferredAisle: "Aisle H: Pasta & Sauces",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Ramen noodles",
    category: "Grains & Pasta",
    preferredAisle: "Aisle I: International Food",
    defaultUnit: Unit.PACK,
    minStockQty: 5,
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Rice noodles",
    category: "Grains & Pasta",
    preferredAisle: "Aisle I: International Food",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Soba noodles",
    category: "Grains & Pasta",
    preferredAisle: "Aisle I: International Food",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=300&h=300"
  },

  // --- Baking ---
  {
    name: "All-purpose flour",
    category: "Baking Supplies",
    preferredAisle: "Aisle F: Baking corner",
    defaultUnit: Unit.KG,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Whole wheat flour",
    category: "Baking Supplies",
    preferredAisle: "Aisle F: Baking corner",
    defaultUnit: Unit.KG,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Bread flour",
    category: "Baking Supplies",
    preferredAisle: "Aisle F: Baking corner",
    defaultUnit: Unit.KG,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Cornstarch",
    category: "Baking Supplies",
    preferredAisle: "Aisle F: Baking corner",
    defaultUnit: Unit.GRAM,
    minStockQty: 250,
    imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Granulated white sugar",
    category: "Baking Supplies",
    preferredAisle: "Aisle F: Baking corner",
    defaultUnit: Unit.KG,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Light brown sugar",
    category: "Baking Supplies",
    preferredAisle: "Aisle F: Baking corner",
    defaultUnit: Unit.KG,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Dark brown sugar",
    category: "Baking Supplies",
    preferredAisle: "Aisle F: Baking corner",
    defaultUnit: Unit.KG,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Powdered sugar",
    category: "Baking Supplies",
    preferredAisle: "Aisle F: Baking corner",
    defaultUnit: Unit.KG,
    minStockQty: 0.5,
    imageUrl: "https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Baking powder",
    category: "Baking Supplies",
    preferredAisle: "Aisle F: Baking corner",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Baking soda (baking)",
    category: "Baking Supplies",
    preferredAisle: "Aisle F: Baking corner",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Active dry yeast",
    category: "Baking Supplies",
    preferredAisle: "Aisle F: Baking corner",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Vanilla extract",
    category: "Baking Supplies",
    preferredAisle: "Aisle F: Baking corner",
    defaultUnit: Unit.ML,
    minStockQty: 100,
    imageUrl: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Cornmeal",
    category: "Baking Supplies",
    preferredAisle: "Aisle F: Baking corner",
    defaultUnit: Unit.KG,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Breadcrumbs",
    category: "Baking Supplies",
    preferredAisle: "Aisle F: Baking corner",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Panko",
    category: "Baking Supplies",
    preferredAisle: "Aisle F: Baking corner",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300&h=300"
  },

  // --- Canned Goods ---
  {
    name: "Diced tomatoes",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 3,
    imageUrl: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Crushed tomatoes",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Whole peeled tomatoes",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Tomato paste",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned chickpeas",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned black beans",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned kidney beans",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned pinto beans",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned tuna",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 4,
    imageUrl: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned salmon",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned sardines",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned anchovies",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned sweet corn",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1551754625-702980ca0072?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned green peas",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1551754625-702980ca0072?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned green beans",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1551754625-702980ca0072?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned sliced mushrooms",
    category: "Canned Goods",
    preferredAisle: "Aisle J: Canned Essentials",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=300&h=300"
  },

  // --- Soup/Broth & More ---
  {
    name: "Applesauce",
    category: "Soups, Broths & Fruit",
    preferredAisle: "Aisle K: Fruits & Dressings",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned peaches",
    category: "Soups, Broths & Fruit",
    preferredAisle: "Aisle K: Fruits & Dressings",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned pineapple chunks",
    category: "Soups, Broths & Fruit",
    preferredAisle: "Aisle K: Fruits & Dressings",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Vegetable broth",
    category: "Soups, Broths & Fruit",
    preferredAisle: "Aisle L: Soups & Broths",
    defaultUnit: Unit.L,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Chicken broth",
    category: "Soups, Broths & Fruit",
    preferredAisle: "Aisle L: Soups & Broths",
    defaultUnit: Unit.L,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Beef broth",
    category: "Soups, Broths & Fruit",
    preferredAisle: "Aisle L: Soups & Broths",
    defaultUnit: Unit.L,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Bouillon cubes",
    category: "Soups, Broths & Fruit",
    preferredAisle: "Aisle L: Soups & Broths",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Tomato soup",
    category: "Soups, Broths & Fruit",
    preferredAisle: "Aisle L: Soups & Broths",
    defaultUnit: Unit.PACK,
    minStockQty: 3,
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Mushroom soup",
    category: "Soups, Broths & Fruit",
    preferredAisle: "Aisle L: Soups & Broths",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Chicken noodle soup",
    category: "Soups, Broths & Fruit",
    preferredAisle: "Aisle L: Soups & Broths",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Lentil soup",
    category: "Soups, Broths & Fruit",
    preferredAisle: "Aisle L: Soups & Broths",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned coconut milk",
    category: "Soups, Broths & Fruit",
    preferredAisle: "Aisle I: International Food",
    defaultUnit: Unit.PACK,
    minStockQty: 3,
    imageUrl: "https://images.unsplash.com/photo-1560130803-aaadb4bc913e?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canned coconut cream",
    category: "Soups, Broths & Fruit",
    preferredAisle: "Aisle I: International Food",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1560130803-aaadb4bc913e?auto=format&fit=crop&q=80&w=300&h=300"
  },

  // --- Oils/Vinegars/Condiments ---
  {
    name: "Extra virgin olive oil",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Sauces",
    defaultUnit: Unit.ML,
    minStockQty: 1000,
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Avocado oil",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Sauces",
    defaultUnit: Unit.ML,
    minStockQty: 500,
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Canola oil",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Sauces",
    defaultUnit: Unit.L,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Sesame oil",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Sauces",
    defaultUnit: Unit.ML,
    minStockQty: 250,
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "White distilled vinegar",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Vinegar",
    defaultUnit: Unit.ML,
    minStockQty: 500,
    imageUrl: "https://images.unsplash.com/photo-1589733901241-5e5148e8809e?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Apple cider vinegar",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Vinegar",
    defaultUnit: Unit.ML,
    minStockQty: 500,
    imageUrl: "https://images.unsplash.com/photo-1589733901241-5e5148e8809e?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Balsamic vinegar",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Vinegar",
    defaultUnit: Unit.ML,
    minStockQty: 250,
    imageUrl: "https://images.unsplash.com/photo-1589733901241-5e5148e8809e?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Rice vinegar",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Vinegar",
    defaultUnit: Unit.ML,
    minStockQty: 250,
    imageUrl: "https://images.unsplash.com/photo-1589733901241-5e5148e8809e?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Soy sauce",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle I: International Food",
    defaultUnit: Unit.ML,
    minStockQty: 500,
    imageUrl: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Tamari",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle I: International Food",
    defaultUnit: Unit.ML,
    minStockQty: 250,
    imageUrl: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Oyster sauce",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle I: International Food",
    defaultUnit: Unit.ML,
    minStockQty: 250,
    imageUrl: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Fish sauce",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle I: International Food",
    defaultUnit: Unit.ML,
    minStockQty: 250,
    imageUrl: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Ketchup",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Sauces",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1607305387299-a3d9611cd46f?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Yellow mustard",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Sauces",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Dijon mustard",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Sauces",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Mayonnaise",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Sauces",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1570554886111-e80fcca5a021?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Sriracha",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Sauces",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Tabasco",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Sauces",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Chili crisp",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle I: International Food",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Honey",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle N: Jams & Spreads",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Maple syrup",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle N: Jams & Spreads",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1588880593393-ffcb5fc5d291?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Barbecue sauce",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Sauces",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Salad dressings",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle M: Oils & Sauces",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1570554886111-e80fcca5a021?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Curry paste",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle I: International Food",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1618412523995-171b7829dce0?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Harissa",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle I: International Food",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1618412523995-171b7829dce0?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Miso paste",
    category: "Oils, Vinegars & Condiments",
    preferredAisle: "Aisle I: International Food",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1618412523995-171b7829dce0?auto=format&fit=crop&q=80&w=300&h=300"
  },

  // --- Spices & Seasonings ---
  {
    name: "Fine sea salt",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1604838605553-611ec5164287?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Kosher salt",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1604838605553-611ec5164287?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Flaky finishing salt",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1604838605553-611ec5164287?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Whole black peppercorns",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1508737804141-4c3b688e25be?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Ground white pepper",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1508737804141-4c3b688e25be?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Garlic powder",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Onion powder",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Minced dried onion",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Ground cumin",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Ground coriander",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Ground cinnamon",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Ground nutmeg",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Ground allspice",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Dried oregano",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Dried basil",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Dried thyme",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Dried rosemary",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Dried bay leaves",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Smoked paprika",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Cayenne pepper",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Crushed red pepper flakes",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Curry powder",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Italian seasoning",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Chili powder",
    category: "Spices & Seasonings",
    preferredAisle: "Aisle S: Spices & Salts",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?auto=format&fit=crop&q=80&w=300&h=300"
  },

  // --- Cleaning ---
  {
    name: "Liquid dish soap",
    category: "Cleaning Products",
    preferredAisle: "Aisle X: Household Cleaners",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Dishwasher pods",
    category: "Cleaning Products",
    preferredAisle: "Aisle X: Household Cleaners",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Dishwasher rinse aid",
    category: "Cleaning Products",
    preferredAisle: "Aisle X: Household Cleaners",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Scrub sponges",
    category: "Cleaning Products",
    preferredAisle: "Aisle X: Sponges & Wipes",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Steel wool pads",
    category: "Cleaning Products",
    preferredAisle: "Aisle X: Sponges & Wipes",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Microfiber cloths",
    category: "Cleaning Products",
    preferredAisle: "Aisle X: Sponges & Wipes",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "All-purpose spray",
    category: "Cleaning Products",
    preferredAisle: "Aisle X: Household Cleaners",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Disinfecting wipes",
    category: "Cleaning Products",
    preferredAisle: "Aisle X: Household Cleaners",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Glass cleaner",
    category: "Cleaning Products",
    preferredAisle: "Aisle X: Household Cleaners",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Baking soda (cleaning)",
    category: "Cleaning Products",
    preferredAisle: "Aisle X: Household Cleaners",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "White cleaning vinegar",
    category: "Cleaning Products",
    preferredAisle: "Aisle X: Household Cleaners",
    defaultUnit: Unit.L,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Liquid bleach",
    category: "Cleaning Products",
    preferredAisle: "Aisle X: Household Cleaners",
    defaultUnit: Unit.L,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Floor cleaning solution",
    category: "Cleaning Products",
    preferredAisle: "Aisle X: Household Cleaners",
    defaultUnit: Unit.L,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Wood cleaner",
    category: "Cleaning Products",
    preferredAisle: "Aisle X: Household Cleaners",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=300&h=300"
  },

  // --- Storage & Paper ---
  {
    name: "Vacuum bags",
    category: "Storage & Packaging",
    preferredAisle: "Aisle Y: Home Utilities",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1622390491509-2f15c7e9c92e?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "13-gallon kitchen trash bags",
    category: "Storage & Packaging",
    preferredAisle: "Aisle Y: Foils & Trash Bags",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Small trash liners",
    category: "Storage & Packaging",
    preferredAisle: "Aisle Y: Foils & Trash Bags",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Aluminum foil",
    category: "Storage & Packaging",
    preferredAisle: "Aisle Y: Foils & Trash Bags",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Plastic wrap",
    category: "Storage & Packaging",
    preferredAisle: "Aisle Y: Foils & Trash Bags",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Parchment paper",
    category: "Storage & Packaging",
    preferredAisle: "Aisle Y: Foils & Trash Bags",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Zip-top gallon bags",
    category: "Storage & Packaging",
    preferredAisle: "Aisle Y: Foils & Trash Bags",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Zip-top quart bags",
    category: "Storage & Packaging",
    preferredAisle: "Aisle Y: Foils & Trash Bags",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=300&h=300"
  },

  // --- Laundry ---
  {
    name: "Liquid laundry detergent",
    category: "Laundry Supplies",
    preferredAisle: "Aisle W: Laundry Corner",
    defaultUnit: Unit.L,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1610555356070-d0efb6505f81?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Laundry pods",
    category: "Laundry Supplies",
    preferredAisle: "Aisle W: Laundry Corner",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1610555356070-d0efb6505f81?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Laundry stain remover spray",
    category: "Laundry Supplies",
    preferredAisle: "Aisle W: Laundry Corner",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1610555356070-d0efb6505f81?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Fabric softener sheets",
    category: "Laundry Supplies",
    preferredAisle: "Aisle W: Laundry Corner",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1610555356070-d0efb6505f81?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Wool dryer balls",
    category: "Laundry Supplies",
    preferredAisle: "Aisle W: Laundry Corner",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1610555356070-d0efb6505f81?auto=format&fit=crop&q=80&w=300&h=300"
  },

  // --- Health/Beauty/Personal Care ---
  {
    name: "Toilet paper",
    category: "Personal Care",
    preferredAisle: "Aisle P: Paper Goods",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1584622781514-f63421229aa9?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Paper towels",
    category: "Personal Care",
    preferredAisle: "Aisle P: Paper Goods",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1584622781514-f63421229aa9?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Facial tissues",
    category: "Personal Care",
    preferredAisle: "Aisle P: Paper Goods",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1584622781514-f63421229aa9?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Liquid hand soap refills",
    category: "Personal Care",
    preferredAisle: "Aisle H: Hand Hygiene",
    defaultUnit: Unit.L,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Body wash",
    category: "Personal Care",
    preferredAisle: "Aisle T: Toiletries",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Bar soap",
    category: "Personal Care",
    preferredAisle: "Aisle T: Toiletries",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Shampoo",
    category: "Personal Care",
    preferredAisle: "Aisle T: Toiletries",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Conditioner",
    category: "Personal Care",
    preferredAisle: "Aisle T: Toiletries",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Toothpaste",
    category: "Personal Care",
    preferredAisle: "Aisle T: Dental Care",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1559599044-c48c8230b65a?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Mouthwash",
    category: "Personal Care",
    preferredAisle: "Aisle T: Dental Care",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1559599044-c48c8230b65a?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Dental floss",
    category: "Personal Care",
    preferredAisle: "Aisle T: Dental Care",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1559599044-c48c8230b65a?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Toothbrushes",
    category: "Personal Care",
    preferredAisle: "Aisle T: Dental Care",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1607579004455-d4fc3b688e25?auto=format&fit=crop&q=80&w=300&h=300"
  },

  // --- Emergency / Tools ---
  {
    name: "AA batteries",
    category: "Emergency & Tools",
    preferredAisle: "Aisle Z: Hardware & Power",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "AAA batteries",
    category: "Emergency & Tools",
    preferredAisle: "Aisle Z: Hardware & Power",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "C batteries",
    category: "Emergency & Tools",
    preferredAisle: "Aisle Z: Hardware & Power",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "D batteries",
    category: "Emergency & Tools",
    preferredAisle: "Aisle Z: Hardware & Power",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "9V batteries",
    category: "Emergency & Tools",
    preferredAisle: "Aisle Z: Hardware & Power",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Flashlights",
    category: "Emergency & Tools",
    preferredAisle: "Aisle Z: Emergency Prep",
    defaultUnit: Unit.PIECE,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1554734867-bf3c00a49371?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Headlamps",
    category: "Emergency & Tools",
    preferredAisle: "Aisle Z: Emergency Prep",
    defaultUnit: Unit.PIECE,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1554734867-bf3c00a49371?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Emergency candles",
    category: "Emergency & Tools",
    preferredAisle: "Aisle Z: Emergency Prep",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Utility lighters",
    category: "Emergency & Tools",
    preferredAisle: "Aisle Z: Emergency Prep",
    defaultUnit: Unit.PIECE,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1554734867-bf3c00a49371?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Duct tape",
    category: "Emergency & Tools",
    preferredAisle: "Aisle Z: Tape & Glues",
    defaultUnit: Unit.PIECE,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1564182842519-8a3b2af3e228?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Electrical tape",
    category: "Emergency & Tools",
    preferredAisle: "Aisle Z: Tape & Glues",
    defaultUnit: Unit.PIECE,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1564182842519-8a3b2af3e228?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Super glue",
    category: "Emergency & Tools",
    preferredAisle: "Aisle Z: Tape & Glues",
    defaultUnit: Unit.PIECE,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1564182842519-8a3b2af3e228?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Multi-tools",
    category: "Emergency & Tools",
    preferredAisle: "Aisle Z: Utility Gear",
    defaultUnit: Unit.PIECE,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1590157132470-86b9a2253456?auto=format&fit=crop&q=80&w=300&h=300"
  },

  // --- Medical & First Aid ---
  {
    name: "Adhesive bandages",
    category: "Medical & First Aid",
    preferredAisle: "First Aid Kit",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Sterile gauze pads",
    category: "Medical & First Aid",
    preferredAisle: "First Aid Kit",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Medical tape",
    category: "Medical & First Aid",
    preferredAisle: "First Aid Kit",
    defaultUnit: Unit.PIECE,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Antiseptic wipes",
    category: "Medical & First Aid",
    preferredAisle: "First Aid Kit",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Rubbing alcohol",
    category: "Medical & First Aid",
    preferredAisle: "First Aid Kit",
    defaultUnit: Unit.ML,
    minStockQty: 250,
    imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Hydrogen peroxide",
    category: "Medical & First Aid",
    preferredAisle: "First Aid Kit",
    defaultUnit: Unit.ML,
    minStockQty: 250,
    imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Antibiotic ointment",
    category: "Medical & First Aid",
    preferredAisle: "First Aid Kit",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Ibuprofen",
    category: "Medical & First Aid",
    preferredAisle: "Medicine Cabinet",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Acetaminophen",
    category: "Medical & First Aid",
    preferredAisle: "Medicine Cabinet",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Antihistamines",
    category: "Medical & First Aid",
    preferredAisle: "Medicine Cabinet",
    defaultUnit: Unit.PACK,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Cough drops",
    category: "Medical & First Aid",
    preferredAisle: "Medicine Cabinet",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Digital thermometer",
    category: "Medical & First Aid",
    preferredAisle: "Medicine Cabinet",
    defaultUnit: Unit.PIECE,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Tweezers",
    category: "Medical & First Aid",
    preferredAisle: "Medicine Cabinet",
    defaultUnit: Unit.PIECE,
    minStockQty: 1,
    imageUrl: "https://images.unsplash.com/photo-1590157132470-86b9a2253456?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Instant cold packs",
    category: "Medical & First Aid",
    preferredAisle: "First Aid Kit",
    defaultUnit: Unit.PACK,
    minStockQty: 2,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300"
  }
];
