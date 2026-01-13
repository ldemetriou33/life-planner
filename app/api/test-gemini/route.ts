import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      return NextResponse.json({
        status: 'not_configured',
        message: 'GEMINI_API_KEY not found in environment variables',
        geminiAvailable: false
      });
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Simple test prompt
    const testPrompt = "Say 'Gemini is working' in exactly 3 words.";
    const result = await model.generateContent(testPrompt);
    const response = result.response.text();

    return NextResponse.json({
      status: 'success',
      message: 'Gemini AI is working correctly!',
      geminiAvailable: true,
      testResponse: response.trim(),
      apiKeyPresent: true,
      apiKeyLength: geminiApiKey.length
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Gemini AI test failed',
      geminiAvailable: false,
      error: error instanceof Error ? error.message : String(error),
      apiKeyPresent: !!process.env.GEMINI_API_KEY
    }, { status: 500 });
  }
}
