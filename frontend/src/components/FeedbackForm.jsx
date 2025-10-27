import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useLocation } from "react-router-dom";

const feedbackParams = [
  { sNo: 1, parameter: "Teacher's Voice Skill" },
  { sNo: 2, parameter: "Systematic delivery" },
  { sNo: 3, parameter: "Teacher's behaviour" },
  { sNo: 4, parameter: "Interaction with students/Inactiveness in class" },
  { sNo: 5, parameter: "Teacher's command over the subject" },
  { sNo: 6, parameter: "Discussion on question/example" },
  { sNo: 7, parameter: "Teacher's punctuality" },
  { sNo: 8, parameter: "Teacher's ability to control class" },
  { sNo: 9, parameter: "Teacher's accessibility & help outside the class" },
  { sNo: 10, parameter: "Overall rating of the teacher (Excellent, Very Good, Good)" },
];

const FeedbackForm = () => {
  const [studentData, setStudentData] = useState({});
  const [studentVerified, setStudentVerified] = useState(false);
  const [session, setSession] = useState("");
  const [semester, setSemester] = useState("");
  const [batch, setBatch] = useState("");
  const [subjects, setSubjects] = useState({});
  const [ratings, setRatings] = useState({});
  const [overallData, setOverallData] = useState({});
  const [comments, setComments] = useState("");
  const [bestTeachers, setBestTeachers] = useState({ t1: "", t2: "", t3: "" });
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [ssb, setSsb] = useState(false)

  const [ssbError, setSsbError] = useState('')


  const location = useLocation();
  const rollFromLogin = location.state?.rollNo || "";
  const [rollNo, setRollNo] = useState(rollFromLogin);

  // get student data
  useEffect(() => {
   const fetchData = async () =>{
try {
      const res = await axios.get(`/student/${rollNo}`);
      setStudentVerified(true);
      setStudentData(res.data.student);
     
    } catch (err) {
      setIsError(true);
      setErrorMsg(err.response?.data?.message || "Error getting data");
      
    }}
    fetchData();
  }, [])
  const verifyRollNo = async () => {
  }

 // Load Subjects
const loadSubjects = async () => {
  if (!session || !semester || !batch) {
    setIsError(true);
    setErrorMsg("Please enter session, semester, and batch");
    return;
  }

  try {
    setLoadingSubjects(true);
    const res = await axios.get(
      `/subjects?session=${session}&semester=${semester}&batch=${batch}`
    );

    if (!res.data || !res.data.subjects || res.data.subjects.length === 0) {
      throw new Error("No subjects found for the given details");
    }

    const fetchedSubjects = {};
    const initRatings = {};
    const initOverallData = {};

    res.data.subjects.forEach((sub) => {
      fetchedSubjects[sub.subjectCode] = {
        name: sub.subjectName,
        teacher: sub.teacherName,
      };
      initRatings[sub.subjectCode] = Array(10).fill("");
      initOverallData[sub.subjectCode] = {
        syllabus: "",
        voice: "",
        regularity: "",
        ranking: "",
        overall: "",
      };
    });

    setSubjects(fetchedSubjects);
    setRatings(initRatings);
    setOverallData(initOverallData);
    setIsError(false);
    setErrorMsg("");
    setSsb(true); 
    setSsbError('')

  } catch (err) {
    setIsError(true);
    setSsbError("NOT FOUND! Enter valid data");
  } finally {
    setLoadingSubjects(false);
  }
};

  // Handle Changes
  const handleRatingChange = (subjectCode, index, value) => {
    setRatings((prev) => ({
      ...prev,
      [subjectCode]: prev[subjectCode].map((r, i) => (i === index ? value : r)),
    }));
  };

  const handleOverallDataChange = (subjectCode, field, value) => {
    setOverallData((prev) => ({
      ...prev,
      [subjectCode]: { ...prev[subjectCode], [field]: value },
    }));
  };

  // Submit Feedback
  const submitFeedback = async () => {
    // Validate required fields
    if (!rollNo || !session || !semester || !batch) {
      setIsError(true);
      setErrorMsg("Please fill all required fields");
      return;
    }

    if (Object.keys(subjects).length === 0) {
      setIsError(true);
      setErrorMsg("Please load subjects first");
      return;
    }

    for (let code of Object.keys(ratings)) {
      if (ratings[code].some((r) => r === "")) {
        setIsError(true);
        setErrorMsg(`Please fill all ratings for ${code}`);
        return;
      }
    }

    for (let code of Object.keys(overallData)) {
      const data = overallData[code];
      if (!data.syllabus || !data.voice || !data.regularity || !data.ranking || !data.overall) {
        setIsError(true);
        setErrorMsg(`Please fill all overall data for ${code}`);
        return;
      }
    }

    if (!bestTeachers.t1 || !bestTeachers.t2 || !bestTeachers.t3) {
      setIsError(true);
      setErrorMsg("Please select top 3 best teachers");
      return;
    }

    try {
      await axios.post("/feedback", {
        studentRoll: rollNo,
        session,
        semester: Number(semester),
        batch: Number(batch),
        ratings,
        overallData,
        comments,
        bestTeachers: [bestTeachers.t1, bestTeachers.t2, bestTeachers.t3],
        suggestions: "",
        submittedAt: new Date(),
      });

      alert("Feedback submitted successfully!");
      // Reset form
      setRatings({});
      setOverallData({});
      setComments("");
      setBestTeachers({ t1: "", t2: "", t3: "" });
      setSubjects({});
      setSession("");
      setSemester("");
      setBatch("");
      setStudentVerified(false);
      setRollNo("");
      setIsError(false);
      setErrorMsg("");
    } catch (err) {
      setIsError(true);
      setErrorMsg(err.response?.data?.message || "Error submitting feedback");
    }
  };

  const renderRatingsTable = () => (
    <table className="min-w-full border-collapse border border-gray-300 my-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">S.No</th>
          <th className="p-2 border">Parameter</th>
          {Object.entries(subjects).map(([code, { name, teacher }]) => (
            <th key={code} className="p-2 border">
              {code} <br /> {name} <br /> {teacher}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {feedbackParams.map((param, i) => (
          <tr key={param.sNo}>
            <td className="p-1 border text-center">{param.sNo}</td>
            <td className="p-1 border">{param.parameter}</td>
            {Object.keys(subjects).map((code) => (
              <td key={code} className="p-1 border text-center">
                <input
                  type="text"
                  value={ratings[code]?.[i] || ""}
                  onChange={(e) => handleRatingChange(code, i, e.target.value)}
                  className="w-full text-center border-none bg-transparent focus:ring-0"
                  placeholder="1-5"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderOverallTable = () => (
    <table className="min-w-full border-collapse border border-gray-300 my-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Subject</th>
          <th className="p-2 border">Teacher</th>
          <th className="p-2 border">Syllabus (%)</th>
          <th className="p-2 border">Voice Skills</th>
          <th className="p-2 border">Regularity</th>
          <th className="p-2 border">Ranking</th>
          <th className="p-2 border">Overall</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(subjects).map(([code, { name, teacher }]) => (
          <tr key={code}>
            <td className="p-1 border">{code} - {name}</td>
            <td className="p-1 border">{teacher}</td>
            <td className="p-1 border">
              <input
                type="text"
                value={overallData[code]?.syllabus || ""}
                onChange={(e) => handleOverallDataChange(code, "syllabus", e.target.value)}
                className="w-full border-none bg-transparent text-center"
              />
            </td>
            <td className="p-1 border">
              <input
                type="text"
                value={overallData[code]?.voice || ""}
                onChange={(e) => handleOverallDataChange(code, "voice", e.target.value)}
                className="w-full border-none bg-transparent text-center"
              />
            </td>
            <td className="p-1 border">
              <input
                type="text"
                value={overallData[code]?.regularity || ""}
                onChange={(e) => handleOverallDataChange(code, "regularity", e.target.value)}
                className="w-full border-none bg-transparent text-center"
              />
            </td>
            <td className="p-1 border">
              <input
                type="number"
                min="1"
                max="7"
                value={overallData[code]?.ranking || ""}
                onChange={(e) => handleOverallDataChange(code, "ranking", e.target.value)}
                className="w-full border-none bg-transparent text-center"
              />
            </td>
            <td className="p-1 border">
              <input
                type="text"
                value={overallData[code]?.overall || ""}
                onChange={(e) => handleOverallDataChange(code, "overall", e.target.value)}
                className="w-full border-none bg-transparent text-center"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const teacherOptions = Object.values(subjects).map(s => s.teacher);

  const renderTeacherDropdown = (field, selected) => (
    <select
      value={bestTeachers[field]}
      onChange={(e) => setBestTeachers((p) => ({ ...p, [field]: e.target.value }))}
      className="p-2 border rounded w-full"
    >
      <option value="">Select</option>
      {teacherOptions
        .filter(t => !Object.values(bestTeachers).includes(t) || t === selected)
        .map((t, i) => (
          <option key={i} value={t}>{t}</option>
        ))}
    </select>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">

      
        <form className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-6 sm:p-10 border-t-8 border-blue-600">
          <h2 className="text-2xl font-bold text-center mb-6">Feedback Form</h2>
          <p><strong>Student:</strong> {studentData.studentName}</p>
          <p><strong>Roll No:</strong> {studentData.rollNo}</p>
          <p><strong>Course:</strong> {studentData.course}</p>
          <p><strong>Branch:</strong> {studentData.branch}</p>

          {/* Session / Semester / Batch */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <label htmlFor="session" className="font-medium">Session:
            <input
              type="text"
              placeholder="Session"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className=" py-1 border rounded ml-2 px-4 font-normal"
              disabled={Object.keys(subjects).length > 0}
              required
            />
            </label>
            <label htmlFor="semester" className="font-medium">Semester:
            <input
              type="number"
              placeholder="Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="py-1 border rounded ml-2 px-4 font-normal"
              disabled={Object.keys(subjects).length > 0}
              required
            />
            </label>
            <label htmlFor="batch" className="font-medium">Batch:
            <input
              type="number"
              placeholder="Batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="py-1 border rounded ml-2 px-4 font-normal"
              disabled={Object.keys(subjects).length > 0}
              required
            /> </label>
          </div>
          {
            ssbError && <p className="text-red-600 font-medium my-4">{ssbError}</p>
          }
          {!ssb && <button
            type="submit"
            onClick={loadSubjects}
            disabled={loadingSubjects}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loadingSubjects ? "Loading Subjects..." : "Load Subjects"}
          </button>
}
          {Object.keys(subjects).length > 0 && (
            <>
              <h3 className="mt-6 font-bold text-lg">Detailed Ratings</h3>
              {renderRatingsTable()}

              <h3 className="mt-6 font-bold text-lg">Overall Performance</h3>
              {renderOverallTable()}

              <h3 className="mt-6 font-bold text-lg">Comments & Best Teachers</h3>
              <textarea
                rows="3"
                placeholder="Comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />

              <div className="grid grid-cols-3 gap-4 mb-4">
                {renderTeacherDropdown("t1", bestTeachers.t1)}
                {renderTeacherDropdown("t2", bestTeachers.t2)}
                {renderTeacherDropdown("t3", bestTeachers.t3)}
              </div>

              {isError && <p className="text-red-600 font-bold mb-4">{errorMsg}</p>}

              <button
                type="button"
                onClick={submitFeedback}
                className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit Feedback
              </button>
            </>
          )}
        </form>
      
    </div>
  );
};

export default FeedbackForm;
