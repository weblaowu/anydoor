const http = require('http');
const conf = require('./config/conf');
const path = require('path');
const route = require('./router/route');
// 创建一个 node 服务
http.createServer((req, res) => {
  // 拿到绝对路径
  const filePath = path.join(conf.root, req.url);
  route(req,res,filePath);
  
}).listen(conf.port, conf.host, () => {
  const url = `http://${conf.host}:${conf.port}`;
  console.info(`Server started at : ${url}`);
});