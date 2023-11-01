import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(Error)
@Injectable()
export class GenericErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (exception instanceof HttpException) {
      this.mapHttpResponse(request, response, exception);
    } else {
      this.mapToResponse(request, response, exception);
    }
  }

  private mapToResponse(
    request: Request,
    response: Response,
    exception: Error
  ): void {
    Logger.error(exception + " " + exception.stack);
    switch (exception.name) {
      case "NotFoundError":
        response.status(404).json({
          errorCode: 404,
          timestamp: new Date().toISOString(),
          path: request.url,
          error: {
            statusCode: 404,
            message: "Resource Not Found",
            error: "Resource Not Found",
          },
        });
        break;
      default:
        response.status(500).json({
          errorCode: 500,
          timestamp: new Date().toISOString(),
          path: request.url,
          error: {
            statusCode: 500,
            message: "Internal Error",
            error: "Internal Error",
          },
        });
    }
  }

  private mapHttpResponse(
    request: Request,
    response: Response,
    exception: HttpException
  ): void {
    response.status(exception.getStatus()).json({
      errorCode: exception.getStatus(),
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception.getResponse(),
    });
  }
}
