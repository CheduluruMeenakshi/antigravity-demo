import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CropType, GrowthStage, SeverityLevel, Field, Advisory } from '../../../../shared/types';
import { apiGet, apiPost } from '../../lib/api';
import {
  Upload,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Check,
  CloudSun,
  Camera
} from 'lucide-react';

const CROPS: { name: CropType; icon: string }[] = [
  { name: 'Wheat', icon: '🌾' },
  { name: 'Rice', icon: '🌾' },
  { name: 'Corn', icon: '🌽' },
  { name: 'Soy', icon: '🫘' },
  { name: 'Cotton', icon: '⚪' },
  { name: 'Tomato', icon: '🍅' },
  { name: 'Potato', icon: '🥔' },
  { name: 'Sugarcane', icon: '🎋' },
  { name: 'Apple', icon: '🍎' },
  { name: 'Citrus', icon: '🍊' },
];

const GROWTH_STAGES: GrowthStage[] = [
  'Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity'
];

const SEVERITY_RATINGS: { level: SeverityLevel; label: string; desc: string }[] = [
  { level: 'Low', label: 'Low', desc: 'Isolated leaf lesions, normal canopy vigor' },
  { level: 'Moderate', label: 'Moderate', desc: 'Notable foliage chlorosis, early clustering' },
  { level: 'Severe', label: 'Severe', desc: 'Aggressive necrosis, systemic defoliation' },
  { level: 'Critical', label: 'Critical', desc: 'Catastrophic blight, imminent harvest collapse' },
];

