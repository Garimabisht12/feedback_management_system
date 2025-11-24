import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const rollFromLogin = location.state?.rollNo || "";
  const [rollNo, setRollNo] = useState(rollFromLogin);

  // get student data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/student/${rollNo}`);
        setStudentVerified(true);
        setStudentData(res.data.student);

      } catch (err) {
        setIsError(true);
        setErrorMsg(err.response?.data?.message || "Error getting data");

      }
    }
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
    setOverallData((prev) => {
      const updated = {
        ...prev,
        [subjectCode]: { ...prev[subjectCode], [field]: value },
      };
      // Auto-update 'overall' field with calculated total rating whenever any field changes
      updated[subjectCode].overall = calculateTotalRating(subjectCode).toString();
      return updated;
    });
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
      const firstNineRatings = ratings[code].slice(0, 9);
      if (firstNineRatings.some((r) => r === "" || r === null || r === undefined)) {
        setIsError(true);
        setErrorMsg(`Please fill all ratings for ${code}`);
        return;
      }
    }

    for (let code of Object.keys(overallData)) {
      const data = overallData[code];
      if (!data.syllabus || !data.voice || !data.regularity) {
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

      // alert("Feedback submitted successfully!");
      // // Reset form
      // setRatings({});
      // setOverallData({});
      // setComments("");
      // setBestTeachers({ t1: "", t2: "", t3: "" });
      // setSubjects({});
      // setSession("");
      // setSemester("");
      // setBatch("");
      // setStudentVerified(false);
      // setRollNo("");
      // setIsError(false);
      // setErrorMsg("");
      
      // Redirect to responded page after successful submission
      navigate("/responded");
    } catch (err) {
      setIsError(true);
      setErrorMsg(err.response?.data?.message || "Error submitting feedback");
    }
  };

  // Calculate total rating for a subject (sum of first 9 ratings)
  const calculateTotalRating = (subjectCode) => {
    const subjectRatings = ratings[subjectCode] || [];
    const sum = subjectRatings.slice(0, 9).reduce((acc, val) => {
      const num = parseInt(val) || 0;
      return acc + num;
    }, 0);
    return sum;
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
                {i === 9 ? (
                  // Row 10: Show calculated total (sum of ratings 1-9)
                  <div className="w-full text-center font-bold text-lg bg-blue-100 py-2">
                    {calculateTotalRating(code)}
                  </div>
                ) : (
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={ratings[code]?.[i] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow values between 1-5 or empty
                      if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 5)) {
                        handleRatingChange(code, i, value);
                      }
                    }}
                    className="w-full text-center border-none bg-transparent focus:ring-0"
                    placeholder="1-5"
                  />
                )}
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
          <th className="p-2 border">Syllabus (1-10)</th>
          <th className="p-2 border">Voice Skills (1-10)</th>
          <th className="p-2 border">Regularity (1-10)</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(subjects).map(([code, { name, teacher }]) => (
          <tr key={code}>
            <td className="p-1 border">{code} - {name}</td>
            <td className="p-1 border">{teacher}</td>
            <td className="p-1 border">
              <input
                type="number"
                min="1"
                max="10"
                value={overallData[code]?.syllabus || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 10)) {
                    handleOverallDataChange(code, "syllabus", value);
                  }
                }}
                className="w-full border-none bg-transparent text-center"
                placeholder="1-10"
              />
            </td>
            <td className="p-1 border">
              <input
                type="number"
                min="1"
                max="10"
                value={overallData[code]?.voice || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 10)) {
                    handleOverallDataChange(code, "voice", value);
                  }
                }}
                className="w-full border-none bg-transparent text-center"
                placeholder="1-10"
              />
            </td>
            <td className="p-1 border">
              <input
                type="number"
                min="1"
                max="10"
                value={overallData[code]?.regularity || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 10)) {
                    handleOverallDataChange(code, "regularity", value);
                  }
                }}
                className="w-full border-none bg-transparent text-center"
                placeholder="1-10"
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
          type="button"
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

            <h3 className="mt-6 font-bold text-lg">Comments </h3>
            <textarea
              rows="3"
              placeholder="Comments..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />

            <h3 className="mt-6 font-bold text-lg"> Best Teachers</h3>
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





