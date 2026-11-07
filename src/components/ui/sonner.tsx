import { Toaster as Sonner } from 'sonner';
import type { ToasterProps } from 'sonner';

function Toaster(props: ToasterProps) {
    return (
        <Sonner
            theme="light"
            className="toaster group"
            position="bottom-right"
            toastOptions={{
                classNames: {
                    toast: 'glass-float rounded-lg text-sm',
                },
            }}
            style={
                {
                    '--normal-bg': 'var(--glass)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--glass-border)',
                } as React.CSSProperties
            }
            {...props}
        />
    );
}

export { Toaster };
