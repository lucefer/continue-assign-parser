const Syntax=require('./type/syntax')
function tranverser(old_ast, visitor) {
  function tranverseArray(array, parent_node) {
    array.forEach(function(node) {
      tranverseNode(node, parent_node)
    })
  }
  function tranverseNode(node, parent_node) {
    let type = node.type
    let method = visitor[type]
    if(method && method.enter) {
      method.enter(node, parent_node)
    }
    switch(type) {
      case 'Program':
        tranverseArray(node.body, node)
        break
      case 'VariableDeclaration':
        tranverseArray(node.body, node)
        break
      case 'EqualVariableDeclaration':
        tranverseArray(node.body, node)
        break
      case 'Identifier':
        break
      default:throw new Error("未知的语法类型："+node.type)
    }
    if(method && method.exit) {
      method.exit(node, parent_node)
    }
  }
  tranverseNode(old_ast, null)
}

function transformer(old_ast) {
  let new_ast = {
    type: 'Program',
    body: []
  }
  old_ast.context = new_ast.body
  let visitor = {
    'VariableDeclaration': {
      enter(node, node_parent) {
        let assignNode = {
          type: Syntax.AssignmentExpression,
          body:[]
        }
        let variableNode={
          type: Syntax.VariableDeclaration,
          body: [],
          kind: node.kind
        }
        node.assign_context = assignNode.body
        node.context = variableNode.body
        node_parent.context.push(variableNode)
        node_parent.context.push(assignNode)
      }
    },
    'EqualVariableDeclaration': {
      enter(node,node_parent) {
        let assignNode = {
          type: 'AssignmentEqual',
          body: [],
          value: node.init
        }
        node.other_context = assignNode.body
        node_parent.assign_context.push(assignNode)
        node.context = node_parent.context
      }
    },
    'Identifier': {
      enter(node, node_parent) {
        if(node_parent.other_context) {
          node_parent.other_context.push(node)
        }
        node_parent.context.push(node)
      }
    }
  }
  tranverser(old_ast, visitor)
  return new_ast
}

module.exports = transformer
