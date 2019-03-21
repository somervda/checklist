context("Update existing checklist", () => {
  let now = new Date();
  const checklistTitlePrefix = "AAA - For E2E :";
  const checklistItemPrefix = "AAAAA :";

  it("-- Login --", () => {
    cy.login(Cypress.env("testuser"), Cypress.env("password"));
  });

  // Go Home
  it("01 Go home", () => {
    cy.get("#navHome").click();
    cy.contains("Streamline tasks with checklists");
  });
  // Load my checklists
  it("02 Load my checklists", () => {
    cy.get("#navChecklists").click();
    cy.get("#navMyChecklists").click();

    cy.contains(checklistTitlePrefix).click();
  });

  // Check for checklist and checklist item to display
  it("03 Open test checklist", () => {
    cy.url().should("include", "checklist/iqGoFXFTdZKtrQG3EZD9");
    cy.contains(checklistItemPrefix);
  });

  // Go to designer
  it("04 Open and update in the designer", () => {
    cy.get("#headerRightButton").click();
    cy.wait(1002);
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
  });
  // Go to the checklist and verify all fields are updated

  it("05 Title updated", () => {
    cy.get("#navChecklists").click();
    cy.get("#navMyChecklists").click();

    cy.contains(checklistTitlePrefix).click();
    cy.wait(1001);
    cy.contains(checklistTitlePrefix + " " + now); // Title
  });
  it("06 Description updated", () => {
    cy.get("#headerToggle").click(); // open checklists header to see details
    cy.contains("Checklist Description: " + now); // CL desc
  });
  it("07 Item Prompt updated", () => {
    cy.get("#itemDropdownToggle").click(); // open item details
    cy.contains(checklistItemPrefix + " " + now); // Item prompt
  });
  it("08 tem Description Updated", () => {
    cy.contains("Item Description : " + now); // Item Desc
  });

  it("-- Logout --", () => {
    cy.logout();
  });
});
