const Syntax = {
    AssignmentExpression: 'AssignmentExpression', //赋值表达式
    AssignmentEqual:'AssignmentEqual',//连等赋值表达式
    ArrayExpression: 'ArrayExpression', //数组表达式
    ArrayPattern: 'ArrayPattern', //数组结构赋值
    Identifier: 'Identifier', //变量表达式
    Literal: 'Literal', //字面量
    ObjectExpression: 'ObjectExpression', //对象表达式
    ObjectPattern: 'ObjectPattern', //对象结构赋值
    Program: 'Program', //程序
    VariableDeclaration: 'VariableDeclaration', //变量定义
    EqualVariableDeclarations: 'EqualVariableDeclarations'//连等赋值变量表达式
}

module.exports = Syntax
