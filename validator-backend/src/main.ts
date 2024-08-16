import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import './patch'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  })
  await app.listen(3000)
}
bootstrap()
