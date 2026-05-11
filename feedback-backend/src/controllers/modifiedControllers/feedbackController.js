const FeedbackForm = require("../../models/model/FeedbackForm");
const FeedbackEntry = require("../../models/model/FeedbackEntry");

exports.submitFeedback =  async (req, res) => {

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

    // check duplicate submission

    const alreadySubmitted = await FeedbackForm.findOne({
      studentId: req.user.id,
      semester,
      batch,
    });

    if (alreadySubmitted) {
      return res.status(400).json({
        success: false,
        message: "Feedback already submitted",
      });
    }

    // create feedback form first

    const feedbackForm = await FeedbackForm.create({
      studentId: req.user.id,
      course,
      branch,
      batch,
      semester,
      year,
      best_teachers,
      suggestions,
      feedback_entries: [],
    });

    // create feedback entries

    const feedbackEntryIds = [];

    for (const feedback of feedbacks) {

      // calculate total score

      const ratings = feedback.parameter_ratings;

      const total_score =
        ratings.voice_skill +
        ratings.systematic_delivery +
        ratings.behaviour +
        ratings.interest_in_class +
        ratings.command_over_subject +
        ratings.discussion_examples +
        ratings.punctuality +
        ratings.class_control +
        ratings.accessibility +
        ratings.overall_teacher_rating;

      // create feedback entry

      const feedbackEntry = await FeedbackEntry.create({

        feedback_form: feedbackForm._id,

        subject_code: feedback.subject_code,
        subject_name: feedback.subject_name,
        teacher_name: feedback.teacher_name,

        syllabus_covered: feedback.syllabus_covered,

        voice_communication: feedback.voice_communication,

        regularity_punctuality:
          feedback.regularity_punctuality,

        ranking: feedback.ranking,

        overall_performance:
          feedback.overall_performance,

        parameter_ratings: ratings,

        total_score,

        comment: feedback.comment,
      });

      feedbackEntryIds.push(feedbackEntry._id);
    }

    // update form with feedback entry ids

    feedbackForm.feedback_entries = feedbackEntryIds;

    await feedbackForm.save();

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedbackForm,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



exports.checkStatus = async (req, res) => {

  try {

    const feedback = await FeedbackForm.findOne({
      studentId: req.user.id,
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