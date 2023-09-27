import 'dotenv/config';
import express from 'express';
import routes from './routes/index.js';
import { VerifyDiscordRequest } from './utils.js';

const app = express(),
{ PORT } = process.env;

// set up middleware
app.use( express.json({ verify: VerifyDiscordRequest( process.env.PUBLIC_KEY ) }));
app.use( routes );
app.listen( PORT, () => {
    console.log( `HTTP running on port ${ PORT } `);
});