// import React, { useEffect, useState } from "react";
// import axios from "../api/axios";
// import { useLocation } from "react-router-dom";
// import RatingForm from './RatingForm'

// const feedbackParams = [
//   { sNo: 1, parameter: "Teacher's Voice Skill" },
//   { sNo: 2, parameter: "Systematic delivery" },
//   { sNo: 3, parameter: "Teacher's behaviour" },
//   { sNo: 4, parameter: "Interaction with students/Inactiveness in class" },
//   { sNo: 5, parameter: "Teacher's command over the subject" },
//   { sNo: 6, parameter: "Discussion on question/example" },
//   { sNo: 7, parameter: "Teacher's punctuality" },
//   { sNo: 8, parameter: "Teacher's ability to control class" },
//   { sNo: 9, parameter: "Teacher's accessibility & help outside the class" },
//   { sNo: 10, parameter: "Overall rating of the teacher (Excellent, Very Good, Good)" },
// ];

// const courseSems = {
//   BTECH: 8,
//   BCA: 6,
//   MCA: 4,
// }

// const FeedbackForm = () => {
//   const [studentData, setStudentData] = useState({});
//   const [studentVerified, setStudentVerified] = useState(false);
//   const [session, setSession] = useState("");
//   const [semester, setSemester] = useState("");
//   const [batch, setBatch] = useState("");
//   const [subjects, setSubjects] = useState([]);
//   const [ratings, setRatings] = useState({});
//   const [overallData, setOverallData] = useState({});
//   const [comments, setComments] = useState("");
//   const [bestTeachers, setBestTeachers] = useState({ t1: "", t2: "", t3: "" });
//   const [loadingSubjects, setLoadingSubjects] = useState(false);
//   const [step, setStep] = useState(1);
//   const [subjectIndex, setSubjectIndex] = useState(0);
//   const [responses, setResponses] = useState({});
//   const [curr_sub, setCurrSub] = useState('')
//   const [rating, setRating] = useState(0)

//   const [ssbError, setSsbError] = useState('')


//   const location = useLocation();
//   const rollFromLogin = location.state?.rollNo || "";
//   const [rollNo, setRollNo] = useState(rollFromLogin);

//   // get student data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`/student/${rollNo}`);
//         setStudentVerified(true);
//         setStudentData(res.data.student);

//       } catch (err) {
//         console.log(err)
//       }
//     }
//     fetchData();
//   }, [])
//   // <<<<<<<<<<<----------------------------------->>>>>>>>>>>>>>>>


//   // Load Subjects
//   const loadSubjects = async () => {
//     if (!session || !semester || !batch) {
//       console.log('enter session semester and batch')
//       return;
//     }

//     try {
//       setLoadingSubjects(true);
//       const res = await axios.get(
//         `/subjects?session=${session}&semester=${semester}&batch=${batch}`
//       );

//       if (!res.data || !res.data.subjects || res.data.subjects.length === 0) {
//         throw new Error("No subjects found for the given details");
//       }

//       const fetchedSubjects = [];
//       const initRatings = {};
//       const initOverallData = {};

//       res.data.subjects.forEach((sub) => {
//         fetchedSubjects.push({
//           code :sub.subjectCode,
//           name: sub.subjectName,
//           teacher: sub.teacherName,
//         });
//         initRatings[sub.subjectCode] = Array(10).fill("");
//         initOverallData[sub.subjectCode] = {
//           syllabus: "",
//           voice: "",
//           regularity: "",
//           ranking: "",
//           overall: "",
//         };
//       });

//       setSubjects(fetchedSubjects);
//       setRatings(initRatings);
//       setOverallData(initOverallData);


//     } catch (err) {
//       console.log(err)
//     } finally {
//       setLoadingSubjects(false);
//     }
//   };

//   // Handle Changes
//   const handleRatingChange = (subjectCode, index, value) => {
//     setRatings((prev) => ({
//       ...prev,
//       [subjectCode]: prev[subjectCode].map((r, i) => (i === index ? value : r)),
//     }));
//   };

