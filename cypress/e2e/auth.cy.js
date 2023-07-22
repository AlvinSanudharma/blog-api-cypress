describe("Auth module", () => {
  const userData = {
    name: "John Doe",
    email: "john@nest.test",
    password: "Secret_123",
  };

  describe("Register", () => {
    /**
     * 1. error validation (null name, email and password)
     * 2. error invalid email format
     * 3. error invalid password format
     * 4. registered successfully
     * 5. error duplicate entry
     */

    it("should return error message for validation", () => {
      cy.request({
        method: "POST",
        url: "/auth/register",
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, [
          "name should not be empty",
          "email should not be empty",
          "password should not be empty",
        ]);
      });
    });

    it("should return error message for invalid email format", () => {
      cy.request({
        method: "POST",
        url: "/auth/register",
        body: {
          name: userData.name,
          email: "john @nest.test",
          password: userData.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, ["email must be an email"]);
      });
    });

    it("should return error message for invalid password format", () => {
      cy.request({
        method: "POST",
        url: "/auth/register",
        body: {
          name: userData.name,
          email: userData.email,
          password: "invalidpassword",
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, ["password is not strong enough"]);
      });
    });

    it("should successfully registered", () => {
      cy.resetUsers();

      cy.request({
        method: "POST",
        url: "/auth/register",
        body: userData,
      }).then((response) => {
        const { id, name, email, password } = response.body.data;

        expect(response.status).to.eq(201);
        expect(response.body.success).to.be.true;
        expect(id).not.to.be.undefined;
        expect(name).to.eq("John Doe");
        expect(email).to.eq("john@nest.test");
        expect(password).to.be.undefined;
      });
    });

    it("should return error because of duplicate email", () => {
      cy.request({
        method: "POST",
        url: "/auth/register",
        body: userData,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(500);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.eq("Email already exists");
      });
    });
  });
});
