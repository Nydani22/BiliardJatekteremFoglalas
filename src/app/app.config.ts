import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "biliardip-e7351", appId: "1:342167973925:web:5d70469afb9a3e2bb4cfcc", storageBucket: "biliardip-e7351.firebasestorage.app", apiKey: "AIzaSyDT2JqacvYjGNkkFM-p3qfHf21EfVV9by4", authDomain: "biliardip-e7351.firebaseapp.com", messagingSenderId: "342167973925", measurementId: "G-7MQNCMK4DW" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
