import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://oauth2.googleapis.com/auth",
  token_uri: "https://oauth2.googleapis.com/token",
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const admin = {
  auth: () => getAuth(),
};

export default admin;
