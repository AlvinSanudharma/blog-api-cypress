describe("Auth module", () => {
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
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq("Bad Request");
        expect("name should not be empty").to.be.oneOf(response.body.message);
        expect("email should not be empty").to.be.oneOf(response.body.message);
        expect("password should not be empty").to.be.oneOf(
          response.body.message
        );
      });
    });

    it("should return error message for invalid email format", () => {
      cy.request({
        method: "POST",
        url: "/auth/register",
        body: {
          name: "John Doe",
          email: "john @nest.test",
          password: "Secret_123",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq("Bad Request");
        expect("email must be an email").to.be.oneOf(response.body.message);
      });
    });

    it("should return error message for invalid password format", () => {
      cy.request({
        method: "POST",
        url: "/auth/register",
        body: {
          name: "John Doe",
          email: "john@nest.test",
          password: "invalidpassword",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq("Bad Request");
        expect("password is not strong enough").to.be.oneOf(
          response.body.message
        );
      });
    });

    it("should successfully registered", () => {
      cy.resetUsers();

      cy.request({
        method: "POST",
        url: "/auth/register",
        body: {
          name: "John Doe",
          email: "john@nest.test",
          password: "Secret_123",
        },
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
        body: {
          name: "John Doe",
          email: "john@nest.test",
          password: "Secret_123",
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.log(response);

        expect(response.status).to.eq(500);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.eq("Email already exists");
      });
    });
  });
});
