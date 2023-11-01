export interface IHttpClientRequestDetails {
  method: Method;
  urlPath: string;
  baseUrl: string;
  data?: object;
  headers?: object;
  queryParams?: Record<string, string>;
  params?: object;
}

export interface IHttpClientResponseDetails {
  data: Record<string, unknown>;
  status: number;
  statusText?: string;
  headers: object;
}

export enum Method {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}
