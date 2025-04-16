import React, { useState } from 'react';

const TagFilter = ({ tags, onFilterChange }) => {
  const [selectedTag, setSelectedTag] = useState('');

  const handleChange = (e) => {
    const tag = e.target.value;
    setSelectedTag(tag);
    onFilterChange(tag);
  };

  return (
    <div className="mb-4">
      <select
        className="p-2 border rounded"
        value={selectedTag}
        onChange={handleChange}
      >
        <option value="">All Tags</option>
        {tags.map((tag, index) => (
          <option key={index} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TagFilter;