import React from 'react';
import type { LiveFeedItem } from '../types';
import ActivityIcon from './icons/ActivityIcon';

interface LiveTrafficFeedProps {
  feed: LiveFeedItem[];
  status: 'Operational' | 'Monitoring' | 'High-Alert';
}

const SystemStatusIndicator: React.FC<{ status: LiveTrafficFeedProps['status'] }> = ({ status }) => {
    const statusConfig = {
        Operational: { text: 'System Operational', color: 'bg-green-500', textColor: 'text-green-300' },
        Monitoring: { text: 'Monitoring Activity', color: 'bg-yellow-500', textColor: 'text-yellow-300' },
        'High-Alert': { text: 'High-Alert Status', color: 'bg-red-500', textColor: 'text-red-300' },
    };
    const config = statusConfig[status];

    return (
        <div className="flex items-center space-x-2 mb-4 p-2 bg-black/20 rounded-md">
            <div className={`w-3 h-3 rounded-full ${config.color} animate-pulse`}></div>
            <span className={`text-sm font-semibold ${config.textColor}`}>{config.text}</span>
        </div>
    );
};


const LiveTrafficFeed: React.FC<LiveTrafficFeedProps> = ({ feed, status }) => {
  return (
    <div className="h-full flex flex-col">
        <h3 className="text-xl font-semibold text-brand-green-light mb-2">System Status & Live Feed</h3>
        <SystemStatusIndicator status={status} />
        <ul className="space-y-3 overflow-y-auto flex-grow">
            {feed.map((item, index) => (
                <li key={index} className="flex items-start animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                    <div className="mt-1 flex-shrink-0 text-brand-green-dark bg-brand-green/20 p-1.5 rounded-full">
                        <ActivityIcon />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-gray-300">{item.event}</p>
                        <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                </li>
            ))}
        </ul>
    </div>
  );
};

export default LiveTrafficFeed;
