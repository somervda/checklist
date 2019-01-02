import { createYield } from "typescript";

context("Actions", () => {

    beforeEach(() => {
        cy.login("test02@comcast.net", "password");
      })


  it("Test02 user lands on My Communities page", () => {
    cy.contains("My Communities");
  });
});
