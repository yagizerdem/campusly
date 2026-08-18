import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import serviceAccount from "@/.firebase/firebase-adminsdk.json" with { type: "json" };

const firebaseApp = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

export { firebaseApp };
