import { Request, Response } from 'express';
import { createAdvisorySchema, aiDiagnosisSchema } from '../schemas/advisory.schema.js';
import { generateCropAdvisory } from '../lib/gemini.js';
import { supabaseAdmin } from '../lib/supabase.js';

// POST /api/advisories
export async function createAdvisory(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    // Parse and validate body fields
    const parseResult = createAdvisorySchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Validation failed', details: parseResult.error.flatten() });
      return;
    }

    const { cropType, growthStage, symptomsDescription, severityRating, fieldId, weatherConditions } = parseResult.data;

    // Build image part if file uploaded
    let imagePart: { inlineData: { data: string; mimeType: string } } | undefined;
    const file = req.file;
    if (file) {
      imagePart = {
        inlineData: {
          data: file.buffer.toString('base64'),
          mimeType: file.mimetype,
        },
      };
    }

    // Build detailed agronomic prompt
    const schemaDescription = JSON.stringify({
      diagnosis: 'string — identified disease/pest/deficiency or "Healthy"',
      confidenceScore: 'number 0–1',
      severityLevel: '"Low" | "Moderate" | "Severe" | "Critical"',
      organicTreatments: 'string[] — organic/biological treatment options',
      chemicalTreatments: 'string[] — chemical treatment options with active ingredients',
      preventativeMeasures: 'string[] — cultural and preventative practices',
      estimatedEconomicImpact: 'string — optional estimated yield/revenue impact',
    });

    const growthStageStr = growthStage ? ` at ${growthStage} stage` : '';
    const severityStr = severityRating ? ` Current severity assessment: ${severityRating}.` : '';
    const weatherStr = weatherConditions ? ` Weather conditions: ${weatherConditions}.` : '';
    const imageStr = file ? ' A crop image has been provided for visual analysis.' : '';

    const prompt =
      `Analyze this ${cropType} crop${growthStageStr}. Grower reports: ${symptomsDescription}.` +
      `${severityStr}${weatherStr}${imageStr}` +
      ` Provide a complete agronomic advisory in JSON format with the following schema: ${schemaDescription}`;

    // Call Gemini
    const aiRaw = await generateCropAdvisory(prompt, imagePart);

    // Parse and validate AI response
    let aiJson: unknown;
    try {
      aiJson = JSON.parse(aiRaw);
    } catch {
      res.status(502).json({ error: 'AI returned non-JSON response', raw: aiRaw });
      return;
    }

    const diagnosisResult = aiDiagnosisSchema.safeParse(aiJson);
    if (!diagnosisResult.success) {
      res.status(502).json({ error: 'AI response failed schema validation', details: diagnosisResult.error.flatten() });
      return;
    }

    const diagnosis = diagnosisResult.data;

    // Upload image to Supabase Storage if present
    let imageUrl: string | null = null;
    if (file) {
      const ext = file.mimetype.split('/')[1];
      const storagePath = `${userId}/${Date.now()}.${ext}`;
      const { error: storageError } = await supabaseAdmin.storage
        .from('advisory-images')
        .upload(storagePath, file.buffer, { contentType: file.mimetype, upsert: false });

      if (storageError) {
        console.error('[Storage] Upload error:', storageError.message);
        // Non-fatal — continue without image URL
      } else {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('advisory-images')
          .getPublicUrl(storagePath);
        imageUrl = publicUrlData.publicUrl;
      }
    }

    // Insert advisory into Supabase
    const { data: advisory, error: dbError } = await supabaseAdmin
      .from('advisories')
      .insert({
        user_id: userId,
        field_id: fieldId ?? null,
        crop_type: cropType,
        growth_stage: growthStage ?? null,
        symptoms_description: symptomsDescription,
        severity_rating: severityRating ?? null,
        weather_conditions: weatherConditions ?? null,
        image_url: imageUrl,
        diagnosis: diagnosis.diagnosis,
        confidence_score: diagnosis.confidenceScore,
        severity_level: diagnosis.severityLevel,
        organic_treatments: diagnosis.organicTreatments,
        chemical_treatments: diagnosis.chemicalTreatments,
        preventative_measures: diagnosis.preventativeMeasures,
        estimated_economic_impact: diagnosis.estimatedEconomicImpact ?? null,
      })
      .select('*, fields(*)')
      .single();

    if (dbError) {
      console.error('[DB] Insert error:', dbError.message);
      res.status(500).json({ error: 'Failed to save advisory', details: dbError.message });
      return;
    }

    res.status(201).json({ advisory });
  } catch (err) {
    console.error('[createAdvisory]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/advisories
export async function getAdvisories(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize as string) || 10));
    const cropType = req.query.cropType as string | undefined;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabaseAdmin
      .from('advisories')
      .select('*, fields(*)', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (cropType) {
      query = query.eq('crop_type', cropType);
    }

    const { data, error, count } = await query;

    if (error) {
      res.status(500).json({ error: 'Failed to fetch advisories', details: error.message });
      return;
    }

    res.json({
      advisories: data ?? [],
      pagination: {
        page,
        pageSize,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      },
    });
  } catch (err) {
    console.error('[getAdvisories]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/advisories/:id
export async function getAdvisory(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('advisories')
      .select('*, fields(*)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      res.status(404).json({ error: 'Advisory not found' });
      return;
    }

    res.json({ advisory: data });
  } catch (err) {
    console.error('[getAdvisory]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
