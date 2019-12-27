var expect = require("chai").expect
const Server = require('../models/server');

// Set Mock for MongoDB
MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
let mongoServer;

var pingService = require('../services/pingService')

describe("pingService", function () {
    this.beforeEach(done=>{
        mongoServer = new MongoMemoryServer();
        mongoServer.getUri().
            then(mongoUri => {
                process.env.DB_CONNECTION = mongoUri;
                pingService.init(done);
            });
    })

    this.afterEach((done)=>{        
        try{
            const removedServer = Server.deleteMany({}, function(err, result) {
                if (err) {
                    // console.log(err);
                    done();
                } else {
                    // console.log(result);
                    done();
                }
            });
        } catch (err) {
            console.log({message: err})
        }
    })

    it("handle Ping", async function () {        
        var server = new Server({
            serverId: "61sec",
            serverName: "61sec",
            timeout: 61000,
            phoneNumber: "+12345678",
        })
        try{
            const savedServer = await server.save();
            // console.log(savedServer);
        } catch (err) {            
            console.log({message: err})
        }
        await pingService.handlePing("61sec");
    })

})