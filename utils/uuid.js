const uuid4 = require('uuid4');

const uuid = () => {
    if (process.env.NODE_ENV === 'test') {
       return '42345678901234567890123456789012'; 
    }
    var token = uuid4().split('-');
    var orderedUuid = token[2] + token[1] + token[0] + token[3] + token[4];
    return orderedUuid;
}

module.exports=uuid;