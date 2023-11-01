import { IHttpClientRequestDetails, IHttpClientResponseDetails } from '../dto/dto.lib.http';

export interface IHttpClientLib {
  sendHttpRequest(sendRequestDetails: IHttpClientRequestDetails): Promise<IHttpClientResponseDetails>;

  // setRetrialOnFailure(retrials: number): void;
}
