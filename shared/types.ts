export interface Profile {
  id: string;
  full_name: string;
  farm_location?: string;
  preferred_units: 'metric' | 'imperial';
  created_at: string;
}

export interface Field {
  id: string;
  user_id: string;
  field_name: string;
  crop_type: string;
  soil_type?: string;
  area_acres?: number;
  created_at: string;
}

export interface AIDiagnosis {
  diagnosis: string;
  confidenceScore: number;
  severityLevel: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  organicTreatments: string[];
  chemicalTreatments: string[];
  preventativeMeasures: string[];
  estimatedEconomicImpact?: string;
}

export interface Advisory {
  id: string;
  user_id: string;
  field_id?: string;
  crop_type: string;
  symptoms_description: string;
  image_url?: string;
  ai_diagnosis: AIDiagnosis;
  created_at: string;
  field?: Field;
}

export type CropType = 'Wheat' | 'Rice' | 'Corn' | 'Soy' | 'Cotton' | 'Tomato' | 'Potato' | 'Sugarcane' | 'Apple' | 'Citrus';
export type GrowthStage = 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturity';
export type SeverityLevel = 'Low' | 'Moderate' | 'Severe' | 'Critical';
export type SoilType = 'Sandy' | 'Clay' | 'Loamy' | 'Silty' | 'Peaty' | 'Chalky';

export interface CreateFieldInput {
  field_name: string;
  crop_type: string;
  soil_type?: string;
  area_acres?: number;
  irrigation_type?: string;
  latitude?: number;
  longitude?: number;
}

export interface AdvisoryFormData {
  cropType: CropType;
  growthStage: GrowthStage;
  symptomsDescription: string;
  severityRating: SeverityLevel;
  fieldId?: string;
  weatherConditions?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
