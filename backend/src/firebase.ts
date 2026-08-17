import { initializeApp, cert } from "firebase-admin/app";
import serviceAccount from "@/.firebase/firebase-adminsdk.json" with { type: "json" };

const firebaseApp = initializeApp({
  credential: cert(JSON.stringify(serviceAccount)),
});

export { firebaseApp };
