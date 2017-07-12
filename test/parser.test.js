const parser = require('../src/compiler/parser')
const expect = require('chai').expect
describe("【语法分析】测试用例", function() {
    it("用例一", function() {
        const input = [{
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
        const expected = {
            "type": "Program",
            "body": [{
                "type": "VariableDeclaration",
                "body": [{
                    "type": "Identifier",
                    "value": "n"
                }, {
                    "type": "EqualVariableDeclarations",
                    "body": [{
                        "type": "Identifier",
                        "value": "m"
                    }, {
                        "type": "Identifier",
                        "value": "e"
                    }, {
                        "type": "Identifier",
                        "value": "f"
                    }, {
                        "type": "Identifier",
                        "value": "g"
                    }],
                    "init": 10
                }],
                "kind": "let"
            }]
        }
        const output = parser(input)
        console.log(JSON.stringify(output))
        expect(JSON.stringify(output) === JSON.stringify(expected)).to.be.true
    })
    it("用例二", function() {
        const input = [{
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
            type: 2,
            value: 'var'
        }, {
            type: 1,
            value: 'f'
        }, {
            type: 6,
            value: '['
        }, {
            type: 6,
            value: '='
        }, {
            type: 7,
            value: 10
        }]
        const expected = {
            "type": "Program",
            "body": [{
                "type": "VariableDeclaration",
                "body": [{
                    "type": "Identifier",
                    "value": "n"
                }, {
                    "type": "EqualVariableDeclarations",
                    "body": [{
                        "type": "Identifier",
                        "value": "m"
                    }, {
                        "type": "Identifier",
                        "value": "e"
                    }, {
                        "type": "Identifier",
                        "value": "f"
                    }, {
                        "type": "Identifier",
                        "value": "g"
                    }],
                    "init": 10
                }],
                "kind": "let"
            }]
        }
        const output = parser(input)
        console.log(JSON.stringify(output))
        expect(JSON.stringify(output) === JSON.stringify(expected)).to.be.true
    })
})
