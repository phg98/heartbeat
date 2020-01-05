var request = require("supertest")
var chai_expect = require("chai").expect
var app;

before(async () => {
    // Set Mock for MongoDB
    const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
    const mongoServer = new MongoMemoryServer();
    const uri = await mongoServer.getUri();
    process.env.DB_CONNECTION = uri;
    app = require('../app')
})

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

    it("should empty when start", function (done) {
        request(app).get("/users")
            .expect(200)
            .expect((res)=> {console.log(res.body);chai_expect(res.body).to.be.empty})
            .end(done)
    })

    it("should add user", function (done) {
        request(app).post("/users")
            .send(data)
            .expect(200)
            .expect((res)=> {chai_expect(res.body).to.be.an('Object').that.includes({serverId: "5sec"})})
            .end(done);
    })
    
    it("should show user", function (done) {
        request(app).get("/users")
            .expect(200)
            .expect((res)=> {console.log(res.body);chai_expect(res.body[0]).to.be.an('Object').that.includes({serverId: "5sec"})})
            .end(done)
    })

    it("should delete user", function (done) {
        // Arrange
        // 이미 저장된 데이터가 1개 있으니 이것을 지우자.

        // Act
        request(app).delete("/users/"+data.serverId)
            .expect(200)
            .end(() => {

                // Assert        
                request(app).get("/users")
                    .expect(200)
                    .expect((res)=> {
                        chai_expect(res.body).to.be.empty;
                    })
                    .end(done)
            })
    })
})