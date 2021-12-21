import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException) //it can be comma separeted list of Exception types
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); //this gives us access to the native inflight request or response objects
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    const error = typeof response === 'string' ? {message: exceptionResponse}
    :(exceptionResponse as object);

    //todo: log the exception here.

    response.status(status).json({
      ...error,
      timestamp: new Date().toISOString()
    });

  }
}
