// clean 清理

const fs = require('fs'),
    path = require('path'),
    { removeAll } = require('./utils'),
    yaml = require('js-yaml');

const root_config = path.resolve('./config.yml')
const config = yaml.load(fs.readFileSync(root_config, { encoding: 'utf8' }))// 获取配置文件并解析配置文件，转换为json数据
const public_dir = path.resolve(config.public)// 获取生成路径

console.log('[INFO] Clean...')
// 判断public目录是否存在 
if (fs.existsSync(public_dir)) {
    removeAll(public_dir)// 存在则删除
    console.log('[INFO] 已清理');
} else {
    console.log('[INFO] 似乎很干净');
}
