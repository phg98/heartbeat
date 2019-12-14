const mongoose = require('mongoose');

const ServerSchema = mongoose.Schema({
    serverId: String,
    timeout: Number,
    phoneNumber: String,
})

module.exports = mongoose.model('Servers', ServerSchema);