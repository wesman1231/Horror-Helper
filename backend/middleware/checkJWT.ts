import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';
dotenv.config();

const audience = process.env.AUTH0_AUDIENCE;
const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL;

if (!audience || !issuerBaseUrl) {
    throw new Error("Missing AUTH0_AUDIENCE or AUTH0_ISSUER_BASE_URL in environment variables.");
}

export const checkJWT = auth({
    audience: audience,
    issuerBaseURL: issuerBaseUrl,
    tokenSigningAlg: 'RS256'
});
