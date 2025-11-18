import React from 'react'



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











const RatingForm = ({subject, code, teacher}) => {
  return (
    <>
    <h1>
        {subject}
        {code}
        {teacher}
        bwahahahahaha
    </h1>
    
    </>
  )
}

export default RatingForm;


// setSubjects(fetchedSubjects);
    //   setRatings(initRatings);
    //   setOverallData(initOverallData);
// const renderRatingsTable = () => (
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