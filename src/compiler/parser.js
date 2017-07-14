const Type = require('./type/token')
const Syntax = require('./type/syntax')

function Node(type, value)
{

}
let token_list, len, pos, current_token

function parse(tokens) {
    let ast = null
    token_list = tokens
    len = token_list.length
    pos = 0

    try {
      ast = parseProgram()
    }
    catch(ex) {
      //console.warn("parse-warn: ",ex)
    }
    return ast
}

function parseProgram() {
    let body, node
    node = new Node()
    body = parseScriptBody()
    let hasEqual = false
    for(let i = 0; i < body.length; i++) {
      if(body[i]) {
        let variableNode = body[i]
        for(let j=0; j < variableNode.body.length; j++){
          if(variableNode.body[j].type === Syntax.EqualVariableDeclaration){
            hasEqual = true
            break
          }
        }
      }
      if(hasEqual){
        break
      }
    }
    if(!hasEqual){
      return null
    }
    node.type = Syntax.Program
    node.body = body
    return node
}

function parseScriptBody() {
    let statement, body = []
    current_token = token_list[pos]
    statement = parseStatementListItem()
    statement && (body.push(statement))
    return body
}

function parseStatementListItem() {
    if (current_token.type === Type.KEYWORD) {
        switch (current_token.value) {
            case 'var':
            case 'let':
                let kind = current_token.value
                let node = parseVariableDeclarationList()
                node.kind = kind
                return node
                break
        }
    }
    return null
}

function parseVariableDeclarationList() {
    pos++
    current_token = token_list[pos]
    return parseVariableDeclaration()
}
function parseVariableDeclaration() {
    let init = null,
        id, node = new Node(),
        id_list = []
    if(isPunctuator("[") || isPunctuator("{")) {
        return null
    }
    parseEqualVariableDeclaration(id_list)
    node.type = Syntax.VariableDeclaration
    node.body = id_list
    return node
}


function parseEqualVariableDeclaration(re) {
    let node, equalNode, id_list
    current_token = token_list[pos++]
    while(current_token.type === Type.IDENTIFIER) {
        node = new Node()
        node.type = Syntax.Identifier
        node.value = current_token.value;
        !id_list && (id_list = [])
        id_list.push(node)
        current_token = token_list[pos++]
    }
    if(!id_list) {
        return
    }
    if(id_list.length > 1) {
        equalNode = new Node()
        equalNode.type = Syntax.EqualVariableDeclaration
        equalNode.body = id_list
        re.push(equalNode)
    } else if (id_list.length === 1) {
        re.push(node)
    }
    if(current_token && current_token.value === ',') {
      if(equalNode){
        equalNode.init = undefined
      } else {
        id_list.forEach(function(n){
          n.init = undefined
        })
      }
      parseEqualVariableDeclaration(re)
    }
    let init = ''
    if(current_token && current_token.value === '=') {
        current_token = token_list[pos++]
        if (current_token.type === Type.STRING_LITERAL || current_token.type === Type.NUMBER_LITERAL || current_token.type == Type.BOOLEAN_LITERAL || current_token.type == Type.NULL_LITERAL) {
            if(current_token.type === Type.STRING_LITERAL) {
              init = '"' + current_token.value + '"'
            } else {
              init = current_token.value
            }
            current_token = token_list[pos++]
        } else if (current_token.type === Syntax.BR) {
            current_token = token_list[pos++]
        } else {
            throw new Error("语法分析错误")
        }
        if(equalNode) {
          equalNode.init = init
        } else {
          node.init = init
        }
    }
    if(current_token && current_token.value === ',') {
        parseEqualVariableDeclaration(re)
    }
}

function isPunctuator(type, value) {
    if(current_token.type === Type.PUNCTUATOR && current_token.value === value) {
        return true
    }
    return false
}



module.exports = parse
