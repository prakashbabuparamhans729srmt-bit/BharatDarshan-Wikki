'use server';
/**
 * @fileOverview A Genkit flow for refining and summarizing content, providing improvement suggestions and highlighting areas for fact-checking.
 *
 * - aiRefineAndSummarizeContent - A function that handles the content refinement and summarization process.
 * - AiRefineAndSummarizeContentInput - The input type for the aiRefineAndSummarizeContent function.
 * - AiRefineAndSummarizeContentOutput - The return type for the aiRefineAndSummarizeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiRefineAndSummarizeContentInputSchema = z.object({
  content: z.string().describe('The content of the article to be refined and summarized.'),
});
export type AiRefineAndSummarizeContentInput = z.infer<typeof AiRefineAndSummarizeContentInputSchema>;

const AiRefineAndSummarizeContentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the provided content.'),
  suggestions: z.string().describe('Suggestions for improving the content, such as clarity, conciseness, grammar, and style.'),
  factCheckAreas: z.array(z.string()).describe('A list of specific phrases or sentences that might require factual verification.'),
});
export type AiRefineAndSummarizeContentOutput = z.infer<typeof AiRefineAndSummarizeContentOutputSchema>;

export async function aiRefineAndSummarizeContent(
  input: AiRefineAndSummarizeContentInput
): Promise<AiRefineAndSummarizeContentOutput> {
  return aiRefineAndSummarizeContentFlow(input);
}

const refineAndSummarizePrompt = ai.definePrompt({
  name: 'refineAndSummarizePrompt',
  input: {schema: AiRefineAndSummarizeContentInputSchema},
  output: {schema: AiRefineAndSummarizeContentOutputSchema},
  prompt: `You are an AI content editor and summarizer.

Your task is to analyze the provided article content. First, provide a concise summary of the content. Second, offer constructive suggestions for improving the content's clarity, conciseness, grammar, and overall style. Finally, identify and list any specific phrases or sentences that appear to be factual statements or claims that would benefit from verification.

Content to analyze:

---
{{{content}}}
---`,
});

const aiRefineAndSummarizeContentFlow = ai.defineFlow(
  {
    name: 'aiRefineAndSummarizeContentFlow',
    inputSchema: AiRefineAndSummarizeContentInputSchema,
    outputSchema: AiRefineAndSummarizeContentOutputSchema,
  },
  async (input) => {
    const {output} = await refineAndSummarizePrompt(input);
    return output!;
  }
);
