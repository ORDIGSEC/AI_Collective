import { Request, Response } from 'express';
import pool from '../config/database';
import { sanitizeInput } from '../utils/validators';
import crypto from 'crypto';

export async function subscribe(req: Request, res: Response) {
  const { email, firstName, source } = req.body;

  try {
    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    const sanitizedFirstName = firstName ? sanitizeInput(firstName) : null;
    const sanitizedSource = source ? sanitizeInput(source) : null;

    // Generate verification token (for future email verification)
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Insert subscriber (ON CONFLICT DO NOTHING to handle duplicates gracefully)
    const result = await pool.query(
      `INSERT INTO newsletter_subscribers (email, first_name, source, verification_token)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET
         first_name = COALESCE(EXCLUDED.first_name, newsletter_subscribers.first_name),
         source = COALESCE(EXCLUDED.source, newsletter_subscribers.source),
         updated_at = CURRENT_TIMESTAMP
       RETURNING id, email`,
      [sanitizedEmail, sanitizedFirstName, sanitizedSource, verificationToken]
    );

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscriber: {
        id: result.rows[0].id,
        email: result.rows[0].email,
      },
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      error: 'Failed to subscribe to newsletter',
    });
  }
}
