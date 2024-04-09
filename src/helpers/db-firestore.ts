const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = {
  "type": "service_account",
  "project_id": "fsoft-br-bb5d4",
  "private_key_id": "d9e1bb13ed220e2d43edc912b04b14683693e590",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4uPeWX9vD6Mlw\nl7MxHY+OYIF9OkWolcFyS212iVXQEaK3OobKNobNrefFWxujqNxFBV/HhkD8bcmk\n5X0BPAugev2HENjPLMFNcFtQUCyLDjRztk12urlJeNCleoFTdhNAh0tBI7E0+amx\nWovp13YNVsUgbVvVgI2uxDWEabN3jzID4v2kmSEJyJzx7qkwbU3nCpAOS8macYhg\nG+FGhuSyq02YUsTHGVpn/nZucSmjEKbiUxGYeI3M91RBGnaSsZZMKPQRPuTUUv4U\nISIDIXwpzzLyNul5ItveYcb15kwyUUyCiu+QF4E3blhRa0NslMESXhC0vwKitWkP\n8unNwEppAgMBAAECgf9KldxRW2M2WWov8og9RCFD28SxXLxuTRqCAzbz4YAAackv\n/1gYGsn+DzFsmDJD/EhruC64ew31iW/qYJzuDVktBDfRjTeXPC4mMA0VJOPGUv6F\ndfzzUZPUQWLsoT2FsVIDonseL/5l1Gj8970xUF9Arjdhk7VnQ96+MkgUSJmuTjY0\n3gAGZ+0bmgOzWUuNVOTocdt/IRRW2q9bq8Q07Q8lQDP1Cvzeap9H5dDlp5njGLFd\nQDt2m/QfE2eKu+uqOcNV0/qey4bTbByPOLW/s+jhakzTiF7XCrRqOGASvk2W178D\nEaurjVljtarm0f+EVZ/42pgynaNZFjr3D2DcLocCgYEA+qEBo/0zJjmdVdYpsR5l\nYbX/0iqLT+lZJeROtCTyN5KPzyfar1CFEW+zRfZtXuZ5t25dTV5r6Rcz2etcXu86\n/3ZjrjV3Wav3QWFHCPUWUgpM5CS3MyPgZ5/1bZmCGG4RSbSUpHodhMWVGPXZ7IkY\nMW2pSqk+gu/dyHM9zse7f4MCgYEAvK5jBrTW863sO+AsgJzSEL9Z6glDtoeR2Bew\nomnAbomWNthfnnlK/9VoF019UN2zItD4/qPH6qPb7rEzFOqs7Erv1eDMDOF8/wjf\ntGmQgmoonpy19U6K017jQEffLxAWEYdXQT9cwWXl0cfTdz146F9p0JEMgRv0U8p3\nVIOEXqMCgYEAk1kJX+JCqhyBVa+9fzZBoHqh1mvQz8B++voJE3wNM4LlLYNe3GdY\ndHHZUi6ZCowxzxgBnrT+eGF9yIbJHb9ETmDKJeelLYEesr+ARdHht4X6wr6bPmO/\nUO0IG9F+XOKJI24ZXcG1jROknrIb1yaapKS2PQDXkZ94IpsuIV3n7AUCgYBtXJ6l\nKnhUsYB1jA//U+YmMuMI1enbiGSuXbzRxn31E+ZvT6bMkf04oBc/OnjiQD4udfV8\nkq2zgNpfVXIIM6WbKCwvSaa76I6svBX92hoanTGCDc8hqi6pKRyLC51/B9HiwxF+\nDh3TMx6sIyicupK0DWmlrA0VYICTeI0F/VziBQKBgQDsvCRayGSr8phw+NuAUqgQ\nRPQ3OPBEg79t8yHLYoJWsuCeDW2BlXjv4radn5Dbx9FcpdyslqiVnE1aQE71LI4b\nHWHYntG2mP8jvHXl8IAecD6yjYAluPgGFtvir0Aifp5tFtDy5hIgebVxSOw/7C6x\nTXz177rJN/zIfLXLB1MTSQ==\n-----END PRIVATE KEY-----\n",
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