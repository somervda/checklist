context("Update existing checklist", () => {
  let now = new Date();
  const checklistTitlePrefix = "AAA - For E2E :";
  const checklistItemPrefix = "AAAAA :";

  it("-- Login --", () => {
    cy.login(Cypress.env("testuser"), Cypress.env("password"));
  });

  it("01 Update existing checklist", () => {
    // Go Home
    cy.get("#navHome").click();
    cy.contains("Streamline tasks with checklists");
    // Load my checklists
    cy.get("#navChecklists").click();
    cy.get("#navMyChecklists").click();

    cy.contains(checklistTitlePrefix).click();

    // Check for checklist and checklist item to display
    cy.url().should("include", "checklist/iqGoFXFTdZKtrQG3EZD9");
    cy.contains(checklistItemPrefix);

    // Go to designer
    cy.get("#headerRightButton").click();
    cy.get("#title").type("{selectall}" + checklistTitlePrefix + " " + now);
    cy.get("#description").within(() => {
      cy.get(".ngx-editor-textarea").type(
        "{selectall}Checklist Description: " + now
      );
    });
    // go to item designer and process description update
    cy.contains(checklistItemPrefix).click();
    cy.url().should("include", "checklistitemdesigner");
    cy.get("#prompt").type("{selectall}" + checklistItemPrefix + " " + now);
    cy.get("#description").within(() => {
      cy.get(".ngx-editor-textarea").type(
        "{selectall}Item Description : " + now
      );
    });
    // Go to the checklist and verify all fields are updated

    cy.get("#navChecklists").click();
    cy.get("#navMyChecklists").click();

    cy.contains(checklistTitlePrefix).click();
    cy.wait(1000);
    cy.contains(checklistTitlePrefix + " " + now); // Title
    cy.contains("Checklist Description: " + now); // CL desc
    cy.get("#itemDropdownToggle").click(); // open item details
    cy.contains(checklistItemPrefix + " " + now); // Item prompt
    cy.contains("Item Description : " + now); // Item Desc
  });

  it("-- Logout --", () => {
    cy.logout();
  });
});
