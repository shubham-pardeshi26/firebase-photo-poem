import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const googleAiPlugin = googleAI({apiKey: process.env.GOOGLE_API_KEY});

export const ai = genkit({
  plugins: [googleAiPlugin],
  model: 'googleai/gemini-2.0-flash',
});
