// use server'
'use server';
/**
 * @fileOverview Generates a poem from an uploaded image, incorporating sentiment analysis.
 *
 * - generatePoemFromImage - A function that handles the poem generation process.
 * - GeneratePoemFromImageInput - The input type for the generatePoemFromImage function.
 * - GeneratePoemFromImageOutput - The return type for the generatePoemFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePoemFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to inspire the poem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GeneratePoemFromImageInput = z.infer<typeof GeneratePoemFromImageInputSchema>;

const SentimentSchema = z.object({
  sentiment: z.string().describe('The sentiment of the image, e.g., positive, negative, neutral.'),
});

const PoemSchema = z.object({
  poem: z.string().describe('A poem inspired by the image.'),
});

export type GeneratePoemFromImageOutput = z.infer<typeof PoemSchema>;

export async function generatePoemFromImage(input: GeneratePoemFromImageInput): Promise<GeneratePoemFromImageOutput> {
  return generatePoemFromImageFlow(input);
}

const analyzeSentiment = ai.defineTool(
  {
    name: 'analyzeSentiment',
    description: 'Analyzes the sentiment of an image.',
    inputSchema: z.object({
      photoDataUri: z
        .string()
        .describe(
          "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
    outputSchema: SentimentSchema,
  },
  async input => {
    // Placeholder implementation for sentiment analysis
    //In a real application, this would call an external sentiment analysis service.
    console.log('Performing sentiment analysis on image...');
    return {sentiment: 'positive'}; // Replace with actual sentiment analysis result
  }
);

const poemPrompt = ai.definePrompt({
  name: 'poemPrompt',
  input: {schema: GeneratePoemFromImageInputSchema},
  output: {schema: PoemSchema},
  tools: [analyzeSentiment],
  prompt: `You are a poet laureate. Given an image, you will write a poem inspired by the image's content, style, and overall feeling.

  First, use the analyzeSentiment tool to determine the sentiment of the image.

  Then, write a poem that reflects the image and its sentiment.

  Image: {{media url=photoDataUri}}
  `,
});

const generatePoemFromImageFlow = ai.defineFlow(
  {
    name: 'generatePoemFromImageFlow',
    inputSchema: GeneratePoemFromImageInputSchema,
    outputSchema: PoemSchema,
  },
  async input => {
    const {output} = await poemPrompt(input);
    return output!;
  }
);
