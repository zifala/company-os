export type Category = 'shell' | 'page-kit' | 'dialogs' | 'forms' | 'views' | 'setup';

export interface DocExample {
    title: string;
    description?: string;
    code: string;
    demoKey: string;
    surface?: 'background' | 'card';
}

export interface PropRow {
    name: string;
    type: string;
    defaultValue?: string;
    description: string;
}

export interface KeyRow {
    keys: string;
    action: string;
}

export interface DocEntry {
    slug: string;
    name: string;
    category: Category;
    pieces: number[];
    tagline: string;
    job: string;
    tags: string[];
    exports: string[];
    files: string[];
    registryDeps?: string[];
    shadcnDeps?: string[];
    intro: string[];
    examples: DocExample[];
    props: { component: string; rows: PropRow[] }[];
    a11y: { keyboard?: KeyRow[]; notes: string[] };
    donts: string[];
    faq: { q: string; a: string }[];
}
