const mongoose = require('mongoose');

const ServerSchema = mongoose.Schema({
    serverId: String,
    timeout: Number,
    phoneNumber: String,
    latestPingTime: Date,
    latestStartTime: Date,
    latestClearedTime: Date,
    latedTimeoutTime: Date,
    currentStatus: String

})

module.exports = mongoose.model('Servers', ServerSchema);