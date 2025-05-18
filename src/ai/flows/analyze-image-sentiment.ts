'use server';

/**
 * @fileOverview A flow for analyzing the sentiment of an image.
 *
 * - analyzeImageSentiment - A function that analyzes the sentiment of an image.
 * - AnalyzeImageSentimentInput - The input type for the analyzeImageSentiment function.
 * - AnalyzeImageSentimentOutput - The return type for the analyzeImageSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageSentimentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageSentimentInput = z.infer<typeof AnalyzeImageSentimentInputSchema>;

const AnalyzeImageSentimentOutputSchema = z.object({
  sentiment: z.string().describe('The sentiment of the image.'),
});
export type AnalyzeImageSentimentOutput = z.infer<typeof AnalyzeImageSentimentOutputSchema>;

export async function analyzeImageSentiment(input: AnalyzeImageSentimentInput): Promise<AnalyzeImageSentimentOutput> {
  return analyzeImageSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImageSentimentPrompt',
  input: {schema: AnalyzeImageSentimentInputSchema},
  output: {schema: AnalyzeImageSentimentOutputSchema},
  prompt: `Analyze the sentiment of the image.

Image: {{media url=photoDataUri}}`,
});

const analyzeImageSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeImageSentimentFlow',
    inputSchema: AnalyzeImageSentimentInputSchema,
    outputSchema: AnalyzeImageSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
