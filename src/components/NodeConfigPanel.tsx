import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Drawer,
    Box,
    Typography,
    Tabs,
    Tab,
    Button,
    IconButton,
    Divider,
    Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import type { Node, NodeConfig } from '../types';
import FormField from './common/FormField';
import '../styles/components/NodeConfigPanel.css';

interface NodeConfigPanelProps {
    open: boolean;
    node: Node | null;
    onClose: () => void;
    onSave: (nodeId: string, config: NodeConfig) => void;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

export default function NodeConfigPanel({ open, node, onClose, onSave }: NodeConfigPanelProps) {
    const [tabValue, setTabValue] = useState(0);

    const { control, handleSubmit, reset, watch } = useForm<NodeConfig>({
        defaultValues: {},
    });
    // Reset form with node-specific data when node changes or panel opens
    useEffect(() => {
        if (open && node && node.data) {
            reset(node.data);
        } else {
            reset({});
        }
    }, [node, open]);

    const onSubmit = (data: NodeConfig) => {
        if (node) {
            onSave(node.id, data);
            onClose();
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!node) return null;

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: 450,
                    backgroundColor: '#13131a',
                    backgroundImage: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(79, 172, 254, 0.05))',
                    backdropFilter: 'blur(20px)',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden',
                },
            }}
            ModalProps={{
                keepMounted: false,
                // disableScrollLock: true, // Prevent body scroll lock
            }}
        >
            <Box className="config-panel" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box className="config-header">
                    <Box>
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                            Configure Node
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            {node.label}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClose} sx={{ color: '#fff' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Tabs */}
                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => setTabValue(newValue)}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiTab-root': {
                            color: 'rgba(255, 255, 255, 0.6)',
                            textTransform: 'none',
                            fontSize: '14px',
                            '&.Mui-selected': {
                                color: '#667eea',
                            },
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#667eea',
                        },
                    }}
                >
                    <Tab label="Basic" />
                    <Tab label="Config" />
                    <Tab label="Retry & Status" />
                    <Tab label="Advanced" />
                </Tabs>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="config-form">
                    <Box className="config-content">
                        {/* Basic Tab */}
                        <TabPanel value={tabValue} index={0}>
                            <Stack spacing={2.5}>
                                <FormField
                                    name="stepId"
                                    label="Step ID"
                                    type="number"
                                    control={control}
                                    rules={{ required: 'Step ID is required' }}
                                    placeholder="e.g., 101"
                                />
                                <FormField
                                    name="stepName"
                                    label="Step Name"
                                    type="text"
                                    control={control}
                                    rules={{ required: 'Step name is required' }}
                                    placeholder="e.g., Pull data from SFTP server"
                                />
                                <FormField
                                    name="type"
                                    label="Type"
                                    type="autocomplete"
                                    control={control}
                                    options={[
                                        { label: 'API', value: 'api' },
                                        { label: 'SFTP', value: 'sftp' },
                                        { label: 'Transform', value: 'transform' },
                                    ]}
                                />
                            </Stack>
                        </TabPanel>

                        {/* API Tab */}
                        <TabPanel value={tabValue} index={1}>
                            {node.type === 'http' || node.type === 'trigger' ? (
                                // API Configuration
                                <Stack spacing={2.5}>
                                    <FormField
                                        name="action.parameters.method"
                                        label="HTTP Method"
                                        type="select"
                                        control={control}
                                        options={[
                                            { label: 'GET', value: 'GET' },
                                            { label: 'POST', value: 'POST' },
                                            { label: 'PUT', value: 'PUT' },
                                            { label: 'DELETE', value: 'DELETE' },
                                        ]}
                                    />
                                    <FormField
                                        name="action.parameters.endpoint"
                                        label="API Endpoint"
                                        type="text"
                                        control={control}
                                        placeholder="https://api.example.com/endpoint"
                                    />
                                    <FormField
                                        name="action.parameters.reqParameters"
                                        label="Request Parameters (JSON)"
                                        type="textarea"
                                        control={control}
                                        rows={8}
                                        placeholder='{\n  "key": "value"\n}'
                                    />
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: -1 }}>
                                        💡 Use ${'{'}response.output.path{'}'} to reference previous step outputs
                                    </Typography>
                                </Stack>
                            ) : (
                                // SFTP Configuration
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ color: '#fff', mb: 2 }}>
                                            Operation
                                        </Typography>
                                        <FormField
                                            name="action.parameters.operation"
                                            label="SFTP Operation"
                                            type="select"
                                            control={control}
                                            options={[
                                                { label: 'Move', value: 'move' },
                                                { label: 'Copy', value: 'copy' },
                                                { label: 'Download', value: 'download' },
                                                { label: 'Upload', value: 'upload' },
                                            ]}
                                        />
                                    </Box>

                                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                                    <Box>
                                        <Typography variant="subtitle2" sx={{ color: '#fff', mb: 2 }}>
                                            Source Server
                                        </Typography>
                                        <Stack spacing={2.5}>
                                            <FormField
                                                name="action.parameters.src.type"
                                                label="Type"
                                                type="select"
                                                control={control}
                                                options={[
                                                    { label: 'Local', value: 'local' },
                                                    { label: 'SFTP', value: 'sftp' },
                                                ]}
                                            />
                                            {watch('action.parameters.src.type') === 'sftp' && (
                                                <>
                                                    <FormField
                                                        name="action.parameters.src.host"
                                                        label="Host"
                                                        type="text"
                                                        control={control}
                                                        placeholder="10.0.0.1"
                                                    />
                                                    <FormField
                                                        name="action.parameters.src.port"
                                                        label="Port"
                                                        type="number"
                                                        control={control}
                                                        placeholder="22"
                                                    />
                                                    <FormField
                                                        name="action.parameters.src.username"
                                                        label="Username"
                                                        type="text"
                                                        control={control}
                                                        placeholder="user1"
                                                    />
                                                    <FormField
                                                        name="action.parameters.src.password"
                                                        label="Password"
                                                        type="text"
                                                        control={control}
                                                        placeholder="••••••••"
                                                    />
                                                </>
                                            )}
                                            <FormField
                                                name="action.parameters.src.path"
                                                label="Path"
                                                type="text"
                                                control={control}
                                                placeholder="/input/*.csv"
                                            />
                                        </Stack>
                                    </Box>

                                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                                    <Box>
                                        <Typography variant="subtitle2" sx={{ color: '#fff', mb: 2 }}>
                                            Destination Server
                                        </Typography>
                                        <Stack spacing={2.5}>
                                            <FormField
                                                name="action.parameters.dest.type"
                                                label="Type"
                                                type="select"
                                                control={control}
                                                options={[
                                                    { label: 'Local', value: 'local' },
                                                    { label: 'SFTP', value: 'sftp' },
                                                ]}
                                            />
                                            {watch('action.parameters.dest.type') as string === 'sftp' && (
                                                <>
                                                    <FormField
                                                        name="action.parameters.dest.host"
                                                        label="Host"
                                                        type="text"
                                                        control={control}
                                                        placeholder="10.0.0.2"
                                                    />
                                                    <FormField
                                                        name="action.parameters.dest.port"
                                                        label="Port"
                                                        type="number"
                                                        control={control}
                                                        placeholder="22"
                                                    />
                                                    <FormField
                                                        name="action.parameters.dest.username"
                                                        label="Username"
                                                        type="text"
                                                        control={control}
                                                        placeholder="user2"
                                                    />
                                                    <FormField
                                                        name="action.parameters.dest.password"
                                                        label="Password"
                                                        type="text"
                                                        control={control}
                                                        placeholder="••••••••"
                                                    />
                                                </>
                                            )}

                                            <FormField
                                                name="action.parameters.dest.path"
                                                label="Path"
                                                type="text"
                                                control={control}
                                                placeholder="/processed/"
                                            />
                                        </Stack>
                                    </Box>
                                </Stack>
                            )}
                        </TabPanel>

                        {/* Retry & Status Tab */}
                        <TabPanel value={tabValue} index={2}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: '#fff', mb: 2 }}>
                                        Retry Configuration
                                    </Typography>
                                    <Stack spacing={2.5}>
                                        <FormField
                                            name="retry.maxAttempts"
                                            label="Max Attempts"
                                            type="number"
                                            control={control}
                                            placeholder="e.g., 5"
                                        />
                                        <FormField
                                            name="retry.delaySeconds"
                                            label="Delay (seconds)"
                                            type="number"
                                            control={control}
                                            placeholder="e.g., 10"
                                        />
                                    </Stack>
                                </Box>

                                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: '#fff', mb: 2 }}>
                                        Status Check
                                    </Typography>
                                    <Stack spacing={2.5}>
                                        <FormField
                                            name="status.type"
                                            label="Status Type"
                                            type="text"
                                            control={control}
                                            placeholder="e.g., api"
                                        />
                                        <FormField
                                            name="status.expectedOutput"
                                            label="Expected Output (JSON)"
                                            type="textarea"
                                            control={control}
                                            rows={4}
                                            placeholder='{\n  "status": "COMPLETED"\n}'
                                        />
                                    </Stack>
                                </Box>
                            </Stack>
                        </TabPanel>

                        {/* Advanced Tab */}
                        <TabPanel value={tabValue} index={3}>
                            <Stack spacing={2.5}>
                                <FormField
                                    name="condition"
                                    label="Condition"
                                    type="text"
                                    control={control}
                                    placeholder="e.g., ${response.output.count > 0}"
                                />
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: -1 }}>
                                    💡 This step will only execute if the condition is true
                                </Typography>
                                <FormField
                                    name="delaySeconds"
                                    label="Delay Before Execution (seconds)"
                                    type="number"
                                    control={control}
                                    placeholder="e.g., 10"
                                />
                            </Stack>
                        </TabPanel>
                    </Box>

                    {/* Footer */}
                    <Box className="config-footer">
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            sx={{
                                color: '#fff',
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                '&:hover': {
                                    borderColor: 'rgba(255, 255, 255, 0.4)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #4facfe 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5568d3 0%, #3f9ae5 100%)',
                                },
                            }}
                        >
                            Save Configuration
                        </Button>
                    </Box>
                </form>
            </Box>
        </Drawer>
    );
}
