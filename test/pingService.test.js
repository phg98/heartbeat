var expect = require("chai").expect
var pingService = require('../services/pingService')

describe("pingService", function () {
    this.beforeEach(done=>{
        pingService.init();
        done();
    })
    this.afterEach(()=>{
        pingService.end();
    })
    it("handle Ping", function (done) {
        pingService.handlePing("61sec");
        done();
    })

})