'use client';

import { useState } from 'react';

export default function AttendanceForm({ students, date, onClose, onSubmit }) {
  const [attendanceData, setAttendanceData] = useState(
    students.reduce((acc, student) => ({
      ...acc,
      [student._id]: 'Present'
    }), {})
  );

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = Object.entries(attendanceData).map(([studentId, status]) => ({
      studentId,
      date,
      status
    }));
    onSubmit(formattedData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-in max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Mark Attendance - {new Date(date).toLocaleDateString()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {students.map((student) => (
            <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{student.rollNumber}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(student._id, 'Present')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    attendanceData[student._id] === 'Present'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(student._id, 'Absent')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    attendanceData[student._id] === 'Absent'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Absent
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
          >
            Save Attendance
          </button>
        </form>
      </div>
    </div>
  );
}