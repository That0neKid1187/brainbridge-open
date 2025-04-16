import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

const Analytics = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const loadData = async () => {
      await fetchTotalUsers();
      await fetchLessonsCompleted();
      await fetchTotalLessons();

      const now = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
      setLastUpdated(now);
    };
    loadData();
  }, []);

  const fetchTotalUsers = async () => {
    const { count, error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'user');
    if (!error) setTotalUsers(count);
    else console.error('Error fetching total users:', error.message);
  };

  const fetchLessonsCompleted = async () => {
    const { count, error } = await supabase
      .from('lesson_history')
      .select('lesson_id', { count: 'exact' })
      .not('completed_at', 'is', null);
    if (!error) {
      setLessonsCompleted(count);
      setTotalHours(((count || 0) * 15 / 60).toFixed(2));
    } else {
      console.error('Error fetching lessons completed:', error.message);
    }
  };

  const fetchTotalLessons = async () => {
    const { count, error } = await supabase
      .from('lessons')
      .select('id', { count: 'exact', head: true });
    if (!error) setTotalLessons(count);
    else console.error('Error fetching total lessons:', error.message);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12 text-zinc-900 dark:text-white">
      <h1 className="text-4xl font-bold text-center">BrainBridge Analytics Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={totalUsers} />
        <StatCard title="Lessons Completed" value={lessonsCompleted} />
        <StatCard title="Total Hours Learned" value={totalHours} />
        <StatCard title="Total Lessons Available" value={totalLessons} />
        <StatCard title="% Rural Students Without Wi-Fi" value="22.3%" />
        <StatCard title="% Platforms Blocking Slow Internet" value="80%" />
      </div>

      <div className="text-center mt-6">
        <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-3 py-1 rounded-full">
          No personal data is collected or shown. <a href="/privacy" className="underline">Learn more</a>
        </span>
      </div>

      <div className="text-center mt-8">
        <a href="/feedback" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded">
          Submit Feedback
        </a>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center mt-8">
        Data sourced from anonymized usage metrics via Supabase. All data is public and aggregated.<br />
        Last Updated: {lastUpdated}
      </p>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-zinc-800 p-6 rounded shadow text-center">
    <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{title}</h2>
    <p className="text-4xl text-blue-600 dark:text-blue-400 font-bold">{value}</p>
  </div>
);

export default Analytics;