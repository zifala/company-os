import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useState } from 'react';
import { InputError } from '@/components/company-os/field-row';
import { PhoneInput } from '@/components/company-os/phone-input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export type VerifyPhoneLabels = { phone: string; code: string; send: string; sendAgain: string; cancel: string };

const defaultLabels: VerifyPhoneLabels = { phone: 'Phone', code: 'Code', send: 'Send code', sendAgain: 'Send again', cancel: 'Cancel' };

export function VerifyPhoneDialog({
    open,
    onOpenChange,
    title,
    description,
    phone,
    onPhoneChange,
    onSend,
    sending,
    sentTo,
    onConfirm,
    confirmLabel,
    processing,
    codeError,
    phoneError,
    labels = defaultLabels,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    phone: string;
    onPhoneChange?: (phone: string) => void;
    onSend: () => void;
    sending: boolean;
    sentTo: string | null;
    onConfirm: (code: string) => void;
    confirmLabel: string;
    processing: boolean;
    codeError?: string;
    phoneError?: string;
    labels?: VerifyPhoneLabels;
}) {
    const [code, setCode] = useState('');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
                <div className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="verify-phone">{labels.phone}</Label>
                        <div className="flex gap-2">
                            <PhoneInput
                                id="verify-phone"
                                value={phone}
                                onChange={(next) => onPhoneChange?.(next)}
                                disabled={!onPhoneChange || sentTo !== null}
                                invalid={!!phoneError}
                            />
                            <Button type="button" variant="outline" disabled={sending || !phone} onClick={onSend}>
                                {sending && <Spinner />}
                                {sentTo ? labels.sendAgain : labels.send}
                            </Button>
                        </div>
                        <InputError message={phoneError} />
                    </div>
                    {sentTo && (
                        <div className="grid gap-2">
                            <Label htmlFor="verify-code">{labels.code}</Label>
                            <InputOTP id="verify-code" maxLength={6} value={code} onChange={setCode} pattern={REGEXP_ONLY_DIGITS} autoFocus>
                                <InputOTPGroup>
                                    {Array.from({ length: 6 }, (_, index) => (
                                        <InputOTPSlot key={index} index={index} />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                            <InputError message={codeError} />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        {labels.cancel}
                    </Button>
                    <Button type="button" disabled={processing || code.length !== 6 || !sentTo} onClick={() => onConfirm(code)}>
                        {processing && <Spinner />}
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
