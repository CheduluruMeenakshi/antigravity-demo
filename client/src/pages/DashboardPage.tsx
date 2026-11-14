import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiGet } from '../lib/api';
import { Field, Advisory } from '../../../shared/types';
import {
  Sprout,
  PlusCircle,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [fields, setFields] = useState<Field[]>([]);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [fieldsRes, advisoriesRes] = await Promise.allSettled([
          apiGet<{ data: Field[] }>('/fields'),
          apiGet<{ data: Advisory[] }>('/advisories?pageSize=5'),
        ]);

        if (fieldsRes.status === 'fulfilled' && fieldsRes.value?.data) {
          setFields(fieldsRes.value.data);
        }
        if (advisoriesRes.status === 'fulfilled' && advisoriesRes.value?.data) {
          setAdvisories(advisoriesRes.value.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard summary', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalFields = fields.length;
  const totalAdvisories = advisories.length;

  const getSeverityBadgeClass = (level: string) => {
    switch (level) {
      case 'Low': return 'badge-low';
      case 'Moderate': return 'badge-moderate';
      case 'Severe': return 'badge-severe';
      case 'Critical': return 'badge-critical';
      default: return 'bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
            Agritech Command Center
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {profile?.full_name || 'Farmer'}!
          </h1>
          <p className="mt-1 text-primary-100 max-w-xl">
            Real-time crop diagnostics, soil health analytics, and AI-driven precision agriculture guidance.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/advisory/new"
            className="inline-flex items-center gap-2 bg-white text-primary-800 font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:bg-primary-50 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span>New Crop Advisory</span>
          </Link>
          <Link
            to="/fields"
            className="inline-flex items-center gap-2 bg-primary-900/40 text-white border border-white/20 font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-900/60 transition-colors"
          >
            <Layers className="w-5 h-5" />
            <span>Manage Fields</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Registered Fields</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalFields}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Advisories</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalAdvisories}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Model Engine</p>
            <h3 className="text-lg font-bold text-gray-900">Gemini 2.5 Flash</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Diagnosis SLA</p>
            <h3 className="text-lg font-bold text-gray-900">&lt; 3 Seconds</h3>
          </div>
        </div>
      </div>

      {/* Recent Advisories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Advisories</h2>
          <Link
            to="/history"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="card text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2" />
            <p className="text-gray-500 text-sm">Loading field and diagnostic records...</p>
          </div>
        ) : advisories.length === 0 ? (
          <div className="card text-center py-12 space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">No crop advisories yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
                Upload a photo of your crop foliage or input field observations to receive instant AI diagnostics.
              </p>
            </div>
            <Link to="/advisory/new" className="btn-primary inline-flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              <span>Create First Advisory</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {advisories.map((adv) => (
              <div key={adv.id} className="card hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                      {adv.crop_type}
                    </span>
                    <span className={getSeverityBadgeClass(adv.ai_diagnosis?.severityLevel)}>
                      {adv.ai_diagnosis?.severityLevel || 'Moderate'}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mt-2 line-clamp-1">
                    {adv.ai_diagnosis?.diagnosis || 'Agronomic Assessment'}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {adv.symptoms_description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(adv.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/advisory/${adv.id}`}
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                  >
                    <span>Full Report</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
