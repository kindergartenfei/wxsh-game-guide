export function errorHandler(err, req, res, next) {
  console.error('[Error]', err)

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ code: 400, message: '数据已存在', data: null })
  }

  if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(500).json({
      code: 500,
      message: '数据库连接失败，请检查 MySQL 与 .env 配置',
      data: null,
    })
  }

  const status = err.status || 500
  res.status(status).json({
    code: err.code && Number.isInteger(err.code) ? err.code : status,
    message: err.message || '服务器内部错误',
    data: null,
  })
}
