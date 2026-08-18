import { v4 as uuidv4 } from "uuid";
import { firebaseApp } from "@src/firebase.js";
import { getAuth } from "firebase-admin/auth";

const uid = uuidv4(); // Generate a unique identifier for the user

getAuth(firebaseApp)
  .createCustomToken(uid)
  .then((customToken) => {
    console.log(`${customToken}`);
  })
  .catch((error) => {
    console.error("Error creating custom token:", error);
  });
