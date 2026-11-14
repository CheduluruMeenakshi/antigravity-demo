import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Advisory, CropType, SeverityLevel } from '../../../shared/types';
import { apiGet } from '../lib/api';
import {
  Search,
  Filter,
  Download,
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText
} from 'lucide-react';

const CROPS: CropType[] = [
  'Wheat', 'Rice', 'Corn', 'Soy', 'Cotton', 'Tomato', 'Potato', 'Sugarcane', 'Apple', 'Citrus'
];

const SEVERITIES: SeverityLevel[] = ['Low', 'Moderate', 'Severe', 'Critical'];

export default function HistoryPage() {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [cropFilter, setCropFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        let url = `/advisories?page=${page}&pageSize=${pageSize}`;
        if (cropFilter !== 'All') {
          url += `&cropType=${cropFilter}`;
        }
        const res = await apiGet<{ data: Advisory[]; total: number; page: number; pageSize: number }>(url);
        if (res?.data) {
          setAdvisories(res.data);
          setTotal(res.total || res.data.length);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to retrieve historical advisories');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [page, cropFilter]);

  const filteredAdvisories = advisories.filter((adv) => {
    const matchesSeverity = severityFilter === 'All' || adv.ai_diagnosis?.severityLevel === severityFilter;
    const matchesSearch = searchQuery === '' ||
      adv.crop_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adv.ai_diagnosis?.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adv.symptoms_description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const getSeverityBadgeClass = (level?: string) => {
    switch (level) {
      case 'Low': return 'badge-low';
      case 'Moderate': return 'badge-moderate';
      case 'Severe': return 'badge-severe';
      case 'Critical': return 'badge-critical';
      default: return 'bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full';
    }
  };

  const exportToCSV = () => {
    if (!advisories.length) return;
    const headers = ['Date', 'Crop Type', 'Diagnosis', 'Severity', 'Confidence Score', 'Symptoms'];
    const rows = filteredAdvisories.map((a) => [
      new Date(a.created_at).toISOString(),
      `"${a.crop_type}"`,
      `"${a.ai_diagnosis?.diagnosis || ''}"`,
      `"${a.ai_diagnosis?.severityLevel || ''}"`,
      `"${((a.ai_diagnosis?.confidenceScore || 0) * 100).toFixed(0)}%"`,
      `"${(a.symptoms_description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agri-advisory-history-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Advisory Archives</h1>
          <p className="text-sm text-gray-500 mt-1">
            Historical repository of crop diagnostics, pathology trends, and treatment outcomes.
          </p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={advisories.length === 0}
          className="btn-secondary inline-flex items-center gap-2 self-start md:self-auto text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search symptoms or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={cropFilter}
              onChange={(e) => { setCropFilter(e.target.value); setPage(1); }}
              className="input-field text-sm py-1.5"
            >
              <option value="All">All Crops</option>
              {CROPS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="input-field text-sm py-1.5"
            >
              <option value="All">All Severities</option>
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading historical archives...</p>
          </div>
        ) : filteredAdvisories.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FileText className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-gray-500 font-medium">No matching advisory records found</p>
            <Link to="/advisory/new" className="text-primary-600 font-semibold text-sm hover:underline">
              Submit a new advisory request
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Crop</th>
                  <th className="px-6 py-4">Field</th>
                  <th className="px-6 py-4">Primary Diagnosis</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Confidence</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAdvisories.map((adv) => (
                  <tr key={adv.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(adv.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {adv.crop_type}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {adv.field?.field_name || 'General Field'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {adv.ai_diagnosis?.diagnosis || 'Standard Consultation'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={getSeverityBadgeClass(adv.ai_diagnosis?.severityLevel)}>
                        {adv.ai_diagnosis?.severityLevel || 'Moderate'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {adv.ai_diagnosis?.confidenceScore ? `${Math.round(adv.ai_diagnosis.confidenceScore * 100)}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/advisory/${adv.id}`}
                        className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-xs bg-primary-50 px-3 py-1.5 rounded-lg"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing {filteredAdvisories.length} records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold px-2">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={advisories.length < pageSize}
              className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
