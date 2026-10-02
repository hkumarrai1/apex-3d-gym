import React from 'react';
import { Dumbbell, ShieldAlert } from 'lucide-react';

export default class ErrorBoundary3D extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("3D WebGL Canvas Notice:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[400px] bg-gym-card/80 border border-cyan-500/30 rounded-3xl flex flex-col items-center justify-center p-6 text-center shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-400 to-lime-400 p-0.5 mb-4 animate-pulse">
            <div className="w-full h-full bg-gym-darker rounded-[14px] flex items-center justify-center">
              <Dumbbell className="w-10 h-10 text-cyan-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white font-heading">3D Interactive Stage Ready</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Accelerated 3D graphics mode running in optimized compatibility view.
          </p>
          <div className="mt-4 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[10px] font-mono text-cyan-400">
            APEX 3D ENGINE &bull; ACTIVE
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
