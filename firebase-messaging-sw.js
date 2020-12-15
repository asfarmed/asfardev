importScripts("https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js",
);
// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics.
importScripts(
    "https://www.gstatic.com/firebasejs/7.16.1/firebase-analytics.js",
);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    messagingSenderId: "113158931285",
    apiKey: "AIzaSyCB7p_6HRQsSB0baVdLEQHHSSmNHsfEAZQ",
    projectId: "tests-user",
    appId: "1:113158931285:web:0296fc186ff5c08926e5dc",
    
   
    
    
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload,
    );
    // Customize notification here
    const notificationTitle = "Background Message Title";
    const notificationOptions = {
        body: "Background Message body.",
        icon: "https://static.nc-img.com/ap/cdn/1047/assets/img/logos/namecheap.svg",
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions,
    );
});
