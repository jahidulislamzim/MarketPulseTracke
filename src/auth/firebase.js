import { initializeApp } from "firebase/app";

const initializeFirebase = () => {
  const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
  };

  return initializeApp(firebaseConfig);
};

export default initializeFirebase;