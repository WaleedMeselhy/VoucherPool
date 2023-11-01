import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { ClsConstants } from '../consts/cls.constants';

@Injectable()
export class TraceInterceptor implements NestInterceptor {
  constructor(
    // Inject the ClsService into the interceptor to get
    // access to the current shared cls context.
    private readonly cls: ClsService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Extract the client's ip address from the request...
    const request = context.switchToHttp().getRequest();
    const spanId = uuid();
    const traceId = request.headers[ClsConstants.TRACE_ID.toLowerCase()]
      ? request.headers[ClsConstants.TRACE_ID.toLowerCase()]
      : spanId;
    this.cls.set(ClsConstants.TRACE_ID, traceId);
    this.cls.set(ClsConstants.SPAN_ID, spanId);
    this.cls.set(ClsConstants.SERVICE_NAME, process.env.SERVICE_NAME);
    return next.handle();
  }
}
