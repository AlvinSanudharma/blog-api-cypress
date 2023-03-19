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
        url: "http://localhost:3000/auth/register",
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
        url: "http://localhost:3000/auth/register",
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
  });
});
