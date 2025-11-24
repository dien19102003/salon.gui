import {nextGenkit} from '@genkit-ai/next';
import {ai} from '@/ai/genkit';
import '@/ai/dev';

export const {POST, GET} = nextGenkit(ai);
