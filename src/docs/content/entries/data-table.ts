import type { DocEntry } from '../types';

export const dataTable: DocEntry = {
    slug: 'data-table',
    name: 'DataTable',
    category: 'page-kit',
    pieces: [20],
    tagline: 'The index table frame: sticky header, scrolling rows, pager footer, and an empty state that keeps the table.',
    job: 'Frame one paginated table so it fills the page and always shows the shape the data will take.',
    tags: ['table', 'index', 'pagination', 'empty', 'skeleton', 'list'],
    exports: ['DataTable', 'TableEmptyRow', 'DataTableSkeleton', 'Paginated', 'PageLabels'],
    files: ['components/company-os/data-table.tsx', 'components/company-os/pager.tsx'],
    shadcnDeps: ['table', 'button', 'skeleton'],
    intro: [
        'Lists are tables. <b>DataTable</b> wraps your <code>&lt;Table&gt;</code> in a card, keeps the header row sticky while rows scroll, and reads Laravel\'s paginator for the footer: "Showing 1–25 of 212" with Previous and Next. One table per view, never two stacked.',
        'When there are no rows the table stays. Headers remain, one full-width <b>TableEmptyRow</b> says why it is empty and names the next action, the footer reads "0 results". The reader sees the shape the data will take. First use, no results, and no permission are three different messages the page passes in.',
        'Loading is <b>DataTableSkeleton</b> inside <code>&lt;Deferred&gt;</code>; a failed load is the LoadError with a retry.',
    ],
    examples: [
        {
            title: 'Rows and pager',
            demoKey: 'data-table-rows',
            code: `import { DataTable, LinkCell, StatusCell, MoneyCell, DateCell } from '@/components/company-os';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

<DataTable page={invoices}>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Invoice</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Total</TableHead>
        <TableHead>Issued</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {invoices.data.map((invoice) => (
        <TableRow key={invoice.id}>
          <LinkCell value={{ label: invoice.number, href: show(invoice.id), detail: invoice.customer }} />
          <StatusCell value={invoice.status} />
          <MoneyCell value={invoice.total} />
          <DateCell value={invoice.issued} />
        </TableRow>
      ))}
    </TableBody>
  </Table>
</DataTable>`,
        },
        {
            title: 'Empty, first use',
            description: 'The table keeps its headers. The row names the next action.',
            demoKey: 'data-table-empty',
            code: `<TableBody>
  {invoices.data.length === 0 && (
    <TableEmptyRow colSpan={4} title="No invoices yet" message="Create the first one from a won deal.">
      {can.create && <Button size="sm">Create invoice</Button>}
    </TableEmptyRow>
  )}
</TableBody>`,
        },
        {
            title: 'Loading',
            demoKey: 'data-table-skeleton',
            code: `<Deferred data="invoices" fallback={<DataTableSkeleton />} rescue={<LoadError prop="invoices" noun="invoices" />}>
  …
</Deferred>`,
        },
    ],
    props: [
        {
            component: 'DataTable',
            rows: [
                { name: 'page', type: 'Paginated<unknown>', description: 'Laravel paginator: from, to, total, prev_page_url, next_page_url. Omit for an unpaginated table.' },
                { name: 'labels', type: 'PageLabels', description: 'previous, next, showing(from, to, total), none. Pass translated copy.' },
                { name: 'children', type: 'ReactNode', description: 'The <code>&lt;Table&gt;</code>.' },
            ],
        },
        {
            component: 'TableEmptyRow',
            rows: [
                { name: 'colSpan', type: 'number', description: 'Column count, so the row spans the table.' },
                { name: 'title', type: 'string', description: 'Why it is empty.' },
                { name: 'message', type: 'string', description: 'What fills it, or who can.' },
                { name: 'children', type: 'ReactNode', description: 'The first action when the user may take it, or the active filter chips.' },
            ],
        },
        {
            component: 'DataTableSkeleton',
            rows: [{ name: 'rows', type: 'number', defaultValue: '6', description: 'Placeholder rows.' }],
        },
    ],
    a11y: {
        keyboard: [
            { keys: 'Tab', action: 'Moves through row links, row menus and the pager buttons.' },
            { keys: 'Enter', action: 'Opens the focused record link.' },
        ],
        notes: [
            'The header row is a real <code>&lt;thead&gt;</code> with <code>&lt;th scope="col"&gt;</code> cells from the ui Table.',
            'Disabled pager buttons stay in the tab order as disabled buttons, so the reader knows there is no next page.',
            'The footer count is tabular and announced as text.',
        ],
    },
    donts: [
        'No standalone empty card instead of the table.',
        'No two tables on one view. One table, a type column, a filter.',
        'No avatars in rows. No column per fact.',
        'No spinner inside the table. Skeleton rows while loading.',
        'No sort or page state in React. The query string is the state.',
    ],
    faq: [
        { q: 'Where do filters go?', a: 'In the FilterBar above the table, written to the query string.' },
        { q: 'Filtered to nothing?', a: 'TableEmptyRow with "No invoices match these filters" and the FilterChips as children, so one click clears them.' },
        { q: 'Row click?', a: 'The LinkCell in the primary column opens the record. Rows with more than two actions get one ActionsMenu.' },
    ],
};
