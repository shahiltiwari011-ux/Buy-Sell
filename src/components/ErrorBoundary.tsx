import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CampusLoop] Uncaught error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearCacheAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-[#FFE4E6] border-2 border-black flex items-center justify-center mx-auto mb-5 text-rose-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="inline-block bg-[#E2F952] border border-black rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider mb-3">
              CAMPUS LOOP SYSTEM RECOVERY
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              Something dropped unexpectedly.
            </h1>

            <p className="text-sm font-medium text-slate-600 mb-6">
              An unexpected error occurred. Don't worry, your account and listings are safe.
            </p>

            {this.state.error && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left mb-6 overflow-x-auto text-xs font-mono text-slate-700 max-h-32">
                <span className="font-bold text-rose-600">Error:</span> {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm text-black bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleClearCacheAndReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Reset Demo Cache</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
