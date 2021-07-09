// minify 压缩

const path = require('path'),
    fs = require('fs'),
    yaml = require('js-yaml'),
    UglifyJS = require('uglify-js'),
    CleanCSS = require('clean-css'),
    minifyHTML = require('html-minifier').minify;

const root_config = path.resolve('./config.yml')
const config = yaml.load(fs.readFileSync(root_config, { encoding: 'utf8' }))// 获取配置文件并解析配置文件，转换为json数据
const generate_path = path.resolve(config.public) // 获取生成路径

// 压缩
minify(reader(generate_path))

// 获取所有已生成的html，css，js文件
function reader(dir) {
    if (!fs.existsSync(dir)) return
    let results = []
    const list = fs.readdirSync(dir)
    list.forEach((file) => {
        file = path.resolve(`${dir}/${file}`)
        var stat = fs.statSync(file)
        if (stat.isDirectory()) {
            results = results.concat(reader(file))
        } else {
            // 过滤后缀名
            if (config.minify.html && path.extname(file) === '.html') {
                results.push(path.resolve(file))
            }
            if (config.minify.css && path.extname(file) === '.css') {
                results.push(path.resolve(file))
            }
            if (config.minify.js && path.extname(file) === '.js') {
                results.push(path.resolve(file))
            }
        }
    })
    return results
}

// 开始压缩
function minify(arr) {
    if (!arr) return
    // 计数
    let html = 0,
        css = 0,
        js = 0;
    console.log('[INFO] Minify...');
    arr.forEach(filepath => {
        if (config.minify.html && path.extname(filepath) === '.html') {
            let fileStr = fs.readFileSync(filepath, 'utf-8')
            fileStr = minifyHTML(fileStr, {
                removeComments: true,
                collapseWhitespace: true,
                minifyJS: true,
                minifyCSS: true
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
    if (config.minify.log) {
        console.log(`[INFO] 已压缩html:${html}个`);
        console.log(`[INFO] 已压缩css:${css}个`);
        console.log(`[INFO] 已压缩js:${js}个`);
    }

}
