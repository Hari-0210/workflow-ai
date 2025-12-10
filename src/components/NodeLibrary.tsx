import type { NodeType } from '../types';
import '../styles/components/NodeLibrary.css';
import useApi from '../shared/api/useAPi';
import { useEffect, useState } from 'react';
import { API_URLS } from '../constants/API_URLS';

const nodeTypes: NodeType[] = [
    {
        type: 'trigger',
        label: 'Trigger',
        icon: '⚡',
        color: 'var(--node-trigger)',
        category: 'Start',
        description: 'Start your workflow'
    },
    {
        type: 'http',
        label: 'HTTP Request',
        icon: '🌐',
        color: 'var(--node-action)',
        category: 'Actions',
        description: 'Make HTTP requests'
    },
    {
        type: 'sftp',
        label: 'SFTP Transfer',
        icon: '📧',
        color: 'var(--node-action)',
        category: 'Actions',
        description: 'Send email notifications'
    },
];

const categories = ['Start', 'Actions', 'Logic', 'Data'];

interface NodeLibraryProps {
    onLoadWorkflow?: (workflow: any) => void;
}

export default function NodeLibrary({ onLoadWorkflow }: NodeLibraryProps) {

    const { request } = useApi<any>();

    const [existingWorkflow, setExistingWorkflow] = useState<any>([]);

    const fetchWorkflow = async () => {
        try {
            const response = await request({
                endpoint: API_URLS.WORKFLOW.LIST,
            });
            if (response.data && response.data.response) {
                setExistingWorkflow(response.data.response);
            }
        } catch (error) {
            console.error("Failed to fetch workflows", error);
        }
    }

    useEffect(() => {
        fetchWorkflow()
    }, [])

    const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
        e.dataTransfer.setData('application/nodeType', JSON.stringify(nodeType));
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div className="node-library">
            <div className="node-library-header">
                <h2 className="gradient-text">Nodes</h2>
                <p className="node-library-subtitle">Drag to canvas</p>
            </div>

            <div className="node-library-content">
                {categories.map(category => {
                    const categoryNodes = nodeTypes.filter(n => n.category === category);
                    if (categoryNodes.length === 0) return null;

                    return (
                        <div key={category} className="node-category">
                            <h3 className="category-title">{category}</h3>
                            <div className="node-list">
                                {categoryNodes.map(nodeType => (
                                    <div
                                        key={nodeType.type}
                                        className="node-template"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, nodeType)}
                                        style={{ '--node-color': nodeType.color } as React.CSSProperties}
                                    >
                                        <div className="node-template-icon">{nodeType.icon}</div>
                                        <div className="node-template-info">
                                            <div className="node-template-label">{nodeType.label}</div>
                                            <div className="node-template-description">{nodeType.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>


            {existingWorkflow.length > 0 && (
                <div className="workflow-list-section">
                    <h3 className="category-title">Existing Workflows</h3>
                    <div className="workflow-list">
                        {existingWorkflow.map((workflow: any) => (
                            <div key={workflow.id} className="workflow-item" onClick={() => onLoadWorkflow?.(workflow)}>
                                <div className="workflow-item-name">{workflow.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <br />
        </div>
    );
}
