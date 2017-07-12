const tokenizer = require('./compiler/tokenizer')
const parser = require('./compiler/parser')
const transformer =  require('./compiler/transformer')
const generator = require('./compiler/generator')

function compile(source) {
  let token_list, ast, new_ast, code=''
  token_list = tokenizer(source)
  if(token_list.length === 0){
    return source
  }
  ast = parser(token_list)
  if(!ast){
    return source
  }
  new_ast = transformer(ast)
  if(new_ast.body.length === 1){
    return source
  }
  code = generator(new_ast)
  return code
}

module.exports = compile
