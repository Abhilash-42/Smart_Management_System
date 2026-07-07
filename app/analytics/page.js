 'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import PerformanceBarChart from '../../components/Charts/PerformanceBarChart';
import SubjectAverageChart from '../../components/Charts/SubjectAverageChart';
import DistributionPieChart from '../../components/Charts/DistributionPieChart';
import LeaderboardChart from '../../components/Charts/LeaderboardChart';

export default function Analytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSubjectAverages = () => {
    if (students.length === 0) return { math: 0, science: 0, english: 0, hindi: 0, socialStudies: 0 };
    
    const totals = students.reduce((acc, student) => ({
      math: acc.math + student.math,
      science: acc.science + student.science,
      english: acc.english + student.english,
      hindi: acc.hindi + student.hindi,
      socialStudies: acc.socialStudies + student.socialStudies
    }), { math: 0, science: 0, english: 0, hindi: 0, socialStudies: 0 });

    return {
      math: Math.round(totals.math / students.length),
      science: Math.round(totals.science / students.length),
      english: Math.round(totals.english / students.length),
      hindi: Math.round(totals.hindi / students.length),
      socialStudies: Math.round(totals.socialStudies / students.length)
    };
  };

  const calculateDistribution = () => {
    const distribution = { Excellent: 0, Average: 0, Poor: 0 };
    students.forEach(student => {
      distribution[student.status]++;
    });
    return distribution;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const subjectAverages = calculateSubjectAverages();
  const distribution = calculateDistribution();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">Visualize student performance data</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Performance</h2>
              <PerformanceBarChart students={students} />
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject Average</h2>
              <SubjectAverageChart averages={subjectAverages} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution</h2>
              <DistributionPieChart distribution={distribution} />
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Students</h2>
              <LeaderboardChart students={students} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}