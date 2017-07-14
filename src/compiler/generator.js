const Syntax=require('./type/syntax')

function codeGenerator(node,parent_node){
  let str=''
  switch(node.type){
    case Syntax.Program:
      for(let i = 0;i < node.body.length;i++) {
        if(i == node.body.length - 1){
          str += codeGenerator(node.body[i])
        } else {
          str += codeGenerator(node.body[i]) + "\n"
        }
      }
      break
    case Syntax.VariableDeclaration:
      str += node.kind + " "
      for(let i = 0;i < node.body.length; i++) {
        str += codeGenerator(node.body[i]) + ","
      }
      str = str.substr(0, str.length-1)
      break
    case Syntax.AssignmentExpression:
      for(let i = 0; i < node.body.length; i++) {
        if(i === node.body.length - 1){
          str += codeGenerator(node.body[i])
        } else {
          str += codeGenerator(node.body[i]) + "\n"
        }
      }
      break
    case Syntax.AssignmentEqual:
      if(node.value !== undefined) {
        for(let i = 0; i < node.body.length; i++) {
          str += (codeGenerator(node.body[i], node) + "=")
        }
        str += node.value
      }
      break
    case Syntax.Identifier:
      if(parent_node && parent_node.type === Syntax.AssignmentEqual) {
        return node.value
      } else {
        if(node.init !== undefined) {
          return node.value + "=" + node.init
        } else {
          return node.value
        }
      }
      break
  }
  return str
}

module.exports = codeGenerator
