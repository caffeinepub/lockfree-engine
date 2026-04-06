import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("LockFreeEngine caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto">
              <span className="text-destructive text-xl">!</span>
            </div>
            <h2 className="font-display font-semibold text-lg text-foreground">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground">
              An unexpected error occurred. Refreshing the page will restore the
              app.
            </p>
            {this.state.error?.message && (
              <pre className="text-left text-xs bg-muted text-muted-foreground p-3 rounded-lg overflow-auto max-h-32 font-mono border border-border">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Refresh Page
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors"
              >
                Clear Cache &amp; Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
