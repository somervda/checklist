// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auditLog: true,
  // url of the checklists rest api services in the cloud
  clapiurl: "http://somerville.noip.me:3000",
  // clapiurl: "http://localhost:3000",
  fbConfig: {
    apiKey: "AIzaSyALjgjLH0LE_8_oLogQuQn3De0eZ-ssZUw",
    authDomain: "oclist-18796.firebaseapp.com",
    databaseURL: "https://oclist-18796.firebaseio.com",
    projectId: "oclist-18796",
    storageBucket: "oclist-18796.appspot.com",
    messagingSenderId: "715462389766"

    // apiKey: "AIzaSyAO4qDVGJ84w8CyweH1BrHXnV2rEBAerwU",
    // authDomain: "cftest-7e431.firebaseapp.com",
    // databaseURL: "https://cftest-7e431.firebaseio.com",
    // projectId: "cftest-7e431",
    // storageBucket: "cftest-7e431.appspot.com",
    // messagingSenderId: "349838147336"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
