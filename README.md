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
* 主要思路就是用if来判断完成后返回这个函数，**[return](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/return)后就终止后面的代码操作了**，代码如下
```
        $form.on('submit', (e) => {
          最上面是有一个submit的监听函数
          --------------这里的分割线---------------
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
* [JSON.stringify](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)方法是将一个JavaScript值(对象或者数组)转换为一个 JSON字符串，如果指定了replacer是一个函数，则可以选择性的替换值，或者如果指定了replacer是一个数组，可选择性的仅包含数组指定的属性
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
* 还有问题存在，就是如果**同样的注册内容会重复保存，所以要修复这个问题**。增加部分代码来判断重复
* 这里用到的[break](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/break)是**终止循环**
```
          let inUser=false//判断先设置为false
          for(i=0;i<users.length;i++){
            let user=users[i]//把数据库里面的每个对象样式的字符串赋值给user
            if(user.email===email){//如果数据库里面的邮箱和获取到用户的邮箱是一样的，那么就把inUser设置成true
              inUser=true
              break;
            }
          }
          if(inUser){//如果inUser是true那么就判断重复了
            response.statusCode = 400
            response.write('email is used')//这里可以复杂一点改成返回给前端一个JSON，这里就不麻烦了
          }
          else{
            users.push({ email: email, password: password })//前面的email是字符串，后面的email是变量
            var usersString=JSON.stringify(users)//把users字符串化
            fs.writeFileSync('./db/users', usersString)//存储这个字符串化后的users，也就是usersString
            response.statusCode = 200
            response.write('success')
          }
```
* 前端拿到后端返回的email is used之后可以翻译一下解释给用户也行。
* 还存在问题就是理论上来说密码储存是需要加密的，用户输入密码后，会把这个密码再次加密后与之前数据库里面的加密的进行对比。
***
* 前面的都是注册页面，下面就先做一个**登陆页面**
***
### 做一个登陆页面
* 创建一个等于页面的html，名字为sign-in，它的结构基本上和注册的页面很像。具体可以看代码。
* 后端增加关于登陆界面的路由，包括get和post，这里的[401](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/401)代表客户端错误，指的是由于缺乏目标资源要求的身份验证凭证，发送的请求未得到满足。
```
  else if (path === '/sign_in' && method === 'GET') {
    let string = fs.readFileSync('./sign_in.html', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }
  else if (path === '/sign_in' && method === 'POST') {
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
        let { email, password } = hash//这一行代码代表前面三行代码，这是ES6的新的语法

        if (email.indexOf('@') === -1) {
          response.statusCode = 400
          response.setHeader('Content-Type', 'application/json;charset=utf-8')
          response.write(`{
          "errors":{
            "email":"invalid"
          }
        }`)
        }

        var users = fs.readFileSync('./db/users', 'utf8')//这里的路径必须要写上最前的点.
        users = JSON.parse(users)//这个是把能否储存的字符串对象化从而可以使用

        let found=false
        for(i=0;i<users.length;i++){
          let user=users[i]
          if(user.email===email&&user.password===password){//判断用户提供的邮箱和密码是否和数据库中的匹配
            found=true
            break
          }
        }
        if(found){//如果匹配就200成功
          response.statusCode = 200
        }else{//如果不匹配就401验证失败
          response.statusCode = 401//401的意思是邮箱密码等验证失败的代码
        }

        response.end()
      })
  }
```
* 实际工作中应该会比这个复杂更多，比如**前端还可以去做一些验证，还没有去除空格等**
* 注册成功就跳转到登陆界面
```
                        window.location.href = '/sign_in'//注册成功之后跳转到登陆界面
