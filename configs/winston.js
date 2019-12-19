var fs = require('fs')
var winston = require('winston')

const logDir = __dirname + '/../logs'

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

const infoTransport = new winston.transports.File({
    filename: 'info.log',
    dirname: logDir,
    level: 'info'
})

const errorTransport = new winston.transports.File({
    filename: 'error.log',
    dirname: logDir,
    level: 'error'
})

const consoleTransport = new (winston.transports.Console)({
    level: 'debug',
    handleExceptions: true,
    json: false, // 로그형태를 json으로도 뽑을 수 있다.
    colorize: true,
    // format: combine(
    //     format.colorize(),
    //     format.printf(
    //       info => `${info.timestamp} ${info.level}: ${info.message}`
    //     )
    //   )
  })

const logger = winston.createLogger({
    transports: [infoTransport, errorTransport, consoleTransport]
})

module.exports = logger;
