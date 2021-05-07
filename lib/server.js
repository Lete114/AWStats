const fs = require("fs"),
    path = require("path"),
    http = require("http"),
    index =require("./generated"),
    yaml = require("js-yaml");

const config = yaml.load(fs.readFileSync("./config.yml",{encoding:"utf8"}))// 获取配置文件并解析配置文件，转换为json数据
const public = config.public // 获取生成路径
const port = config.port || 114 // 获取端口，默认为114

const server = http.createServer((req,res)=>{
    // 将请求转换为url对象
    var url = new URL("http://127.0.0.1:"+port+req.url)
    pathname = url.pathname

    //判断此时用户输入的地址是文件夹地址还是文件地址
    //如果是文件夹地址，那么自动请求这个文件夹中的index.html
    if(pathname.indexOf(".") == -1) {
        pathname += "./index.html";
    }
    //输入的网址是127.0.0.1/index.html
    //实际请求的是./public/index.html
    var fileURL = "./" + path.normalize("./"+public+"/" + pathname);
    //得到拓展名
    var extname = path.extname(pathname);
    //把文件读出来
    fs.readFile(fileURL,(err,data)=>{
        //读完之后做的事情
        if(err) {//文件不存在,重定向到404页面
            fs.readFile("./"+public+"/404.html",(err,data)=>{
                res.writeHead(404,{"Content-Type":"text/html;charset=utf8"});
                //如果404页面不存在则发生404错误
                if(err) res.end("404,页面没有找到");
                res.end(data);
            });
        }
        //读完之后做的事情
        getMime(extname, mime=> {
            res.writeHead(200,{"Content-Type":mime});
            res.end(data);
        });
    });

});
server.listen(port,"127.0.0.1");
console.log("[INFO] 已启动服务,请访问: http://127.0.0.1:"+port);

// 获取请求资源类型
function getMime(extname,callback) {
    fs.readFile("./lib/mime.json",(err,data)=>{
        if(err) {
            throw Error("找不到mime.json文件！");
            return ;
        }
        //转成JSON
        var mimeJSON = JSON.parse(data);
        var mime = mimeJSON[extname] || "text/plain";
        //读完执行回调函数，mime类型字符串，就是它的参数
        callback(mime);
    });
}