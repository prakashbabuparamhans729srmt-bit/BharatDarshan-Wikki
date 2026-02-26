'use server';
/**
 * @fileOverview A Genkit flow for translating article content into multiple Indian languages.
 *
 * - aiTranslateArticleContent - A function that handles the content translation process.
 * - TranslateArticleContentInput - The input type for the aiTranslateArticleContent function.
 * - TranslateArticleContentOutput - The return type for the aiTranslateArticleContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslateArticleContentInputSchema = z.object({
  content: z.string().describe('The article content to be translated.'),
  targetLanguages: z.array(z.string()).describe('An array of Indian language names (e.g., "Hindi", "Bengali") to translate the content into.'),
});
export type TranslateArticleContentInput = z.infer<typeof TranslateArticleContentInputSchema>;

const TranslateArticleContentOutputSchema = z.record(z.string(), z.string()).describe('An object containing translations, with language names as keys and translated content as values.');
export type TranslateArticleContentOutput = z.infer<typeof TranslateArticleContentOutputSchema>;

export async function aiTranslateArticleContent(
  input: TranslateArticleContentInput
): Promise<TranslateArticleContentOutput> {
  return aiTranslateArticleContentFlow(input);
}

const translateSingleContentPrompt = ai.definePrompt({
  name: 'translateSingleContentPrompt',
  input: {
    schema: z.object({
      content: z.string(),
      targetLanguage: z.string(),
    }),
  },
  output: { schema: z.string() },
  prompt: `Translate the following article content into {{targetLanguage}}. Provide only the translated text, without any additional comments or formatting.\n\nContent:\n{{{content}}}\n\nTranslated into {{targetLanguage}}: `,
});

const aiTranslateArticleContentFlow = ai.defineFlow(
  {
    name: 'aiTranslateArticleContentFlow',
    inputSchema: TranslateArticleContentInputSchema,
    outputSchema: TranslateArticleContentOutputSchema,
  },
  async (input) => {
    const { content, targetLanguages } = input;
    const translations: TranslateArticleContentOutput = {};

    const translationPromises = targetLanguages.map(async (lang) => {
      const { output } = await translateSingleContentPrompt({
        content,
        targetLanguage: lang,
      });
      if (output) {
        translations[lang] = output;
      }
    });

    await Promise.all(translationPromises);

    return translations;
  }
);
