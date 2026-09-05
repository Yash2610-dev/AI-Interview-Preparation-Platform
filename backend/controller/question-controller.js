import Question from "../models/question-model.js";
import Session from "../models/session-model.js";

// @desc Add additional questions to an existing session
// @route POST /api/questions/add
// @access Private
export const addQuestionsToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    if (!sessionId || !questions || !questions.length) {
      return res.status(400).json({
        success: false,
        message: "Session ID and questions are required",
      });
    }

    // Find the session
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // Check if session belongs to the logged-in user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Create new questions
    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer || "",
        note: q.note || "",
        isPinned: q.isPinned || false,
      })),
    );

    // Update session to include new question IDs
    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();

    res.status(201).json({
      success: true,
      message: "Questions added successfully",
      data: createdQuestions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc Pin or unpin a question
// @route POST /api/questions/:id/pin
// @access Private
export const togglePinQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPinned } = req.body;

    // Find the question
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Find the session to check ownership
    const session = await Session.findById(question.session);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // Check if session belongs to the logged-in user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Update pin status
    question.isPinned = isPinned !== undefined ? isPinned : !question.isPinned;
    await question.save();

    res.status(200).json({
      success: true,
      message: `Question ${question.isPinned ? "pinned" : "unpinned"} successfully`,
      question,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc Update a note for a question
// @route POST /api/questions/:id/note
// @access Private
export const updateQuestionNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (note === undefined) {
      return res.status(400).json({
        success: false,
        message: "Note content is required",
      });
    }

    // Find the question
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Find the session to check ownership
    const session = await Session.findById(question.session);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // Check if session belongs to the logged-in user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Update note
    question.note = note;
    await question.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      question,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};