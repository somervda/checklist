context("Actions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  // https://on.cypress.io/interacting-with-elements

  it("ourChecklist started up ", () => {
    cy.get(".card-header ").should("have.value", "Checklists");
  });
});
