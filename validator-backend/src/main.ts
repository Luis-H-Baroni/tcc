import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import './patch'

const port = process.env.PORT || 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  })
  await app.listen(port)
}
bootstrap()
