var request = require("supertest")
var expect = require("chai").expect
var app = require('../app')

describe("homepage", function () {
    
    var data = {
        serverId: "5sec",
        serverName: "5sec",
        timeout: 5000,
        phoneNumber: "+12345678",
        isTemp:true
    };

    it("welcomes the user", function (done) {
        request(app).get("/")
            .expect(200)
            .expect(/Welcome to Express/, done)
    })

    it("should add user", function (done) {
        request(app).post("/users")
            .send(data)
            .expect(200)
            .expect((res)=> {expect(res.body).to.be.an('Object').that.includes({serverId: "5sec"})})
            .end(done);
    })
    
    it("should show user", function (done) {
        request(app).post("/users")
            .send(data)
            .expect(200)
        request(app).get("/users")
            .expect(200)
            .expect((res)=> {expect(res.body[0]).to.be.an('Object').that.includes({serverId: "5sec"})})
            .end(done)

    })
})