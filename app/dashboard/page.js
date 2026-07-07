'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import StatisticsCard from '../../components/StatisticsCard';
import ActivityLog from '../../components/ActivityLog';
import { Users, TrendingUp, Award, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalStudents: 0,
    classAverage: 0,
    topPerformers: 0,
    weakStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      
      if (data) {
        const total = data.length;
        const avg = total > 0 ? Math.round(data.reduce((sum, student) => sum + student.percentage, 0) / total) : 0;
        const top = data.filter(student => student.percentage >= 90).length;
        const weak = data.filter(student => student.percentage < 40).length;
        
        setStats({
          totalStudents: total,
          classAverage: avg,
          topPerformers: top,
          weakStudents: weak
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {session?.user?.username}!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatisticsCard
              title="Total Students"
              value={stats.totalStudents}
              icon={<Users className="w-6 h-6" />}
              gradient="from-purple-600 to-indigo-600"
              animation="fade-in"
            />
            <StatisticsCard
              title="Class Average"
              value={`${stats.classAverage}%`}
              icon={<TrendingUp className="w-6 h-6" />}
              gradient="from-blue-600 to-cyan-600"
              animation="slide-in"
            />
            <StatisticsCard
              title="Top Performers"
              value={stats.topPerformers}
              icon={<Award className="w-6 h-6" />}
              gradient="from-green-600 to-emerald-600"
              animation="zoom-in"
            />
            <StatisticsCard
              title="Weak Students"
              value={stats.weakStudents}
              icon={<AlertCircle className="w-6 h-6" />}
              gradient="from-red-600 to-pink-600"
              animation="fade-in"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
              <ActivityLog />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button onClick={() => router.push('/students')} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200">
                  Manage Students
                </button>
                <button onClick={() => router.push('/attendance')} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200">
                  Mark Attendance
                </button>
                <button onClick={() => router.push('/analytics')} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}