import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import MiniDrawer from '../components/layout/MiniDrawer';
import WorkflowBuilderPage from '../pages/WorkflowBuilderPage';
import WorkflowConfigPage from '../pages/WorkflowConfigPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <MiniDrawer />
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
            <Routes>
              <Route path="/" element={<WorkflowBuilderPage />} />
              <Route path="/workflows" element={<WorkflowBuilderPage />} />
              <Route path="/workflows/config" element={<WorkflowConfigPage />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

