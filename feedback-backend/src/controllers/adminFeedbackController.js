const FeedbackForm = require('../models/FeedbackForm')
const FeedbackEntry = require('../models/FeedbackEntry')


exports.getAllFeedback = async (req, res) => {

  try {

    const feedbacks = await FeedbackForm.find()

      .populate("studentId", "name email")

      .populate("feedback_entries")

      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

exports.getFeedbackById = async (req, res) => {

  try {

    const feedback = await FeedbackForm.findById(req.params.id)

      .populate("studentId", "name email")

      .populate("feedback_entries");

    // feedback not found

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback form not found",
      });
    }

    return res.status(200).json({
      success: true,
      feedback,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}


exports.getTeacherAnalytics = async (req, res) => {

  try {

    const teacherName = req.params.teacherName;

    // get all feedback entries for teacher

    const feedbacks = await FeedbackEntry.find({
      teacher_name: teacherName,
    });

    // no feedback found

    if (feedbacks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No feedback found for this teacher",
      });
    }

    // totals

    let totalScore = 0;

    let totalVoiceSkill = 0;
    let totalSystematicDelivery = 0;
    let totalBehaviour = 0;
    let totalInterestInClass = 0;
    let totalCommandOverSubject = 0;
    let totalDiscussionExamples = 0;
    let totalPunctuality = 0;
    let totalClassControl = 0;
    let totalAccessibility = 0;
    let totalOverallTeacherRating = 0;

    const comments = [];

    // loop through feedbacks

    feedbacks.forEach((feedback) => {

      totalScore += feedback.total_score;

      totalVoiceSkill += feedback.parameter_ratings.voice_skill;

      totalSystematicDelivery +=
        feedback.parameter_ratings.systematic_delivery;

      totalBehaviour +=
        feedback.parameter_ratings.behaviour;

      totalInterestInClass +=
        feedback.parameter_ratings.interest_in_class;

      totalCommandOverSubject +=
        feedback.parameter_ratings.command_over_subject;

      totalDiscussionExamples +=
        feedback.parameter_ratings.discussion_examples;

      totalPunctuality +=
        feedback.parameter_ratings.punctuality;

      totalClassControl +=
        feedback.parameter_ratings.class_control;

      totalAccessibility +=
        feedback.parameter_ratings.accessibility;

      totalOverallTeacherRating +=
        feedback.parameter_ratings.overall_teacher_rating;

      if (feedback.comment) {
        comments.push(feedback.comment);
      }
    });

    const totalFeedbacks = feedbacks.length;

    // averages

    const analytics = {

      teacher_name: teacherName,

      total_feedbacks: totalFeedbacks,

      average_total_score:
        (totalScore / totalFeedbacks).toFixed(2),

      average_ratings: {

        voice_skill:
          (totalVoiceSkill / totalFeedbacks).toFixed(2),

        systematic_delivery:
          (totalSystematicDelivery / totalFeedbacks).toFixed(2),

        behaviour:
          (totalBehaviour / totalFeedbacks).toFixed(2),

        interest_in_class:
          (totalInterestInClass / totalFeedbacks).toFixed(2),

        command_over_subject:
          (totalCommandOverSubject / totalFeedbacks).toFixed(2),

        discussion_examples:
          (totalDiscussionExamples / totalFeedbacks).toFixed(2),

        punctuality:
          (totalPunctuality / totalFeedbacks).toFixed(2),

        class_control:
          (totalClassControl / totalFeedbacks).toFixed(2),

        accessibility:
          (totalAccessibility / totalFeedbacks).toFixed(2),

        overall_teacher_rating:
          (totalOverallTeacherRating / totalFeedbacks).toFixed(2),
      },

      comments,
    };

    return res.status(200).json({
      success: true,
      analytics,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}



exports.getSubjectAnalytics = async (req, res) => {

  try {

    const subjectCode = req.params.subjectCode;

    // get all feedback entries for subject

    const feedbacks = await FeedbackEntry.find({
      subject_code: subjectCode,
    });

    // no feedback found

    if (feedbacks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No feedback found for this subject",
      });
    }

    // totals

    let totalScore = 0;

    let totalVoiceCommunication = 0;
    let totalRegularityPunctuality = 0;
    let totalOverallPerformance = 0;
    let totalRanking = 0;

    const teachers = new Set();

    const comments = [];

    // loop through feedbacks

    feedbacks.forEach((feedback) => {

      totalScore += feedback.total_score;

      totalVoiceCommunication +=
        feedback.voice_communication;

      totalRegularityPunctuality +=
        feedback.regularity_punctuality;

      totalOverallPerformance +=
        feedback.overall_performance;

      totalRanking += feedback.ranking;

      teachers.add(feedback.teacher_name);

      if (feedback.comment) {
        comments.push(feedback.comment);
      }
    });

    const totalFeedbacks = feedbacks.length;

    // analytics object

    const analytics = {

      subject_code: subjectCode,

      subject_name: feedbacks[0].subject_name,

      total_feedbacks: totalFeedbacks,

      teachers: [...teachers],

      average_total_score:
        (totalScore / totalFeedbacks).toFixed(2),

      average_voice_communication:
        (
          totalVoiceCommunication / totalFeedbacks
        ).toFixed(2),

      average_regularity_punctuality:
        (
          totalRegularityPunctuality / totalFeedbacks
        ).toFixed(2),

      average_overall_performance:
        (
          totalOverallPerformance / totalFeedbacks
        ).toFixed(2),

      average_ranking:
        (
          totalRanking / totalFeedbacks
        ).toFixed(2),

      comments,
    };

    return res.status(200).json({
      success: true,
      analytics,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}