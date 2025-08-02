/* public/firebase-messaging-sw.js */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyACNAQy-lDMLxcF4lY94nXZaP3vYOqkBQI",
  authDomain: "mon-ecommerce-74ab1.firebaseapp.com",
  projectId: "mon-ecommerce-74ab1",
  storageBucket: "mon-ecommerce-74ab1.appspot.com",
  messagingSenderId: "64302986040",
  appId: "1:64302986040:web:2fe58ee1bbc30a9f9ac7cd",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Message reçu en arrière-plan :", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png",
  });
});
