// 引入模块
const fs = require("fs"),
    path = require("path"),
    ejs = require('ejs'),
    yaml = require("js-yaml"),
    remove= require("./remove"),
    copy = require("./copy");

const config = yaml.load(fs.readFileSync("./config.yml",{encoding:"utf8"}))// 获取根目录配置文件
const public = config.public // 获取生成路径
const source = config.themes // 获取主题
const themes = yaml.load(fs.readFileSync("themes/"+source+"/config.yml",{encoding:"utf8"}))// 获取主题配置文件
const ConfigData = {config,themes} // 合并配置文件和主题配置文件

console.log("[INFO] Generated...");


// 判断public目录是否存在 
if (fs.existsSync(public))remove.removeAll(public);// 存在则删除
fs.mkdirSync(public);// 新建public

// 将主题的静态资源(static)复制到生成路径(public)
copy.exists("themes/"+source+"/static",`./${public}/static`,copy.copyDir)

// 解析ejs
var getEjs = (EjsFilePath)=>{
    var files = fs.readdirSync(EjsFilePath); // 获取ejs文件
    for (let item of files) {
        var FilePath = `${EjsFilePath}/${item}`
        var stats = fs.statSync(FilePath);
        if (stats.isDirectory()) { // 是否是目录 是：回调ejs解析方法 否：执行解析
            getEjs(FilePath)
        } else {
            if(path.extname(item) === '.ejs'){ // 只解析ejs文件
                // 获取ejs文件名
                FilePath = FilePath.replace(new RegExp("themes/"+source+"/template/","g"),"")
                if(path.dirname(FilePath)!="."){//判断是否是文件夹
                    fs.mkdirSync(path.dirname(public+"/"+FilePath)) // 创建文件夹
                }
                // 开始解析ejs
                ejs.renderFile(`${EjsFilePath}/${item}`, ConfigData, (err, HTMLData) => {
                    if (err) {
                        console.log(err);
                    } else {
                        /**
                         * newHtmlFilePath 
                         * @param path.dirname(FilePath) 获取路径名
                         * @param path.basename(FilePath,".ejs") 获取文件名，并过滤掉.ejs后缀
                         * 
                         */
                        let newHtmlFilePath = path.dirname(FilePath)+"/"+path.basename(FilePath,".ejs")
                        // 新建html文件
                        fs.writeFile(`./${public}/${newHtmlFilePath}.html`,HTMLData,'utf8',function(error){
                            if(error){
                                console.log(error);
                                return false;
                            }
                        })
                    }
                })
            }
        }
    }
}
getEjs("themes/"+source+"/template")

console.log("[INFO] 已完成");
