import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, CartesianGrid } from 'recharts';
import supabase from '../supabaseClient';

export default function ClassificationBreakdownChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchClassifications = async () => {
      const { data: profiles, error } = await supabase.from('profiles').select('classification');
      if (error) {
        console.error('Error fetching classifications:', error.message);
        return;
      }

      const counts = { rural: 0, urban: 0, suburban: 0 };
      profiles.forEach(p => {
        const key = p.classification?.toLowerCase();
        if (counts[key] !== undefined) counts[key]++;
      });

      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      const formatted = Object.entries(counts).map(([key, count]) => ({
        classification: key.charAt(0).toUpperCase() + key.slice(1),
        percentage: parseFloat(((count / total) * 100).toFixed(1))
      }));

      setData(formatted);
    };

    fetchClassifications();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">User Breakdown by Classification</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="classification" />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(val) => `${val}%`} />
          <Bar dataKey="percentage" fill="#f59e0b">
            <LabelList dataKey="percentage" position="top" formatter={(val) => `${val}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}