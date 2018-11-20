// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auth0: {
    domain: "mychecklist.auth0.com",
    clientId: "TNSMyB1IDKZsHDO3RM0Mq4GfSY4fzYW1",
    // Only use callbackURL to force a callback to a specific URL
    // it is more flexable to leave it blank and have it redirect automatically
    // to the calling URL - DAS 30Oct18
    callbackURL: "",
    apiNameSpace: "https://ourCheckLists.com",
    audience: "https://api.ourCheckLists.com"
  },
  // url of the checklists rest api services in the cloud
  clapiurl: "http://somerville.noip.me:3000"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
