import { ApiMethod, createApi } from "./enums/apiEnums";

export const API_URLS = {
    WORKFLOW: {
        START: createApi("/workflows/{workflowId}/run", ApiMethod.POST),
        GET_WORKFLOW_STATUS: createApi("/workflows/workflowStatus/{runId}", ApiMethod.POST),
        LIST: createApi("/workflows/list", ApiMethod.GET),
    }
}