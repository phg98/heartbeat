const mongoose = require('mongoose');

const ServerSchema = mongoose.Schema({
    serverId: String,
    serverName: String,
    timeout: Number,
    phoneNumber: String,
    latestPingTime: Date,
    latestStartTime: Date,
    latestClearedTime: Date,
    latestTimeoutTime: Date,
    currentStatus: String

})

module.exports = mongoose.model('Servers', ServerSchema);