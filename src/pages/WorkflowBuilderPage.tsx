import { useState } from 'react';
import NodeLibrary from '../components/NodeLibrary';
import Canvas from '../components/Canvas';
import type { Node, Connection } from '../types';
import useApi from '../shared/api/useAPi';
import { API_URLS } from '../constants/API_URLS';

export default function WorkflowBuilderPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState<string>('');
  const { request } = useApi<any>();

  const onLoadWorkflow = (workflow: any) => {
    setWorkflowId(workflow.id);
    setWorkflowName(workflow.name || '');
    const BASE_X = 50, BASE_Y = 100, GAP_X = 250, GAP_Y = 120;

    const triggerNode = {
      id: `node-trigger-${Date.now()}`,
      type: 'trigger',
      position: { x: BASE_X, y: BASE_Y },
      label: 'Trigger',
      data: {}
    } as Node;

    const newNodes = workflow.config.steps.map((s: any, i: number) => ({
      id: `node-${crypto.randomUUID()}`,
      type: s.type === 'api' || s.type === 'pollApi' ? 'http' : s.type,
      position: { x: BASE_X + (i + 1) * GAP_X, y: BASE_Y + (i + 1) * GAP_Y },
      label: s.stepName,
      data: s
    })) as Node[];

    const newConnections = [
      newNodes.length && { id: crypto.randomUUID(), sourceNodeId: triggerNode.id, targetNodeId: newNodes[0].id },
      ...newNodes.slice(0, -1).map((n: any, i: number) => ({
        id: crypto.randomUUID(),
        sourceNodeId: n.id,
        targetNodeId: newNodes[i + 1].id
      }))
    ].filter(Boolean) as Connection[];

    setNodes([triggerNode, ...newNodes]);
    setConnections(newConnections);
  };

  const buildStepsFromNodes = () => {
    return nodes
      .filter(n => n.type !== 'trigger')
      .map(n => ({
        ...n.data,
        stepName: n.label,
      }));
  };

  const handleNewWorkflow = () => {
    setWorkflowId(null);
    setWorkflowName('');
    setNodes([]);
    setConnections([]);
  };

  const handleSaveWorkflow = async () => {
    const payload = {
      name: workflowName || 'Untitled Workflow',
      config: { steps: buildStepsFromNodes() }
    };

    if (workflowId) {
      const res = await request({ endpoint: API_URLS.WORKFLOW.UPDATE, body: { workflowId, ...payload } });
      if (res.data && (res.data.id || res.data.workflowId)) {
        setWorkflowId(res.data.id || res.data.workflowId);
      }
    } else {
      const res = await request({ endpoint: API_URLS.WORKFLOW.CREATE, body: payload });
      if (res.data && (res.data.id || res.data.workflowId)) {
        setWorkflowId(res.data.id || res.data.workflowId);
      }
    }
  };

  const handleDeleteWorkflow = async () => {
    if (!workflowId) return;
    await request({ endpoint: API_URLS.WORKFLOW.DELETE, body: { workflowId } });
    handleNewWorkflow();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: 0 }}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <NodeLibrary onLoadWorkflow={onLoadWorkflow} />
        <Canvas
          nodes={nodes}
          connections={connections}
          onNodesChange={setNodes}
          onConnectionsChange={setConnections}
          workflowId={workflowId}
        />
      </div>
    </div>
  );
}

