import { z } from 'zod';

// Advisory creation input schema
export const createAdvisorySchema = z.object({
  cropType: z.enum(['Wheat', 'Rice', 'Corn', 'Soy', 'Cotton', 'Tomato', 'Potato', 'Sugarcane', 'Apple', 'Citrus']),
  growthStage: z.enum(['Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity']).optional(),
  symptomsDescription: z.string().min(10, 'Please provide at least 10 characters describing symptoms'),
  severityRating: z.enum(['Low', 'Moderate', 'Severe', 'Critical']).optional(),
  fieldId: z.string().uuid().optional(),
  weatherConditions: z.string().optional(),
});

// AI response validation schema
export const aiDiagnosisSchema = z.object({
  diagnosis: z.string(),
  confidenceScore: z.number().min(0).max(1),
  severityLevel: z.enum(['Low', 'Moderate', 'Severe', 'Critical']),
  organicTreatments: z.array(z.string()),
  chemicalTreatments: z.array(z.string()),
  preventativeMeasures: z.array(z.string()),
  estimatedEconomicImpact: z.string().optional(),
});

// Field creation schema
export const createFieldSchema = z.object({
  field_name: z.string().min(1, 'Field name is required'),
  crop_type: z.string().min(1, 'Crop type is required'),
  soil_type: z.string().optional(),
  area_acres: z.number().positive().optional(),
  irrigation_type: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export type CreateAdvisoryInput = z.infer<typeof createAdvisorySchema>;
export type AIDiagnosis = z.infer<typeof aiDiagnosisSchema>;
export type CreateFieldInput = z.infer<typeof createFieldSchema>;
