// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("login", (email, password) => {
  cy.visit("login", {
    onBeforeLoad: win => {
      win.sessionStorage.clear();
    }
  });
  cy.get("#inputEmail").type(email);
  cy.get("#inputPassword").type(password);
  cy.get("#btnLogin").click();
  cy.get("#dropdownSignedIn");
  // wait for checklists to be rendered before going back home
  cy.contains("Test template");
  cy.get("#navHome").click();
});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
