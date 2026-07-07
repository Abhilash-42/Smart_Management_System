'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';
import { ArrowLeft, Download } from 'lucide-react';

export default function StudentDetails({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchStudent();
  }, [params.id]);

  const fetchStudent = async () => {
    try {
      const response = await fetch(`/api/students/${params.id}`);
      const data = await response.json();
      setStudent(data);
    } catch (error) {
      console.error('Error fetching student:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    try {
      const response = await fetch(`/api/students/${params.id}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student_report_${student.rollNumber}.pdf`;
      a.click();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Student not found</h2>
          <button
            onClick={() => router.push('/students')}
            className="mt-4 text-purple-600 hover:text-purple-700"
          >
            Go back to students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-8">
          <div className="mb-8">
            <button
              onClick={() => router.push('/students')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Students
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                <p className="text-gray-500 mt-1">Roll Number: {student.rollNumber}</p>
              </div>
              <button
                onClick={generatePDF}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-4 rounded-lg">
                <p className="text-sm opacity-90">Total Marks</p>
                <p className="text-2xl font-bold">{student.total}/500</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-4 rounded-lg">
                <p className="text-sm opacity-90">Percentage</p>
                <p className="text-2xl font-bold">{student.percentage}%</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-lg">
                <p className="text-sm opacity-90">Grade</p>
                <p className="text-2xl font-bold">{student.grade}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-4 rounded-lg">
                <p className="text-sm opacity-90">Status</p>
                <p className="text-2xl font-bold">{student.status}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Subject Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { name: 'Math', score: student.math },
                  { name: 'Science', score: student.science },
                  { name: 'English', score: student.english },
                  { name: 'Hindi', score: student.hindi },
                  { name: 'Social Studies', score: student.socialStudies }
                ].map((subject) => (
                  <div key={subject.name} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{subject.name}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{subject.score}</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                        style={{ width: `${subject.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Summary</h2>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  {student.name} has achieved a total of {student.total} marks out of 500
                  with a percentage of {student.percentage}%. The student has been
                  categorized as <span className="font-semibold">{student.status}</span>
                  and has earned a grade of <span className="font-semibold">{student.grade}</span>.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}