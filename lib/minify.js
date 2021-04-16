const path = require('path'),
    fs = require('fs'),
    yaml = require("js-yaml"),
    UglifyJS = require('uglify-js'),
    CleanCSS  = require('clean-css'),
    minifyHTML = require('html-minifier').minify;

var config = yaml.load(fs.readFileSync("./config.yml",{encoding:"utf8"}))// 获取配置文件并解析配置文件，转换为json数据
const generate_path = config.public // 获取生成路径

// 获取所有已生成的html，css，js文件
var reader = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) {
            results = results.concat(reader(file))
        } else {
        	// 过滤后缀名
            if (config.minify.html && path.extname(file) === '.html') {
                results.push(path.resolve(__dirname, file))
            }
            if (config.minify.css && path.extname(file) === '.css') {
                results.push(path.resolve(__dirname, file))
            }
            if (config.minify.js && path.extname(file) === '.js') {
                results.push(path.resolve(__dirname, file))
            }
        }
    })
    return results
}

// 开始压缩
const minify = function(arr) {
    var html=css=js = 0; // 计数
    console.log("[INFO] Minify...");
    arr.forEach(filepath => {
        let isWin = /^win/.test(process.platform)
        if(isWin) filepath = filepath.replace(/\\lib\\/,"\\");
        else filepath = filepath.replace(/\/lib\//,"/");
        if (config.minify.html && path.extname(filepath) === '.html') {
            let fileStr = fs.readFileSync(filepath, 'utf-8')
            fileStr = minifyHTML(fileStr,{
                removeComments: true,
                collapseWhitespace: true,
                minifyJS:true, 
                minifyCSS:true
            });
            fs.writeFileSync(filepath, fileStr)
            html++
        }
        if (config.minify.css && path.extname(filepath) === '.css') {
            let fileStr = fs.readFileSync(filepath, 'utf-8')
            fileStr = new CleanCSS({}).minify(fileStr);
            fs.writeFileSync(filepath, fileStr.styles)
            css++
        }
        if (config.minify.js && path.extname(filepath) === '.js') {
            let fileStr = fs.readFileSync(filepath, 'utf-8')
            fileStr = UglifyJS.minify(fileStr);
            fs.writeFileSync(filepath, fileStr.code)
            js++
        }
    })
    if(config.minify.log){
        console.log(`[INFO] 已压缩html:${html}个`);
        console.log(`[INFO] 已压缩css:${css}个`);
        console.log(`[INFO] 已压缩js:${js}个`);
    }
    
}
minify(reader(generate_path))
