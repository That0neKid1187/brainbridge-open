// src/hooks/useLessons.js
import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

export function useLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          content,
          topic,
          is_complete,
          lesson_number,
          tags,
          categories (
            slug
          )
        `);

      // 🐛 TEMP DEBUG: Log exactly what Supabase returns
      console.log('✅ Supabase returned lessons:', data);
      if (error) {
        console.error('❌ Supabase fetch error:', error.message);
        setLessons([]);
      } else {
        // If data is an array, log each item’s title & content for clarity
        data?.forEach((item, index) => {
          console.log(`Lesson #${index}:`, {
            id: item.id,
            title: item.title,
            content: item.content,
            slug: item.categories?.slug,
          });
        });
        setLessons(data);
      }
      setLoading(false);
    };

    fetchLessons();
  }, []);

  const getAll = () => lessons;

  // Fallback: If categories.slug is missing, try lesson.topic
  const getByTopic = (topic) => {
    return lessons.filter((lesson) => {
      const slug = lesson.categories?.slug || lesson.topic;
      return slug === topic;
    });
  };

  const getById = (id) => lessons.find((lesson) => lesson.id === id);

  return { getAll, getByTopic, getById, loading };
}