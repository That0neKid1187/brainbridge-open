import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';

const OwnerDashboard = () => {
  const { user, role, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const [filter, setFilter] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortKey, setSortKey] = useState('lesson_number');
  const [sortOrder, setSortOrder] = useState('asc');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && (!user || role !== 'owner')) navigate('/login');
  }, [user, role, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const [lessonsRes, categoriesRes] = await Promise.all([
        supabase.from('lessons').select('*'),
        supabase.from('categories').select('*'),
      ]);

      if (!lessonsRes.error && !categoriesRes.error) {
        setLessons(lessonsRes.data || []);
        setCategories(categoriesRes.data || []);
      }
    };
    fetchData();
  }, []);

  const handleLessonChange = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };

  const handleDeleteLesson = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this lesson?');
    if (!confirmed) return;
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (!error) {
      setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
    } else {
      setMessage('Delete failed: ' + error.message);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleDuplicateLesson = async (lesson) => {
    const clone = { ...lesson, id: undefined, title: lesson.title + ' (Copy)' };
    const { error } = await supabase.from('lessons').insert([clone]);
    setMessage(error ? 'Failed to duplicate lesson' : 'Lesson duplicated');
    setTimeout(() => setMessage(''), 4000);
  };

  const handleSaveLesson = async (lesson) => {
    if (!lesson.title.trim() || !lesson.content.trim()) {
      setMessage('Title and content are required.');
      return;
    }
    const tagArray = lesson.tags?.split(',').map((tag) => tag.trim()).filter(Boolean);
    const { error } = await supabase.from('lessons').update({ ...lesson, tags: tagArray }).eq('id', lesson.id);
    setMessage(error ? 'Failed to save changes' : 'Changes saved');
    setTimeout(() => setMessage(''), 4000);
  };

  const sortedFilteredLessons = lessons
    .filter((l) =>
      l.title?.toLowerCase().includes(filter.toLowerCase()) &&
      (!filterTag || (l.tags || []).some((t) => t.toLowerCase().includes(filterTag.toLowerCase()))) &&
      (!filterCategory || l.category_id === filterCategory)
    )
    .sort((a, b) => {
      const valA = a[sortKey] ?? '';
      const valB = b[sortKey] ?? '';
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold text-blue-700">Owner Dashboard</h1>

      {/* Lesson CRUD */}
      <section className="border-t pt-6">
        <h2 className="text-2xl font-semibold mb-4">Manage Lessons</h2>

        <div className="flex gap-4 items-center flex-wrap mb-4">
          <input className="border p-2 rounded" placeholder="Filter by title..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Filter by tag..." value={filterTag} onChange={(e) => setFilterTag(e.target.value)} />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border p-2 rounded">
            <option value="">All Categories</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="border p-2 rounded">
            <option value="lesson_number">Sort by Lesson #</option>
            <option value="title">Sort by Title</option>
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border p-2 rounded">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <table className="w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Complete</th>
              <th className="p-2">Lesson #</th>
              <th className="p-2">Tags</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedFilteredLessons.map((lesson, i) => (
              <React.Fragment key={lesson.id}>
                <tr className="border-t">
                  <td className="p-2"><input className="border p-1 rounded w-full" value={lesson.title} onChange={(e) => handleLessonChange(i, 'title', e.target.value)} /></td>
                  <td className="p-2">
                    <select className="border p-1 rounded" value={lesson.is_complete ? 'true' : 'false'} onChange={(e) => handleLessonChange(i, 'is_complete', e.target.value === 'true')}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </td>
                  <td className="p-2"><input type="number" className="border p-1 rounded w-full" value={lesson.lesson_number || 0} onChange={(e) => handleLessonChange(i, 'lesson_number', parseInt(e.target.value))} /></td>
                  <td className="p-2"><input type="text" className="border p-1 rounded w-full" value={lesson.tags?.toString() || ''} onChange={(e) => handleLessonChange(i, 'tags', e.target.value)} /></td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleSaveLesson(lesson)} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                    <button onClick={() => handleDuplicateLesson(lesson)} className="bg-yellow-500 text-white px-3 py-1 rounded">Copy Template</button>
                    <button onClick={() => handleDeleteLesson(lesson.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                    <button onClick={() => setExpandedLessonId(lesson.id === expandedLessonId ? null : lesson.id)} className="bg-blue-500 text-white px-3 py-1 rounded">{expandedLessonId === lesson.id ? 'Hide Content' : 'Edit Content'}</button>
                  </td>
                </tr>
                {expandedLessonId === lesson.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="p-4">
                      <h4 className="font-semibold mb-2">Markdown Content Editor</h4>
                      <textarea className="w-full p-2 border rounded h-40" value={lesson.content || ''} onChange={(e) => handleLessonChange(i, 'content', e.target.value)} />
                      <div className="mt-4">
                        <h5 className="text-sm font-semibold">Preview</h5>
                        <div className="border p-4 mt-2 rounded bg-white prose">
                          <ReactMarkdown>{lesson.content || ''}</ReactMarkdown>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {message && <p className="mt-4 text-center text-lg text-blue-700">{message}</p>}
      </section>
    </div>
  );
};

export default OwnerDashboard;