import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public

  // ✅ Ensure only one Firebase app instance is initialized
  let app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: config.FIREBASE_API_KEY,
        authDomain: config.FIREBASE_AUTH_DOMAIN,
        projectId: config.FIREBASE_PROJECT_ID,
        storageBucket: config.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
        appId: config.FIREBASE_APP_ID,
        measurementId: config.FIREBASE_MEASUREMENT_ID
      })

  // ✅ Initialize Firebase Authentication
  const auth = getAuth(app)

  // ✅ Ensure anonymous sign-in if no user is logged in
  if (import.meta.client) {
    onAuthStateChanged(auth, async user => {
      if (!user) {
        try {
          await signInAnonymously(auth)
          console.log('✅ Signed in anonymously.')
        } catch (error) {
          console.error(
            '❌ Anonymous sign-in failed:',
            error?.message || 'Unknown error'
          )
        }
      }
    })
  }
})
