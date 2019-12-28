var fs = require('fs')
var winston = require('winston')
const moment = require('moment-timezone')

const logDir = __dirname + '/../logs'

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}


const myFormat = winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.label} - ${info.message}`);
// function myTimeStamp () {
//     // return new Date().toString(); 
//     return moment().format('hh:mm:ss.SSS'); 
// };
const appendTimestamp = winston.format((info, opts) => {
    if(opts.tz)
        info.timestamp = moment().tz(opts.tz).format();
    return info;
  });

const infoTransport = new winston.transports.File({
    filename: 'info.log',
    dirname: logDir,
    level: 'info',
    json: false,
    timestamp: true,
    colorize: true,
    format: winston.format.combine(
        winston.format.label({ label: 'heartbeat' }),
        appendTimestamp({ tz: 'Asia/Seoul' }),
        winston.format.timestamp(),
        myFormat
    )
})

const errorTransport = new winston.transports.File({
    filename: 'error.log',
    dirname: logDir,
    level: 'error',
    json: false,
    timestamp: true,
    colorize: true,
    format: winston.format.combine(
        winston.format.label({ label: 'heartbeat' }),
        appendTimestamp({ tz: 'Asia/Seoul' }),
        winston.format.timestamp(),
        myFormat
    )
})

const consoleTransport = new (winston.transports.Console)({

    level: 'debug',
    handleExceptions: true,
    json: false, // 로그형태를 json으로도 뽑을 수 있다.
    colorize: true,
    timestamp: true,
    format: winston.format.combine(
        winston.format.label({ label: 'heartbeat' }),
        appendTimestamp({ tz: 'Asia/Seoul' }),
        winston.format.colorize(),
        myFormat
    )
  })


const logger = winston.createLogger({
    // timestamp: myTimeStamp,
    // json: false,
    // format: winston.format.combine(
    //     winston.format.label({ label: 'main' }),
    //     winston.format.colorize(),
    //     winston.format.timestamp(),
    //   myFormat
    // ),
    transports: [infoTransport, errorTransport, consoleTransport]
})

module.exports = logger;
