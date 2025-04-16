// File: src/pages/TopicPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { useLessons } from '../hooks/useLessons';

const TopicPage = () => {
  const { topic } = useParams();
  const { getByTopic } = useLessons();
  let lessons = getByTopic(topic);

  lessons = lessons.filter((lesson) => lesson.is_complete);
  lessons.sort((a, b) => (a.lesson_number || 0) - (b.lesson_number || 0));

  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

  return (
    <>
      <Helmet>
        <title>{capitalizedTopic} Lessons | BrainBridge</title>
        <meta
          name="description"
          content={`Explore curated lessons in ${capitalizedTopic} — from beginner concepts to deeper insights, all built for accessibility.`}
        />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content={`BrainBridge, ${capitalizedTopic} education, free ${topic} lessons, rural access`} />
        <link rel="canonical" href={`https://www.brainbridge.education/topics/${topic}`} />

        {/* Social Sharing Tags */}
        <meta property="og:title" content={`${capitalizedTopic} Lessons | BrainBridge`} />
        <meta
          property="og:description"
          content={`Browse accessible, free lessons in ${capitalizedTopic} on BrainBridge — a WiFi-optimized platform for underserved students.`}
        />
        <meta property="og:image" content="https://www.brainbridge.education/og-preview.png" />
        <meta property="og:url" content={`https://www.brainbridge.education/topics/${topic}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-zinc-900 dark:text-white capitalize">
          {topic} Lessons
        </h1>

        {lessons.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">No lessons found for this topic.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    to={`/lessons/${lesson.id}`}
                    className="block p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                  >
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                      {lesson.title}
                    </h2>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 text-center">
              <Link
                to={`/topics/${topic}/overview`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Full Overview
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TopicPage;