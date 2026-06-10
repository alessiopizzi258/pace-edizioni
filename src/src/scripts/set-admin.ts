// src/scripts/set-admin.ts
import * as admin from 'firebase-admin';

// Utilizziamo le variabili d'ambiente fornite dal sistema, non un file locale
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  } as admin.ServiceAccount),
});

const UID = 'Zq8BPXj0mLhRxWcZ8CRF5iw16ta2'; // lo trovi in Authentication → Users

async function main() {
  await admin.auth().setCustomUserClaims(UID, { admin: true });
  console.log('✓ Custom claim admin impostato');
  process.exit(0);
}

main();