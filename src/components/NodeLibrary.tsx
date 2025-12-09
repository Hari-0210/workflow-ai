import type { NodeType } from '../types';
import '../styles/components/NodeLibrary.css';
import useApi from '../shared/api/useAPi';
import { useEffect, useState } from 'react';

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

export default function NodeLibrary() {

    const { request } = useApi<any>();

    const [existingWorkflow, setExistingWorkflow] = useState<any>([]);

    const fetchWorkflow = async () => {
        const response = await request({
            url: 'http://localhost:8081/workflows/list',
            method: 'GET'
        });
        console.log("response", response.data.response);
        setExistingWorkflow(response.data.response);
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
            <div>
                {existingWorkflow.map((workflow: any) => (
                    <div key={workflow.id}>
                        <h3>{workflow.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}