//   const handleOverallDataChange = (subjectCode, field, value) => {
//     setOverallData((prev) => ({
//       ...prev,
//       [subjectCode]: { ...prev[subjectCode], [field]: value },
//     }));
//   };

//   // Submit Feedback
//   const submitFeedback = async () => {
//     // Validate required fields
//     if (!rollNo || !session || !semester || !batch) {
//       console.log('enter data properly - roll no, session, semester, batch')
//       return;
//     }

//     if (Object.keys(subjects).length === 0) {
//       console.log(" loading subjects failed");
//       return;
//     }

//     for (let code of Object.keys(ratings)) {
//       if (ratings[code].some((r) => r === "")) {

//         console.log(`Please fill all ratings for ${code}`);
//         return;
//       }
//     }

//     for (let code of Object.keys(overallData)) {
//       const data = overallData[code];
//       if (!data.syllabus || !data.voice || !data.regularity || !data.ranking || !data.overall) {

//         console.log(`Please fill all overall data for ${code}`);
//         return;
//       }
//     }

//     if (!bestTeachers.t1 || !bestTeachers.t2 || !bestTeachers.t3) {

//       console.log("Please select top 3 best teachers");
//       return;
//     }

//     try {
//       await axios.post("/feedback", {
//         studentRoll: rollNo,
//         session,
//         semester: Number(semester),
//         batch: Number(batch),
//         ratings,
//         overallData,
//         comments,
//         bestTeachers: [bestTeachers.t1, bestTeachers.t2, bestTeachers.t3],
//         suggestions: "",
//         submittedAt: new Date(),
//       });

//       alert("Feedback submitted successfully!");
//       // Reset form
//       setRatings({});
//       setOverallData({});
//       setComments("");
//       setBestTeachers({ t1: "", t2: "", t3: "" });
//       setSubjects({});
//       setSession("");
//       setSemester("");
//       setBatch("");
//       setStudentVerified(false);
//       setRollNo("");
//     } catch (err) {
//       console.log(err)
//     }
//   };

//   const renderRatingsTable = () => (
//     <table className="min-w-full border-collapse border border-gray-300 my-4">
//       <thead className="bg-gray-100">
//         <tr>
//           <th className="p-2 border">S.No</th>
//           <th className="p-2 border">Parameter</th>
//           {Object.entries(subjects).map(([code, { name, teacher }]) => (
//             <th key={code} className="p-2 border">
//               {code} <br /> {name} <br /> {teacher}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {feedbackParams.map((param, i) => (
//           <tr key={param.sNo}>
//             <td className="p-1 border text-center">{param.sNo}</td>
//             <td className="p-1 border">{param.parameter}</td>
//             {Object.keys(subjects).map((code) => (
//               <td key={code} className="p-1 border text-center">
//                 <input
//                   type="text"
//                   value={ratings[code]?.[i] || ""}
//                   onChange={(e) => handleRatingChange(code, i, e.target.value)}
//                   className="w-full text-center border-none bg-transparent focus:ring-0"
//                   placeholder="1-5"
//                 />
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );

