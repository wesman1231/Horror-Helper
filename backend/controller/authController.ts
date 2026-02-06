import { type Request, type Response } from "express";
import { ManagementClient } from "auth0";
import dotenv from "dotenv";

dotenv.config();

/**
 * Auth0 Management Client
 *
 * Used to interact with the Auth0 Management API.
 * Requires a Machine-to-Machine application with proper scopes:
 * - read:users
 * - update:users
 */
const client = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_MGMT_CLIENT_ID!,
  clientSecret: process.env.AUTH0_MGMT_CLIENT_SECRET!
});

/**
 * Resend Verification Email
 *
 * This endpoint:
 * 1. Accepts an email address from the request body
 * 2. Searches Auth0 for a user with that email
 * 3. Retrieves the associated user_id
 * 4. Triggers a new email verification email via Auth0
 *
 * Expected request body:
 * {
 *   "email": "user@example.com"
 * }
 *
 * Possible responses:
 * - 200: Verification email sent successfully
 * - 404: No user found or user_id missing
 * - 500: Internal server error
 */
export async function resendVerification(req: Request, res: Response) {
  try {
    // Extract email from request body
    const email = req.body.email;

    // Query Auth0 users by email
    const response = await client.users.list({
      q: `email:"${email}"`,
      search_engine: "v3"
    });

    const users = response.data;

    // No user found with the provided email
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No user found with that email" });
    }

    // Use the first matched user
    const userID = users[0].user_id;

    // Sanity check — should never happen, but protects against malformed data
    if (!userID) {
      return res.status(404).json({ error: "User ID not found" });
    }

    // Trigger Auth0 to resend the verification email
    await client.jobs.verificationEmail.create({
      user_id: userID,
      client_id: process.env.AUTH0_CLIENT_ID
    });

    return res.status(200).json({
      message: "Verification email sent successfully"
    });
  } catch (error) {
    // Log unexpected errors for debugging
    console.error(error);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
}
