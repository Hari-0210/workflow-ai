import { useEffect, useState } from "react";
import useApi from "../../shared/api/useAPi";
import { API_URLS } from "../../constants/API_URLS";
import { AppBar, Box, Button, List, ListItem, ListItemText, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface WorkflowItem {
  id: string;
  name: string;
  config: unknown;
}

function WorkflowRun(props) {
  const navigate = useNavigate();
  const { request } = useApi<any>();
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
   const handleRun = (id: string) => {
    const wf = workflows.find(w => String(w.id) === String(id));
    navigate('/workflows?mode=run', { state: { workflow: wf } });
  };

  const fetchWorkflows = async () => {
    const response = await request({ endpoint: API_URLS.WORKFLOW.LIST });
    if (response.data && response.data.response) {
      setWorkflows(
        response.data.response.map((w: any) => ({
          id: w.id,
          name: w.name,
          config: w.config,
        }))
      );
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);
  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: 0 }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--glass-border)' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>Workflow Configuration</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, overflow: 'auto' }}>
        <List>
          {workflows.map((w) => (
            <ListItem key={w.id} divider secondaryAction={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined" onClick={() => handleRun(w.id)}>Run</Button>
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

export default WorkflowRun;
