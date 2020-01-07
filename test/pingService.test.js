const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

//const Server = require('../models/server');
var Server;
try {
    var mongoose = require('mongoose');
    Server = mongoose.model('Servers')
} catch (error) {
    Server = require('../models/server');
}

// Set Mock for MongoDB
var MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
let mongoServer;

var pingService = require('../services/pingService')

describe("pingService", function () {
          
    var server = new Server({
        serverId: "1sec",
        serverName: "1sec",
        timeout: 1000,
        phoneNumber: "+12345678",
        isTemp:true
    })

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
            Server.deleteMany({isTemp:true}, function(err) {
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
        // Arrange
        await server.save();
        
        // Act
        var handled = await pingService.handlePing(server.serverId);

        // Assert        
        expect(handled).to.equal("Handled")
        let isNotified = false;
        pingService.send_notification = (serverId)=>{
            isNotified = true;
        }

        var waitForTimeout = new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve();
            }, server.timeout + 500);
        });
    
        await waitForTimeout;
    
        expect(isNotified).to.equal(true);
    })

    it("should check unsaved server", async function () {
        // Arrange    

        // Act & Assert
        await expect( pingService.handlePing(server.serverId)).to.be.rejectedWith("Server Not Found Error")

    })

})