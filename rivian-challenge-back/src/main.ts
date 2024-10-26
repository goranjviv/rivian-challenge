import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // remove undeclared properties from request
      whitelist: true,
      // block requests with undeclared properties
      forbidNonWhitelisted: true,
      // all params come as strings via network.
      // This will transform strings to whatever type is declared
      transform: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: ['HEAD', 'OPTIONS', 'GET', 'PATCH', 'PUT', 'POST', 'DELETE'],
  });


  const config = new DocumentBuilder()
    .setTitle('Rivian challenge')
    .setDescription('-')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
