// File: src/pages/TopicOverview.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLessons } from '../hooks/useLessons';

const TopicOverview = () => {
  const { topic } = useParams();
  const { getByTopic } = useLessons();

  let topicLessons = getByTopic(topic || '');
  topicLessons = topicLessons.filter((lesson) => lesson.is_complete);
  topicLessons.sort((a, b) => (a.lesson_number || 0) - (b.lesson_number || 0));

  return (
    <div className="min-h-screen px-4 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-zinc-900 dark:text-white capitalize">
        {topic} Overview
      </h1>

      {topicLessons.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No lessons found for this topic.</p>
      ) : (
        <ol className="list-decimal list-inside space-y-4">
          {topicLessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                to={`/lessons/${lesson.id}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {lesson.title}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default TopicOverview;
