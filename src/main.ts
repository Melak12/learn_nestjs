import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { ConvertIntPipe } from './common/pipes/convert-int.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add Validation Pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, //auto transform payloads to dto types. This avoids parseXXX pipes in the controller's param 
    transformOptions: {
      enableImplicitConversion: true, //set in our ValidationPipe and we don't have to explicitly specify types with @Type() decorator
    }
  }));

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new WrapResponseInterceptor(), new TimeoutInterceptor())

  app.useGlobalPipes(new ConvertIntPipe)

  await app.listen(3000);
}
bootstrap();
