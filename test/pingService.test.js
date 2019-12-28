var expect = require("chai").expect
//const Server = require('../models/server');
var Server;
try {
    var mongoose = require('mongoose');
    Server = mongoose.model('Servers')
} catch (error) {
    Server = require('../models/server');
}

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
            const removedServer = Server.deleteMany({isTemp:true}, function(err, result) {
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
            serverId: "5sec",
            serverName: "5sec",
            timeout: 5000,
            phoneNumber: "+12345678",
            isTemp:true
        })
        try{
            const savedServer = await server.save();
            // console.log(savedServer);
        } catch (err) {            
            console.log({message: err})
        }
        await pingService.handlePing("5sec");
    })

})