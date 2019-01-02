import { createYield } from "typescript";

context("Actions", () => {
  beforeEach(() => {
    cy.login("test02@comcast.net", "password");
  });

  let now = new Date();
  const checklistTitle = "Test New : " + now;

  it("01 Create a new checklist", () => {
    cy.get("#navChecklists").click();
    cy.get("#navAddChecklist").click();
    cy.get("#title").type(checklistTitle);
    cy.get(".ngx-editor-textarea").type(
      "Lorem ipsum cursus class urna nibh purus ."
    );
    cy.get("button.float-right").click();
  });
});
