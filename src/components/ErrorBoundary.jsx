import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
          <div className="max-w-md bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center backdrop-blur-md">
            <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-white mb-2">Oops! Có lỗi xảy ra</h1>
            <p className="text-zinc-400 text-sm mb-6 break-words">
              {this.state.error?.message || 'Vui lòng tải lại trang'}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg transition-all"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
