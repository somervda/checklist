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
    // Wait for confirmation of checklist addition in the toastr
    cy.contains("Checklist Created");
  });

  it("02 Add checklists item", () => {
    cy.get("#addChecklistsItem").click();
    cy.get("#prompt").type("Generated Item");
    cy.get("#description").within(() => {
      cy.get(".ngx-editor-textarea").type(
        "Lorem ipsum cursus class urna nibh purus ."
      );
    });
    cy.get("#resultType").select("1");
    cy.get("#headerRightButton").click();
    cy.contains("ChecklistItem Created");
  });

  it("-- Logout --", () => {
    cy.logout();
  });
});
