// app/api/assess/enhance/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { saveAssessment } from "../../../../lib/scoreStorage";

// SETUP GEMINI (Will be null if no key is found)
const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey 
  ? new GoogleGenerativeAI(geminiApiKey) 
  : null;

// DEFINE THE OUTPUT SCHEMA (For Real AI)
const schema = {
  type: SchemaType.OBJECT,
  properties: {
    singularity_score: { type: SchemaType.NUMBER },
    human_moat: { type: SchemaType.STRING, enum: ["High", "Medium", "Low"] },
    saturation_year: { type: SchemaType.NUMBER },
    verdict: { type: SchemaType.STRING },
    timeline_context: { type: SchemaType.STRING },
    pivot_strategy: { type: SchemaType.STRING },
    upskillingRoadmap: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    },
    humanMoatTriggers: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    },
    recommendedTools: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          url: { type: SchemaType.STRING }
        },
        required: ["name", "description"]
      }
    }
  },
  required: ["singularity_score", "human_moat", "saturation_year", "verdict", "pivot_strategy", "timeline_context", "upskillingRoadmap", "humanMoatTriggers", "recommendedTools"],
};

export async function POST(req: Request) {
  try {
    const { university, major } = await req.json();

    if (!genAI) {
      return NextResponse.json(
        { error: "Gemini AI not configured" },
        { status: 503 }
      );
    }

        if (process.env.NODE_ENV === 'development') {
          console.log('🤖 Using Gemini AI for enhancement...');
          console.log('University:', university);
          console.log('Major:', major);
        }
    
    try {
      // Use gemini-2.5-flash (latest fast model with schema support)
      const model = genAI.getGenerativeModel({
        model: "models/gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

      const prompt = `
      Analyze this career path for the Singularity Era (2025-2035) based on BOTH the university AND major.
      
      University: ${university}
      Major: ${major}
      
      IMPORTANT: Consider BOTH factors:
      - University prestige/reputation affects networking, opportunities, and career trajectory
      - Major/degree determines the core skill set and AI vulnerability
      
      Scoring Rules (base scores, adjust ±5 based on university prestige):
      - "Business/Management" -> Base Score ~65-75. Obsolescence: ~2032. Moat: Medium.
      - "CS/Coding/Data" -> Base Score ~40-60. Obsolescence: ~2029. Moat: Low.
      - "Nursing/Trades/Health" -> Base Score ~90+. Obsolescence: 2045+. Moat: High.
      - Top-tier universities (Ivy League, Oxbridge, etc.) add +3-5 to score
      - Lower-tier universities subtract -2-3 from score
      
      Provide a comprehensive analysis including:
      - singularity_score (0-100): Overall AI resistance score
      - human_moat ("High"/"Medium"/"Low"): Level of protection from AI
      - saturation_year (2026-2045): When AI will fully replace this role
      - verdict (string): A dramatic, memorable verdict name (e.g., "The Laptop Purge", "The Middleman Massacre")
      - timeline_context (string): Explanation of when and why this role becomes obsolete
      - pivot_strategy (string): Specific, actionable advice for pivoting to AI-resistant roles
      - upskillingRoadmap (array of strings): 5 specific skills to develop, ordered by priority
      - humanMoatTriggers (array of strings): 4-5 specific human advantages that protect this role from AI
      - recommendedTools (array of objects): 3-4 tools/platforms to help with the pivot, each with name, description, and optional url
      
      Make the analysis specific to ${university} and ${major}. Consider how the university's reputation and network affects career trajectory.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const data = JSON.parse(text);
      
      // Validate Gemini response has all required fields
      if (!data.singularity_score || !data.verdict || !data.upskillingRoadmap) {
        console.warn("⚠️ Gemini response missing required fields");
        return NextResponse.json(
          { error: "Incomplete Gemini response" },
          { status: 500 }
        );
      }
      
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Gemini AI successfully generated enhanced assessment');
            console.log('Score:', data.singularity_score);
            console.log('Verdict:', data.verdict);
          }
      
      // Save assessment for statistics (non-blocking)
      saveAssessment(data.singularity_score, major, university).catch(err => console.error('Assessment save failed:', err));
      
      // Mark that this was AI-generated
      const aiGeneratedData = {
        ...data,
        _source: 'gemini-ai' // Internal flag to track AI vs preset
      };
      
      return NextResponse.json(aiGeneratedData);
    } catch (geminiError) {
      console.error("❌ Gemini Failed:", geminiError);
      console.error("Error details:", geminiError instanceof Error ? geminiError.message : String(geminiError));
      return NextResponse.json(
        { error: "Gemini API failed", details: geminiError instanceof Error ? geminiError.message : String(geminiError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Enhance endpoint error:", error);
    return NextResponse.json(
      { error: "Enhancement failed" },
      { status: 500 }
    );
  }
}
