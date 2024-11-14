import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { initializeApp } from "firebase/app";
import { importProvidersFrom } from "@angular/core";
import { IonicModule } from "@ionic/angular";

const firebaseConfig = {
  apiKey: "AIzaSyDPuzCSy9yzfcYqWYriNMOhWt3nrSz6BWY",
  authDomain: "car-app-ce04f.firebaseapp.com",
  projectId: "car-app-ce04f",
  storageBucket: "car-app-ce04f.appspot.com", // Make sure this ends with `.appspot.com`
  messagingSenderId: "414749857039",
  appId: "1:414749857039:web:63db688d5a4e56a8bfda7a",
  databaseURL: "https://car-app-ce04f-default-rtdb.europe-west1.firebasedatabase.app"
};

initializeApp(firebaseConfig);

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: RouteReuseStrategy, useClass: IonicRouteStrategy
    },
    importProvidersFrom(IonicModule.forRoot({innerHTMLTemplatesEnabled: true})),
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    AlertController
  ],
});
