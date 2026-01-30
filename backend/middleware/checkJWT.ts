import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';
dotenv.config();

const audience = process.env.AUTH0_AUDIENCE;
const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL;

export const checkJWT = auth({
    audience: audience,
    issuerBaseURL: issuerBaseUrl,
    tokenSigningAlg: 'RS256'
}
);
