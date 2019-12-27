var expect = require("chai").expect
var pingService = require('../services/pingService')

describe("pingService", function () {
    this.beforeEach(done=>{
        pingService.init(done);
    })
    this.afterEach((done)=>{
        pingService.end(done);
    })
    it("handle Ping", function (done) {
        pingService.handlePing("61sec", done);
    })

})