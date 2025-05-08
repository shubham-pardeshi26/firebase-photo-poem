'use server';

import { generatePoem, GeneratePoemInput, GeneratePoemOutput } from '@/ai/flows/generate-poem';
import { z } from 'zod';

const GeneratePoemActionInputSchema = z.object({
  photoDataUri: z.string().refine(
    (uri) => uri.startsWith('data:image/') && uri.includes(';base64,'),
    { message: "Invalid image data URI format. Must be a base64 encoded image." }
  ),
});

export async function generatePoemAction(input: GeneratePoemInput): Promise<GeneratePoemOutput> {
  const validationResult = GeneratePoemActionInputSchema.safeParse(input);

  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors.map(e => e.message).join(', ');
    console.error("Validation failed:", errorMessages);
    throw new Error(`Invalid input: ${errorMessages}`);
  }

  try {
    const output = await generatePoem(validationResult.data);
    return output;
  } catch (error) {
    console.error("Error in generatePoemAction:", error);
    // It's good practice to not expose internal error details to the client.
    // Log the detailed error on the server and return a generic message.
    throw new Error('Failed to generate poem. Please try again.');
  }
}
