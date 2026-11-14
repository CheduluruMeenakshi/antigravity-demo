import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Advisory } from '../../../../shared/types';
import { apiGet, apiPost } from '../../lib/api';
import DiagnosisResult from '../../components/DiagnosisResult';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Printer,
  MessageSquare,
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function AdvisoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [advisory, setAdvisory] = useState<Advisory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Follow up inquiry state
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpAnswers, setFollowUpAnswers] = useState<Array<{ q: string; a: string }>>([]);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    async function loadAdvisory() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await apiGet<{ data: Advisory }>(`/advisories/${id}`);
        if (res?.data) {
          setAdvisory(res.data);
        } else {
          throw new Error('Advisory record not found');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load advisory report');
      } finally {
        setLoading(false);
      }
    }

    loadAdvisory();
  }, [id]);

  const handleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuestion.trim() || !advisory) return;

    try {
      setAsking(true);
      const questionText = followUpQuestion.trim();
      const promptCombined = `Previous diagnosis was: ${advisory.ai_diagnosis.diagnosis} for ${advisory.crop_type}. Grower follow-up question: "${questionText}". Provide actionable specific recommendations addressing this question.`;

      const formData = new FormData();
      formData.append('cropType', advisory.crop_type);
      formData.append('symptomsDescription', promptCombined);
      if (advisory.field_id) formData.append('fieldId', advisory.field_id);

      const res = await apiPost<{ data: Advisory }>('/advisories', formData);
      if (res?.data?.ai_diagnosis?.diagnosis) {
        setFollowUpAnswers((prev) => [
          ...prev,
          {
            q: questionText,
            a: `${res.data.ai_diagnosis.diagnosis}. Suggested actions: ${res.data.ai_diagnosis.organicTreatments.slice(0, 2).join('; ')}`,
          },
        ]);
        setFollowUpQuestion('');
      }
    } catch (err: any) {
      alert('Could not submit follow-up query: ' + err.message);
    } finally {
      setAsking(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Retrieving agronomic advisory payload...</p>
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Advisory Report Unavailable</h2>
        <p className="text-sm text-gray-500">{error || 'This report may have been deleted or access is restricted.'}</p>
        <Link to="/history" className="btn-primary inline-block">
          Return to History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Archives</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="btn-secondary inline-flex items-center gap-2 text-xs py-1.5 px-3"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Advisory</span>
        </button>
      </div>

      {/* Meta Header */}
      <div className="card bg-gray-50/50 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-gray-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-100/60 rounded-xl text-primary-800 font-bold text-lg">
            {advisory.crop_type}
          </div>
          <div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(advisory.created_at).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                {advisory.field?.field_name || 'Unassigned Field'}
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              <strong>Reported Symptoms:</strong> {advisory.symptoms_description}
            </p>
          </div>
        </div>

        {advisory.image_url && (
          <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
            <img
              src={advisory.image_url}
              alt="Foliage sample"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* AI Structured Results */}
      <DiagnosisResult
        diagnosis={advisory.ai_diagnosis}
        cropType={advisory.crop_type}
      />

      {/* Interactive Agronomist Chat Follow-up */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <MessageSquare className="w-5 h-5 text-primary-600" />
          <h3 className="font-bold text-gray-900">Contextual Follow-Up Inquiry</h3>
        </div>

        <p className="text-xs text-gray-500">
          Ask specific clarifying questions regarding chemical dosage rates, organic alternatives, or localized application timing.
        </p>

        {followUpAnswers.length > 0 && (
          <div className="space-y-3 pt-2">
            {followUpAnswers.map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-xl space-y-1.5 border border-gray-100">
                <div className="text-xs font-bold text-gray-600">Q: {item.q}</div>
                <div className="text-sm text-gray-900">A: {item.a}</div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleFollowUp} className="flex gap-2 pt-2">
          <input
            type="text"
            required
            value={followUpQuestion}
            onChange={(e) => setFollowUpQuestion(e.target.value)}
            placeholder="e.g. Can I mix copper fungicide with neem oil at this stage?"
            className="input-field text-sm"
          />
          <button
            type="submit"
            disabled={asking || !followUpQuestion.trim()}
            className="btn-primary inline-flex items-center gap-2 py-2 px-4 flex-shrink-0"
          >
            {asking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
}
