import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Settings, CheckCircle, AlertCircle, LogOut, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { user, profile, signOut } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [farmLocation, setFarmLocation] = useState(profile?.farm_location || '');
  const [preferredUnits, setPreferredUnits] = useState<'metric' | 'imperial'>(
    profile?.preferred_units || 'metric'
  );
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          farm_location: farmLocation.trim() || null,
          preferred_units: preferredUnits,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account & Farm Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure personal identification, regional agronomy standards, and localized measurement units.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl animate-in fade-in">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="card space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <User className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-bold text-gray-900">Agronomist Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Farm Location (State / Country)
            </label>
            <input
              type="text"
              placeholder="e.g. Salinas Valley, California"
              value={farmLocation}
              onChange={(e) => setFarmLocation(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-900">Regional Preferences</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Measurement Standard
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
              <label className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                preferredUnits === 'metric' ? 'border-primary-600 bg-primary-50/50 text-primary-900 font-semibold' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="units"
                  value="metric"
                  checked={preferredUnits === 'metric'}
                  onChange={() => setPreferredUnits('metric')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="text-sm">Metric System</div>
                  <div className="text-xs text-gray-500 font-normal">Hectares, Celsius, Liters, kg</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                preferredUnits === 'imperial' ? 'border-primary-600 bg-primary-50/50 text-primary-900 font-semibold' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="units"
                  value="imperial"
                  checked={preferredUnits === 'imperial'}
                  onChange={() => setPreferredUnits('imperial')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="text-sm">Imperial System</div>
                  <div className="text-xs text-gray-500 font-normal">Acres, Fahrenheit, Gallons, lbs</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary inline-flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="card border-red-100 bg-red-50/30">
        <h3 className="text-base font-bold text-red-900 mb-2">Account Session</h3>
        <p className="text-sm text-red-700 mb-4">
          Terminate current device authorization and clear local cached credentials.
        </p>
        <button
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
