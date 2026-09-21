import { google } from 'googleapis';
import { readFileSync } from 'fs';

const key = JSON.parse(
  readFileSync('./aktu-feedback-app-firebase-adminsdk-fbsvc-9bfc21f82e.json', 'utf8')
);

const jwtClient = new google.auth.JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
});

async function createDatabase() {
  await jwtClient.authorize();
  const firestore = google.firestore({ version: 'v1', auth: jwtClient });

  console.log("Creating Native Mode Firestore database 'aktu-native-db' via API...");

  try {
    const res = await firestore.projects.databases.create({
      parent: `projects/${key.project_id}`,
      databaseId: 'aktu-native-db',
      requestBody: {
        locationId: 'asia-south1',
        type: 'FIRESTORE_NATIVE'
      }
    });
    console.log("Database creation initiated:", res.data);
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
  }
}

createDatabase();
