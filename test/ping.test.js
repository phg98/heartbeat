process.env.NODE_ENV = process.env.NODE_ENV || 'test'
var request = require("supertest")
const chai = require("chai")
var chai_expect = chai.expect
// chai.use(require('chai-as-promised'))
var app;
const TEST_UUID = '42345678901234567890123456789012'

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
        serverId: "1sec",
        serverName: "1sec",
        timeout: 1000,
        phoneNumber: "+12345678",
        isTemp:true
    };
    
    it("should err when no server", function (done) {
        request(app).get("/ping/server_not_exists")
            .expect(404)
            .end(done);
    })

    
    it("should activate when first ping", function (done) {
        // Arrange
        request(app).post("/users/")
        .send(data)
        .expect(200)
        .end(() => {
            // Act
            request(app).get("/ping/" + TEST_UUID)
                .expect(200)
                .end(()=>{
                    // Assert                    
                    request(app).get("/users/" + data.serverName)
                    .expect(200)
                    .expect((res)=> {
                        chai_expect(res.body[0]).to.be.an('Object').that.includes({currentStatus: "Up"})
                    })
                    .end(done)
                })
        })
    })
 
})