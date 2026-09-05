import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import Question from "../models/question-model.js";
import Session from "../models/session-model.js";

import {
  conceptExplainPrompt,
  questionAnswerPrompt,
} from "../utils/prompts-util.js";


// ===============================
// Gemini AI
// ===============================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

console.log("Gemini key exists:", !!process.env.GEMINI_API_KEY);
console.log("Gemini key length:", process.env.GEMINI_API_KEY?.length);


// ===============================
// Generate Interview Questions
// ===============================

export const generateInterviewQuestions = async (req, res) => {
  console.log("Generate questions API called");

  try {
    const { sessionId } = req.body;

    // 1. Check sessionId
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    // 2. Find session
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // 3. Authorization
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const { role, experience, topicsToFocus } = session;

    // 4. Create prompt
    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      10
    );

    // 5. Generate using Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // 6. Check response
    if (!response) {
      return res.status(500).json({
        success: false,
        message: "Invalid response from Gemini",
      });
    }

    // 7. Get text
    const rawText = response.text || "";

    if (!rawText) {
      return res.status(500).json({
        success: false,
        message: "Gemini returned empty response",
      });
    }

    console.log("Gemini response received");

    // 8. Clean JSON
    const cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    // 9. Parse JSON
    let questions;

    try {
      questions = JSON.parse(cleanedText);
    } catch (error) {
      const match = cleanedText.match(/\[[\s\S]*\]/);

      if (!match) {
        console.log("Invalid AI response:", cleanedText);

        return res.status(500).json({
          success: false,
          message: "AI response not in JSON format",
        });
      }

      try {
        questions = JSON.parse(match[0]);
      } catch (parseError) {
        return res.status(500).json({
          success: false,
          message: "Failed to parse AI response",
        });
      }
    }

    // 10. Check array
    if (!Array.isArray(questions)) {
      return res.status(500).json({
        success: false,
        message: "AI response is not an array",
      });
    }

    // 11. Save questions
    const saved = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,

        question:
          typeof q === "string"
            ? q
            : q.question || "",

        answer:
          typeof q === "object"
            ? q.answer || ""
            : "",

        note: "",
        isPinned: false,
      }))
    );

    // 12. Attach questions to session
    session.questions.push(
      ...saved.map((q) => q._id)
    );

    await session.save();

    // 13. Response
    return res.status(201).json({
      success: true,
      data: saved,
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};


// ===============================
// Generate Concept Explanation
// ===============================

export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const prompt = conceptExplainPrompt(question);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = response.text || "";

    if (!rawText) {
      return res.status(500).json({
        success: false,
        message: "Gemini returned empty response",
      });
    }

    const cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .replace(/^json\s*/i, "")
      .trim();

    let explanation;

    try {
      explanation = JSON.parse(cleanedText);
    } catch (error) {
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error(
          "Failed to parse AI response as JSON"
        );
      }

      explanation = JSON.parse(jsonMatch[0]);
    }

    if (
      !explanation.title ||
      !explanation.explanation
    ) {
      throw new Error(
        "Response missing required fields"
      );
    }

    return res.status(200).json({
      success: true,
      data: explanation,
    });

  } catch (error) {
    console.error("EXPLANATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};


// ===============================
// Get Session By ID
// ===============================

export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(
      req.params.id
    ).populate("questions");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    return res.status(200).json({
      success: true,
      session,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};