'use server';
/**
 * @fileOverview Provides AI-powered voice search functionality.
 *
 * - aiVoiceSearchContent - A function that handles voice search, converting audio to text
 *   and then identifying search terms to return simulated search results.
 * - AiVoiceSearchContentInput - The input type for the aiVoiceSearchContent function.
 * - AiVoiceSearchContentOutput - The return type for the aiVoiceSearchContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const AiVoiceSearchContentInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. The MIME type should correspond to the audio format, e.g., 'audio/webm'."
    ),
});
export type AiVoiceSearchContentInput = z.infer<typeof AiVoiceSearchContentInputSchema>;

const AiVoiceSearchContentOutputSchema = z.object({
  queryText: z.string().describe('The transcribed text from the voice command.'),
  results: z.string().describe('Simulated search results based on the query text, identifying states, districts, or points of interest.'),
});
export type AiVoiceSearchContentOutput = z.infer<typeof AiVoiceSearchContentOutputSchema>;

export async function aiVoiceSearchContent(input: AiVoiceSearchContentInput): Promise<AiVoiceSearchContentOutput> {
  return aiVoiceSearchContentFlow(input);
}

const identifySearchTermsPrompt = ai.definePrompt({
  name: 'identifySearchTermsPrompt',
  input: { schema: z.object({ queryText: z.string() }) },
  output: { schema: AiVoiceSearchContentOutputSchema.pick({ results: true }) },
  prompt: `The user has spoken the following query: "{{queryText}}".
  
  Your task is to identify any Indian states, districts, or specific points of interest mentioned in the query.
  Based on these identified terms, provide a simulated search result.
  
  If a state, district, or point of interest is clearly mentioned, acknowledge it and suggest what kind of information would be found.
  If the query is too vague, indicate that and suggest clarifying.
  
  Examples:
  - Query: "Tell me about Uttar Pradesh"
    Result: "Searching for information about the state of Uttar Pradesh. You would find details on its geography, culture, famous places like Varanasi and Agra, and local cuisine."
  - Query: "Find places in Jaipur"
    Result: "Searching for points of interest within the district of Jaipur, Rajasthan. This might include Amber Fort, Hawa Mahal, Jantar Mantar, and local markets."
  - Query: "What is the Taj Mahal?"
    Result: "Searching for information about the Taj Mahal, a famous point of interest in Agra, Uttar Pradesh. You would find its history, architectural details, and visitor information."
  - Query: "I want to travel to Kerala"
    Result: "Searching for travel information about the state of Kerala. This could include backwater tours, beaches, hill stations, and cultural experiences."
  - Query: "Where is Mumbai"
    Result: "Searching for information about the city and district of Mumbai, Maharashtra. This would include its status as a major financial hub, Bollywood, historical sites, and local transport."
  - Query: "Search for tourist spots"
    Result: "Your query '{{queryText}}' is a bit vague. Please specify a state, district, or a more specific type of place you're interested in, like 'tourist spots in Goa' or 'historical places in Delhi'."
  
  Provide only the simulated search results as a string.
  `,
});

const aiVoiceSearchContentFlow = ai.defineFlow(
  {
    name: 'aiVoiceSearchContentFlow',
    inputSchema: AiVoiceSearchContentInputSchema,
    outputSchema: AiVoiceSearchContentOutputSchema,
  },
  async (input) => {
    // 1. Convert audio to text using STT model
    const audioPart = {
      media: {
        url: input.audioDataUri,
        // The contentType needs to be extracted from the data URI or assumed based on common types.
        // The data URI format is 'data:<mimetype>;base64,<encoded_data>'
        contentType: input.audioDataUri.substring(
          input.audioDataUri.indexOf(':') + 1,
          input.audioDataUri.indexOf(';')
        ),
      },
    };

    const sttResponse = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-stt'),
      prompt: [audioPart],
      config: {
        responseModalities: ['TEXT'],
      },
    });

    const queryText = sttResponse.text;
    if (!queryText) {
      throw new Error('Failed to transcribe audio to text.');
    }

    // 2. Use another prompt to identify search terms and simulate results
    const { output } = await identifySearchTermsPrompt({ queryText });

    return {
      queryText,
      results: output!.results,
    };
  }
);
