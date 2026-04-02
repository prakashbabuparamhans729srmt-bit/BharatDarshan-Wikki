
'use server';
/**
 * @fileOverview A Genkit flow for converting article text into high-quality speech.
 *
 * - aiTextToSpeech - A function that handles the conversion of text to audio data URI.
 * - AiTextToSpeechInput - The input type for the aiTextToSpeech function.
 * - AiTextToSpeechOutput - The return type for the aiTextToSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const AiTextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  voiceName: z.string().optional().default('Algenib').describe('The name of the prebuilt voice to use.'),
});
export type AiTextToSpeechInput = z.infer<typeof AiTextToSpeechInputSchema>;

const AiTextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a WAV data URI.'),
});
export type AiTextToSpeechOutput = z.infer<typeof AiTextToSpeechOutputSchema>;

export async function aiTextToSpeech(input: AiTextToSpeechInput): Promise<AiTextToSpeechOutput> {
  return aiTextToSpeechFlow(input);
}

const aiTextToSpeechFlow = ai.defineFlow(
  {
    name: 'aiTextToSpeechFlow',
    inputSchema: AiTextToSpeechInputSchema,
    outputSchema: AiTextToSpeechOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: input.voiceName },
          },
        },
      },
      prompt: input.text,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate audio from the provided text.');
    }

    // Extract PCM data from the returned media URL (data URI)
    const pcmBase64 = media.url.substring(media.url.indexOf(',') + 1);
    const pcmBuffer = Buffer.from(pcmBase64, 'base64');

    // Convert PCM to WAV format
    const wavBase64 = await toWav(pcmBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);

/**
 * Utility to wrap PCM data into a WAV container.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