export default function NewAdvisoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedFieldId = searchParams.get('fieldId') || '';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fields, setFields] = useState<Field[]>([]);
  const [loadingFields, setLoadingFields] = useState(true);

  // Form State
  const [fieldId, setFieldId] = useState(preselectedFieldId);
  const [cropType, setCropType] = useState<CropType>('Wheat');
  const [growthStage, setGrowthStage] = useState<GrowthStage>('Vegetative');
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('Moderate');
  const [weather, setWeather] = useState('');

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFields() {
      try {
        const res = await apiGet<{ data: Field[] }>('/fields');
        if (res?.data) {
          setFields(res.data);
          if (preselectedFieldId) {
            const match = res.data.find((f) => f.id === preselectedFieldId);
            if (match) {
              setCropType(match.crop_type as CropType);
            }
          }
        }
      } catch (err) {
        console.warn('Fields could not be loaded', err);
      } finally {
        setLoadingFields(false);
      }
    }
    loadFields();
  }, [preselectedFieldId]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setFieldId(selected);
    const found = fields.find((f) => f.id === selected);
    if (found && CROPS.some((c) => c.name === found.crop_type)) {
      setCropType(found.crop_type as CropType);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please upload a JPEG, PNG, or WebP image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB maximum limit');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleFinalSubmit = async () => {
    if (symptoms.trim().length < 10) {
      setSubmitError('Please provide at least 10 characters describing the observed symptoms.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('cropType', cropType);
      formData.append('growthStage', growthStage);
      formData.append('symptomsDescription', symptoms.trim());
      formData.append('severityRating', severity);
      if (fieldId) formData.append('fieldId', fieldId);
      if (weather.trim()) formData.append('weatherConditions', weather.trim());
      if (imageFile) formData.append('image', imageFile);

      const res = await apiPost<{ data: Advisory }>('/advisories', formData);
      if (res?.data?.id) {
        navigate(`/advisory/${res.data.id}`);
      } else {
        throw new Error('Diagnosis response incomplete');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit advisory. Please retry.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Wizard Header Progress */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">AI Crop Diagnostic Wizard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Multimodal vision analysis, pathogen classification, and instant IPM treatment blueprint.
        </p>

        <div className="flex items-center justify-between mt-6 max-w-md">
          {[
            { num: 1, title: 'Crop Target' },
            { num: 2, title: 'Field Evidence' },
            { num: 3, title: 'AI Synthesis' },
          ].map((item, idx) => (
            <React.Fragment key={item.num}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    step === item.num
                      ? 'bg-primary-600 text-white shadow-sm ring-4 ring-primary-100'
                      : step > item.num
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > item.num ? <Check className="w-4 h-4" /> : item.num}
                </div>
                <span className={`text-xs font-semibold ${step >= item.num ? 'text-gray-900' : 'text-gray-400'}`}>
                  {item.title}
                </span>
              </div>
              {idx < 2 && <div className="h-0.5 w-10 bg-gray-200" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {submitError && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* STEP 1: Crop Selection */}
      {step === 1 && (
        <div className="card space-y-6 animate-in fade-in">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Select Field (Optional)
            </label>
            <select
              value={fieldId}
              onChange={handleFieldChange}
              className="input-field"
            >
              <option value="">No specific field (Standalone Diagnostic)</option>
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.field_name} ({f.crop_type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Select Crop Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {CROPS.map((c) => (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => setCropType(c.name)}
                  className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    cropType === c.name
                      ? 'border-primary-600 bg-primary-50/70 ring-2 ring-primary-500 font-bold text-primary-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-2xl">{c.icon}</span>
                  <span className="text-xs">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Phenological Growth Stage *
            </label>
            <div className="flex flex-wrap gap-2">
              {GROWTH_STAGES.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGrowthStage(g)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    growthStage === g
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <span>Next: Field Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Symptoms & Evidence */}
      {step === 2 && (
        <div className="card space-y-6 animate-in fade-in">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Foliage / Soil Symptoms Description *
            </label>
            <textarea
              rows={4}
              required
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Yellowing leaf margins with brown necrotic concentric rings spreading outward, powdery residue underneath leaf underside..."
              className="input-field"
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 10 characters required.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Observed Severity Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SEVERITY_RATINGS.map((s) => (
                <label
                  key={s.level}
                  onClick={() => setSeverity(s.level)}
                  className={`p-3.5 border rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                    severity === s.level
                      ? 'border-primary-600 bg-primary-50/60 font-semibold'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="severity"
                    checked={severity === s.level}
                    onChange={() => setSeverity(s.level)}
                    className="mt-0.5 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <div className="text-sm text-gray-900 font-bold">{s.label}</div>
                    <div className="text-xs text-gray-500 font-normal">{s.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
              <CloudSun className="w-4 h-4 text-primary-600" />
              <span>Micro-climate / Weather Conditions</span>
            </label>
            <input
              type="text"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              placeholder="e.g. 28°C, heavy humidity, recent continuous monsoon rains"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-primary-600" />
              <span>Upload Leaf or Soil Photo (Multimodal Gemini Vision)</span>
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 max-w-sm">
                <img
                  src={imagePreview}
                  alt="Crop condition preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="p-2 bg-white/95 text-xs text-gray-600 truncate border-t">
                  {imageFile?.name} ({(imageFile?.size! / 1024).toFixed(0)} KB)
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 hover:border-primary-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-primary-50/20">
                <Upload className="w-8 h-8 text-primary-600 mb-2" />
                <span className="text-sm font-semibold text-gray-800">
                  Click to upload crop foliage or soil image
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WebP up to 5MB supported
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={symptoms.trim().length < 10}
              onClick={() => setStep(3)}
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
            >
              <span>Review Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Submit */}
      {step === 3 && (
        <div className="card space-y-6 animate-in fade-in">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Diagnostic Submission Summary</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3.5 rounded-xl">
                <span className="text-xs text-gray-500 uppercase font-semibold">Target Crop</span>
                <p className="font-bold text-gray-900 text-base mt-0.5">{cropType}</p>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl">
                <span className="text-xs text-gray-500 uppercase font-semibold">Growth Phase</span>
                <p className="font-bold text-gray-900 text-base mt-0.5">{growthStage}</p>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl">
                <span className="text-xs text-gray-500 uppercase font-semibold">Estimated Severity</span>
                <p className="font-bold text-gray-900 text-base mt-0.5">{severity}</p>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl">
                <span className="text-xs text-gray-500 uppercase font-semibold">Visual Evidence</span>
                <p className="font-bold text-gray-900 text-base mt-0.5">
                  {imageFile ? '1 Photo Attached' : 'Text Diagnostics Only'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl text-sm">
              <span className="text-xs text-gray-500 uppercase font-semibold">Symptom Log</span>
              <p className="text-gray-800 mt-1">{symptoms}</p>
            </div>

            {weather && (
              <div className="bg-gray-50 p-4 rounded-xl text-sm">
                <span className="text-xs text-gray-500 uppercase font-semibold">Environmental Context</span>
                <p className="text-gray-800 mt-1">{weather}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <button
              type="button"
              disabled={submitting}
              onClick={() => setStep(2)}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Modify Evidence</span>
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={handleFinalSubmit}
              className="btn-primary inline-flex items-center gap-2 py-3 px-6 shadow-md"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Gemini Vision Advisory...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Advisory</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
