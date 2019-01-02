context("Create new checklist", () => {
  let now = new Date();
  const checklistTitle = "Test New : " + now;

  it("-- Login --", () => {
    cy.login(Cypress.env("testuser"), Cypress.env("password"));
  });

  it("01 Add a new checklist", () => {
    cy.get("#navChecklists").click();
    cy.get("#navAddChecklist").click();
    cy.get("#title").type(checklistTitle);
    cy.get("#description").within(() => {
      cy.get(".ngx-editor-textarea").type(
        "Lorem ipsum cursus class urna nibh purus ."
      );
    });
    cy.get("#headerRightButton").click();
    //cy.contains(checklistTitle);
  });

  // it("02 Return to checklist designer via my checklists", () => {
  //   cy.get("#navChecklists").click();
  //   cy.get("#navMyChecklists").click();
  //   cy.contains("checklistTitle").click();
  // });

  it("-- Logout --", () => {
    cy.logout();
  });
});
