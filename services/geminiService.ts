import { GoogleGenAI } from "@google/genai";
import { ShipStats, Blueprint } from '../types';

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeShipDesign = async (blueprint: Blueprint, stats: ShipStats): Promise<string> => {
  const ai = getAiClient();
  const equippedNames = blueprint.equipped.map(p => p ? p.name : "Empty Slot").join(", ");
  
  const prompt = `
    Analyze this Eclipse: Second Dawn for the Galaxy ship design.
    
    Ship Class: ${blueprint.shipType}
    Parts: ${equippedNames}
    
    Stats:
    - Total Cost: ${stats.cost}
    - Damage Output: ${stats.damage}
    - Computer (Hit Bonus): +${stats.computer}
    - Shield (Hit Penalty): -${stats.shield}
    - Hull Points: ${stats.hull}
    - Initiative: ${stats.initiative}
    - Power Balance: ${stats.powerBalance}
    
    Task:
    1. Is this design legal? (Power balance must be >= 0).
    2. What are its strengths? (e.g., Glass Cannon, Tank, Initiative Striker).
    3. What specific enemies (Ancients, GCDS, or specific archetypes) would this struggle against?
    4. Suggest one improvement.
    
    Keep it concise and tactical.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert strategist for the board game Eclipse: Second Dawn for the Galaxy."
      }
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Unable to connect to the fleet strategy database (AI Error).";
  }
};

export const generateFaction = async (traits: string): Promise<string> => {
  const ai = getAiClient();
  const prompt = `Create a unique alien faction for Eclipse: Second Dawn with the following themes: ${traits}. 
  Provide:
  1. Faction Name
  2. Short Lore (2 sentences)
  3. One unique gameplay mechanic or starting advantage related to the theme.
  Format as JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    return response.text || "{}";
  } catch (error) {
    return JSON.stringify({ error: "Failed to generate faction." });
  }
};