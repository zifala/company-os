import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { NavigationBridge } from '@/lib/navigation';
import { SiteSearch, useSiteSearch } from './docs/site/search';
import { Shell } from './docs/site/shell';

const page = <T extends string>(name: T, load: () => Promise<Record<T, React.ComponentType>>) =>
    lazy(() => load().then((module) => ({ default: module[name] })));

const HomePage = page('HomePage', () => import('./docs/site/pages/home'));
const StandardPage = page('StandardPage', () => import('./docs/site/pages/standard'));
const PiecePage = page('PiecePage', () => import('./docs/site/pages/piece'));
const ComponentsIndexPage = page('ComponentsIndexPage', () => import('./docs/site/pages/components-index'));
const ComponentPage = page('ComponentPage', () => import('./docs/site/pages/component'));
const BlocksPage = page('BlocksPage', () => import('./docs/site/pages/compositions'));
const TemplatesPage = page('TemplatesPage', () => import('./docs/site/pages/compositions'));
const TemplateViewPage = page('TemplateViewPage', () => import('./docs/site/pages/compositions'));
const AiPage = page('AiPage', () => import('./docs/site/pages/ai'));
const RoadmapPage = page('RoadmapPage', () => import('./docs/site/pages/roadmap'));

export function App() {
    const search = useSiteSearch();

    return (
        <TooltipProvider delayDuration={0}>
            <NavigationBridge />
            <Routes>
                <Route element={<Shell onSearch={search.show} />}>
                    <Route index element={<HomePage />} />
                    <Route path="/standard" element={<StandardPage />} />
                    <Route path="/pieces/:slug" element={<PiecePage />} />
                    <Route path="/components" element={<ComponentsIndexPage />} />
                    <Route path="/components/:slug" element={<ComponentPage />} />
                    <Route path="/blocks" element={<BlocksPage />} />
                    <Route path="/templates" element={<TemplatesPage />} />
                    <Route path="/ai" element={<AiPage />} />
                    <Route path="/roadmap" element={<RoadmapPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
                <Route path="/templates/:slug" element={<TemplateViewPage />} />
            </Routes>
            <SiteSearch open={search.open} onOpenChange={search.setOpen} />
            <Toaster />
        </TooltipProvider>
    );
}
