import { Method } from "../http/dto/dto.lib.http";

export class TransactionLogObject {
  serviceName: string;
  traceId: string;
  spanId: string;
  integrationName: string;
  layer: string;
  requestTime: string;
  ip: string;
  method: Method;
  url: string;
  host: string;
  requestParams: string;
  query: string;
  requestHeaders: unknown;
  requestBody: string;
  statusCode: string;
  responseHeaders: string;
  response: string;
  elapsedTime: number;

  setIntegrationName(value: string): TransactionLogObject {
    this.integrationName = value;
    return this;
  }

  setLayer(value: string): TransactionLogObject {
    this.layer = value;
    return this;
  }

  setRequestTime(value: string): TransactionLogObject {
    this.requestTime = value;
    return this;
  }

  setIp(value: string): TransactionLogObject {
    this.ip = value;
    return this;
  }

  setTraceId(value: string): TransactionLogObject {
    this.traceId = value;
    return this;
  }

  setSpanId(value: string): TransactionLogObject {
    this.spanId = value;
    return this;
  }

  setMethod(value: Method): TransactionLogObject {
    this.method = value;
    return this;
  }

  setUrl(value: string): TransactionLogObject {
    this.url = value;
    return this;
  }

  setHost(value: string): TransactionLogObject {
    this.host = value;
    return this;
  }

  setRequestParams(value: string): TransactionLogObject {
    this.requestParams = value;
    return this;
  }

  setQuery(value: string): TransactionLogObject {
    this.query = value;
    return this;
  }

  setRequestHeaders(value: unknown): TransactionLogObject {
    this.requestHeaders = value;
    return this;
  }

  setRequestBody(value: string): TransactionLogObject {
    this.requestBody = value;
    return this;
  }

  setStatusCode(value: string): TransactionLogObject {
    this.statusCode = value;
    return this;
  }

  setResponseHeaders(value: string): TransactionLogObject {
    this.responseHeaders = value;
    return this;
  }

  setResponse(value: string): TransactionLogObject {
    this.response = value;
    return this;
  }

  setElapsedTime(value: number): TransactionLogObject {
    this.elapsedTime = value;
    return this;
  }
}
