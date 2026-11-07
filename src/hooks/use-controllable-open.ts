import { useState } from 'react';

export function useControllableOpen(
    open?: boolean,
    onOpenChange?: (open: boolean) => void,
): [boolean, (open: boolean) => void] {
    const [ownOpen, setOwnOpen] = useState(false);

    return [open ?? ownOpen, onOpenChange ?? setOwnOpen];
}
