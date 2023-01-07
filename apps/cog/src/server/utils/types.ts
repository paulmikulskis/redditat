import { redis } from "@yungsten/utils";
import { z } from "zod";

export type WorkflowSummary = {
  functionName: string;
  cron: string;
  reqBody: Record<string, any>;
  calls: Record<string, any>;
};

export type ExtendedWorkflowSummary = {
  queueName: string;
  id: string;
  jobName: string;
  next: number;
  key: string;
  functionName: string;
  cron: string;
  reqBody: Record<string, any>;
};

export type WorkflowSchedules = {
  [workflowName: string]: WorkflowSummary;
};

export type ExtendedWorkflowSchedules = {
  [workflowName: string]: ExtendedWorkflowSummary;
};

export interface ApiResponse {
  code: number;
  message: string;
  data?: Record<string, unknown>;
}

export interface ApiError {
  code: number;
  message?: string;
  data?: Record<string, unknown>;
}

export type IntegratedCalls = {
  name: string;
  description: string;
  schema: z.Schema;
  fn: (context: redis.RedisConnectionContext, body: unknown) => Promise<ApiResponse>;
  queueName: string;
  scheduleable?: boolean;
  calls?: Record<string, IntegratedCalls>;
  callArgs?: boolean;
};

export type IntegratedFunction = {
  name: string;
  description: string;
  schema: z.Schema;
  fn: (context: redis.RedisConnectionContext, body: unknown) => Promise<ApiResponse>;
  queueName: string;
  scheduleable?: boolean;
  calls?: Record<string, IntegratedCalls>;
};
