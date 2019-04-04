module.exports = {
  root: process.cwd(),
  host: '127.0.0.1',
  port: '9527',
  // 缓存相关的属性, 初始化值
  cache: {
    maxAge: 600,
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true
  }
}