/**
 * Firebase configuration and single initialization.
 * Load this script AFTER Firebase SDK scripts (firebase-app-compat, firebase-auth-compat, firebase-analytics-compat).
 * Ensures Firebase is initialized only once and exposes firebaseAuth + RecaptchaVerifier globally.
 */
(async function () {
  'use strict';
  if (typeof firebase === 'undefined') {
    console.warn('Firebase SDK not loaded. Load firebase-app-compat.js and firebase-auth-compat.js first.');
    return;
  }

  try {
    const res = await fetch('/api/config');
    const config = await res.json();

    var firebaseConfig = {
      apiKey: config.FIREBASE_API_KEY,
      authDomain: config.FIREBASE_AUTH_DOMAIN,
      projectId: config.FIREBASE_PROJECT_ID,
      storageBucket: config.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
      appId: config.FIREBASE_APP_ID,
      measurementId: config.FIREBASE_MEASUREMENT_ID
    };

    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
      if (typeof firebase.analytics === 'function') {
        firebase.analytics();
      }
    }

    window.firebaseAuth = firebase.auth();
    window.RecaptchaVerifier = firebase.auth.RecaptchaVerifier;
    window.dispatchEvent(new Event('firebaseReady'));
  } catch (err) {
    console.error("Failed to load Firebase config from backend", err);
  }
})();
