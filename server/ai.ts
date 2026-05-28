import { GoogleGenAI, Type } from "@google/genai";
import { Unit } from "./db";

let aiClient: GoogleGenAI | null = null;

export function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please add it via Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}

// 1. Multimodal OCR: Parses scanned receipt image (base64) into structured JSON items
export async function parseReceiptImage(base64Data: string, mimeType: string) {
  try {
    const ai = getAIClient();
    
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data
      }
    };
    
    const promptPart = {
      text: `Analyze this grocery receipt image. Extract all food items, household items, or groceries.
For each item, identify:
- item name (clean, human-readable name without weird store abbrev, e.g. "Amul Cheese Block" instead of "AMUL CHZ BLK 200")
- quantity (numerical value, default to 1 if not readable, float allowed)
- unit (select exactly one of the following: "PIECE", "GRAM", "KG", "ML", "L", "TBSP", "TSP", "PACK")
- unit price (number representing cost per item unit in local currency, or total split. If missing, estimate reasonably)
- category (select from: "Dairy", "Produce", "Bakery", "Poultry", "Meat", "Pantry Staples", "Beverages", "Snacks", "Household", "Misc")

Return ONLY a flat JSON array of objects conforming to this schema. Do not write markdown, code blocks, or explanations.`
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, promptPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              qty: { type: Type.NUMBER },
              unit: { 
                type: Type.STRING, 
                description: "One of: PIECE, GRAM, KG, ML, L, TBSP, TSP, PACK" 
              },
              price: { type: Type.NUMBER },
              category: { type: Type.STRING }
            },
            required: ["name", "qty", "unit", "price", "category"]
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (e: any) {
    console.error("AI parseReceiptImage failed: ", e.message);
    throw e;
  }
}

// 2. OCR Text-parser (Alternative in case of fake camera scanner on desktop preview)
export async function parseReceiptText(ocrText: string) {
  try {
    const ai = getAIClient();
    
    const prompt = `Convert the following raw text from a scanned grocery receipt into a structured list of purchased items:
"${ocrText}"

For each grocery/item, infer:
- clean item name
- quantity (float or integer, default is 1)
- unit (one of: "PIECE", "GRAM", "KG", "ML", "L", "TBSP", "TSP", "PACK")
- unit price (total price or per unit price, as a number)
- category (one of: Dairy, Produce, Bakery, Poultry, Meat, Pantry Staples, Beverages, Snacks, Household, Misc)

Choose the unit that best fits the item.
Return a structured JSON list.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              qty: { type: Type.NUMBER },
              unit: { type: Type.STRING },
              price: { type: Type.NUMBER },
              category: { type: Type.STRING }
            },
            required: ["name", "qty", "unit", "price", "category"]
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (e: any) {
    console.error("AI parseReceiptText failed: ", e.message);
    throw e;
  }
}

// 3. AI Predictive Stock/Usage Optimizer: predicts restock recommendation on items
export interface RestockPrediction {
  itemId: string;
  itemName: string;
  confidence: number; // 0-1
  reason: string;
  recommendedQty: number;
}

export async function getRestockPredictions(inventorySummary: string) {
  try {
    const ai = getAIClient();
    
    const prompt = `You are an advanced pantry replenishment model. Analyze the current inventory list, quantities, bought dates, consumption rates, and expiry patterns described in this JSON context:

${inventorySummary}

Predict which items are at risk of running out, spoiling, or becoming depleted in the next 10 days. For each predicted item, provide:
- itemId (must match an itemId in the input context if available, otherwise suggest a mock id or null)
- itemName (matching candidate name)
- confidence (number strictly between 0 and 1, reflecting depletion risk)
- reason (short, analytical explanation like "consumed 0.4kg/day average; current stock lasts 2 days" or "expiring tomorrow")
- recommendedQty (suggested quantity to restock)

Return ONLY a JSON array of recommendation objects.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              itemId: { type: Type.STRING },
              itemName: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              reason: { type: Type.STRING },
              recommendedQty: { type: Type.NUMBER }
            },
            required: ["itemName", "confidence", "reason", "recommendedQty"]
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (e: any) {
    console.error("AI getRestockPredictions failed: ", e.message);
    // return stub if fails
    return [];
  }
}

// 4. Recipe builder & ingredient generator
export async function suggestAIBoughtIngredients(recipeName: string) {
  try {
    const ai = getAIClient();
    const prompt = `Generate a standard detailed cooking recipe for: "${recipeName}".
Extract and structure all ingredients precisely.
Specify:
- name (generic clean ingredient name)
- qty (numerical quantity, e.g. 500, 2)
- unit (select exactly from: "PIECE", "GRAM", "KG", "ML", "L", "TBSP", "TSP", "PACK")

And also include a markdown-formatted instruction list under 'stepsMd'.
Return JSON structure matching: { title: "Recipe Title", stepsMd: "Instructions...", ingredients: [{ name: "Ingredient Name", qty: number, unit: "PIECE"|... }] }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            stepsMd: { type: Type.STRING },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  qty: { type: Type.NUMBER },
                  unit: { type: Type.STRING }
                },
                required: ["name", "qty", "unit"]
              }
            }
          },
          required: ["title", "stepsMd", "ingredients"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (e: any) {
    console.error("AI suggestAIBoughtIngredients failed: ", e.message);
    throw e;
  }
}
