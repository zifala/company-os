export function StatTileLite({ value, label, hint }: { value: string; label: string; hint: string }) {
    return (
        <div className="rounded-lg glass px-4 py-3">
            <p className="text-xl font-bold text-slate-800 tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xs text-slate-400">{hint}</p>
        </div>
    );
}
