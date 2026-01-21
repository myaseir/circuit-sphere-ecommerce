'use client';

import { useState, useEffect } from 'react';

export default function HealthPage() {
  const [status, setStatus] = useState<'loading' | 'healthy' | 'error'>('loading');
  const [data, setData] = useState<any>(null);

  // Use env variable with fallback
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_URL}/health`);
        if (!res.ok) throw new Error('Failed');
        const json = await res.json();
        setData(json);
        setStatus('healthy');
      } catch (err) {
        console.error("Health check failed:", err);
        setStatus('error');
      }
    };

    checkHealth();
  }, [API_URL]);

  return (
    // CHANGED: Removed 'items-center', added 'pt-32' (top padding) to clear the navbar
    <div className="min-h-screen bg-gray-50 flex justify-center pt-32 px-4">
      
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100 h-fit">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">System Status</h1>
          <p className="text-gray-500 text-sm mt-1">Glacia Labs Platform Health</p>
        </div>

        {/* Status Card */}
        <div className={`rounded-lg p-6 border transition-colors duration-300 ${
          status === 'healthy' ? 'bg-green-50 border-green-200' : 
          status === 'error' ? 'bg-red-50 border-red-200' : 
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Pulsing Dot Animation */}
              <span className="relative flex h-3 w-3">
                {status === 'healthy' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${
                  status === 'healthy' ? 'bg-green-500' : 
                  status === 'error' ? 'bg-red-500' : 
                  'bg-gray-400'
                }`}></span>
              </span>
              
              <span className={`font-semibold ${
                status === 'healthy' ? 'text-green-700' : 
                status === 'error' ? 'text-red-700' : 
                'text-gray-700'
              }`}>
                {status === 'healthy' ? 'All Systems Operational' : 
                 status === 'error' ? 'Service Disruption' : 
                 'Checking status...'}
              </span>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        {status === 'healthy' && data && (
          <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
              <span className="text-gray-500">Service API</span>
              <span className="font-medium text-gray-900">{data.service}</span>
            </div>
            <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
              <span className="text-gray-500">Version</span>
              <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{data.version}</span>
            </div>
            <div className="flex justify-between text-sm pt-1">
              <span className="text-gray-500">API Connection</span>
              <span className="text-green-600 font-medium flex items-center gap-1">
                Active
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </span>
            </div>
          </div>
        )}

        {/* Error Details */}
        {status === 'error' && (
           <div className="mt-4 p-3 bg-red-50 rounded text-xs text-red-600 break-all">
             Unable to connect to backend at: <br/> 
             <span className="font-mono">{API_URL}</span>
           </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.reload()}
            className="text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
          >
            Refresh Status
          </button>
        </div>
        
      </div>
    </div>
  );
}