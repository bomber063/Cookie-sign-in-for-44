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
* 当后端代码增加请求的方法的时候，这里的路由还需要考虑请求方法。
```
else if (path === '/sign_up' && method === 'GET') {//这里的method里面的GET要大写，并且使要满足这个路径和方法才可以走这个路由
    let string = fs.readFileSync('./sign_up.html', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  } else if (path === '/sign_up' && method === 'POST') {//当在这个路径是POST请求的时候就进这个路由
    let string = fs.readFileSync('./sign_up.html', 'utf8')
    response.statusCode = 200
    response.end()
  }
```
### 接下来需要服务器来读取前端用户用浏览器给的邮箱和密码
* 我们在开发者工具里面看到post请求里面对应的最后一部分，也就是请求体Form Data 的view source里面可以看到邮箱，密码和密码确认啦。
* node.js没有办法读取到这个请求体里面的数据。我们需要借助一些工具来读取。**为什么读取不到，因为Form Data是一段一段的上传的，就算去读取可能也只能读取到一段**，我们可以到google上搜node http get post data,可以找到[链接](https://stackoverflow.com/questions/4295782/how-to-process-post-data-in-node-js),我们可以找到这样一段代码
```
let body = [];
request.on('data', (chunk) => {
  body.push(chunk);
}).on('end', () => {
  body = Buffer.concat(body).toString();
  // at this point, `body` has the entire request body stored in it as a string
});
```
* 在node.js里面打出来的效果需要多打印几次才能看到结果，**因为前面几行不知道啥原因看不到，需要多点击几次，可能是这个版本node.js的bug**。
* **这个结果需要在node.js里面查看，而不是浏览器中查看**.
* 为什么这四个部分不是一下子就上传的呢，前面有说明过，见[链接——浏览器是先下载全部响应内容，然后再判断是不是400吗](https://github.com/bomber063/-achieve-AJAX-for-37),这里可以在举一个小例子，假设用户输入了一个一万个长度的用户名，是不可以把一万个长度的子一下子就传过来的。一般都是一点点，1kb或者多少kb/s的速度上传，上传过程中就会触发这个data事件
* 这里用到jquery的API，[data事件](https://www.jquery123.com/event.data/),[end事件](https://www.jquery123.com/end/)终止在当前链的最新过滤操作，并返回匹配的元素的以前状态。
* 后端代码修改如下
```
else if (path === '/sign_up' && method === 'POST') {//当在这个路径是POST请求的时候就进这个路由
    let body = [];//请求体
    request.on('data', (chunk) => {//监听request的data事件，每次data事件都会给一小块数据，这里用chunk表示
      body.push(chunk);//把这个一小块数据，也就是chunk放到body数组里面。
    }).on('end', () => {//当end的时候，也就是数据全部上传完了之后。
      body = Buffer.concat(body).toString();//这里body就把里面的body数据全部合并起来
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
      console.log(body)
      response.statusCode = 200
      response.end()
    });
  }
```
* 把后端获取到前面用户输入的信息的这个函数单独封装起来使用
```
function readbody(request){
  return new Promise((resolve,reject)=>{
    let body = [];//请求体
    request.on('data', (chunk) => {//监听request的data事件，每次data事件都会给一小块数据，这里用chunk表示
      body.push(chunk);//把这个一小块数据，也就是chunk放到body数组里面。
    }).on('end', () => {//当end的时候，也就是数据全部上传完了之后。
      body = Buffer.concat(body).toString();//这里body就把里面的body数据全部合并起来
      resolve(body)//这里的body就是传给.then()成功后第一个函数的参数
    })
  })
}
```
* 前面的代码拿到body就可以修改为
```
else if (path === '/sign_up' && method === 'POST') {//当在这个路径是POST请求的时候就进这个路由
    readbody(request)
    .then((body)=>{//这里的body就是封装函数readbody里面的成功后函数的里面的参数
      console.log(body)//这里的body就是封装函数readbody里面的成功后函数的里面的参数
      response.statusCode = 200
      response.end()
    })
}
```
***
* 上面的部分就是当用户post这个sign_up的时候，服务端就会去读取post请求的第四部分body，然后从post请求的第四部分body里面得到字符串，这个格式就是比如email=111@qq.com&password=222&password_confirmation=222,邮箱，密码和确认密码,所以接下来要分别来拆分这个字符串得到邮箱，密码和确认密码等信息
***
### 拆分post请求的第四部分body里面得到字符串，获取到邮箱，密码等信息
* 这里用到API——[split](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/split)方法使用指定的分隔符字符串将一个String对象分割成字符串数组，以将字符串分隔为子字符串，以确定每个拆分的位置。 
* 我们可以在node.js里面看到新的数组——[ 'email=111', 'password=222', 'password_confirmation=333' ]
* **客户端**千辛万苦把**用户post表单里面收集到用户输入的信息变成字符串**，**服务端**千辛万苦把这个字符串**还原成分开的样子，也就是按照需要的结构解析出来**
* 具体修改的后端代码见下面
```
    .then((body)=>{
      let hash={}
      let strings=body.split('&')//这里的string就被&分隔，所以得到新的数组[ 'email=111', 'password=222', 'password_confirmation=333' ]
      strings.forEach((element) => {//这里的element就是前面的数组的三个元素
        let parts=element.split('=')//这里的parts就是把email=111继续分隔为[email,111]
        let key=parts[0]
        let value=parts[1]
        hash[key]=value//hash['email']='111'
      });
      console.log(hash)//这里就会打出{ email: '111', password: '222', password_confirmation: '333' }
```