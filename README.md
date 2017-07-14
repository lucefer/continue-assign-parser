# js连等语法编译器
背景：
在javascript语法中，假如我想为三个变量赋值，我通常需要这样写
```
var a, b, c = 1000
a = b = c
```
或者这样写
```
var a = 1000, b = 1000, c = 1000
```
可以看出来，不管我们采用哪种方式赋值，都会重复敲入一些代码
* 第一种方式，我们多敲入了三个变量a、b、c。
* 第二种方式，我们多敲入了两次变量值 1000。
上面我们命名的变量不是很复杂，仅仅作为演示用的单字符变量名。但是实际开发环境中，我们往往要为变量定义语义化的名字。
```
var baseSalary, middleSalary, highSalary = 1000
baseSalary = middleSalary = highSalary
```
这次我们要多敲入很多字符了，虽然可以用拷贝粘贴的方式，但是仍然是有一定的工作量。
也许你觉得没有什么，不就是多敲一些字符吗？这么懒吗！
懒到是其次，我觉得这可以作为一个问题进行思考，能不能创造一种新的语法，能让我们更简单地为多个变量赋值呢？
经过一番思考，我想出了下面这种方式，上面两种情况我用下面的代码来表示
```
var a b c = 1000

var baseSalary middleSalary HighSalary = 1000
```
是不是简洁了很多？这就是我想要的语法，在此命名为**连等语法**。

但javascript语法不支持这种方式，所以我必须要实现一个编译器，来转译这种语法。

>注意：为了简便起见，我为该语法做了一些限制，如下：
* 只允许用var、let 关键字赋值。
* 只允许为变量赋予以下几种类型的值
  * 字符串字面量
  * 数字字面量
  * null字面量
  * bool字面量
* 如果超出了以上规则，则不认为是有效的连等语法，编译器不会对它进行编译。

## 使用方式
这个库有两种使用方式，一种是命令行方式，一种是webpack-loader的方式。
#### 命令行方式
首先，我们先全局安装continue-assign-parser，安装完暴露编译命令**aparse**
```
npm install -g continue-assign-parser

```
其次，我们用如下两种命令进行编译
1. 编译文件
```
aparse -f 'index.js'
```
编译目录下名为index.js的文件，返回编译好的代码
2. 编译字符串
```
aparse -s 'let a b c = 1000'
```

大家也许很好奇编译后的代码是什么形式，拿上面这段代码来说，编译后的代码如下：
```
let a, b, c
a = b = c = 1000
```
#### webpack-loader的方式
为了方便大家使用，我专门写了一个webpack-loader，传送门[assign-loader](https://github.com)
使用方式如下
```
npm install -D assign-loader
```
在webpack的配置文件中关于模块加载器这一项，assign-loader一定要配置在js文件编译的第一个阶段。因为大部分js加载器都不支持我们的连等语法，如果我们不在第一步进行转译的话，后续js加载器会报语法错误。配置示例如下
```
module:{
    rules:[
        {
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: /(node_modules)/
        },
        {
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          enforce: 'pre',
          options: {
            eslint: {
              configFile: '.eslintrc'
            }
          }
        },
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                postcss: [require('postcss-bem')(),require('postcss-cssnext')()]
              }
            }
          ],
        },
        {
          test: /\.(jsd|vue|js)$/,
          loader: 'assign-loader',
          exclude: /node_modules/
        },
        {
          //设置对应的资源后缀.
          test: /\.(css|scss)$/,
          //设置后缀对应的加载器.
          loader: ExtractTextPlugin.extract({
            loader: 'css-loader?modules'
          })
        }
    ]
  }
```
