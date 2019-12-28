const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ServerSchema = new Schema({
    serverId: String,
    serverName: String,
    timeout: Number,
    phoneNumber: String,
    latestPingTime: Date,
    latestStartTime: Date,
    latestClearedTime: Date,
    latestTimeoutTime: Date,
    currentStatus: String,
    isTemp: Boolean 
})

module.exports = mongoose.model('Servers', ServerSchema);