//   const renderOverallTable = () => (
//     <table className="min-w-full border-collapse border border-gray-300 my-4">
//       <thead className="bg-gray-100">
//         <tr>
//           <th className="p-2 border">Subject</th>
//           <th className="p-2 border">Teacher</th>
//           <th className="p-2 border">Syllabus (%)</th>
//           <th className="p-2 border">Voice Skills</th>
//           <th className="p-2 border">Regularity</th>
//           <th className="p-2 border">Ranking</th>
//           <th className="p-2 border">Overall</th>
//         </tr>
//       </thead>
//       <tbody>
//         {Object.entries(subjects).map(([code, { name, teacher }]) => (
//           <tr key={code}>
//             <td className="p-1 border">{code} - {name}</td>
//             <td className="p-1 border">{teacher}</td>
//             <td className="p-1 border">
//               <input
//                 type="text"
//                 value={overallData[code]?.syllabus || ""}
//                 onChange={(e) => handleOverallDataChange(code, "syllabus", e.target.value)}
//                 className="w-full border-none bg-transparent text-center"
//               />
//             </td>
//             <td className="p-1 border">
//               <input
//                 type="text"
//                 value={overallData[code]?.voice || ""}
//                 onChange={(e) => handleOverallDataChange(code, "voice", e.target.value)}
//                 className="w-full border-none bg-transparent text-center"
//               />
//             </td>
//             <td className="p-1 border">
//               <input
//                 type="text"
//                 value={overallData[code]?.regularity || ""}
//                 onChange={(e) => handleOverallDataChange(code, "regularity", e.target.value)}
//                 className="w-full border-none bg-transparent text-center"
//               />
//             </td>
//             <td className="p-1 border">
//               <input
//                 type="number"
//                 min="1"
//                 max="7"
//                 value={overallData[code]?.ranking || ""}
//                 onChange={(e) => handleOverallDataChange(code, "ranking", e.target.value)}
//                 className="w-full border-none bg-transparent text-center"
//               />
//             </td>
//             <td className="p-1 border">
//               <input
//                 type="text"
//                 value={overallData[code]?.overall || ""}
//                 onChange={(e) => handleOverallDataChange(code, "overall", e.target.value)}
//                 className="w-full border-none bg-transparent text-center"
//               />
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );

//   const teacherOptions = Object.values(subjects).map(s => s.teacher);

//   const renderTeacherDropdown = (field, selected) => (
//     <select
//       value={bestTeachers[field]}
//       onChange={(e) => setBestTeachers((p) => ({ ...p, [field]: e.target.value }))}
//       className="p-2 border rounded w-full"
//     >
//       <option value="">Select</option>
//       {teacherOptions
//         .filter(t => !Object.values(bestTeachers).includes(t) || t === selected)
//         .map((t, i) => (
//           <option key={i} value={t}>{t}</option>
//         ))}
//     </select>
//   );


// function handleResponse(field, value) {
//   setResponses(prev => ({
//     ...prev,
//     [subjects[subjectIndex].code]: {
//       ...prev[subjects[subjectIndex].code],
//       [field]: value
//     }
//   }));
// }

// function goNextSubject() {
//   if (subjectIndex + 1 < subjects.length) {
//     setSubjectIndex(subjectIndex + 1);
//     setStep(2); // go back to rating step
//   } else {
//     setStep(4); // fourth step = submit final
//   }
// }


// function renderRatingsChart(sub) {


// return (
//   <div>
//     <h2>{sub.code} {sub.name} - {sub.teacher}</h2>

//     <ul>
//       {feedbackParams.map((param, i) => (
//         <li key={i} className="my-3">
//           <strong>{param.parameter}</strong>

//           <div className="flex gap-2 mt-2">
//             {[1, 2, 3, 4, 5].map(num => (
//               <label key={num} className="cursor-pointer">
//                 <input
//                   type="radio"
//                   name={`rating-${i}`}   // ★ UNIQUE PER PARAM
//                   value={num}
//                   checked={ratings[param.parameter] === num}
//                   onChange={() => handleRating(param.parameter, num)}
//                 />
//                 {num}
//               </label>
//             ))}
//           </div>
//         </li>
//       ))}
//     </ul>

//     {/* <pre className="bg-gray-100 p-2 mt-4">
//       {JSON.stringify(ratings, null, 2)}
//     </pre> */}
//   </div>
// ) 
// }

// function handleRating (param, val){

// }

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
//       {/* Session / Semester / Batch */}
//       <div className="StudentData">
//     <h2 className="text-2xl font-bold text-center mb-6">Feedback Form</h2>
//         <p><strong>Student:</strong> {studentData.studentName}</p>
//         <p><strong>Roll No:</strong> {studentData.rollNo}</p>
//         <p><strong>Course:</strong> {studentData.course}</p>
//         <p><strong>Branch:</strong> {studentData.branch}</p>

//       </div>
//       <form action="" >
//         <div className="grid grid-cols-3 gap-4 mt-4">

