const uuid4 = require('shortid');
const shortid = require('shortid');

const uuid = () => {
    if (process.env.NODE_ENV === 'test') {
       return '123abcABC'; 
    }
    return shortid.generate();
}

module.exports=uuid;