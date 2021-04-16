const fs = require("fs"),
    remove= require("./remove"),
    yaml = require("js-yaml");
    
const config = yaml.load(fs.readFileSync("./config.yml",{encoding:"utf8"}))// 获取配置文件并解析配置文件，转换为json数据
const public = config.public// 获取生成路径

console.log("[INFO] Clean...")
// 判断public目录是否存在 
if (fs.existsSync(public)){
    remove.removeAll(public)// 存在则删除
    console.log("[INFO] 已清理");
}else{
    console.log("[INFO] 似乎很干净");
}
