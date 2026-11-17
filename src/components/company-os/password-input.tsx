import { Eye, EyeOff } from 'lucide-react';
import type { ComponentProps, Ref } from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function PasswordInput({
    className,
    ref,
    showLabel = 'Show password',
    hideLabel = 'Hide password',
    ...props
}: Omit<ComponentProps<'input'>, 'type'> & { ref?: Ref<HTMLInputElement>; showLabel?: string; hideLabel?: string }) {
    const [shown, setShown] = useState(false);

    return (
        <div className="relative">
            <Input type={shown ? 'text' : 'password'} className={cn('pe-10', className)} ref={ref} {...props} />
            <button
                type="button"
                disabled={props.disabled}
                onClick={() => setShown((value) => !value)}
                className="absolute inset-y-0 end-0 flex items-center rounded-e-md px-3 text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none"
                aria-label={shown ? hideLabel : showLabel}
                tabIndex={-1}
            >
                {shown ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            </button>
        </div>
    );
}
