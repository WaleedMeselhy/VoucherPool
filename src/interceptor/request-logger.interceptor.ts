import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import * as moment from 'moment';
import { Logger } from '../lib/Logger/log4j.lib.logger';
import { TransactionLogObject } from '../lib/Logger/dto.lib.logger';
import { ClsConstants } from 'src/consts/cls.constants';
import * as SafeJsonStringify from 'json-stringify-safe';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService, private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const httpResponse = context.switchToHttp().getResponse();
    const { hostname, url, method, params, query, body, headers, ip } = req;
    const start = Date.now();
    return next.handle().pipe(
      tap((response) => {
        httpResponse.setHeader(ClsConstants.TRACE_ID.toLocaleLowerCase(), this.cls.get<string>(ClsConstants.TRACE_ID));
        httpResponse.setHeader(ClsConstants.SPAN_ID.toLocaleLowerCase(), this.cls.get<string>(ClsConstants.SPAN_ID));
        const res = Date.now() - start;
        const transactionLog: TransactionLogObject = new TransactionLogObject()
          .setLayer('controller')
          .setRequestTime(moment(start).format('DD-MMM-YYYY HH:mm:ss'))
          .setTraceId(headers[ClsConstants.TRACE_ID.toLowerCase()])
          .setSpanId(headers[ClsConstants.TRACE_ID.toLowerCase()])
          .setIp(ip)
          .setTraceId(this.cls.get<string>(ClsConstants.TRACE_ID))
          .setSpanId(this.cls.get<string>(ClsConstants.SPAN_ID))
          .setMethod(method)
          .setUrl(url)
          .setHost(hostname)
          .setRequestParams(SafeJsonStringify(params))
          .setQuery(SafeJsonStringify(query))
          .setRequestHeaders(SafeJsonStringify(headers))
          .setRequestBody(SafeJsonStringify(body))
          .setStatusCode(httpResponse.statusCode)
          .setResponseHeaders(SafeJsonStringify(headers))
          .setResponse(SafeJsonStringify(response))
          .setElapsedTime(res);

        this.logger.info(transactionLog);
      }),
      catchError((err) => {
        httpResponse.setHeader(ClsConstants.TRACE_ID.toLocaleLowerCase(), this.cls.get<string>(ClsConstants.TRACE_ID));
        httpResponse.setHeader(ClsConstants.SPAN_ID.toLocaleLowerCase(), this.cls.get<string>(ClsConstants.SPAN_ID));
        const res = Date.now() - start;
        const transactionLog: TransactionLogObject = new TransactionLogObject()
          .setTraceId(this.cls.get<string>(ClsConstants.TRACE_ID))
          .setSpanId(this.cls.get<string>(ClsConstants.SPAN_ID))
          .setLayer('controller')
          .setRequestTime(moment(start).format('DD-MMM-YYYY HH:mm:ss'))
          .setIp(ip)
          .setMethod(method)
          .setUrl(url)
          .setHost(hostname)
          .setRequestParams(SafeJsonStringify(params))
          .setQuery(SafeJsonStringify(query))
          .setRequestHeaders(SafeJsonStringify(headers))
          .setRequestBody(SafeJsonStringify(body))
          .setStatusCode(err.status)
          .setResponseHeaders(SafeJsonStringify(headers))
          .setResponse(SafeJsonStringify(err.response))
          .setElapsedTime(res);

        this.logger.error(transactionLog);
        throw err;
      })
    );
  }
}