//           <label htmlFor="session" className="font-medium">Session:
//           <select name="session" id="session" 
//           value={session}
//           onChange={(e) => setSession(e.target.value)}
//           required>
//             <option value="">--select--</option>
//             <option value="2025-26">2025-26</option>
//           </select>
//             </label>
//           <label htmlFor="semester" className="font-medium">Semester:
//           <select name="semester" id="semester" 
//           value={semester}
//           onChange={(e) => setSemester(e.target.value)}
//           required>
//             <option value="">--select--</option>
//             {

//               [...Array((courseSems[studentData.course]))].map((_, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   {i + 1}
//                 </option>
//               ))

//             }
//           </select>
//             </label>
//           <label htmlFor="batch" className="font-medium">Batch:
//             <select name="batch" id="batch" 
//             value={batch}
//             onChange={(e) => setBatch(e.target.value)}
//             required>
//               <option value="">--select--</option>
//               <option value="1">1</option>
//               <option value="2">3</option>
//               <option value="2">3</option>
//             </select>
//             </label>
//             <button
//           type="submit"
//           onClick={loadSubjects}
//           disabled={loadingSubjects}
//           className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//         >
//           {loadingSubjects ? "Loading Subjects..." : "Load Subjects"}
//         </button>


//         </div>
//       </form>

//         {/* select faculty => a list of all faculty one by one */}
//         {/* form for that faculty */}
//         {/* overall feedback */}
//         {/* best teacher top 3 */}
//         {/* additional feedback comment and all */}


// <h2>Select Subject</h2>



//     <select name="subject" id="subject" value={curr_sub}
//           onChange={(e) => setCurrSub(e.target.value)} >
//       <option value="">--select--</option> 
//       {

//         subjects.map((sub) => 
//         {
//           return (
//          <option value={sub.code} key={sub.code}>{sub.name}</option> 
//           )
//         }

//       )

//       }
//     </select>
//     <button onClick={() => console.log("subjectSelected: ", curr_sub)}>SELECT</button>




//       <form action="">
//         <h1>Ratings</h1>
//         {() => renderRatingsChart(curr_sub)}
//       </form>

// {currentSubject && (
//   <RatingForm subjectCode={currentSubject} />
// )}
{/* 
{step === 2 && (
  <div>
    <h2>{subjects[subjectIndex].subjectName}</h2>

    <label>Teaching quality:</label>
    {[1,2,3,4,5].map(val => (
      <label key={val}>
        <input
          type="radio"
          name="q1"
          value={val}
          onChange={() => handleResponse("q1", val)}
        />
        {val}
      </label>
    ))}

    <button onClick={() => setStep(3)}>Next</button>
  </div>
)}
{step === 3 && (
  <div>
    <textarea
      placeholder="Additional comments"
      onChange={e => handleResponse("comment", e.target.value)}
    />

    <button onClick={goNextSubject}>Submit and Continue</button>
  </div>
)}
{step === 4 && (
  <div>
    <h2>Review & Submit</h2>
    <pre>{JSON.stringify(responses, null, 2)}</pre>
    <button onClick={submitFeedback}>Submit</button>
  </div>
)}


  */}

//     </div>
//   );
// };

// export default FeedbackForm;







// {step === 1 && (
//   <div>
//     <h2>Select Subject</h2>

//     <select name="subject" id="subject" >
//       <option value="">--select--</option> 
//       {
//         Object.entries(subjects).map(([code, { name, teacher }], index) => 
//         {
//          <option value={code}>name - teacher</option> 

//         }

//       )

//       }
//     </select>
//     { Object.entries(subjects).map(([code, { name, teacher }], index) => (


//       <button key={code} onClick={() => {
//         setSubjectIndex(index);
//         setStep(2);
//       }}>
//         {code} - {name} ({teacher})
//       </button>
//     ))}
//   </div>
// )}





{/* {
              Object.entries(subjects).map(([code, {name, teacher}]) =>{
                <FeedbackSubpart subject={name} code={code} teacher={teacher} />

              })

            } */}

