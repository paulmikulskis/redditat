import { boolean, z } from "zod";
import { redis } from "@yungsten/utils";
import { ApiError, ApiResponse, IntegratedFunction, IntegratedCalls } from "./types";
import { Logger } from "tslog";
import { integratedFunctions } from "./executeFunction";

const logger = new Logger();

// helper function to easily see all of the schedulable functions
export const getScheduleableFunctions = (): IntegratedFunction[] => {
  return integratedFunctions.filter((fn) => fn.scheduleable);
};

/**
 * the ExtendedIntegratedFunctionArgs type allows us to take the argument type definitions
 * that we or other devs create, and graft on some default arguments.  One of those arguments is
 * called "return", which will cause the IntegratedFunction to block until the Worker finished processing.
 */
export type ExtendedIntegratedFunctionArgs<A> = A & { response? };

export const createIntegratedFunction = <A>(
  /**
   * Creates an IntegratedFunction object that can be used for running tasks asynchronously or on a schedule.
   * The generic type parameter <A> allows us to pay attention to the type of the function's request body, and
   * use that type with the Zod library to validate input to this function, as well as typehint the callable "fn"
   *   -> note, the callable fn param here is the "actual" IntegratedFunction you write when developing
   *
   * @param name - A unique name for this IntegratedFunction. This will be used to identify this function in the queue and in logs.
   * @param description - A description of what this function does. This will be used to provide context and clarify the purpose of this function.
   * @param schema - A z.Schema object that defines the shape of the input arguments for this function. This is used to validate and parse the input.
   * @param fn - The function that will be run asynchronously or on a schedule. This function should return a Promise that resolves to an ApiResponse object.
   * @param queueName - The name of the queue that this function should be added to. If not provided, defaults to the value of the `name` parameter.
   * @param scheduleable - A boolean indicating whether this function can be scheduled to run on a schedule. If not provided, defaults to `true`.
   * @param calls - An object containing other IntegratedFunctions that can be called by this function.
   *
   * @returns An IntegratedFunction object that can be used for running tasks asynchronously or on a schedule.
   */
  name: string,
  description: string,
  schema: z.Schema<ExtendedIntegratedFunctionArgs<A>>,
  fn: (
    context: redis.RedisConnectionContext,
    args: ExtendedIntegratedFunctionArgs<A>
  ) => Promise<ApiResponse>,
  queueName?: string,
  scheduleable?: boolean,
  calls?: Record<string, IntegratedCalls>
): IntegratedFunction => ({
  name,
  description,
  schema,
  fn: (context: redis.RedisConnectionContext, body: unknown) => {
    const bodyParse = schema.safeParse(body);
    if (!bodyParse.success)
      return Promise.resolve(
        respondError(
          401,
          `invalid POST body input, not parsable: ${JSON.stringify(bodyParse)}`
        )
      );
    return fn(context, bodyParse.data);
  },
  queueName: queueName ?? name,
  scheduleable: scheduleable ?? true,
  calls,
});

/**
 * Use this helper function when responding from the Express server.
 * Creates a new `ApiResponse` object to be returned in the server response.
 *
 * @param code - The HTTP status code to be returned in the response
 * @param message - The message to be returned in the response
 * @param data - (optional) Any additional data to be returned in the response
 * @returns The newly created `ApiResponse` object
 */
export const respondWith = (
  code: number,
  message: string,
  data?: Record<string, unknown>
): ApiResponse => {
  logger.info(`[${code}] ${message}`);
  return {
    code: code,
    message: message,
    data: data,
  };
};

/**
 * Use this helper function to have the Express server respond with an error
 *
 * @param code The HTTP status code to return with the error response
 * @param message A string message to include in the error response
 * @returns An object with a `code` field representing the provided HTTP status code, a `message` field
 * representing the provided error message, and an optional `data` field that can contain additional error data
 */
export const respondError = (code: number, message: string): ApiResponse => {
  logger.info(`[${code}] ${message}`);
  return {
    code: code,
    message: message || "no message specified",
    data: undefined,
  };
};

export const respondWithError = (error: ApiError) => {
  return respondWith(error.code, error.message ?? "", error.data);
};
