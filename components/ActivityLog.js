'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities');
      const data = await response.json();
      setActivities(data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading activities...</div>;
  }

  if (activities.length === 0) {
    return <div className="text-center py-4 text-gray-500">No recent activities</div>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity._id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-white font-medium">{activity.action}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {activity.user} • {new Date(activity.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}