const getInputByLabel = (label) => {
  return cy
    .contains('label', label)
    .invoke('attr', 'for')
    .then((id) => {
      cy.get('#' + id)
    })
}

describe("Essentials", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/login");
  })

  it("Visits the login", () => {
    cy.contains("span", "Welcome to Therapist Scheduler");
    cy.contains("label", "Email");
    cy.contains("label", "Password");
  });

  describe("registration", () => {
    beforeEach(() => {
      cy.contains("button", "Register").click();
    })

    it("Switches to register", () => {
      cy.contains("label", "Username");
      cy.contains("label", "Email");
      cy.contains("label", "Password");
      cy.contains("label", "Role");
    });

    it("switches back after registration", () => {
      getInputByLabel('Username').type('someone');
      getInputByLabel('Email').type('someone@example.com');
      getInputByLabel('Password').type('password');
      cy.get('[data-cy="role"]').type('Client');
      getInputByLabel('Password').click();
      cy.contains("button", "Submit").click();
      
      cy.contains("span", "Welcome to Therapist Scheduler");
      cy.contains("label", "Email");
      cy.contains("label", "Password");
    });
  })
});
