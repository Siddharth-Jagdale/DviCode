// src/components/patient/AccessLog.js
// Patient Data Access Log UI (demo). Uses Tailwind + supports dark mode.
// Copy this file into src/components/patient/AccessLog.js

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Demo data for now. Backend will replace this later.
const demoLogs = [
  { id: 1, doctorName: 'Dr. Asha Kulkarni', role: 'Cardiologist', accessTime: '2025-09-20T14:35:00+05:30', purpose: 'Reviewed ECG and reports' },
  { id: 2, doctorName: 'Dr. Rohit Sharma', role: 'General Physician', accessTime: '2025-09-19T09:20:00+05:30', purpose: 'Routine follow-up' },
  { id: 3, doctorName: 'Dr. Priya Desai', role: 'Dermatologist', accessTime: '2025-09-18T18:50:00+05:30', purpose: 'Checked skin test results' },
];

// Small helper: format ISO time to readable string for India locale
const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  } catch (e) {
    return iso;
  }
};

export default function AccessLog() {
  // logs state - currently fixed to demoLogs. Will change to API call later.
  const [logs] = useState(demoLogs);
  // search query for filtering
  const [query, setQuery] = useState('');
  // expanded row id for showing details
  const [expandedId, setExpandedId] = useState(null);

  // compute filtered list (search + sort newest first)
  const filtered = useMemo(() => {
    if (!query) return logs.slice().sort((a, b) => new Date(b.accessTime) - new Date(a.accessTime));
    const q = query.toLowerCase();
    return logs
      .filter((l) =>
        l.doctorName.toLowerCase().includes(q) ||
        l.role.toLowerCase().includes(q) ||
        (l.purpose || '').toLowerCase().includes(q)
      )
      .sort((a, b) => new Date(b.accessTime) - new Date(a.accessTime));
  }, [logs, query]);

  // toggle expanded row
  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="p-6">
      {/* Header - title + search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Patient Data Access Log</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">Shows who viewed this patient's medical data (demo entries).</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            {/* Search input */}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctor, role or purpose"
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 btn-secondary details-button"
            />
            {/* small search icon */}
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button
            onClick={() => setQuery('')}
            className="px-3 py-2 text-sm border rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 btn-secondary details-button"
            aria-label="Clear search"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date &amp; Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purpose</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-300">
                  No access logs found.
                </td>
              </tr>
            ) : (
              filtered.map((l) => (
                <React.Fragment key={l.id}>
                  {/* Main row */}
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{l.doctorName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{l.role}</div>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{formatDate(l.accessTime)}</div>
                    </td>

                    <td className="px-6 py-4 align-top text-sm text-gray-700 dark:text-gray-300">{l.purpose}</td>

                    <td className="px-6 py-4 align-top text-right">
                      {/* Expand button to show more details */}
                      <button
                        onClick={() => toggle(l.id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-900 btn-secondary details-button"
                        aria-expanded={expandedId === l.id}
                      >
                        Details
                      </button>
                    </td>
                  </tr>

                  {/* Expanded details row */}
                  {expandedId === l.id && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 bg-gray-50 dark:bg-gray-900">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Doctor:</strong> {l.doctorName} &nbsp;•&nbsp; <strong>Role:</strong> {l.role}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{formatDate(l.accessTime)}</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{l.purpose}</div>
                        <div className="mt-3">
                          {/* "View profile" is a placeholder link for later */}
                          <Link to="#" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                            View profile
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">* This page currently shows demo data. Real logs will come from the backend later.</div>
    </div>
  );
}
