context("Actions", () => {
  cy.visit("http://localhost:4200");

  // Check home page is rendered

  it("ourChecklist started and shows home page", () => {
    cy.contains("Streamline tasks with checklists.");
  });

  it("signup login is clickable and login page is shown", () => {
    cy.get("#navUserSignupLogin").click();
    cy.contains("h4", "Login");
  });
});
