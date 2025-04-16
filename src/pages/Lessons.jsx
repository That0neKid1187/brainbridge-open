// File: src/pages/Lessons.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { useLessons } from '../hooks/useLessons';
import ReactMarkdown from 'react-markdown';
import supabase from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';

const Lessons = () => {
  const { lessonId } = useParams();
  const { getById, getByTopic, loading } = useLessons();
  const lesson = getById(lessonId);
  const { user } = useContext(AuthContext);

  const [message, setMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (user && lesson) {
      checkLessonStatus();
      checkFavoriteStatus();
      incrementLessonView();
    }
  }, [user, lesson]);

  const checkLessonStatus = async () => {
    if (!lesson) return;
    const { data, error } = await supabase
      .from('lesson_history')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id)
      .single();
    if (!error && data) setIsCompleted(!!data.completed_at);
  };

  const checkFavoriteStatus = async () => {
    if (!lesson) return;
    const { data, error } = await supabase
      .from('favorites')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id)
      .single();
    if (!error && data) setIsFavorited(true);
  };

  const incrementLessonView = async () => {
    try {
      await supabase.rpc("increment_lesson_view", { lesson_id: lesson.id });
    } catch (error) {
      console.error("Error incrementing lesson view:", error.message);
    }
  };

  if (loading) return <p>Loading lessons...</p>;

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <p className="text-zinc-500 dark:text-zinc-400 text-xl">Lesson not found.</p>
      </div>
    );
  }

  const topicSlug = lesson.categories?.slug || lesson.topic || '';
  let sameTopicLessons = getByTopic(topicSlug).filter((l) => l.is_complete);
  sameTopicLessons.sort((a, b) => (a.lesson_number || 0) - (b.lesson_number || 0));

  const currentIndex = sameTopicLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? sameTopicLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < sameTopicLessons.length - 1 ? sameTopicLessons[currentIndex + 1] : null;

  const markAsCompleted = async () => {
    if (!user) return setMessage('You must be logged in.');
    const { error } = await supabase
      .from('lesson_history')
      .upsert({ user_id: user.id, lesson_id: lesson.id, completed_at: new Date() });
    if (error) {
      setMessage('❌ Could not mark lesson as completed.');
    } else {
      setMessage(`✅ "${lesson.title}" marked as completed!`);
      setIsCompleted(true);
    }
  };

  const unmarkAsCompleted = async () => {
    if (!user) return setMessage('You must be logged in.');
    const { error } = await supabase
      .from('lesson_history')
      .delete()
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id);
    if (error) {
      setMessage('❌ Could not unmark lesson as completed.');
    } else {
      setMessage(`✅ "${lesson.title}" unmarked as completed.`);
      setIsCompleted(false);
    }
  };

  const addToFavorites = async () => {
    if (!user) return setMessage('You must be logged in.');
    const { error } = await supabase.from('favorites').insert({ user_id: user.id, lesson_id: lesson.id });
    if (error) {
      setMessage('❌ Could not add lesson to favorites.');
    } else {
      setMessage(`✅ "${lesson.title}" added to favorites!`);
      setIsFavorited(true);
    }
  };

  const removeFromFavorites = async () => {
    if (!user) return setMessage('You must be logged in.');
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id);
    if (error) {
      setMessage('❌ Could not remove lesson from favorites.');
    } else {
      setMessage(`✅ "${lesson.title}" removed from favorites.`);
      setIsFavorited(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{lesson.title} | BrainBridge</title>
        <meta
          name="description"
          content={lesson.content.slice(0, 150).replace(/\n/g, ' ') + '...'}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://www.brainbridge.education/lessons/${lesson.id}`} />
        <meta name="keywords" content={`${lesson.tags?.join(', ') || 'lesson, brainbridge, education, learning'}`} />

        {/* Social Sharing Tags */}
        <meta property="og:title" content={`${lesson.title} | BrainBridge`} />
        <meta
          property="og:description"
          content={lesson.content.slice(0, 150).replace(/\n/g, ' ') + '...'}
        />
        <meta property="og:image" content="https://www.brainbridge.education/og-preview.png" />
        <meta property="og:url" content={`https://www.brainbridge.education/lessons/${lesson.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen px-4 py-12 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-zinc-900 dark:text-white">{lesson.title}</h1>

        <div className="prose dark:prose-invert max-w-none mb-10">
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </div>

        <div className="flex gap-2 flex-wrap mb-10">
          {lesson.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-100"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between mb-8 text-sm">
          {prevLesson ? (
            <Link to={`/lessons/${prevLesson.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              ← Previous: {prevLesson.title}
            </Link>
          ) : <div />}

          {nextLesson ? (
            <Link to={`/lessons/${nextLesson.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              Next: {nextLesson.title} →
            </Link>
          ) : <div />}
        </div>

        <div className="mb-6 text-center">
          <Link to={`/topics/${topicSlug}/overview`} className="text-blue-600 dark:text-blue-400 hover:underline">
            View Topic Overview
          </Link>
        </div>

        <div className="flex gap-4 justify-center mb-6">
          {isCompleted ? (
            <button onClick={unmarkAsCompleted} className="bg-gray-400 text-white px-4 py-2 rounded">
              Unmark as Completed
            </button>
          ) : (
            <button onClick={markAsCompleted} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Mark as Completed
            </button>
          )}

          {isFavorited ? (
            <button onClick={removeFromFavorites} className="bg-gray-400 text-white px-4 py-2 rounded">
              Remove from Favorites
            </button>
          ) : (
            <button onClick={addToFavorites} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
              Add to Favorites
            </button>
          )}
        </div>

        {message && <p className="text-center text-lg text-zinc-700 dark:text-zinc-300">{message}</p>}
      </div>
    </>
  );
};

export default Lessons;