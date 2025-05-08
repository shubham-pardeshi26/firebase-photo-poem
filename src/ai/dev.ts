import {config} from 'dotenv';
// Ensure that .env is loaded before other imports which might use process.env
const result = config();
if (result.error) {
  // console.warn('Error loading .env file for Genkit dev server, falling back to environment variables if set elsewhere.', result.error.message);
  // Allow to continue if .env is not found, as variables might be set in the environment directly
}


import '@/ai/flows/generate-poem.ts';
