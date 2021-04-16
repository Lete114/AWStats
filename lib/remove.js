var fs = require("fs");


/**
 * 
 * @param path 删除目录下的所有文件及目录，包括当前目录
 */
var removeAll = (path)=>{
    var files = fs.readdirSync(path);
    for (let item of files) {
        var stats = fs.statSync(`${path}/${item}`);
        if (stats.isDirectory()) {
            removeAll(`${path}/${item}`)
        } else {
            fs.unlinkSync(`${path}/${item}`)
        }
    }
    fs.rmdirSync(path)
}

/**
 * 
 * @param dir 删除目录下的所有文件及目录，不删除目录下的.git文件夹及文件
 */
let remove = (dir)=> {
    const dir_path = ".deploy_git"
    let list = fs.readdirSync(dir)
    // 移除.deploy_git目录
    var childDir = dir == dir_path?null:dir
    // resultsArr.push(childDir)
    list.forEach(function(file) {
        // 排除.git目录
        if (file === '.git') return false
        // 获取文件路径
        file = dir + '/' + file
        let stat = fs.statSync(file)
        // 如果是目录，则进入该目录
        if (stat && stat.isDirectory()) {
            remove(file)
        } else {
            fs.unlinkSync(file); //删除文件
        }
    })
    // 删除目录
    if(childDir!=null){
        fs.rmdirSync(childDir)
    }
}
module.exports = {remove,removeAll};