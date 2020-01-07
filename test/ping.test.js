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

describe("ping", function () {
    
    var data = {
        serverId: "5sec",
        serverName: "5sec",
        timeout: 5000,
        phoneNumber: "+12345678",
        isTemp:true
    };

    it("should err when no server", function (done) {
        request(app).get("/ping/server_not_exists")
            .expect(404)
            .end(done);
    })
    
    // it("should show user", function (done) {
    //     request(app).get("/users")
    //         .expect(200)
    //         .expect((res)=> {console.log(res.body);chai_expect(res.body[0]).to.be.an('Object').that.includes({serverId: "5sec"})})
    //         .end(done)
    // })

    // it("should delete user", function (done) {
    //     // Arrange
    //     // 이미 저장된 데이터가 1개 있으니 이것을 지우자.

    //     // Act
    //     request(app).delete("/users/"+data.serverId)
    //         .expect(200)
    //         .end(() => {

    //             // Assert        
    //             request(app).get("/users")
    //                 .expect(200)
    //                 .expect((res)=> {
    //                     chai_expect(res.body).to.be.empty;
    //                 })
    //                 .end(done)
    //         })
    // })
})