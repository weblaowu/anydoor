const {cache} = require('../config/conf');
const refresh = (stats, res) => {
  const {
    maxAge,
    expires,
    cacheControl,
    lastModified,
    etag
  } = cache;
  if (cacheControl) {
    res.setHeader('cache-control', `on-store`)
  }
  if (expires) {
    res.setHeader('Expries', (new Date(Date.now() + maxAge * 1000)).toUTCString());
  }
  if (lastModified) {
    res.setHeader('Last-Modified', stats.mtime.toUTCString());
  }
  if (etag) {
    res.setHeader('Etag', `${stats.size}-${stats.mtime}`);
  }
};

module.exports = function isFresh(stats, req, res) {
  // 调用refresh, 判断并设置响应头
  refresh(stats,res);
  // 获取请求头部信息 协商缓存 的两个字段
  const lastModified = req.headers['if-modified-since'];
  const etag = req.headers['if-none-match'];
   // 如果没有这两个字段，说明没有走协商缓存
  if(!lastModified && !etag){
    return false;
  }
  if(lastModified && lastModified!== res.getHeader('Last-Modified')){
    return false;
  }
  if(etag && etag!==  res.getHeader('ETag')){
    return false;
  }
  // 否则，可以用缓存
  return true; 
}