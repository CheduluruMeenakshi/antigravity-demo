import React, { useState, useEffect } from 'react';
import { Field, CropType, SoilType } from '../../../shared/types';
import { apiGet, apiPost, apiDelete } from '../lib/api';
import FieldCard from '../components/FieldCard';
import { Plus, X, Sprout, AlertCircle, Loader2 } from 'lucide-react';

const CROP_OPTIONS: CropType[] = [
  'Wheat', 'Rice', 'Corn', 'Soy', 'Cotton', 'Tomato', 'Potato', 'Sugarcane', 'Apple', 'Citrus'
];

const SOIL_OPTIONS: SoilType[] = [
  'Sandy', 'Clay', 'Loamy', 'Silty', 'Peaty', 'Chalky'
];

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [cropType, setCropType] = useState<CropType>('Wheat');
  const [soilType, setSoilType] = useState<SoilType>('Loamy');
  const [areaAcres, setAreaAcres] = useState<string>('');
  const [irrigationType, setIrrigationType] = useState('Drip');

  const loadFields = async () => {
    try {
      setLoading(true);
      const res = await apiGet<{ data: Field[] }>('/fields');
      if (res?.data) {
        setFields(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load farm fields');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFields();
  }, []);

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName.trim()) return;

    try {
      setSubmitting(true);
      const payload = {
        field_name: fieldName.trim(),
        crop_type: cropType,
        soil_type: soilType,
        area_acres: areaAcres ? parseFloat(areaAcres) : undefined,
        irrigation_type: irrigationType || undefined,
      };

      const res = await apiPost<{ data: Field }>('/fields', payload);
      if (res?.data) {
        setFields([res.data, ...fields]);
        setIsModalOpen(false);
        // Reset form
        setFieldName('');
        setAreaAcres('');
      }
    } catch (err: any) {
      alert(err?.message || 'Error creating field');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteField = async (id: string) => {
    try {
      await apiDelete(`/fields/${id}`);
      setFields(fields.filter((f) => f.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete field');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Farm & Field Manager</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure field parameters, crop varieties, and soil classifications for targeted advisory accuracy.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Field</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 card">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Retrieving registered fields...</p>
        </div>
      ) : fields.length === 0 ? (
        <div className="text-center py-16 card space-y-4">
          <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto">
            <Sprout className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No fields registered yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Register your farm parcels to keep track of soil dynamics, crop rotation histories, and localized advisories.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Field</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => (
            <FieldCard key={field.id} field={field} onDelete={handleDeleteField} />
          ))}
        </div>
      )}

      {/* Add Field Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-4">Register New Field</h2>

            <form onSubmit={handleCreateField} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Name / Identifier *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Plot - Sector B"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Crop *
                  </label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value as CropType)}
                    className="input-field"
                  >
                    {CROP_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soil Texture *
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as SoilType)}
                    className="input-field"
                  >
                    {SOIL_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 15.5"
                    value={areaAcres}
                    onChange={(e) => setAreaAcres(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Irrigation System
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Drip / Sprinkler"
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Field</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
