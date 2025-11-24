'use server';

import { suggestOptimalTimes, SuggestOptimalTimesInput, SuggestOptimalTimesOutput } from '@/ai/flows/intelligent-schedule-suggestions';
import { z } from 'zod';

const ActionInputSchema = z.object({
  serviceType: z.string(),
  stylistId: z.string(),
  preferredDay: z.string(),
  preferredTime: z.string().optional(),
  durationMinutes: z.number(),
});

export async function getIntelligentSuggestions(
  input: SuggestOptimalTimesInput
): Promise<{ success: boolean; data?: SuggestOptimalTimesOutput; error?: string }> {
  const validatedInput = ActionInputSchema.safeParse(input);

  if (!validatedInput.success) {
    return { success: false, error: 'Invalid input.' };
  }

  try {
    const suggestions = await suggestOptimalTimes(validatedInput.data);
    return { success: true, data: suggestions };
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    // In a real app, you might want to return a more user-friendly error
    return { success: false, error: 'Could not fetch suggestions at this time.' };
  }
}
