import serverless from 'serverless-http';
import { app } from '../../api.js';

export const handler = serverless(app, { basePath: '/.netlify/functions' });
