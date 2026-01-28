import React from 'react'
import styles from './ErrorBoundary.module.css'
import Button from '../../../../shared/ui/Button/Button'

interface State {
    hasError: boolean;
    error?: Error | null;
    info?: any
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
    state: State = {hasError: false, error: null, info: null}

    static getDerivedStateFromError(error: Error) {
        return {hasError: true, error}
    }

    componentDidCatch(error: Error, info: any) {
        console.error('Captured error in ErrorBoundary', error, info)
        this.setState({error, info})
    }

    handleReload = () => {
        window.location.reload()
    }

    handleHome = () => {
        window.location.href = '/'
    }

    render() {
        if (!this.state.hasError) return this.props.children as React.ReactElement

        return (
            <div className={styles.root}>
                <div className={styles.card} role="alert">
                    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                         aria-hidden>
                        <path d="M11.001 10h2v5h-2z" fill="currentColor"/>
                        <path d="M11 16h2v2h-2z" fill="currentColor"/>
                        <path
                            d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
                            fill="currentColor"/>
                    </svg>
                    <div className={styles.title}>Something went wrong</div>
                    <div className={styles.msg}>An error occurred in the application — you can reload the page or go
                        back to the home page.
                    </div>
                    {this.state.error && (
                        <pre
                            className={styles.stack}>{this.state.error?.message}\n{this.state.info?.componentStack}</pre>
                    )}
                    <div className={styles.actions}>
                        <Button variant="primary" onClick={this.handleReload}>Reload</Button>
                        <Button variant="secondary" onClick={this.handleHome}>Home</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ErrorBoundary
