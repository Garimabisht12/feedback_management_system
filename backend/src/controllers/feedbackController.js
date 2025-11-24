// controllers/feedbackController.js
const Feedback = require('../models/Feedback');


// GET /feedback-status/:rollNumber
exports.checkFeedbackStatus = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const existingFeedback = await Feedback.findOne({ studentRoll: Number(rollNumber) });


    if (!existingFeedback) {
      return res.json({ submitted: false });
    }
    return res.json({ submitted: true }); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ submitted: false, message: "Server error" });
  }
};



exports.submitFeedback = async (req, res) => {
  try {
    const {
      studentRoll,
      session,
      semester,
      batch,
      ratings,
      overallData,
      comments,
      bestTeachers,
      suggestions,
      submittedAt
    } = req.body;

    // Validate required fields
    if (!studentRoll || !session || !semester || !batch || !ratings || !overallData || !bestTeachers) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create feedback entry
    await Feedback.create({
      studentRoll,
      session,
      semester,
      batch,
      ratings,
      overallData,
      comments,
      bestTeachers,
      suggestions,
      submittedAt
    });

    return res.status(201).json({ message: 'Feedback submitted successfully' });

  } catch (err) {
    console.error('Error submitting feedback:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// GET /feedback/analytics - Get comprehensive feedback analytics
exports.getFeedbackAnalytics = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({});

    // Total feedbacks
    const totalFeedbacks = feedbacks.length;

    // Best Teachers Analysis
    const bestTeachersCount = {};
    feedbacks.forEach(feedback => {
      if (feedback.bestTeachers && Array.isArray(feedback.bestTeachers)) {
        feedback.bestTeachers.forEach(teacher => {
          bestTeachersCount[teacher] = (bestTeachersCount[teacher] || 0) + 1;
        });
      }
    });

    // Sort and get top 8 teachers
    const topTeachers = Object.entries(bestTeachersCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Subject-wise ratings analysis
    const subjectRatings = {};
    feedbacks.forEach(feedback => {
      if (feedback.ratings) {
        Object.entries(feedback.ratings).forEach(([subjectCode, ratingsArray]) => {
          if (!subjectRatings[subjectCode]) {
            subjectRatings[subjectCode] = {
              totalRatings: [],
              count: 0
            };
          }

          // Calculate average for this feedback (first 9 ratings, 1-5 scale)
          const firstNine = ratingsArray.slice(0, 9);
          const sum = firstNine.reduce((acc, val) => acc + (parseInt(val) || 0), 0);
          const avg = sum / 9;

          subjectRatings[subjectCode].totalRatings.push(avg);
          subjectRatings[subjectCode].count++;
        });
      }
    });

    // Calculate average ratings per subject
    const subjectAverages = Object.entries(subjectRatings).map(([code, data]) => {
      const overallAvg = data.totalRatings.reduce((a, b) => a + b, 0) / data.totalRatings.length;
      return {
        subjectCode: code,
        averageRating: parseFloat(overallAvg.toFixed(2)),
        feedbackCount: data.count
      };
    }).sort((a, b) => b.averageRating - a.averageRating);

    // Overall Performance Metrics (1-10 scale)
    const overallMetrics = {
      syllabus: [],
      voice: [],
      regularity: []
    };

    feedbacks.forEach(feedback => {
      if (feedback.overallData) {
        Object.values(feedback.overallData).forEach(data => {
          if (data.syllabus) overallMetrics.syllabus.push(parseInt(data.syllabus) || 0);
          if (data.voice) overallMetrics.voice.push(parseInt(data.voice) || 0);
          if (data.regularity) overallMetrics.regularity.push(parseInt(data.regularity) || 0);
        });
      }
    });

    const calculateAverage = (arr) => {
      if (arr.length === 0) return 0;
      return parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2));
    };

    const averageMetrics = {
      syllabus: calculateAverage(overallMetrics.syllabus),
      voice: calculateAverage(overallMetrics.voice),
      regularity: calculateAverage(overallMetrics.regularity)
    };

    // All Comments (not filtered)
    const allComments = feedbacks
      .filter(f => f.comments && f.comments.trim() !== '')
      .map(f => ({
        comment: f.comments
      }));

    // Session-wise distribution
    const sessionDistribution = {};
    feedbacks.forEach(feedback => {
      const key = `${feedback.session} - Sem ${feedback.semester}`;
      sessionDistribution[key] = (sessionDistribution[key] || 0) + 1;
    });

    const sessionData = Object.entries(sessionDistribution).map(([session, count]) => ({
      session,
      count
    }));

    // Send analytics response
    return res.status(200).json({
      totalFeedbacks,
      topTeachers,
      subjectAverages,
      averageMetrics,
      allComments,
      sessionDistribution: sessionData
    });

  } catch (err) {
    console.error('Error fetching analytics:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// GET /feedback/teacher/:teacherName - Get specific teacher analytics
exports.getTeacherAnalytics = async (req, res) => {
  try {
    const { teacherName } = req.params;
    const feedbacks = await Feedback.find({});

    // Filter feedbacks that include this teacher in ratings or overallData
    const teacherFeedbacks = feedbacks.filter(feedback => {
      if (feedback.ratings) {
        const hasTeacherInRatings = Object.keys(feedback.ratings).some(key => 
          key.toLowerCase().includes(teacherName.toLowerCase())
        );
        if (hasTeacherInRatings) return true;
      }
      if (feedback.overallData) {
        const hasTeacherInOverall = Object.keys(feedback.overallData).some(key =>
          key.toLowerCase().includes(teacherName.toLowerCase())
        );
        if (hasTeacherInOverall) return true;
      }
      return false;
    });

    const totalFeedbacks = teacherFeedbacks.length;

    // Count how many times voted as best teacher
    const bestTeacherVotes = feedbacks.filter(f => 
      f.bestTeachers && f.bestTeachers.includes(teacherName)
    ).length;

    // Calculate subject-wise ratings for this teacher
    const subjectRatings = {};
    teacherFeedbacks.forEach(feedback => {
      if (feedback.ratings) {
        Object.entries(feedback.ratings).forEach(([subjectCode, ratingsArray]) => {
          if (subjectCode.toLowerCase().includes(teacherName.toLowerCase())) {
            if (!subjectRatings[subjectCode]) {
              subjectRatings[subjectCode] = {
                ratings: [],
                parameterRatings: Array(9).fill(0).map(() => [])
              };
            }
            
            // Store individual parameter ratings
            const firstNine = ratingsArray.slice(0, 9);
            firstNine.forEach((rating, index) => {
              const val = parseInt(rating) || 0;
              subjectRatings[subjectCode].parameterRatings[index].push(val);
            });

            // Overall average
            const sum = firstNine.reduce((acc, val) => acc + (parseInt(val) || 0), 0);
            subjectRatings[subjectCode].ratings.push(sum / 9);
          }
        });
      }
    });

    // Calculate parameter-wise averages
    const parameterNames = [
      "Teacher's Voice Skill",
      "Systematic delivery",
      "Teacher's behaviour",
      "Interaction with students",
      "Command over subject",
      "Discussion on questions",
      "Teacher's punctuality",
      "Ability to control class",
      "Accessibility outside class"
    ];

    const parameterAverages = parameterNames.map((name, index) => {
      let allRatings = [];
      Object.values(subjectRatings).forEach(data => {
        allRatings = allRatings.concat(data.parameterRatings[index]);
      });
      const avg = allRatings.length > 0 
        ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length 
        : 0;
      return {
        parameter: name,
        average: parseFloat(avg.toFixed(2))
      };
    });

    // Overall metrics for this teacher
    const overallMetrics = {
      syllabus: [],
      voice: [],
      regularity: []
    };

    teacherFeedbacks.forEach(feedback => {
      if (feedback.overallData) {
        Object.entries(feedback.overallData).forEach(([code, data]) => {
          if (code.toLowerCase().includes(teacherName.toLowerCase())) {
            if (data.syllabus) overallMetrics.syllabus.push(parseInt(data.syllabus) || 0);
            if (data.voice) overallMetrics.voice.push(parseInt(data.voice) || 0);
            if (data.regularity) overallMetrics.regularity.push(parseInt(data.regularity) || 0);
          }
        });
      }
    });

    const calculateAverage = (arr) => {
      if (arr.length === 0) return 0;
      return parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2));
    };

    const averageMetrics = {
      syllabus: calculateAverage(overallMetrics.syllabus),
      voice: calculateAverage(overallMetrics.voice),
      regularity: calculateAverage(overallMetrics.regularity)
    };

    // Overall rating average (from parameter ratings)
    const overallRatingAvg = parameterAverages.reduce((sum, p) => sum + p.average, 0) / parameterAverages.length;

    // Comments mentioning this teacher
    const teacherComments = teacherFeedbacks
      .filter(f => f.comments && f.comments.trim() !== '')
      .map(f => ({
        comment: f.comments,
        session: f.session,
        semester: f.semester
      }));

    // Subject breakdown
    const subjectBreakdown = Object.entries(subjectRatings).map(([code, data]) => ({
      subjectCode: code,
      averageRating: parseFloat((data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(2)),
      feedbackCount: data.ratings.length
    })).sort((a, b) => b.averageRating - a.averageRating);

    return res.status(200).json({
      teacherName,
      totalFeedbacks,
      bestTeacherVotes,
      overallRatingAvg: parseFloat(overallRatingAvg.toFixed(2)),
      parameterAverages,
      averageMetrics,
      subjectBreakdown,
      teacherComments
    });

  } catch (err) {
    console.error('Error fetching teacher analytics:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
