import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosError } from 'axios';
import { Injectable } from '@nestjs/common';
import { IHttpClientLib } from '../interface/i-http-client.lib.http';
import { IHttpClientRequestDetails, IHttpClientResponseDetails, Method } from '../dto/dto.lib.http';
import { Logger } from '../../Logger/log4j.lib.logger';
import { ClsService } from 'nestjs-cls';
import { ClsConstants } from '../../../consts/cls.constants';
import { TransactionLogObject } from 'src/lib/Logger/dto.lib.logger';
import * as IP from 'ip';
import * as SafeJsonStringify from 'json-stringify-safe';

@Injectable()
export class AxiosHttpClient implements IHttpClientLib {
  axios: AxiosInstance;

  constructor(private logger: Logger, private readonly cls: ClsService) {
    this.axios = axios.create();
    this.createLoggingInterceptors(this.axios, cls, logger);
  }

  // setRetrialOnFailure(retrials: number): void {
  //	axiosRetry(this.axios, {retries: retrials});
  // }

  createLoggingInterceptors(axios: AxiosInstance, cls: ClsService, logger: Logger): void {
    this.axios.interceptors.request.use(
      function (config) {
        // Do something before request is sent
        const traceId = cls.get<string>(ClsConstants.TRACE_ID);
        // set traceId in headers
        config.headers.traceId = traceId;
        config['startTime'] = new Date().toISOString();
        return config;
      },
      function (error) {
        // Do something with request error
        // console.log("before request error",error);
        logger.error('Axios Error:' + error);
        return Promise.reject(error);
      }
    );

    this.axios.interceptors.response.use(
      function (response) {
        const headers = response.config.headers;
        const clonedHeaders = { ...headers };
        clonedHeaders.Authorization = 'Removed for security';
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        // console.log("request succeeded",response);
        const elapsedTime = Date.now() - Date.parse(response.config['startTime']);
        const transactionLog: TransactionLogObject = new TransactionLogObject()
          .setLayer('axios')
          .setIntegrationName('SAP')
          .setRequestTime(response?.config['startTime'])
          .setIp(IP.address())
          .setMethod(response?.config.method.toUpperCase() as Method)
          .setUrl(response?.request.path)
          .setHost(response?.request.hostname)
          .setRequestParams(SafeJsonStringify(response?.config.data))
          .setRequestBody(SafeJsonStringify(response?.config.data))
          .setQuery(SafeJsonStringify(response?.request.query))
          .setRequestHeaders(SafeJsonStringify(clonedHeaders))
          .setStatusCode(response?.status.toString())
          .setResponseHeaders(SafeJsonStringify(response?.headers))
          .setResponse(SafeJsonStringify(response?.data))
          .setElapsedTime(elapsedTime);
        logger.info(transactionLog);
        return response;
      },
      function (error: AxiosError) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        // console.log("request failed",error);
        const elapsedTime = Date.now() - Date.parse(error.config['startTime']);
        const transactionLog: TransactionLogObject = new TransactionLogObject()
          .setLayer('axios')
          .setIntegrationName('SAP')
          .setRequestTime(new Date(error.config['startTime']).toISOString())
          .setIp(error.request.ip)
          .setMethod(error.request.method)
          .setUrl(error.config.url)
          .setHost(error.request.hostname)
          .setRequestParams(SafeJsonStringify(error.config.data))
          .setQuery(SafeJsonStringify(error.request.query))
          .setRequestHeaders(SafeJsonStringify(error.request.headers))
          .setRequestBody(SafeJsonStringify(error.config.data))
          .setStatusCode(error?.response?.status + '')
          .setResponseHeaders(SafeJsonStringify(error?.response?.headers))
          .setResponse(SafeJsonStringify(error?.response?.data))
          .setElapsedTime(elapsedTime);
        logger.error(transactionLog);
        return Promise.reject(error);
      }
    );
  }

  async sendHttpRequest(sendRequestDetails: IHttpClientRequestDetails): Promise<IHttpClientResponseDetails> {
    const options: AxiosRequestConfig = {
      url: sendRequestDetails.urlPath,
      method: sendRequestDetails.method.toLowerCase() as Method,
      baseURL: sendRequestDetails.baseUrl,
      data: sendRequestDetails.data,
      headers: sendRequestDetails.headers as AxiosRequestHeaders,
      params: sendRequestDetails.params,
    };
    options.url += '?' + new URLSearchParams(sendRequestDetails.queryParams).toString();
    return this.axios.request(options);
  }
}
