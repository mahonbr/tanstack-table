import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { error: null, errorInfo: null };
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error: error,
			errorInfo: errorInfo,
		});
	}

	render() {
		if (this.state.errorInfo) {
			const { error = '', errorInfo } = this.state;

			return (
				<div style={{ padding: '0 10px 10px' }}>
					<h3>Something went wrong.</h3>
					<details style={{ whiteSpace: 'pre-wrap' }}>
						<summary>View Details</summary>
						<div style={{ padding: '10px 0 0' }}>{error.toString()}</div>

						{errorInfo.componentStack}
					</details>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
