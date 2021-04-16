const fs = require('fs'),
    yaml = require("js-yaml");
// 获取配置文件并解析配置文件，转换为json数据
var config = yaml.load(fs.readFileSync("./config.yml",{encoding:"utf8"}))
// 获取生成路径
const public = config.public
/**
 * 复制一个文件夹下的文件到另一个文件夹
 * @param src 源文件夹
 * @param newSrc 目标文件夹
 */
const copyDir = function (src, newSrc) {
    // 读取目录中的所有文件/目录
    fs.readdir(src, function (err, paths) {
        if (err) {
            throw err
        }
        paths.forEach(function (path) {
            const _src = src + '/' + path
            const _newSrc = newSrc + '/' + path
            let readable; let writable
            fs.stat(_src, function (err, stat) {
                if (err) {
                    throw err
                }
                // 判断是否为文件
                if (stat.isFile()) {
                    // 创建读取流
                    readable = fs.createReadStream(_src)
                    // 创建写入流
                    writable = fs.createWriteStream(_newSrc)
                    // 通过管道来传输流
                    readable.pipe(writable)
                }
                // 如果是目录则递归调用自身
                else if (stat.isDirectory()) {
                    exists(_src, _newSrc, copyDir)
                }
            })
        })
    })
}
/**
 * 在复制目录前需要判断该目录是否存在，
 * 不存在需要先创建目录
 * @param src // 原目录
 * @param newSrc // 新目录
 * @param callback
 */
const exists = function (src, newSrc, callback) {
    // 使用正则去除/static目录
    newSrc = newSrc.replace(new RegExp(public+"/static/","g"),public+"/")
    newSrc = newSrc.replace(new RegExp(public+"/static","g"),public+"")
    // 如果路径存在，则返回 true，否则返回 false。
    if (fs.existsSync(newSrc)) {
        callback(src, newSrc)
    } else {
        fs.mkdir(newSrc, function () {
            callback(src, newSrc)
        })
    }
}

module.exports = { exists, copyDir};