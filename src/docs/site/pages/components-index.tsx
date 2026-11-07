import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { categories, entries } from '../../content';
import { PageTitle } from '../shell';

export function ComponentsIndexPage() {
    const [params] = useSearchParams();
    const cat = params.get('cat');
    const visible = categories.filter((category) => !cat || category.id === cat);

    return (
        <>
            <PageTitle title="Components" lead={`${entries.length} components. Each one job, a fixed anatomy, an accessibility contract, and a Don't list.`} />
            <nav aria-label="Categories" className="mb-6 flex flex-wrap gap-1">
                <Link to="/components" className={cn('rounded-md px-2.5 py-1 text-sm', !cat ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:text-foreground')}>
                    All
                </Link>
                {categories.map((category) => (
                    <Link key={category.id} to={`/components?cat=${category.id}`} className={cn('rounded-md px-2.5 py-1 text-sm', cat === category.id ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:text-foreground')}>
                        {category.label}
                    </Link>
                ))}
            </nav>
            <div className="grid gap-8">
                {visible.map((category) => {
                    const items = entries.filter((entry) => entry.category === category.id);

                    return (
                        <section key={category.id}>
                            <div className="mb-3 flex items-baseline justify-between">
                                <h2 className="text-sm font-semibold">{category.label}</h2>
                                <span className="text-xs text-muted-foreground">{category.note}</span>
                            </div>
                            {items.length === 0 ? (
                                <p className="rounded-lg glass px-5 py-6 text-sm text-muted-foreground">Nothing here yet. See the roadmap.</p>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {items.map((entry) => (
                                        <Link key={entry.slug} to={`/components/${entry.slug}`} className="rounded-lg glass px-5 py-4 transition-all duration-300 hover:border-primary/40">
                                            <span className="block text-sm font-semibold">{entry.name}</span>
                                            <span className="mt-1 block text-xs text-muted-foreground">{entry.job}</span>
                                            <span className="mt-3 flex justify-between font-mono text-[11px] text-muted-foreground">
                                                <span>pieces {entry.pieces.join(', ')}</span>
                                                <span>{entry.exports.length} exports</span>
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>
        </>
    );
}
