// src/pages/UserDashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';

const UserDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [progress, setProgress] = useState(0);

  // Functions to fetch data from Supabase
  const fetchLessonHistory = async () => {
    const { data, error } = await supabase
      .from('lesson_history')
      .select(`
        lesson_id,
        completed_at,
        lessons ( title )
      `)
      .eq('user_id', user.id);
    if (error) console.error('Error fetching history:', error.message);
    else setHistory(data || []);
  };

  const fetchFavorites = async () => {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        lesson_id,
        lessons ( title )
      `)
      .eq('user_id', user.id);
    if (error) console.error('Error fetching favorites:', error.message);
    else setFavorites(data || []);
  };

  const fetchProgress = async () => {
    // Count completed lessons
    const { count: completedCount } = await supabase
      .from('lesson_history')
      .select('lesson_id', { count: 'exact' })
      .eq('user_id', user.id)
      .not('completed_at', 'is', null);
    // Count total lessons
    const { count: totalCount } = await supabase
      .from('lessons')
      .select('id', { count: 'exact' });
    const completed = completedCount || 0;
    const total = totalCount || 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    setProgress(percentage);
  };

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchLessonHistory();
      fetchFavorites();
      fetchProgress();
    }
  }, [user]);

  // Set up real-time subscriptions using supabase.channel (v2 API)
  useEffect(() => {
    if (!user) return;

    const lessonHistorySubscription = supabase
      .channel('lesson_history_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lesson_history',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Lesson history change:', payload);
          fetchLessonHistory();
          fetchProgress();
        }
      )
      .subscribe();

    const favoritesSubscription = supabase
      .channel('favorites_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Favorites change:', payload);
          fetchFavorites();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(lessonHistorySubscription);
      supabase.removeChannel(favoritesSubscription);
    };
  }, [user]);

  // Function to remove a favorite lesson
  const removeFavorite = async (lesson_id) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('lesson_id', lesson_id);
    if (error) {
      console.error('Error removing favorite:', error.message);
    } else {
      fetchFavorites();
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
      <p className="mb-4">Welcome, {user.email}!</p>

      {/* Progress Section */}
      <div className="bg-blue-50 p-4 rounded border border-blue-200 mb-6">
        <h2 className="text-xl font-bold text-blue-700 mb-2">Your Progress</h2>
        <p className="text-gray-600">You have completed {progress}% of all lessons.</p>
      </div>

      {/* Lesson History Section */}
      <div className="bg-blue-50 p-4 rounded border border-blue-200 mb-6">
        <h2 className="text-xl font-bold text-blue-700 mb-2">Your Lesson History</h2>
        {history.length === 0 ? (
          <p className="text-gray-600">No lessons viewed or completed yet.</p>
        ) : (
          <ul className="list-disc list-inside">
            {history.map((item) => (
              <li key={item.lesson_id}>
                <Link to={`/lessons/${item.lesson_id}`} className="text-blue-600 hover:underline">
                  {item.lessons?.title || 'Untitled Lesson'}
                </Link>{' '}
                {item.completed_at ? '(Completed)' : '(In Progress)'}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Favorites Section */}
      <div className="bg-blue-50 p-4 rounded border border-blue-200">
        <h2 className="text-xl font-bold text-blue-700 mb-2">Your Favorites</h2>
        {favorites.length === 0 ? (
          <p className="text-gray-600">No favorite lessons yet.</p>
        ) : (
          <ul className="list-disc list-inside">
            {favorites.map((fav) => (
              <li key={fav.lesson_id} className="flex items-center justify-between">
                <Link to={`/lessons/${fav.lesson_id}`} className="text-blue-600 hover:underline">
                  {fav.lessons?.title || 'Untitled Lesson'}
                </Link>
                <button
                  onClick={() => removeFavorite(fav.lesson_id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;