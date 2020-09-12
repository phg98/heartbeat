const expect = require('chai').expect;

const uuid = require('../utils/uuid')

describe('uuid', ()=>{
    it('should make uuid', ()=>{
        expect(uuid()).match(/\b[0-9A-Fa-f]{9}\b/g)
    })
})
