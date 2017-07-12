const tokenizer = require('../src/compiler/tokenizer')
const expect = require('chai').expect

describe("【词法分析】测试用例", function(){
  it("用例一",function(){
    const input = 'let n,m e f g=10'
    const expected = [{
        type: 2,
        value: 'let'
    }, {
        type: 1,
        value: 'n'
    }, {
        type: 6,
        value: ','
    }, {
        type: 1,
        value: 'm'
    }, {
        type: 1,
        value: 'e'
    }, {
        type: 1,
        value: 'f'
    }, {
        type: 1,
        value: 'g'
    }, {
        type: 6,
        value: '='
    }, {
        type: 7,
        value: 10
    }]
    const output = tokenizer(input)
    expect(JSON.stringify(output) === JSON.stringify(expected)).to.be.true
  })
  it("用例一",function(){
    const input = `let n,m=true, e f g='10',
    fn=null,cc=0x20,zz='\u0039',ff=077,ffg = 'tests测试'`
    const expected = [{
        type: 2,
        value: 'let'
    }, {
        type: 1,
        value: 'n'
    }, {
        type: 6,
        value: ','
    }, {
        type: 1,
        value: 'm'
    }, {
        type: 1,
        value: 'e'
    }, {
        type: 1,
        value: 'f'
    }, {
        type: 1,
        value: 'g'
    }, {
        type: 6,
        value: '='
    }, {
        type: 7,
        value: 10
    }]
    const output = tokenizer(input)
    expect(JSON.stringify(output) === JSON.stringify(expected)).to.be.true
  })
  it("用例三",function(){
    const input = `let  e f g=011, cc= 0b11,dd=011,ffff=011bb ,ddfd=0o90,hh='\u{fefe}',
    fn
    =null,cc  = 0x20nn, cdf=0x20,  zz='\u0039',ffg zzh = 'tests测试', zzn=3.1e+2, zzy=33.1E+10`
    const expected = [{
        type: 2,
        value: 'let'
    }, {
        type: 1,
        value: 'n'
    }, {
        type: 6,
        value: ','
    }, {
        type: 1,
        value: 'm'
    }, {
        type: 1,
        value: 'e'
    }, {
        type: 1,
        value: 'f'
    }, {
        type: 1,
        value: 'g'
    }, {
        type: 6,
        value: '='
    }, {
        type: 7,
        value: 10
    }]
    const output = tokenizer(input)
    expect(JSON.stringify(output) === JSON.stringify(expected)).to.be.true
  })
})
