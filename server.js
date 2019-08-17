var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('方方说：含查询字符串的路径\n' + pathWithQuery)

  if (path === '/') {
    let string = fs.readFileSync('./index.html', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  } else if (path === '/sign_up' && method === 'GET') {//这里的method里面的GET要大写，并且使要满足这个路径和方法才可以走这个路由
    let string = fs.readFileSync('./sign_up.html', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  } else if (path === '/sign_up' && method === 'POST') {//当在这个路径是POST请求的时候就进这个路由
    readbody(request)
      .then((body) => {
        let hash = {}
        let strings = body.split('&')//这里的string就被&分隔，所以得到新的数组[ 'email=111', 'password=222', 'password_confirmation=333' ]
        strings.forEach((element) => {//这里的element就是前面的数组的三个元素
          let parts = element.split('=')//这里的parts就是把email=111继续分隔为[email,111]
          let key = parts[0]
          let value = parts[1]
          hash[key] = decodeURIComponent(value)//decodeURIComponent可以解码@
        });
        // console.log(hash)//这里就会打出{ email: '111', password: '222', password_confirmation: '333' }
        // console.log(body)//这里的body就是封装函数readbody里面的成功后函数的里面的参数
        // let email=hash['email']
        // let password=hash['password']
        // let password_confirmation=hash['password_confirmation']
        let { email, password, password_confirmation } = hash//这一行代码代表前面三行代码，这是ES6的新的语法
        // console.log(email,password,password_confirmation)
        if (email.indexOf('@') === -1) {
          response.statusCode = 400
          response.setHeader('Content-Type', 'application/json;charset=utf-8')
          response.write(`{
            "errors":{
              "email":"invalid"
            }
          }`)
        } else if (password !== password_confirmation) {
          response.statusCode = 400
          response.write('password is not match')
        } else {
          response.statusCode = 200
          response.write('success')
        }
        response.statusCode = 200
        response.end()
      })
    // let body = [];//请求体
    // request.on('data', (chunk) => {//监听request的data事件，每次data事件都会给一小块数据，这里用chunk表示
    //   body.push(chunk);//把这个一小块数据，也就是chunk放到body数组里面。
    // }).on('end', () => {//当end的时候，也就是数据全部上传完了之后。
    //   body = Buffer.concat(body).toString();//这里body就把里面的body数据全部合并起来
    //这个Buffer不知道是什么东西，但是可以在node.js里面打出来看到是一个函数，下面的注释
    // function Buffer(arg, encodingOrOffset,
    //   length) {
    //     showFlaggedDeprecation();
    //     // Common case.
    //     if (typeof arg === 'number') {
    //       if (typeof encodingOrOffset === 'string') {
    //         throw new ERR_INVALID_ARG_TYPE('string', 'string', arg);
    //       }
    //       return Buffer.alloc(arg);
    //     }
    //     return Buffer.from(arg, encodingOrOffset, length);
    //   }

    // at this point, `body` has the entire request body stored in it as a string
    // });
  }
  else if (path === '/main.js') {
    let string = fs.readFileSync('./main.js', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
    response.write(string)
    response.end()
  } else if (path === '/xxx') {
    response.statusCode = 200
    // response.setHeader('Content-Type', 'text/json;charset=utf-8')
    response.setHeader('Content-Type', 'text/json;charset=utf-8')

    // response.setHeader('Access-Control-Allow-Origin', 'http://bomber2.com:8002')//告诉浏览器http://bomber2.com:8002是我的朋友，不要限制他的访问
    // response.setHeader('Access-Control-Allow-Origin', 'http://bomber3.com:8003')
    // response.setHeader('Access-Control-Allow-Origin', 'http://bomber2.com:8002 , http://bomber3.com:8003')
    response.setHeader('Access-Control-Allow-Origin', '*')//告诉浏览器所有人是我的朋友，不要限制他们的访问

    response.write(`
    {
      "note":{
        "to": "小谷",
        "from": "bomber",
        "heading": "打招呼",
        "content": "hi"
      }
    }
    `)
    response.end()
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(`
      {
        "error": "not found"
      }
    `)
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})

function readbody(request) {
  return new Promise((resolve, reject) => {
    let body = [];//请求体
    request.on('data', (chunk) => {//监听request的data事件，每次data事件都会给一小块数据，这里用chunk表示
      body.push(chunk);//把这个一小块数据，也就是chunk放到body数组里面。
    }).on('end', () => {//当end的时候，也就是数据全部上传完了之后。
      body = Buffer.concat(body).toString();//这里body就把里面的body数据全部合并起来
      resolve(body)//Promise执行完毕成功后就会执行resolve这个函数，这个函数同样会返回
    })
  })
}


server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)