```
### 接下来如果登陆成功就跳转到首页
* 增加一个简单的首页index.html，方便跳转用。
* 用到一个跳转的API——[Location](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/href)和[Location.href](https://developer.mozilla.org/zh-CN/docs/Web/API/URLUtils/href)
* [Location的W3school链接](https://www.w3school.com.cn/jsref/dom_obj_location.asp)
* 前端部分增加成功后跳转到首页代码
```
                .then(
                    (r) => {
                        window.location.href = '/'
                        console.log('成功', r)
                    },//这里的r就是服务器返回的response，也就是符合html语法的字符串
```
* 邮箱或密码数据库中不存在，后端增加代码，不匹配的返回JSON信息
```
else{//如果不匹配就401验证失败
          response.statusCode = 401//401的意思是邮箱密码等验证失败的代码，而且必须要放到该路由的最前面才可以
          response.setHeader('Content-Type', 'application/json;charset=utf-8')
          response.write(`{
          "errors":{
            "matchEmailAndPassword":"invalid"
          }
        }`)
        }
```
* 前端获取到后端返回的信息判断后告诉用户邮箱或密码不匹配
```
                        if(errors.matchEmailAndPassword && errors.matchEmailAndPassword === 'invalid'){
                            alert('账户或密码有误')
                        }
```
### 引入cookie这个主题
* 目前存在2个问题
1. 目前来看没有办法阻止来访问首页，就是直接输入主页地址也是可以跳转的，根本不需要邮箱和密码来跳转，**说明就算不登录也可以看到登陆后的内容，如果是这样用户就没必要登陆，这个要想个办法解决**。
2. **登陆之后能否把邮箱名字显示在某个位置**，方便用户知道是自己登陆了。
* 此时就需要引入[cookie](https://zhuanlan.zhihu.com/p/22396872?refer=study-fe)啦，它是一个请求头，告诉你你是谁
* 维基百科关于[cookie链接](https://zh.wikipedia.org/wiki/Cookie)，MDN关于[cookie链接](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cookie)
* 什么时候需要设置cookie——**就是在登陆成功的一瞬间你需要设置cookie**
* 用到的API——[set-cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie)被用来由服务器端向客户端发送 cookie，我们后端加上一句代码
```
          response.setHeader('Set-Cookie',`sign_in_email=${email}`)
```
* 这样我们登陆成功后就会带上这个设置的cookie，怎么看到呢？我们把perserve log打开，然后登陆成功后就可以看到sign_in和主页的两个请求，一个是POST一个是GET，我们可以看到sign_in的Response Headers的view source里面多了一个Set-Cookie: sign_in_email=**你输入的邮箱**,然后再你的请求Request Header的view source里面也会**自动带上Cookie: sign_in_email=你设置的邮箱，主页的GET请求Request Headers里面的view source也会带上这个Cookie: sign_in_email=你设置的邮箱的请求头**
* 说明只要后端响应了一个cookie头，**从此以后，只要是相同的源(或者相同的域名)访问都需要带上这个cookie头**
* 这个cookie类似于去公园给你(响应)的一张票，每次进公园（请求）都需要出示这张票，不然不能进去。
* cookie特点
1. 服务器通过Set-Cookie响应头设置Cookie
2. 浏览器得到Cookie之后，每次请求都要带上Cookie
3. 服务器读取Cookie就知道登陆用户的信息(比如email)
* 问题
1. 如果在Chrome登陆得到Cookie，用Safari访问，Safari会带上Cookie吗？不会，比如你在chrome浏览器登陆知乎，那么你在手机上还是需要重新登陆知乎。它只认识那张票(cookie)，这个票(cookie)是跟着浏览器走的。
2. Cookie存在哪里——window里面存在C盘的一个文件里面，其他系统存在E盘文件，一般不让你去找到它，它不希望你改动它。
3. 票能作假吗？是可以的。我们通过开发者工具里面的Application里面有一个Cookies，，**打开之后可以在Value中双击篡改它,刷新之后看到请求里面的Cookie已经是改动之后的值了所以Cookie是不安全的，用户想改很容易，所以如果你在Cookie里面存了值，你是不能相信这个值的，用户稍微有点前端知识就可以更改这个Cookie，这时候我们可以使用[session](https://github.com/bomber063/Session-LocalStorage-Cache-Control-for-45)来避免用户来很容易的更改**
4. Cookie有有效期吗？是有的，有时候登陆会让你选择记住一周，这就是一周后失效。当然如果你不记住或者设置失效时间，本身默认的有效期有20分钟左右(这个左右是因为由浏览器自己决定)，比如你如果一直开着浏览器可能这个Cookie就长时间有效，如果你把浏览器关了，那么就会有一个默认浏览器失效时间来控制，如果你关闭后马上又再次打开，这个Cookie是还在的，但是你第二天再去打开肯定这个Cookie没有了，需要重新登陆。**这个有效期后端可以强制来设置**  

   1. 你可以设置cookie 的最长有效时间——Expires=<date> 可选
   2. 你可以设置在 cookie 失效之前需要经过的秒数——Max-Age=<non-zero-digit> 可选，假如二者 （指 Expires 和Max-Age） 均存在，那么 Max-Age 优先级更高。
   3. 指定 cookie 可以送达的主机名——Domain=<domain-value> ，一个网站只会带上自己域名的Cookie，是不会带上其他域名的Cookie，比如知乎在我的浏览器上有Cookie，百度在我的浏览器上有Cookie，但是你只能看到自己的Cookie，因为Cookie是按照域名分组的。
   4. 指定一个 URL 路径——Path=<path-value> 可选
   5. 一个带有安全属性的 cookie 只有在请求使用SSL和HTTPS协议的时候才会被发送到服务器——Secure 可选
   6. 设置了 HttpOnly 属性的 cookie 不能使用 JavaScript 经由  Document.cookie 属性、XMLHttpRequest 和  Request APIs 进行访问，以防范跨站脚本攻击（XSS）——HttpOnly 可选，**这里说的是防止用户用JavaScript改，但是可以通过其他方式修改(比如在开发者工具中修改)。我们通过代码验证**
   ```
    document.cookie就可以看到Cookie
   ```
   但是如果设置了HttpOnly，比如
   ```
          response.setHeader('Set-Cookie',`sign_in_email=${email};HttpOnly`)
   ```
   那么
   ```
   document.cookie就看不到这个Cookie了
   ```
   7. 允许服务器设定一则 cookie 不随着跨域请求一起发送——SameSite=Lax 可选
5. Cookie 遵守同源策略吗？
**也有，不过跟 AJAX 的同源策略稍微有些不同**。
当请求 qq.com 下的资源时，浏览器会默认带上 qq.com 对应的 Cookie，不会带上 baidu.com 对应的 Cookie
当请求 v.qq.com 下的资源时，浏览器不仅会带上 v.qq.com 的Cookie，还会带上 qq.com 的 Cookie
另外 Cookie 还可以根据路径做限制，请自行了解，这个功能用得比较少。  
### 用户登录后展示用户的信息
* 用到node.js的一个API，通过在Google上查询nodejs read cookie,找到[链接](https://stackoverflow.com/questions/3393854/get-and-set-a-single-cookie-with-node-js-http-server),它就是request.headers.cookie,我们通过代码就可以在nodejs上看到cookie的结果啦
```
    console.log(request.headers.cookie)
```
* 如果我们有多个cookie，那么就会用分号; 和空格来分隔，比如
```
sign_in_email=1@; a=1; b=2
```
* 我们用到的API——[replace](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace)方法返回一个由替换值（replacement）替换一些或所有匹配的模式（pattern）后的新字符串。模式可以是一个字符串或者一个正则表达式，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。
* 前端首页我们用一个占位符--zhan--来表示登陆成功后会被更改的地方
```
  <h1>你的用户名为--zhan--</h1>
```
* 后端代码增加部分用于验证cookie
```
    let cookie=request.headers.cookie.split('; ')//这里是分号空格来分隔这个cookie，这个cookie类似于a=1; b=2; sign_in_email=eee
    let hash={}
    for(i=0;i<cookie.length;i++){
      let parts=cookie[i].split('=')//继续用=来分隔这个cookie
      let key=parts[0]//第一部分就是前面设置的cookie名字          response.setHeader('Set-Cookie',`sign_in_email=${email};HttpOnly`)
      let value=parts[1]//这个第二部分就是cookie的值，对应邮箱
      hash[key]=value//把所有的信息都存入这个hash
    }
    let email=hash.sign_in_email
    let users=fs.readFileSync('./db/users','utf8')//读取数据库中存储的信息
    users=JSON.parse(users)//把数据库中的字符串转换为对象
    let found=false
    for(i=0;i<users.length;i++){
      if(users[i].email===email){//如果数据库中有一个邮箱和用户的邮箱(也就是cookie的值)相同，就停止退出并把found=true
        found=true
        break
      }
    }
    if(found){
      string=string.replace('--zhan--',email)//如果found=true说明这个Cookie的值没问题，就把占位符替换，显示用户的邮箱
    }
    else{
      string=string.replace('--zhan--','不知道')//如果found=false说明这个Cookie的值有问题，就把占位符替换，显示不知道
    }
```
* 在开发者工具里面打开cookie点击×删除这个用户cookie就代表没有登陆，那么就不会显示用户名啦。
### 处理了一个undefined的bug
* 我在db/users里面写了一个{"e":"234234@qq","p":"1"}，这个邮箱email变成了e，那么在执行下面的代码的时候会一致显示undefined，如果把{"e":"234234@qq","p":"1"}改成{"email":"234234@qq","p":"1"}就没有问题了
```
    let email=hash.sign_in_email//这里会导致email为undefined
    let users=fs.readFileSync('./db/users','utf8')
    users=JSON.parse(users)
    let found=false
    for(i=0;i<users.length;i++){
      if(users[i].email===email){//这样有一个i里面没有email，那么就是undefined===undefined，这样就会导致found=true
        found=true
        // console.log(users)
        break
      }
    }
    if(found){
      string=string.replace('__zhan__', email)//email就是undefined，所以会显示undefined，不会继续执行下一步的else
    }
    else{
      string=string.replace('__zhan__', '不知道')//不会执行到这里
    }
```
### 回顾整个过程
1. 用户打开sign_up注册页面注册，**客户端发情一个post请求**，请求内容带上邮箱，密码和确认密码提供给服务器(server)
2. **服务器(server)**收到没有问题(比如服务器中已经有注册，重复了，或者邮箱密码不合法等等就是有问题)就会把邮箱和密码**记录在数据库中**，然后告诉用户注册成功
3. 用户打开**登陆sign_in页面开始登陆**，**客户端发起一个post请求**，请求内容带上邮箱和密码。
4. **服务器(server)**收到邮箱和密码后看**是否在数据库中**，如果在就可以登陆成功，如果不在说明不能登陆失败。
5. 如果**登陆成功，服务器(server)会响应给客户端一个Cookie，比如'Set-Cookie', `sign_in_email=bomber@163.com**，客户端就会把这个Cookie记下来
6. 客户端登陆成功，并获取到Cookie后，登陆首页会**带上这个Cookie，这是一个GET请求**。
7. 服务器(server)会**读取客服端带上的这个Cookie**，用这个Cookie里面的信息(比如邮箱)去找数据库中的user，数据库中的users信息可以包括，名字，邮箱，密码，生日等等(只要用户填写的信息都会保存)，**因为一个user可以包括用户的所有信息，只要邮箱对应上，就可以找到该用户的其他信息**
8. 服务器(server)就会在**HTML中填上对应的信息**（比如用户名），然后把这个**新的HTML响应给用户**。
* 另一个用户去打开首页，因为**没有Cookie**，那么就**不会替换任何首页内容**，这个首页是所有人都可以看到的普通页面。
* 设置了Cookie之后所有同源的请求都会带上这个Cookie，不同源肯定就不会带上啦。**Cookie是跟着域名一起的**。


