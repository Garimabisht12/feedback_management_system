const FeedbackForm = require("../models/FeedbackForm");
const FeedbackEntry = require("../models/FeedbackEntry");

exports.submitFeedback = async (req, res) => {

  try {

    const {
      course,
      branch,
      batch,
      semester,
      feedbacks,
      best_teachers,
      suggestions,
    } = req.body;

    if (!req.student?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid student token",
      });
    }

    if (!course || !branch || !batch || !semester) {
      return res.status(400).json({
        success: false,
        message: "Missing feedback form metadata",
      });
    }

    if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No feedback items provided",
      });
    }

    // CHECK DUPLICATE

    const alreadySubmitted = await FeedbackForm.findOne({
      studentId: req.student.id,
      semester,
      batch,
    });

    if (alreadySubmitted) {

      return res.status(400).json({
        success: false,
        message: "Feedback already submitted",
      });

    }

    const cleanBestTeachers = Array.isArray(best_teachers)
      ? best_teachers
          .map(item => String(item || '').trim())
          .filter(Boolean)
      : [];

    // CREATE FORM (do not save yet, so we can rollback cleanly if entry validation fails)
    const feedbackForm = new FeedbackForm({
      studentId: req.student.id,
      course,
      branch,
      batch,
      semester,
      best_teachers: cleanBestTeachers,
      suggestions,
      feedback_entries: [],
    });

    // STORE FEEDBACK ENTRIES
    const feedbackEntryIds = [];

    for (const feedback of feedbacks) {
      const ratings = feedback.parameter_ratings || {};

      if (typeof feedback.subject_code !== 'string' || !feedback.subject_code.trim()) {
        return res.status(400).json({
          success: false,
          message: "Each feedback entry must include a subject code",
        });
      }

      const entryData = {
        feedback_form: feedbackForm._id,
        subject_code: String(feedback.subject_code || '').trim(),
        subject_name: String(feedback.subject_name || '').trim(),
        teacher_name: String(feedback.teacher_name || '').trim(),
        syllabus_covered: Number(feedback.syllabus_covered || 0),
        voice_communication: Number(feedback.voice_communication || 0),
        regularity_punctuality: Number(feedback.regularity_punctuality || 0),
        ranking: Number(feedback.ranking || 0),
        overall_performance: Number(feedback.overall_performance || 0),
        parameter_ratings: {
          voice_skill: Number(ratings.voice_skill || 0),
          systematic_delivery: Number(ratings.systematic_delivery || 0),
          behaviour: Number(ratings.behaviour || 0),
          interest_in_class: Number(ratings.interest_in_class || 0),
          command_over_subject: Number(ratings.command_over_subject || 0),
          discussion_examples: Number(ratings.discussion_examples || 0),
          punctuality: Number(ratings.punctuality || 0),
          class_control: Number(ratings.class_control || 0),
          accessibility: Number(ratings.accessibility || 0),
          overall_teacher_rating: Number(ratings.overall_teacher_rating || 0),
        },
        comment: feedback.comment,
      };

      const total_score =
        entryData.parameter_ratings.voice_skill +
        entryData.parameter_ratings.systematic_delivery +
        entryData.parameter_ratings.behaviour +
        entryData.parameter_ratings.interest_in_class +
        entryData.parameter_ratings.command_over_subject +
        entryData.parameter_ratings.discussion_examples +
        entryData.parameter_ratings.punctuality +
        entryData.parameter_ratings.class_control +
        entryData.parameter_ratings.accessibility +
        entryData.parameter_ratings.overall_teacher_rating;

      const feedbackEntry = new FeedbackEntry({
        ...entryData,
        total_score,
      });

      await feedbackEntry.validate();
      await feedbackEntry.save();

      feedbackEntryIds.push(feedbackEntry._id);
    }

    // UPDATE FORM
    feedbackForm.feedback_entries = feedbackEntryIds;
    await feedbackForm.save();

    return res.status(201).json({

      success: true,

      message:
        "Feedback submitted successfully",

      feedbackForm,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Server error",

      error: error.message,

    });

  }

};


exports.checkStatus = async (req, res) => {

  try {

    const feedback = await FeedbackForm.findOne({
      studentId: req.student?.id,
    });

    return res.status(200).json({
      success: true,
      submitted: !!feedback,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}