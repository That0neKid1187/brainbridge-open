// src/pages/AdminDashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';

const AdminDashboard = () => {
  const { user, role, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const [filter, setFilter] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortKey, setSortKey] = useState('lesson_number');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchLessons = async () => {
      const { data, error } = await supabase.from('lessons').select('*');
      if (!error) setLessons(data);
    };
    fetchLessons();
  }, [message]);

  useEffect(() => {
    if (!authLoading && (!user || role !== 'admin')) {
      navigate('/login');
    }
  }, [user, role, authLoading, navigate]);

  if (authLoading) return <p>Loading...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) {
      setMessage('❌ All required fields must be filled.');
      return;
    }
    const tagArray = tags.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0);
    const { error } = await supabase.from('lessons').insert([{ title, content, category_id: categoryId, tags: tagArray, is_complete: false, lesson_number: 0 }]);
    setMessage(error ? '❌ Upload failed: ' + error.message : '✅ Lesson uploaded successfully!');
    if (!error) { setTitle(''); setContent(''); setTags(''); setCategoryId(''); setShowPreview(false); }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    setMessage(error ? '❌ Failed to delete lesson' : '✅ Lesson deleted');
  };

  const handleDuplicate = async (lesson) => {
    const clone = { ...lesson, id: undefined, title: lesson.title + ' (Copy)' };
    const { error } = await supabase.from('lessons').insert([clone]);
    setMessage(error ? '❌ Failed to duplicate lesson' : '✅ Lesson duplicated');
  };

  const handleLessonChange = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };

  const handleSaveLesson = async (lesson) => {
    if (!lesson.title.trim() || !lesson.content.trim()) {
      setMessage('❌ Title and content are required.');
      return;
    }
    const tagArray = lesson.tags?.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0);
    const { error } = await supabase.from('lessons').update({ ...lesson, tags: tagArray }).eq('id', lesson.id);
    setMessage(error ? '❌ Failed to save changes' : '✅ Changes saved');
  };

  const sortedFilteredLessons = lessons
    .filter((l) =>
      l.title.toLowerCase().includes(filter.toLowerCase()) &&
      (!filterTag || (l.tags || []).some((t) => t.toLowerCase().includes(filterTag.toLowerCase()))) &&
      (!filterCategory || l.category_id === filterCategory)
    )
    .sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      return sortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Admin Dashboard</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Lesson Title*" className="w-full p-2 border rounded" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Lesson Content (Markdown supported)*" className="w-full p-2 border rounded h-40" value={content} onChange={(e) => setContent(e.target.value)} required />
        <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setShowPreview((prev) => !prev)}>{showPreview ? 'Hide' : 'Show'} Markdown Preview</button>
        {showPreview && <div className="mt-4 p-4 border rounded bg-gray-50"><ReactMarkdown>{content}</ReactMarkdown></div>}
        <input type="text" placeholder="Tags (comma-separated)" className="w-full p-2 border rounded" value={tags} onChange={(e) => setTags(e.target.value)} />
        <select className="w-full p-2 border rounded" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">Select Category</option>
          {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">Upload Lesson</button>
      </form>
      {message && <p className="text-center text-lg mt-4">{message}</p>}

      <div className="flex gap-4 items-center flex-wrap mt-12">
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

      <h2 className="text-2xl font-bold text-blue-700 mt-6 mb-4">Edit Existing Lessons</h2>
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
                  <button onClick={() => handleDuplicate(lesson)} className="bg-yellow-500 text-white px-3 py-1 rounded">Duplicate</button>
                  <button onClick={() => handleDelete(lesson.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
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
    </div>
  );
};

export default AdminDashboard;
