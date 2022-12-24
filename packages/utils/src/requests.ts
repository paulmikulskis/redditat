import axios, { AxiosInstance } from "axios";
import { Logger } from "tslog";
const logger = new Logger();

const DEFAULT_TIMEOUT = 100000; // 10 seconds
/**
 * Makes an HTTP request and returns a stream.
 *
 * @param {RequestOptions} options - The options for the request.
 * @param {number} [retryCount=0] - The number of times the request has been retried.
 * @returns {Promise<HttpResponse>} A promise that resolves to an `HttpResponse` object with a `stream` property.
 * @throws {HttpError} If the request fails after the maximum number of retries.
 */
export async function request(
  options: RequestOptions,
  retryCount: number = 0
): Promise<HttpResponse> {
  console.log(`senting ${options.method} request to ${options.url}`);
  const headers = options.headers ? options.headers : undefined;
  const axiosInstance: AxiosInstance = axios.create({
    timeout: options.timeout || DEFAULT_TIMEOUT,
    headers: headers,
    method: options.method,
    data: options.data,
    params: options.params,
    responseType: options.responseType,
  });

  try {
    const response = await axiosInstance(options.url);
    const headersArray =
      Object.entries(response.headers).length > 1
        ? (Object.entries(response.headers).map(([key, value]) => [
            key || "",
            (Array.isArray(value) ? value.join(", ") : value) || "",
          ]) as HeadersInit)
        : undefined;
    const headers = new Headers(headersArray);
    return {
      statusCode: response.status,
      statusMessage: `successfully requested to '${options.url}'`,
      headers: headers,
      body: response.data,
    };
  } catch (error) {
    if (retryCount >= retryCount) {
      logger.error(`Failed to make request after ${retryCount} retries`, {
        url: options.url,
        error,
      });
      throw error;
    }
    logger.warn(`Retrying request to ${options.url}`, { error });
    return request(options, retryCount + 1);
  }
}

export class RequestOptions {
  maxRetries?: number;
  json?: any;
  form?: any;
  constructor(
    readonly method: string,
    readonly url: string,
    readonly headers?: { [key: string]: string },
    readonly params?: { [key: string]: string | number | boolean },
    readonly data?: any,
    readonly responseType?: "json" | "text" | "stream" | "arraybuffer",
    readonly timeout?: number,
    readonly withCredentials?: boolean,
    readonly auth?: {
      username: string;
      password: string;
    }
  ) {}
}

class HttpResponse {
  statusCode: number;
  statusMessage: string;
  body?: any;
  headers?: Headers;

  constructor(statusCode: number, statusMessage: string, body?: any, headers?: Headers) {
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.headers = headers;
    this.body = body;
  }
}

class HttpError extends Error {
  statusCode: number;
  statusMessage: string;
  body?: any;
  headers?: Headers;

  constructor(
    statusCode: number,
    statusMessage: string,
    body?: any,
    headers?: Headers,
    message?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.headers = headers;
    this.body = body;
  }
}
