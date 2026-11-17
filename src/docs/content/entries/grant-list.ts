import type { DocEntry } from '../types';

export const grantList: DocEntry = {
    slug: 'grant-list',
    name: 'GrantList',
    category: 'organization',
    pieces: [5, 16],
    tagline: 'The pages granted to one person on top of their role: what, who granted it, when, and revoke with a reason.',
    job: 'Add or take away a single page for one person without inventing a role for them.',
    tags: ['grants', 'delegated', 'pages', 'revoke', 'scoped permissions', 'access'],
    exports: ['GrantList', 'grantListLabels', 'Grant', 'GrantListLabels'],
    files: ['components/company-os/grant-list.tsx'],
    registryDeps: ['cells', 'data-table', 'reason-dialog'],
    shadcnDeps: ['table', 'button'],
    intro: [
        'Rows are the <code>grants</code> table for one user: <code>page</code>, <code>granted_by</code>, <code>granted_at</code>, <code>revoked_at</code>. Revoked rows stay, struck through, with who and why — grants are stamped, never erased.',
        'Revoke opens a ReasonDialog. It shows only where <code>canRevoke</code> is true: the recipe lets a person grant and revoke only pages they hold. Granting is a FormDialog on the page whose options are those same pages.',
    ],
    examples: [
        {
            title: 'On the user\'s Grants tab',
            demoKey: 'grant-list-basic',
            code: `import { GrantList } from '@/components/company-os';

<GrantList
  person={user.name}
  grants={grants}
  canRevoke={(grant) => auth.pages.includes(grant.page.key)}
  processing={form.processing}
  errors={form.errors}
  onRevoke={(grant, reason, done) => router.delete(route('organization.users.grants.destroy', [user.id, grant.id]), { data: { reason }, onSuccess: done })}
/>`,
        },
        {
            title: 'No grants',
            demoKey: 'grant-list-empty',
            code: `<GrantList person="Mahad Yusuf" grants={[]} canRevoke={() => false} onRevoke={() => undefined} />`,
        },
    ],
    props: [
        {
            component: 'GrantList',
            rows: [
                { name: 'person', type: 'string', description: 'Named in the revoke consequence.' },
                { name: 'grants', type: 'Grant[]', description: '<code>{ id, page: { key, label, detail }, grantedBy, grantedAt, revokedAt, revokedBy?, revokeReason? }</code>.' },
                { name: 'canRevoke', type: '(grant) => boolean', description: 'Whether the viewer holds the page.' },
                { name: 'processing · errors', type: 'boolean · { reason? }', description: 'Request state for the dialog.' },
                { name: 'onRevoke', type: '(grant, reason, done) => void', description: 'Call <code>done</code> on success to close the dialog.' },
                { name: 'labels', type: 'Partial<GrantListLabels>', description: 'Column heads, states, dialog copy.' },
            ],
        },
    ],
    a11y: { notes: ['Revoked state is a word in a pill plus the strike-through, never colour alone.'] },
    donts: ['No granting a page you do not hold.', 'No deleting grant rows. Revoke stamps revoked_at.', 'No grant to work around a missing scope. Fix the role.'],
    faq: [{ q: 'What does a grant give?', a: 'One page in the sidebar and its route. Access::granted checks it; the page still applies the person\'s scopes and sensitive switches.' }],
};
