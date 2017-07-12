const Type = require('./type/token')

const NumberReg = /[0-9]/
const LetterReg = /[a-z]/i
const WhitespaceReg = /[\u0020\u00A0\u0009\u000B\u000C]/

let pos = 0
let char
let source
let len

//当前字符是否符合标识符的开始符号规则
function isIdStart(ch) {
  return (ch === '$') || (ch === '_')||
        (LetterReg.test(ch))
}
//当前字符是否是标识符的一部分
function isIdPart(ch) {
  return (ch === '$') || (ch === '_') ||  // $ and _
            LetterReg.test(ch)||        // a..zA..Z
            NumberReg.test(ch)        // 0..9
}
function isKeyword(id) {
  switch(id.length) {
    case 2:
      return (id === 'if') || (id === 'in') || (id === 'do')
    case 3:
      return (id === 'var') || (id === 'for') || (id === 'new') ||
          (id === 'try') || (id === 'let')
    case 4:
      return (id === 'this') || (id === 'else') || (id === 'case') ||
          (id === 'void') || (id === 'with') || (id === 'enum')
    case 5:
      return (id === 'while') || (id === 'break') || (id === 'catch') ||
          (id === 'throw') || (id === 'const') || (id === 'yield') ||
          (id === 'class') || (id === 'super')
    case 6:
      return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
          (id === 'switch') || (id === 'export') || (id === 'import')
    case 7:
      return (id === 'default') || (id === 'finally') || (id === 'extends')
    case 8:
      return (id === 'function') || (id === 'continue') || (id === 'debugger')
    case 10:
      return (id === 'instanceof')
    default:
      return false
  }
}
//获取标识符token
function getId() {
  let start, ch
  start = pos++
  ch = source[start]
  while(pos < len) {
    ch = source[pos]
    if(isIdPart(ch)) {
      ++ pos
    } else {
      break
    }
  }
  return source.slice(start, pos)
}

//扫描标识符，得出标识符类型
function scanId(){
  let start, id, type
  start = pos
  id = getId()
  if(id.length === 1){
    type = Type.IDENTIFIER
  }else if(isKeyword(id)) {
    type = Type.KEYWORD
  } else if(id === 'null') {
    type = Type.NULL_LITERAL
  } else if(id === 'true' || id==='false'){
    type = Type.BOOLEAN_LITERAL
  } else {
    type = Type.IDENTIFIER
  }
  return {
    type: type,
    value: id
  }
}

function getNextToken(){
  let cp, token
  if(pos > len){
    return {
      type: Type.EOF
    }
  }
  cp = source[pos]
  if(isIdStart(cp)) {
    token = scanId()
    return token
  }

  if(cp === '(' || cp === ')' || cp === ';' || cp ===',') {
    token = scanPuntuator()
    return token
  }
  if(cp === '"'|| cp === '\'') {
    token = scanStringLiteral()
    return token
  }
  if(cp === ".") {
    if(isDecimalDigit(source[pos + 1])) {
      return scanNumberLiteral()
    }
    return scanPuntuator()
  }
  if(isDecimalDigit(cp)) {
    return scanNumberLiteral()
  }
  return scanPuntuator()
}
function scanHexLiteral() {
  let number = ''
  while(pos < len) {
    if(!isHexDigit(source[pos])) {
      break
    }
    number += source[pos++]
  }
  if(number.length === 0) {
    throwUnexpectedToken()
  }
  return {
    type: Type.NUMBER_LITERAL,
    value: parseInt('0x' + number, 16)
  }
}
function scanBinaryliteral() {
  let number = '', ch

  while(pos < len) {
    ch = source[pos]
    if(ch != '0' && ch != '1') {
      break
    }

    number += source[pos++]

  }

  if(number.length === 0) {
    throwUnexpectedToken()
  }
  if(pos < len) {
    if(isIdStart(ch) || isDecimalDigit(ch)) {
      throwUnexpectedToken()
    }
  }
  return {
    type: Type.NUMBER_LITERAL,
    value: parseInt(number, 2)
  }

}
function isOctalDigit(ch) {
  return "01234567".indexOf(ch) > -1
}
function scanOctalLiteral() {
  let number = '', ch, isOctal = false
  ch = source[pos]
  if(isOctalDigit(ch)) {
      isOctal = true
      number = "0" + ch
  }
  pos++
  while(pos < len) {
    ch = source[pos]
    if(!isOctalDigit(ch)) {
      break
    }else{
      number += source[pos++]
    }
  }
  if(!isOctal && number.length === 0){
    throwUnexpectedToken()
  }
  if(isIdStart(ch) || isDecimalDigit(ch)) {
    throwUnexpectedToken()
  }
  return {
    type: Type.NUMBER_LITERAL,
    value: parseInt(number, 8)
  }
}
function isImplicitOctal(){
  let i, ch
  for(i = (pos + 1); i<len; i++) {
    ch = source[pos]
    if(ch === '8'||ch === '9') {
      return false
    }
    if(!isOctalDigit(ch)) {
      return true
    }
  }
  return true
}
/**
 * []
 * @method scanNumberLiteral
 * @return {[type]}          [description]
 */
