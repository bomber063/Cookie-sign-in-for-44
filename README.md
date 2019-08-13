# Cookie-sign-in-for-44
## 首先介绍几个名词
* cookie——辨别身份用的，cache control(缓存控制)
## 复习http部分知识
* 客户端(比如浏览器)发请求(request)给服务端server,请求如果是http协议是由客户端的[80端口](https://baike.baidu.com/item/80%E7%AB%AF%E5%8F%A3/7581041?fr=aladdin)来接收，如果是https协议是由客户端的[443端口](https://baike.baidu.com/item/443%E7%AB%AF%E5%8F%A3)来接收,然后服务器server发一个response给客户端(比如浏览器)
* request分为四个部分
1. 请求行GET XXX/ HTTP/1.1
2. 请求头Content-type:application,Content-Length
3. 回车
4. 请求体a=1&b=2&...
* response分为四部分
1. 响应行 HTTP/1.1 200 OK
2. 响应头 Content-type:text/html;charset=utf-8;Content-Length: 465;等等
3. 回车
4. 响应体，就是html文件
### 回顾发请求的代码
* 详细可以见前面的[笔记说明](https://github.com/bomber063/-achieve-AJAX-for-37)
```
var request=new XMLHttpRequest()//初始化一个HTTP对象
    request.open('POST','./xxx')//初始化请求动词和路径
    request.onreadystatechange=()=>{//监听请求的变化
        if(request.readyState===4){//等于4说明下载完成了
            if(request.status===200){//等于200说明请求成功

            }
        }
    }
    request.send('a=1&b=2')//最后就是把请求体发出去，一般get是没有这个部分的
```
### 回顾node.js收请求的代码
```
 if (path==='/'){
     response.code=200//请求成功返回的响应代码
     response.setHeader('Content-type','text/html;charset=utf-8')//响应行
     response.write('返回的内容')//响应体
     response.end()//响应结束
 }
```
***
* 接下来以注册登录为需求来熟悉和了解cookie
***
### 后端server.js文件来自于以前的笔记
* 以前的笔记[链接](https://github.com/bomber063/-achieve-AJAX-for-37)

### 增加server.js里面的关于注册的路由和html文件
* 增加一个后端的路由，是针对注册页面的
```
else if(path==='/sign_up'){
    let string = fs.readFileSync('./sign_up.html', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }
```
* 这样当我们在主页找到路径/sign_up的时候就可以找到该sign_up.html网页啦,可以通过打开开发者工具中看到sign_up下面的Response,也就是响应体。
* 我们在Response Header的view source里面还可以看到我们写的Content-Type: text/html;charset=utf-8
* 此时可以先把cookie清空，点击cookie，在Application里面Storage里面的Cookies，里面有一个clear al，也就是禁止标志，一个圈里面一个斜杆——⊘