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

### 增加代码达到注册界面的基本要求
* html文件代码
```
    <div class="form-wrap">
        <h1>注册</h1>
        <form>
            <div class="row">
                <label>邮箱</label>
                <input type="text" name="email">
            </div>
            <div class="row">
                <label>密码</label>
                <input type="password" name="password">
            </div>
            <div class="row">
                <label>确认密码</label>
                <input type="password" name="password_confirmation">
            </div>
            <div class="row">
                <input type="submit" value="注册">
            </div>
        </form>
    </div>
```
*  css样式代码
```
        * {
            box-sizing: border-box;
            padding: 0px;
            margin: 0px;
        }

        body {
            border: 1px solid red;
            /* vh不兼容IE，可以兼容手机端浏览器 */
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            /* coloumn变成纵向排列 */
            flex-direction: column;
        }

        /* 这里可以直接写body里面是height：100%,或者还可以写成
                html{
            height:100%;
        }
        body{
            min-height:100%;
        }也可以实现西面19和22行代码选择器一起的效果，这个可以兼容IE浏览器 */
        .form-wrap{
            border:1px solid #ddd;
            padding:20px;
        }
        .form-wrap .row{
            margin:10px 0px;
        }
        .form-wrap .row> label{
            display: inline-block;
            min-width: 4em;
        }
```
### 接下来我们应该把用户填写的东西发送给后台
* 用户调填写了邮箱，密码和密码确认后点击注册，邮箱和密码没有问题(比如，密码和确认密码要一样，邮箱里面要有@等检查)，发送给服务器，然后保存在服务器后台的数据库中。
* 需要用到JQuery，我们从[BootCDN](https://www.bootcdn.cn/)，这个**网站的信息相对全一点**,把script也放到HTML文件里面，这样就不用为js做路由了。
* 用到监听[submit事件](https://www.jquery123.com/submit/).
* [find()](https://www.jquery123.com/find/)通过一个选择器，jQuery对象，或元素过滤，得到当前匹配的元素集合中每个元素的后代。
* [val()](https://www.jquery123.com/val/)获取匹配的元素集合中第一个元素的当前值或设置匹配的元素集合中每个元素的**值**。
* js的监听注册后执行的代码
```
        $('#signUpForm').on('submit',(e)=>{
            let hash={}
            // console.log(e)//这里的e就是一堆的事件
            e.preventDefault()
            let need=['email','password','password_confirmation']
            need.forEach((name)=>{
                let value=$('#signUpForm').find(`[name=${name}]`).val()
                hash[name]=value
            })
            console.log(hash)
        })
```
* 接下来我们post一下，也使用ajax来提交信息。用到jq的[jQuery.post()](https://www.jquery123.com/jQuery.post/)使用一个HTTP POST 请求从服务器加载数据。
* 因为后端只有路径，没有get或者post的的方法要求。而且返回的是长得很像html的一串字符串,可以在开发者工具中的response中看到
* 前端增加的代码
```
        $.post()//这个post请求发出去后，后台返回的是符合html语法的一串字符串，因为后端只有路径，没有get或者post的的方法要求。而且返回的也是一串字符串
        .then(
            (r)=>{console.log('成功',r)},//这里的r就是服务器返回的response，也就是符合html语法的字符串
            ()=>{console.log('失败')}
            )
```
* 后端的代码
```
else if(path==='/sign_up'){
    let string = fs.readFileSync('./sign_up.html', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }
```
