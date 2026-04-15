import { feedbackParameters } from "../utilities/feedback-parameters"


export function RatingForm ({ subject, ratings, setRatings }) {
  const handleChange = (subjectId, paramId, value) => {
    setRatings(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [paramId - 1]: Number(value)
      }
    }))
  }
  return (
    <>
      <div
        key={subject.id}
        className='rating flex flex-col justify-center mt-10 '
      >
        <h1 className='font-bold text-center'>{subject.subjectName}</h1>
        <h6 className='text-center'>{subject.teacherName}</h6>
        <h2 className='text-center font-bold text-lg mt-4'>Detailed Rating</h2>

        <table className="table-auto text-center border-collapse border border-gray-300 mx-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className='py-4 px-2 border border-gray-300'>Parameter</th>
              <th className='py-4 px-2 border border-gray-300'>Not Satisfactory</th>
              <th className='py-4 px-2 border border-gray-300'>Below Average</th>
              <th className='py-4 px-2 border border-gray-300'>Average</th>
              <th className='py-4 px-2 border border-gray-300'>Good</th>
              <th className='py-4 px-2 border border-gray-300'>Excellent</th>
            </tr>
          </thead>
          {feedbackParameters.map(param => {
            return (
              <>
                <tbody >
                  <tr className="border-b border-gray-200">
                    <td className='py-2 px-2 text-left border-r border-gray-300'>
                      <label htmlFor={`${subject._id}-${param.sNo}-1`}>
                        {param.parameter}
                      </label>
                    </td>
                    <td className="py-2 px-2 border-r border-gray-300">
                      <input
                        type='radio'
                        name={`${subject._id}-${param.sNo}`}
                        id={`${subject._id}-${param.sNo}-1`}
                        value={1}
                        onChange={e =>
                          handleChange(subject.subjectCode, param.sNo, e.target.value)
                        }
                      />
                    </td>

                    <td className="py-2 px-2 border-r border-gray-300">
                      <input
                        type='radio'
                        name={`${subject._id}-${param.sNo}`}
                        id={`${subject._id}-${param.sNo}-2`}
                        value={2}
                        onChange={e =>
                          handleChange(subject.subjectCode, param.sNo, e.target.value)
                        }
                      />
                    </td>
                    <td className="py-2 px-2 border-r border-gray-300">
                      <input
                        type='radio'
                        name={`${subject._id}-${param.sNo}`}
                        id={`${subject._id}-${param.sNo}-3`}
                        value={3}
                        onChange={e =>
                          handleChange(subject.subjectCode, param.sNo, e.target.value)
                        }
                      />
                    </td>
                    <td className="py-2 px-2 border-r border-gray-300">
                      <input
                        type='radio'
                        name={`${subject._id}-${param.sNo}`}
                        id={`${subject._id}-${param.sNo}-4`}
                        value={4}
                        onChange={e =>
                          handleChange(subject.subjectCode, param.sNo, e.target.value)
                        }
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type='radio'
                        name={`${subject._id}-${param.sNo}`}
                        id={`${subject._id}-${param.sNo}-5`}
                        value={5}
                        onChange={e =>
                          handleChange(subject.subjectCode, param.sNo, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </>
            )
          })}
        </table>

      </div>
    </>
  )
}
