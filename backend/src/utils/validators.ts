import { z } from 'zod';

// Newsletter subscription schema
export const newsletterSubscriptionSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().max(255).optional(),
  source: z.string().max(255).optional(),
});

export type NewsletterSubscription = z.infer<typeof newsletterSubscriptionSchema>;

// Email validation helper
export function isValidEmail(email: string): boolean {
  return newsletterSubscriptionSchema.shape.email.safeParse(email).success;
}

// Sanitize input (basic XSS prevention)
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 1000); // Limit length
}
