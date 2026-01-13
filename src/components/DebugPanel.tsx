import { useState, useEffect, useRef } from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogEntry {
  timestamp: string;
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  data?: any;
}

const DebugPanel = () => {
  // Carica i log salvati da localStorage all'avvio
  const loadLogsFromStorage = (): LogEntry[] => {
    try {
      const saved = localStorage.getItem('debug-panel-logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const [logs, setLogs] = useState<LogEntry[]>(loadLogsFromStorage);
  const [isOpen, setIsOpen] = useState(() => {
    // Mantieni lo stato aperto/chiuso da localStorage
    try {
      return localStorage.getItem('debug-panel-open') === 'true';
    } catch {
      return false;
    }
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intercetta console.log, console.warn, console.error
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    const addLog = (type: LogEntry['type'], ...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => {
        const newLog: LogEntry = {
          timestamp: new Date().toLocaleTimeString('it-IT'),
          type,
          message,
          data: args.length > 1 ? args.slice(1) : undefined,
        };
        // Mantieni solo gli ultimi 200 log (aumentato per debug)
        const newLogs = [...prev.slice(-199), newLog];
        // Salva in localStorage per persistere anche dopo re-render
        try {
          localStorage.setItem('debug-panel-logs', JSON.stringify(newLogs));
        } catch (e) {
          // Ignora errori di localStorage (quota esaurita, ecc.)
        }
        return newLogs;
      });
    };

    console.log = (...args: any[]) => {
      originalLog(...args);
      // Cattura TUTTI i log importanti, inclusi quelli di Make
      const shouldLog = args.some(arg => {
        if (typeof arg !== 'string') return false;
        const lowerArg = arg.toLowerCase();
        return (
          lowerArg.includes('firstname') || 
          lowerArg.includes('lastname') || 
          lowerArg.includes('email') || 
          lowerArg.includes('debug') ||
          lowerArg.includes('make') ||
          lowerArg.includes('webhook') ||
          lowerArg.includes('payload') ||
          lowerArg.includes('invio') ||
          lowerArg.includes('risposta') ||
          lowerArg.includes('✅') ||
          lowerArg.includes('❌') ||
          lowerArg.includes('📤') ||
          lowerArg.includes('📥') ||
          lowerArg.includes('📧') ||
          lowerArg.includes('🔍')
        );
      });
      if (shouldLog) {
        addLog('log', ...args);
      }
    };

    console.warn = (...args: any[]) => {
      originalWarn(...args);
      addLog('warn', ...args);
    };

    console.error = (...args: any[]) => {
      originalError(...args);
      addLog('error', ...args);
    };

    console.info = (...args: any[]) => {
      originalInfo(...args);
      addLog('info', ...args);
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new logs arrive
    if (logsEndRef.current && isOpen && !isMinimized) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen, isMinimized]);

  const clearLogs = () => {
    setLogs([]);
    try {
      localStorage.removeItem('debug-panel-logs');
    } catch {
      // Ignora errori
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return 'text-red-500';
      case 'warn': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-300';
    }
  };

  // Salva lo stato aperto/chiuso in localStorage
  const handleToggleOpen = (open: boolean) => {
    setIsOpen(open);
    try {
      localStorage.setItem('debug-panel-open', String(open));
    } catch {
      // Ignora errori
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => handleToggleOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium"
      >
        🔍 Debug Logs {logs.length > 0 && `(${logs.length})`}
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-gray-900 text-white rounded-lg shadow-2xl z-50 border border-gray-700 ${
      isMinimized ? 'w-80' : 'w-[600px]'
    } ${isMinimized ? 'h-12' : 'h-[500px]'} transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">🔍 Debug Panel</span>
          <span className="text-xs text-gray-400">({logs.length} log)</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleOpen(false)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <X size={14} />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Toolbar */}
          <div className="p-2 border-b border-gray-700 bg-gray-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLogs}
              className="h-7 text-xs text-gray-400 hover:text-white"
            >
              🗑️ Pulisci
            </Button>
          </div>

          {/* Logs */}
          <div className="h-[420px] overflow-y-auto p-3 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                Nessun log ancora. Compila il form per vedere i log.
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="mb-2 pb-2 border-b border-gray-800 last:border-0"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 text-[10px] mt-0.5">
                      {log.timestamp}
                    </span>
                    <span className={`font-semibold ${getLogColor(log.type)}`}>
                      [{log.type.toUpperCase()}]
                    </span>
                  </div>
                  <div className="mt-1 text-gray-300 break-words whitespace-pre-wrap">
                    {log.message}
                  </div>
                  {log.data && (
                    <div className="mt-1 text-gray-400 text-[10px]">
                      {JSON.stringify(log.data, null, 2)}
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </>
      )}
    </div>
  );
};

export default DebugPanel;
