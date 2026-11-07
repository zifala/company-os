import { useState } from 'react';
import { FieldRow } from '@/components/company-os/field-row';
import { isValidPhone, PhoneInput } from '@/components/company-os/phone-input';
import type { PhoneLabels } from '@/components/company-os/phone-input';

export function PhoneField({
    id,
    label,
    name,
    value,
    defaultValue,
    onChange,
    error,
    disabled,
    hint,
    invalidMessage = 'Enter a valid phone number for the chosen country.',
    labels,
}: {
    id: string;
    label: string;
    name?: string;
    value?: string | null;
    defaultValue?: string | null;
    onChange?: (value: string) => void;
    error?: string;
    disabled?: boolean;
    hint?: string;
    invalidMessage?: string;
    labels?: PhoneLabels;
}) {
    const [current, setCurrent] = useState<string>(value ?? defaultValue ?? '');
    const [touched, setTouched] = useState(false);
    const shown = value ?? current;
    const clientError = touched && !isValidPhone(shown) ? invalidMessage : undefined;

    return (
        <FieldRow id={id} label={label} hint={hint} error={error ?? clientError}>
            <PhoneInput
                id={id}
                value={shown}
                disabled={disabled}
                invalid={!!(error ?? clientError)}
                onBlur={() => setTouched(true)}
                labels={labels}
                onChange={(next) => {
                    setCurrent(next);
                    onChange?.(next);
                }}
            />
            {name && <input type="hidden" name={name} value={shown} />}
        </FieldRow>
    );
}
