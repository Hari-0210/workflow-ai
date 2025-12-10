import { ApiMethod, createApi } from "./enums/apiEnums";

export const API_URLS = {
    WORKFLOW: {
        START: createApi("/workflows/{workflowId}/run", ApiMethod.POST),
        GET_WORKFLOW_STATUS: createApi("/workflows/workflowStatus/{runId}", ApiMethod.POST),
        LIST: createApi("/workflows/list", ApiMethod.GET),
        CREATE: createApi("/workflows/create", ApiMethod.POST),
        UPDATE: createApi("/workflows/update/{workflowId}", ApiMethod.PUT),
        DELETE: createApi("/workflows/delete/{workflowId}", ApiMethod.DELETE),
    }
}
