import React, { useState } from 'react';
import { Field } from '../../../shared/types';
import { Sprout, MapPin, Layers, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FieldCardProps {
  field: Field;
  onDelete: (id: string) => void;
}

const CROP_ICONS: Record<string, string> = {
  Wheat: '🌾',
  Rice: '🌾',
  Corn: '🌽',
  Soy: '🫘',
  Cotton: '⚪',
  Tomato: '🍅',
  Potato: '🥔',
  Sugarcane: '🎋',
  Apple: '🍎',
  Citrus: '🍊',
};

export default function FieldCard({ field, onDelete }: FieldCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove field "${field.field_name}"?`)) {
      setIsDeleting(true);
      onDelete(field.id);
    }
  };

  const cropEmoji = CROP_ICONS[field.crop_type] || '🌱';

  return (
    <div className="card hover:shadow-md transition-shadow relative flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-primary-50 rounded-xl" role="img" aria-label={field.crop_type}>
              {cropEmoji}
            </span>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{field.field_name}</h3>
              <p className="text-sm font-medium text-primary-700">{field.crop_type}</p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete field"
            className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 my-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-400" />
            <span>Soil Type: <strong className="text-gray-700">{field.soil_type || 'Unspecified'}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>Area: <strong className="text-gray-700">{field.area_acres ? `${field.area_acres} Acres` : 'Not recorded'}</strong></span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Added {new Date(field.created_at).toLocaleDateString()}
        </span>
        <Link
          to={`/advisory/new?fieldId=${field.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          <span>Get Advisory</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
