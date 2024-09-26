describe("Login Form", () => {
  it("logs us into the application", () => {
    cy.visit("/")

    cy.get(".ButtonGroup__GroupElement-sc-1vz6lai-0 > :nth-child(1)").click()

    cy.get('[for="email-input"] > [data-testid="input-component"]')
      .click()
      .type("user@test.com")

    cy.get('[for="password-input"] > [data-testid="input-component"]')
      .click()
      .type("123")

    cy.get(".Button__SubmitButton-sc-rsr8vc-4").click()

    cy.url().should("include", "/main")
  })
})
