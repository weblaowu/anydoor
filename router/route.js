const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);      
const readdir = promisify(fs.readdir); 
const Headerbar = require('handlebars');
const path = require('path');
const config = require('../config/conf');

// 引入 template ,同步方法，只执行一次准备好模板
const source = fs.readFileSync(path.join(__dirname,'../template/dir.html'));
// 编译一下模板，source读到的是buffer, toString 转成字符串
const temp = Headerbar.compile(source.toString());

module.exports = async function (req, res, filePath) {
  try {
    const stats = await stat(filePath);
    // 判断是否是文件
    if (stats.isFile()) {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/plain');
      // 把文件内容通过流的方式一点一点读 出来
      fs.createReadStream(filePath, {
        encoding: 'utf8'
      }).pipe(res);
    } else if (stats.isDirectory()) { // 判断是否是文件夹
      // 如果是，读目录
      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      // 需要什么样的数据，展示出来
      const dir  = path.relative(config.root, filePath);
      const data = {
        title: path.basename(filePath),
        dir: `/${dir}`,
        files
      }
      res.end(temp(data));
    }
  } catch (err) {
    res.statusCode = 404;
    res.setHeader('Content-type', 'text/plain');
    res.end(`${filePath} is not a directory or file`);
  }
}