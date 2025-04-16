// File: src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useLessons } from '../hooks/useLessons';
import TagFilter from '../components/TagFilter';
import CategoryGrid from "../components/CategoryGrid";

const categories = [
  { title: 'STEM Education', path: '/categories/stem' },
  { title: 'Career Guidance', path: '/categories/career' },
  { title: 'Civic Engagement', path: '/categories/civic' },
  { title: 'College Admissions', path: '/categories/college' },
  { title: 'Math', path: '/categories/math' },
  { title: 'Philosophy', path: '/categories/philosophy' },
];

const Home = () => {
  const { getAll, loading } = useLessons();
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const allLessons = getAll();

  useEffect(() => {
    let lessonsFiltered = allLessons;

    if (selectedTag) {
      lessonsFiltered = lessonsFiltered.filter(
        (lesson) => lesson.tags && lesson.tags.includes(selectedTag)
      );
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      lessonsFiltered = lessonsFiltered.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(lowerSearch) ||
          lesson.content.toLowerCase().includes(lowerSearch) ||
          (lesson.tags && lesson.tags.join(' ').toLowerCase().includes(lowerSearch))
      );
    }

    setFilteredLessons(lessonsFiltered);
  }, [selectedTag, searchTerm, allLessons]);

  const uniqueTags = Array.from(
    new Set(allLessons.flatMap((lesson) => lesson.tags || []))
  );

  const isFiltering = !!searchTerm || !!selectedTag;

  return (
    <>
      <Helmet>
        <title>BrainBridge | Free Rural Education Platform</title>
        <meta
          name="description"
          content="Explore free, fast, and accessible lessons across STEM, college prep, and more — optimized for low-bandwidth connections and underserved communities."
        />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="BrainBridge, rural education, free lessons, STEM, college access, civic engagement, philosophy" />
        <link rel="canonical" href="https://www.brainbridge.education/" />

        {/* Social Sharing Tags */}
        <meta property="og:title" content="BrainBridge — Free Education for Every Student" />
        <meta
          property="og:description"
          content="BrainBridge delivers accessible, open-source lessons for students in rural or underserved communities. Learn anything, anywhere."
        />
        <meta property="og:image" content="https://www.brainbridge.education/og-preview.png" />
        <meta property="og:url" content="https://www.brainbridge.education/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <section className="bg-white dark:bg-zinc-900">
        <div className="max-w-screen-xl px-4 py-20 mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
            Empowering Rural Learners with Free Education
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 mb-8 max-w-2xl mx-auto">
            Explore thousands of bite-sized lessons, guides, and opportunities across STEM, college admissions,
            civic engagement, and more—built for students everywhere.
          </p>

          <div className="max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for lessons..."
              className="w-full p-3 rounded-lg border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 outline-none mb-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {uniqueTags.length > 0 && (
            <div className="mb-8">
              <TagFilter tags={uniqueTags} onFilterChange={setSelectedTag} />
            </div>
          )}

          {loading && <p className="text-zinc-500 dark:text-zinc-400 mb-6">Loading lessons...</p>}

          <div className="max-w-6xl mx-auto w-full px-4">
            {isFiltering ? (
              filteredLessons.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredLessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      to={`/lessons/${lesson.id}`}
                      className="block border border-zinc-200 dark:border-zinc-700 p-6 rounded-2xl shadow hover:shadow-lg transition bg-white dark:bg-zinc-900"
                    >
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                        {lesson.content.slice(0, 120)}...
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                !loading && (
                  <p className="text-center text-zinc-500 dark:text-zinc-400 mt-6">
                    No lessons match your search or filter.
                  </p>
                )
              )
            ) : (
              <CategoryGrid />
            )}
          </div>

          <div className="mt-16 border-t pt-8 text-sm text-zinc-500 dark:text-zinc-400">
            <p>
              BrainBridge is an open education platform built to bridge gaps in access and opportunity.
              <br /> Built with 💙 by Jacob Brashear.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;