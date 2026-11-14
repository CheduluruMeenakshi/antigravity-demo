import React, { useState } from 'react';
import { Field, CropType, GrowthStage, SeverityLevel } from '../../../shared/types';
import { Sparkles, Camera, Loader2 } from 'lucide-react';

interface AdvisoryFormProps {
  fields: Field[];
  onSubmit: (formData: FormData) => Promise<void>;
  loading?: boolean;
}

const CROPS: CropType[] = [
  'Wheat', 'Rice', 'Corn', 'Soy', 'Cotton', 'Tomato', 'Potato', 'Sugarcane', 'Apple', 'Citrus'
];

export default function AdvisoryForm({ fields, onSubmit, loading = false }: AdvisoryFormProps) {
  const [fieldId, setFieldId] = useState('');
  const [cropType, setCropType] = useState<CropType>('Wheat');
  const [growthStage, setGrowthStage] = useState<GrowthStage>('Vegetative');
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('Moderate');
  const [weather, setWeather] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('cropType', cropType);
    formData.append('growthStage', growthStage);
    formData.append('symptomsDescription', symptoms.trim());
    formData.append('severityRating', severity);
    if (fieldId) formData.append('fieldId', fieldId);
    if (weather.trim()) formData.append('weatherConditions', weather.trim());
    if (file) formData.append('image', file);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Target Field</label>
        <select
          value={fieldId}
          onChange={(e) => setFieldId(e.target.value)}
          className="input-field text-sm"
        >
          <option value="">Standalone Consultation</option>
          {fields.map((f) => (
            <option key={f.id} value={f.id}>{f.field_name} ({f.crop_type})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Crop Type</label>
          <select
            value={cropType}
            onChange={(e) => setCropType(e.target.value as CropType)}
            className="input-field text-sm"
          >
            {CROPS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Severity</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
            className="input-field text-sm"
          >
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Observed Symptoms *</label>
        <textarea
          rows={3}
          required
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe leaf spots, chlorosis, wilt, or insect signs..."
          className="input-field text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Attach Leaf Photo</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
      </div>

      <button
        type="submit"
        disabled={loading || symptoms.trim().length < 10}
        className="btn-primary w-full flex items-center justify-center gap-2 py-2 text-sm"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        <span>Run Gemini Diagnosis</span>
      </button>
    </form>
  );
}
