import { Request, Response } from 'express';
import { createFieldSchema } from '../schemas/advisory.schema.js';
import { supabaseAdmin } from '../lib/supabase.js';

// GET /api/fields
export async function getFields(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    const { data, error } = await supabaseAdmin
      .from('fields')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'Failed to fetch fields', details: error.message });
      return;
    }

    res.json({ fields: data ?? [] });
  } catch (err) {
    console.error('[getFields]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/fields
export async function createField(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    const parseResult = createFieldSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Validation failed', details: parseResult.error.flatten() });
      return;
    }

    const fieldData = parseResult.data;

    const { data, error } = await supabaseAdmin
      .from('fields')
      .insert({ ...fieldData, user_id: userId })
      .select('*')
      .single();

    if (error) {
      res.status(500).json({ error: 'Failed to create field', details: error.message });
      return;
    }

    res.status(201).json({ field: data });
  } catch (err) {
    console.error('[createField]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /api/fields/:id
export async function deleteField(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Verify ownership first
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('fields')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existing) {
      res.status(404).json({ error: 'Field not found or access denied' });
      return;
    }

    const { error: deleteError } = await supabaseAdmin
      .from('fields')
      .delete()
      .eq('id', id);

    if (deleteError) {
      res.status(500).json({ error: 'Failed to delete field', details: deleteError.message });
      return;
    }

    res.status(200).json({ message: 'Field deleted successfully' });
  } catch (err) {
    console.error('[deleteField]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
