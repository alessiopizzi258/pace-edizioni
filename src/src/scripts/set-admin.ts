// scripts/set-admin.ts
import * as admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const UID = 'Zq8BPXj0mLhRxWcZ8CRF5iw16ta2'; // lo trovi in Authentication → Users

async function main() {
  await admin.auth().setCustomUserClaims(UID, { admin: true });
  console.log('✓ Custom claim admin impostato');
  process.exit(0);
}

main();