function scanNumberLiteral() {
  let number, start, ch
  ch = source[pos]
  if(!NumberReg.test(ch) && ch !== ".") {
    throw new Error("number must starts with number or .")
  }
  start = pos
  number = ''
  if(ch !== '.') {
    number = source[pos++]
    ch = source[pos]
    if(number === '0') {
      if(ch === 'x' || ch === 'X') {
        ++pos
        return scanHexLiteral()
      } else if(ch === 'b' || ch === 'B') {
        ++pos
        return scanBinaryliteral()
      } else if(ch === 'o' || ch === 'O') {
        return scanOctalLiteral()
      }
      if(isOctalDigit(ch)) {
        if(isImplicitOctal(ch)) {
          return scanOctalLiteral()
        }
      }
    }
    while(isDecimalDigit(source[pos])) {
      number += source[pos++]
    }
    ch = source[pos]
  }
  if(ch === "."){
    number += source[pos++];
            while(isDecimalDigit(source[pos])) {
                number += source[pos++]
            }
            ch = source[pos]
  }
  if(ch === 'e' || ch === 'E') {
    number += source[pos++]
    ch = source[pos]
    if(ch === '+' || ch === '-') {
      number += source[pos++]
    }
    if(isDecimalDigit(source[pos])) {
      while(isDecimalDigit(source[pos]) && pos < len) {
        number += source[pos++]
      }
    } else {
      throwUnexpectedToken()
    }
  }
  if(source[pos] && isIdStart(source[pos])) {
    throwUnexpectedToken()
  }
  return {
    type: Type.NUMBER_LITERAL,
    value: parseFloat(number)
  }
}
/**
 * [判断当前字符是否属于换行符]
 * @method isLineTerminal
 * @param  {[type]}       cp [description]
 * @return {Boolean}         [description]
 */
function isLineTerminal(cp) {
  let code = cp.charCodeAt(0)
  if(code === 0x0A || code === 0x0D || code === 0x2028 || code === 0x2029) {
    return true
  }
  return false
}
function throwUnexpectedToken() {
  throw new Error("unexpected token error")
}
function isHexDigit(ch) {
  return /[\da-zA-Z]/.test(ch)
}
function isDecimalDigit(ch) {
  return NumberReg.test(ch)
}
/**
 * [扫描unicode字符]
 * @method scanUnicode
 * @return {[type]}    [description]
 */
function scanUnicode() {
  let ch, code = 0
  ch = source[pos]
  if(ch !== '}') {
    throwUnexpectedToken()
  }
  while(pos < len) {
     ch = source[pos++]
     if(!isHexDigit(ch)) {
       break;
     }
     code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase())
  }
  if(code > 0x10FFFF || ch !== '}') {
    throwUnexpectedToken()
  }
  return String.fromCharCode(code)
}
/**
 * [扫描unicode字符串]
 * @method scanHexEscaped
 * @param  {[type]}       ch [description]
 * @return {[type]}          [description]
 */
function scanHexEscaped(ch) {
  let length, code = 0
  length = ch === 'u'?4:2
  for(let i = 0; i < length; i++) {
    if(pos < len && isHexDigit(source[pos])) {
      ch = source[pos++]
      code = code * 16 + "0123456789abcdef".indexOf(ch.toLowerCase())
    } else {
      return ''
    }
  }
  return String.fromCharCode(code)
}
/**
 * [扫描字符串字面量]
 * @method scanStringLiteral
 * @return {[type]}          [description]
 */
function scanStringLiteral(){
  let cp, start, str = '', ch, isValid = false, unescaped
  cp = source[pos]
  start = pos
  ++pos
  if(cp !== '"' && cp !== '\'') {
    throw new Error("string literal must starts with a quote")
  }
  while(pos < len) {
    let ch = source[pos++]
    if(ch === cp){
        isValid = true
        break
    }
    if(ch === '\\') {
      ch = source[pos++]
      if(!ch || !isLineTerminal(ch)) {
        switch(ch) {
          case 'u':
          case 'x':
            if(source[pos] === '{') {
              ++pos
              str += scanUnicode()
            } else {
              unescaped = scanHexEscaped(ch)
              if(!unescaped) {
                throwUnexpectedToken()
              }
              str += unescaped
            }
            break;
          case 'r':
          case 'n':
          case 't':
          case 'b':
          case 'f':
          case 'v':
            str += "\\" + ch
            break;
          case '8':
          case '9':
            str += ch
            throwUnexpectedToken()
            break
          default:
            str += ch
        }
      } else {
        if(ch === "\r" && source[pos]  === "\n") {
          pos++
        }
      }
    } else if(isLineTerminal(ch)) {
      break
    } else {
      str += ch
    }
  }
  if(isValid) {
    return {
      type: Type.STRING_LITERAL,
      value: str
    }
  }
  else{
    throwUnexpectedToken()
  }
}
/**
 * [扫描操作符]
 * @method scanPuntuator
 * @return {[type]}      [description]
 */
function scanPuntuator() {
  let ch, token, start
  token = {
    type: Type.PUNCTUATOR,
    value: ''
  }
  start = pos
  ch = source[pos]
  switch(ch) {
    case ',':
      ++pos
      break
    case '=':
      ++pos
      break
    default:
      throwUnexpectedToken()
  }
  token.value = source.slice(start, pos)
  return token
}
function tokenizer(src) {
  pos = 0
  source = src
  let token_list = []
  len = src.length
  try {
    while(pos < len) {
      var cp = src[pos]
      if(isLineTerminal(cp)) {
        if(!!token_list.length && token_list[token_list.length-1].type !== Type.BR) {
          token_list.push({
            type: Type.BR,
            value: 'br'
          })
        }
        pos++
        continue
      }
      if(WhitespaceReg.test(cp)) {
        pos++
        continue
      }
      token_list.push(getNextToken())
    }
  }
  catch(ex){
  }
  return token_list
}
module.exports =  tokenizer
