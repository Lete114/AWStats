const fs = require("fs"),
    index =require("./generated"),
    connect = require("connect"),
    serveStatic = require("serve-static"),
    yaml = require("js-yaml");

const config = yaml.load(fs.readFileSync("./config.yml",{encoding:"utf8"}))// 获取配置文件并解析配置文件，转换为json数据
const public = config.public // 获取生成路径
const port = config.port || 114 // 获取端口，默认为114


const app = connect();
app.use(serveStatic(public)); // 获取静态资源路径
app.listen(port); // 端口

console.log("[INFO] 以启动服务,请访问: http://127.0.0.1:"+port);