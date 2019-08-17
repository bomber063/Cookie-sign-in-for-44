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
* 分别用一个变量储存邮箱，密码和确认密码
```
      // let email=hash['email']
      // let password=hash['password']
      // let password_confirmation=hash['password_confirmation']
      let {email,password,password_confirmation}=hash//这一行代码代表前面三行代码，这是ES6的新的语法
```
### 接下来测试邮箱，密码和确认密码的正确和符合性
* 用到API——[indexOf](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf)方法返回调用它的 String 对象中第一次出现的指定值的索引，从 fromIndex 处进行搜索。**如果未找到该值，则返回 -1**。
* 这里后端如果检测有误就会有提示，前端可以拿到后端的提示，也就是responseText，就可以提示给用户。
* 后端有时候写的代码不一定用户能看懂，所以需要前端来翻译，比如后端写的response.write('bad email')，前端翻译为
```
            (request)=>{
                if(request.responseText==='bad email')
                alert('邮箱写错了')}
            )
        })
```
* 所以这里除了http协议，还有所谓的前后端协议，这个是前后端定的协议
* 后端报错信息提供一个JSON,这是一个**字符串**
```
          response.write(`{
            "errors":{
              "email":"invalid"
            }
          }`)
```
* 把前端部分需要把这个符合JSON语法的报错信息字符串转换为一个对象。
```
                    (request) => {
                        let object = JSON.parse(request.responseText)
                        console.log(object)
                    })
```
* 前端部分优化代码可以写成
```
                    (request) => {
                        // if(request.responseText==='bad email')
                        // alert('邮箱写错了')}//这里第一个请求a是对象,也就是request，第二个请求b是'error',第三个请求c是http的状态信息'Bad Request'
                        // let object = JSON.parse(request.responseText)
                        // let errors=object.errors
                        // let { errors } = object//这句就意思就是上面一行代码的意思，是ES6的写法
                        let {errors}=JSON.parse(request.responseText)//这一行代码把上面几行的代码缩减为这一行代码
                        console.log(errors)
                    }
                )
```
* 前端部分用到[JSON.parse](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)方法用来解析JSON字符串，构造由字符串描述的JavaScript值或对象。提供可选的reviver函数用以在返回之前对所得到的对象执行变换(操作)，这样会比较麻烦，**我们可以省略这一步**
* 我们给后端代码中写上这个是JSON，修改一句代码,修改Content-Type
```
          response.setHeader('Content-Type', 'application/json;charset=utf-8')
```
* 前端部分就可以简化为
```
                        let {errors}=request.responseJSON
```
* 这样前端部分代码就可以简化为这两行就可以根据后端的响应来提示用户哪里有错误.
```
                        let {errors}=request.responseJSON
                        if(errors.email&&errors.email==='invalid'){//当errors存在并且等于'invalid'的时候告诉用户错在哪里
                            alert('邮箱格式错误')
                        }
```
### 修改错误提示的样式
* 前端jS代码
```
                        if(errors.email&&errors.email==='invalid'){//当errors存在并且等于'invalid'的时候告诉用户错在哪里
                            $('#signUpForm').find('[name="email"]').siblings('.error').text('邮箱格式错误')
                            // alert('邮箱格式错误')
                        }
```
* 前端HTML代码增加
```
            <div class="row">
                <label>邮箱</label>
                <input type="text" name="email">
                <span class="error"></span>
            </div>
```
* 前端CSS增加最小宽度
```
        .form-wrap {
            border: 1px solid #ddd;
            padding: 20px;
            min-width: 380px;
        }
```
### 如果用户没有写邮箱，那么就不需要麻烦后端，只需要前端来验证这个即可，当然就算前端验证了，后端也会验证是否没有写邮箱的。
* 主要思路就是用if return或者if...else来判断，代码如下
```
            // $form.find('.error').text('')
            $form.find('.error').each((value,index)=>{//这个是为了刚开始清空文字，不然文字会一直显示不会消失
                $(index).text('')
            })//这三行代码效果跟上面效果一样，只是感觉
            if (hash['email'] === '') {
                $form.find('[name="email"]').siblings('.error').text('请填写邮箱')
                return//这里return代表就返回结束中止了，也就是不执行下面的post请求，如果不写，会继续执行下面的代码会导致显示邮箱格式错误。这里把下面加上else if也可以
            }
            if(hash['password']===''){
                $form.find('[name="password"]').siblings('.error').text('请填写密码')
                return//这里return代表就返回结束中止了，也就是不执行下面的post请求，如果不写，会继续执行下面的代码会导致显示邮箱格式错误。这里把下面加上else if也可以
            }
            if(hash['password_confirmation']===''){
                $form.find('[name="password_confirmation"]').siblings('.error').text('填写确认密码')
                return//这里return代表就返回结束中止了，也就是不执行下面的post请求，如果不写，会继续执行下面的代码会导致显示邮箱格式错误。这里把下面加上else if也可以
            }
            if(hash['password_confirmation']!==hash['password']){
                $form.find('[name="password_confirmation"]').siblings('.error').text('密码不匹配')
                return//这里return代表就返回结束中止了，也就是不执行下面的post请求，如果不写，会继续执行下面的代码会导致显示邮箱格式错误。这里把下面加上else if也可以
            }
```
* **验证正确性这种一般后端是必须要验证的，前端有些是可以不验证的，因为有些人可以用curl来发请求**，比如你用在开发者工具对应的请求中找到copy->copy as curl然后再git bash中打开粘贴，然后输入回车后就可以看到后端的响应了。黑客可以很简单的跨过浏览器来发请求，**所以必须要确保后端是安全的，这个地方前端部分安全与否关系不大**
* 目前的功能功能是验证必须要填写内容，比如验证密码是否匹配，邮箱是否有@等。不过这里的@还是有点问题的，还没解释这个@。
### 下面开始正式的登录
* 一般密码是不能按照明文的格式存下来的，这里只是展示存储的过程，所以把密码按照明文存储下来。
* 存储需要数据库，这里就建立一个笔记本来储存即可,增加一个文件夹db，db里面有一个文件为users。
* 首先修复前面的的这个@判断，因为JS的发明者李爵士说过如果JS中出现了@就要用%40来代替。用到一个API——[decodeURIComponent()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)方法用于解码由 encodeURIComponent 方法或者其它类似方法编码的部分统一资源标识符（URI）。修改的代码为
```
          hash[key] = decodeURIComponent(value)//decodeURIComponent可以解码@
```
* 另一个node.js的API——[fs.writeFileSync](http://nodejs.cn/api/fs.html#fs_fs_writefilesync_file_data_options).用于在某个路径存储某些数据。
* 对象是不方便保存的，对象是内存里面的东西，保存下来会显示[object Object]，必须转换为字符串，所以还要一个转换为字符串化的API——JSON.parsef
* 如果前面已经存入了[object Object]，那么就要用到[try...catch](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/try...catch)语句将能引发错误的代码放在try块中，并且对应一个响应，然后有异常被抛出。catch子句包含try块中抛出异常时要执行的语句。也就是，你想让try语句中的内容成功， 如果没成功，你想控制接下来发生的事情，这时你可以在catch语句中实现。 如果在try块中有任何一个语句（或者从try块中调用的函数）抛出异常，控制立即转向catch子句。如果在try块中没有异常抛出，会跳过catch子句。
* 修改后端的代码
```
else {
          var users = fs.readFileSync('./db/users', 'utf8')//这里的路径必须要写上最前的点.
          try {//尝试去执行这里面的代码
            users = JSON.parse(users)//[]
          } catch (error) {//如果try里面的代码执行有异常就放弃try里面的代码执行catch里面的代码,如果没有异常就跳过catch
            users=[]
          }
          users.push({ email: email, password: password })//前面的email是字符串，后面的email是变量
          var usersString=JSON.stringify(users)//把users字符串化
          fs.writeFileSync('./db/users', usersString)//存储这个支付穿化后的users，也就是usersString
          response.statusCode = 200
          response.write('success')
        }
```
* 还有问题存在，就是如果同样的注册内容会重复保存，所以要修复这个问题。

