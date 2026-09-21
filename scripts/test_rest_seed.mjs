import { google } from 'googleapis';
import { readFileSync } from 'fs';

const key = JSON.parse(
  readFileSync('./aktu-feedback-app-firebase-adminsdk-fbsvc-9bfc21f82e.json', 'utf8')
);

const jwtClient = new google.auth.JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: ['https://www.googleapis.com/auth/datastore', 'https://www.googleapis.com/auth/cloud-platform']
});

async function seedRest() {
  await jwtClient.authorize();
  const token = jwtClient.credentials.access_token;

  console.log("Testing REST write to aktudatabase...");

  // Write a document to feedbacks collection via Firestore v1 REST API
  const url = `https://firestore.googleapis.com/v1/projects/aktu-feedback-app/databases/aktudatabase/documents/feedbacks`;
  
  const body = {
    fields: {
      authorName: { stringValue: "Abhishek Pathak" },
      authorUsername: { stringValue: "abhishek_p" },
      collegeName: { stringValue: "ITS Engineering College, Greater Noida" },
      department: { stringValue: "Computer Science" },
      category: { stringValue: "Infrastructure & Labs" },
      rating: { integerValue: "5" },
      comment: { stringValue: "The computer labs have been upgraded with high-speed internet!" },
      sentiment: { stringValue: "positive" },
      status: { stringValue: "Resolved" },
      likes: { integerValue: "15" },
      createdAt: { stringValue: new Date().toISOString() }
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const resJson = await response.json();
  console.log("REST Response:", JSON.stringify(resJson, null, 2));
}

seedRest().catch(console.error);
