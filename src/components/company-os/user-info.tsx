import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export type UserSummary = {
    name: string;
    email?: string;
    avatar?: string | null;
};

export function initialsOf(name: string): string {
    const parts = name.trim().split(/\s+/u).filter(Boolean);

    if (parts.length === 0) {
        return '';
    }

    const first = Array.from(parts[0])[0] ?? '';
    const last = parts.length > 1 ? (Array.from(parts[parts.length - 1])[0] ?? '') : '';

    return `${first}${last}`.toUpperCase();
}

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: UserSummary;
    showEmail?: boolean;
}) {
    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                    {initialsOf(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && user.email && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
}
