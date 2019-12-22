var request = require("supertest")
var app = require('../app')

describe("homepage", function () {
    it("welcomes the user", function (done) {
        request(app).get("/")
            .expect(200)
            .expect(/Welcome to Express/, done)
    })
})