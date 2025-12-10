import { useEffect, useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useApi from '../shared/api/useAPi';
import { API_URLS } from '../constants/API_URLS';

interface WorkflowItem {
  id: string;
  name: string;
  config: unknown;
}

export default function WorkflowConfigPage() {
  const navigate = useNavigate();
  const { request } = useApi<any>();
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);

  const fetchWorkflows = async () => {
    const response = await request({ endpoint: API_URLS.WORKFLOW.LIST });
    if (response.data && response.data.response) {
      setWorkflows(response.data.response.map((w: any) => ({ id: w.id, name: w.name, config: w.config })));
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleNew = () => navigate('/workflows?mode=edit');
  const handleEdit = (id: string) => {
    const wf = workflows.find(w => String(w.id) === String(id));
    navigate('/workflows?mode=edit', { state: { workflow: wf } });
  };
  const handleDelete = async (id: string) => {
    await request({ endpoint: API_URLS.WORKFLOW.DELETE, body: { workflowId: id } });
    fetchWorkflows();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: 0 }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--glass-border)' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>Workflow Configuration</Typography>
          <Button variant="contained" onClick={handleNew}>New</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, overflow: 'auto' }}>
        <List>
          {workflows.map((w) => (
            <ListItem key={w.id} divider secondaryAction={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined" onClick={() => handleEdit(w.id)}>Edit</Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(w.id)}>Delete</Button>
              </Box>
            }>
              <ListItemText primary={w.name} secondary={w.id} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
