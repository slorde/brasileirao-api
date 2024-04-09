const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = {
  "type": "service_account",
  "project_id": "fsoft-br-bb5d4",
  "private_key_id": "d9e1bb13ed220e2d43edc912b04b14683693e590",
  "private_key": process.env.FIREBASE_PRIVATE_KEY, 
  "client_email": "firebase-adminsdk-kmeba@fsoft-br-bb5d4.iam.gserviceaccount.com",
  "client_id": "111074922085515429940",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kmeba%40fsoft-br-bb5d4.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

initializeApp({
  credential: cert(serviceAccount)
});

export default getFirestore();