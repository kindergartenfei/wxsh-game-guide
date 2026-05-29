import app from './app.js'
import { config } from './config/index.js'
import { testConnection } from './db/pool.js'

async function bootstrap() {
  try {
    await testConnection()
    console.log(`[DB] 已连接 ${config.db.database}@${config.db.host}:${config.db.port}`)
  } catch (err) {
    console.warn('[DB] 连接失败，服务仍会启动，请检查 MySQL:', err.message)
  }

  app.listen(config.port, () => {
    console.log(`[Server] http://localhost:${config.port}`)
    console.log(`[API]    http://localhost:${config.port}/api/pets`)
  })
}

bootstrap()
