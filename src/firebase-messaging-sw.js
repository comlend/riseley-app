importScripts('./build/sw-toolbox.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');


var config = {
    apiKey: "AIzaSyA4sBMDqCbQPeaCQ5L3xItosjDeW1Q4t28",
    authDomain: "riseley-st.firebaseapp.com",
    databaseURL: "https://riseley-st.firebaseio.com",
    projectId: "riseley-st",
    storageBucket: "riseley-st.appspot.com",
    messagingSenderId: "257675727271"
};
firebase.initializeApp(config);


/* firebase.initializeApp({
   // get this from Firebase console, Cloud messaging section
   messagingSenderId: "587368411111"
}); */

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
   console.log('[firebase-messaging-sw.js] Received background message ', payload);
   // Customize notification here
   const notificationTitle = 'Background Message Title';
   const notificationOptions = {
      body: 'Background Message body.',
      icon: 'assets/imgs/icon.png'
   };

   return self.registration.showNotification(notificationTitle, notificationOptions);
});