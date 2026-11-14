import React, { useState } from 'react';
import { AIDiagnosis } from '../../../shared/types';
import {
  AlertTriangle,
  ShieldCheck,
  FlaskConical,
  Sprout,
  DollarSign,
  Info,
  CheckCircle2,
  TrendingDown,
  AlertCircle
} from 'lucide-react';

interface DiagnosisResultProps {
  diagnosis: AIDiagnosis;
  cropType: string;
}

export default function DiagnosisResult({ diagnosis, cropType }: DiagnosisResultProps) {
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const toggleAction = (key: string) => {
    setCompletedActions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getSeverityAlert = (level: string) => {
    switch (level) {
      case 'Critical':
        return {
          bg: 'bg-red-50 border-red-200 text-red-900',
          badge: 'bg-red-100 text-red-800 border-red-200',
          desc: 'Immediate intervention mandatory to avoid irreversible yield destruction or crop failure.',
          icon: <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />,
        };
      case 'Severe':
        return {
          bg: 'bg-orange-50 border-orange-200 text-orange-900',
          badge: 'bg-orange-100 text-orange-800 border-orange-200',
          desc: 'Significant tissue necrosis or pathogen spread detected. Urgent treatment required.',
          icon: <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0" />,
        };
      case 'Moderate':
        return {
          bg: 'bg-yellow-50 border-yellow-200 text-yellow-900',
          badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          desc: 'Localized symptoms identified. Rapid containment recommended before seasonal escalation.',
          icon: <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />,
        };
      case 'Low':
      default:
        return {
          bg: 'bg-green-50 border-green-200 text-green-900',
          badge: 'bg-green-100 text-green-800 border-green-200',
          desc: 'Mild or early stage manifestation. Implement organic prophylaxis and maintain observation.',
          icon: <ShieldCheck className="w-6 h-6 text-green-600 flex-shrink-0" />,
        };
    }
  };

  const alertConfig = getSeverityAlert(diagnosis.severityLevel);
  const confidencePercent = Math.round((diagnosis.confidenceScore || 0.85) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="card border-l-4 border-l-primary-600 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                Target Crop: {cropType}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${alertConfig.badge}`}>
                Severity: {diagnosis.severityLevel}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {diagnosis.diagnosis}
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 min-w-[200px]">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                <span>Confidence</span>
                <span className="text-primary-700">{confidencePercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Severity Banner */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${alertConfig.bg}`}>
          {alertConfig.icon}
          <div>
            <h4 className="font-bold text-sm">Pathology Alert ({diagnosis.severityLevel} Risk)</h4>
            <p className="text-xs sm:text-sm mt-0.5 opacity-90">{alertConfig.desc}</p>
          </div>
        </div>
      </div>

      {/* Economic Impact Card */}
      {diagnosis.estimatedEconomicImpact && (
        <div className="card bg-amber-50/50 border-amber-200/80 p-5 flex items-start gap-3">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-xl flex-shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Estimated Economic & Yield Impact</h3>
            <p className="text-sm text-gray-700 mt-1">{diagnosis.estimatedEconomicImpact}</p>
          </div>
        </div>
      )}

      {/* Structured Action Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organic Remedies */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <div className="p-2 bg-green-50 text-green-700 rounded-lg">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Organic & Biological Controls</h3>
              <p className="text-xs text-gray-500">Eco-safe, residue-free biological interventions</p>
            </div>
          </div>

          <ul className="space-y-3">
            {diagnosis.organicTreatments?.map((treatment, idx) => {
              const key = `org-${idx}`;
              const done = !!completedActions[key];
              return (
                <li
                  key={idx}
                  onClick={() => toggleAction(key)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    done ? 'bg-green-50/40 border-green-200 opacity-60' : 'border-gray-200 hover:border-green-300 bg-white'
                  }`}
                >
                  <button type="button" className="mt-0.5 flex-shrink-0 text-primary-600">
                    <CheckCircle2 className={`w-5 h-5 ${done ? 'text-green-600 fill-green-100' : 'text-gray-300'}`} />
                  </button>
                  <span className={`text-sm ${done ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {treatment}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Chemical Interventions */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Targeted Chemical Controls</h3>
              <p className="text-xs text-gray-500">Regulated active ingredients & curative sprays</p>
            </div>
          </div>

          <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-100 text-xs text-blue-800 flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>Adhere strictly to labeled Pre-Harvest Intervals (PHI) and wear PPE.</span>
          </div>

          <ul className="space-y-3">
            {diagnosis.chemicalTreatments?.map((treatment, idx) => {
              const key = `chem-${idx}`;
              const done = !!completedActions[key];
              return (
                <li
                  key={idx}
                  onClick={() => toggleAction(key)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    done ? 'bg-blue-50/40 border-blue-200 opacity-60' : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <button type="button" className="mt-0.5 flex-shrink-0 text-blue-600">
                    <CheckCircle2 className={`w-5 h-5 ${done ? 'text-blue-600 fill-blue-100' : 'text-gray-300'}`} />
                  </button>
                  <span className={`text-sm ${done ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {treatment}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Preventative & Cultural Practices */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Preventative & Cultural Management</h3>
            <p className="text-xs text-gray-500">Long-term soil health, canopy aeration, and vector exclusion</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {diagnosis.preventativeMeasures?.map((measure, idx) => (
            <div
              key={idx}
              className="p-3 bg-purple-50/30 border border-purple-100 rounded-xl flex items-start gap-2.5 text-sm text-gray-800"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
              <span>{measure}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Agronomic Disclaimer */}
      <div className="text-center p-4 text-xs text-gray-500 bg-gray-50 rounded-xl border border-gray-200/60">
        <p>
          ⚠️ <strong>Agronomic Safety Notice:</strong> AI recommendations are generated via multimodal Gemini Vision synthesis.
          Always cross-reference with localized field trials and regional extension advisory services prior to bulk chemical dispersion.
        </p>
      </div>
    </div>
  );
}
