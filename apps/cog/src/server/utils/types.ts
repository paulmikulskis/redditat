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
