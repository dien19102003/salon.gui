'use server';

/**
 * @fileOverview A Genkit flow that suggests optimal booking times for appointments based on stylist availability and resource allocation.
 *
 * - suggestOptimalTimes - A function that suggests optimal booking times.
 * - SuggestOptimalTimesInput - The input type for the suggestOptimalTimes function.
 * - SuggestOptimalTimesOutput - The return type for the suggestOptimalTimes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalTimesInputSchema = z.object({
  serviceType: z.string().describe('The type of hair service requested (e.g., haircut, coloring).'),
  stylistId: z.string().describe('The ID of the stylist selected for the appointment.'),
  preferredDay: z.string().describe('The preferred day for the appointment (YYYY-MM-DD).'),
  preferredTime: z.string().optional().describe('The preferred time of day (e.g., morning, afternoon, evening).'),
  durationMinutes: z.number().describe('The duration of the service in minutes.'),
});
export type SuggestOptimalTimesInput = z.infer<typeof SuggestOptimalTimesInputSchema>;

const SuggestOptimalTimesOutputSchema = z.object({
  suggestedTimes: z.array(z.string()).describe('An array of suggested appointment times (HH:mm).'),
  reasoning: z.string().describe('The reasoning behind the suggested times.'),
});
export type SuggestOptimalTimesOutput = z.infer<typeof SuggestOptimalTimesOutputSchema>;

export async function suggestOptimalTimes(input: SuggestOptimalTimesInput): Promise<SuggestOptimalTimesOutput> {
  return suggestOptimalTimesFlow(input);
}

const suggestOptimalTimesPrompt = ai.definePrompt({
  name: 'suggestOptimalTimesPrompt',
  input: {schema: SuggestOptimalTimesInputSchema},
  output: {schema: SuggestOptimalTimesOutputSchema},
  prompt: `You are an AI assistant that suggests optimal booking times for a hair salon appointment.

  Given the following information, suggest three available appointment times on the preferred day, taking into account stylist availability and service duration.
  Explain your reasoning for the suggested times.

  Service Type: {{{serviceType}}}
  Stylist ID: {{{stylistId}}}
  Preferred Day: {{{preferredDay}}}
  Preferred Time: {{{preferredTime}}}
  Duration: {{{durationMinutes}}} minutes
  
  Format the suggested times as HH:mm.  Return reasoning for your choices.
  `,
});

const suggestOptimalTimesFlow = ai.defineFlow(
  {
    name: 'suggestOptimalTimesFlow',
    inputSchema: SuggestOptimalTimesInputSchema,
    outputSchema: SuggestOptimalTimesOutputSchema,
  },
  async input => {
    const {output} = await suggestOptimalTimesPrompt(input);
    return output!;
  }
);
