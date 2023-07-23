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

  describe("Login", () => {
    /**
     * 1. Unauthorize on failed
     * 2. Return access token
     */

    it("should return unauthorize on failed", () => {
      cy.request({
        method: "POST",
        url: "/auth/login",
        body: {},
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorize(response);
      });

      cy.request({
        method: "POST",
        url: "/auth/login",
        body: {
          email: userData.email,
          password: "wrong password",
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorize(response);
      });
    });

    it.only("should return access token on success", () => {
      cy.request({
        method: "POST",
        url: "/auth/login",
        body: {
          email: userData.email,
          password: userData.password,
        },
      }).then((response) => {
        expect(response.body.success).to.be.true;
        expect(response.body.message).to.eq("Login success");
        expect(response.body.data.access_token).not.to.be.undefined;
      });
    });
  });
});
