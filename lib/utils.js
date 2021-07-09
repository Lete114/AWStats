// utils 工具

const fs = require('fs'),
    path = require('path');


/**
 * 在复制目录前需要判断该目录是否存在，
 * 不存在需要先创建目录
 * @param src // 原目录
 * @param newSrc // 新目录
 */
function copy_before(src, newSrc) {
    // 如果路径存在，则返回 true，否则返回 false。
    if (fs.existsSync(newSrc)) copy(src, newSrc)
    else {
        fs.mkdir(newSrc, () => {
            copy(src, newSrc)
        })
    }
}

/**
 * 复制一个文件夹下的文件到另一个文件夹
 * @param src 源文件夹
 * @param newSrc 目标文件夹
 */
function copy(src, newSrc) {
    // 读取目录中的所有文件/目录
    fs.readdir(src, (err, paths) => {
        if (err) throw err
        paths.forEach((_path) => {
            const _src = path.resolve(`${src}/${_path}`)
            const _newSrc = path.resolve(`${newSrc}/${_path}`)
            fs.stat(_src, (err, stat) => {
                if (err) throw err
                // 判断是否为文件
                if (stat.isFile()) {
                    // 创建读取流
                    let readable = fs.createReadStream(_src)
                    // 创建写入流
                    let writable = fs.createWriteStream(_newSrc)
                    // 通过管道来传输流
                    readable.pipe(writable)

                    // 以下方法性能会比如上方法快，此处留做后续参考
                    /*
                        // pipe执行效率：0.050ms-0.020ms
                        // buffer执行效率：0.020ms-0.008ms
                        readable.on('data', (chunk) => {
                            writable.write(chunk)
                        })
                        readable.on('end',()=>{
                            writable.end()
                        })
                    */
                }
                // 如果是目录则递归调用自身
                else if (stat.isDirectory()) {
                    copy_before(_src, _newSrc)
                }
            })
        })
    })
}

/**
 * 删除目录下的所有文件及目录，包括当前目录
 * @param path 需要删除的路径文件夹
 */
function removeAll(_path) {
    const files = fs.readdirSync(_path);
    for (let item of files) {
        const file_path = path.resolve(`${_path}/${item}`)
        const stats = fs.statSync(file_path);
        if (stats.isDirectory()) removeAll(file_path)
        else fs.unlinkSync(file_path)//删除文件
    }
    fs.rmdirSync(_path)// 删除文件夹
}

module.exports = { copy_before, copy, removeAll };