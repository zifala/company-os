import { PrintBlock, PrintLines, PrintSheet, PrintTotals } from '@/components/company-os';
import type { PrintColumn, PrintRow } from '@/components/company-os';

const columns: PrintColumn[] = [
    { key: 'description', label: 'Description' },
    { key: 'quantity', label: 'Qty', numeric: true, width: '16mm' },
    { key: 'price', label: 'Unit price', numeric: true, width: '30mm' },
    { key: 'amount', label: 'Amount', numeric: true, width: '32mm' },
];

const rows: PrintRow[] = [
    { id: '1', cells: { description: 'Cold chain audit, Mogadishu port warehouse', quantity: '1', price: '4,800.00', amount: '4,800.00' } },
    { id: '2', cells: { description: 'Reefer container monitoring, October', quantity: '12', price: '320.00', amount: '3,840.00' } },
    { id: '3', cells: { description: 'Temperature loggers, model TL-40', quantity: '24', price: '45.00', amount: '1,080.00' } },
    { id: '4', cells: { description: 'On-site training, two sessions', quantity: '2', price: '650.00', amount: '1,300.00' } },
];

export function PrintInvoice() {
    return (
        <PrintSheet
            letterhead={{
                legalName: 'Halcyon Freight Ltd',
                lines: ['KM4 Street, Hodan District, Mogadishu', 'Registration REG-2019-4471 · Tax ID 300-118-442', 'accounts@halcyon.example · +252 61 234 5678'],
                logo: <span className="flex size-12 items-center justify-center rounded-md border border-black text-lg font-bold">H</span>,
            }}
            title="Invoice"
            number="INV-0413"
            stamp="Draft"
            meta={[
                { label: 'Issued', value: '7 Nov 2026' },
                { label: 'Due', value: '7 Dec 2026' },
                { label: 'Terms', value: 'Net 30' },
                { label: 'Currency', value: 'USD' },
            ]}
            footer={['Halcyon Freight Ltd · REG-2019-4471', 'Printed 7 Nov 2026, 10:24 by Ayaan Warsame', 'INV-0413']}
        >
            <div className="grid grid-cols-2 gap-[8mm]">
                <PrintBlock title="Bill to">
                    <p className="font-semibold">Northwind Trading</p>
                    <p>Attn. Idil Hassan</p>
                    <p>Maka Al Mukarama Road, Mogadishu</p>
                </PrintBlock>
                <PrintBlock title="Reference">
                    <p>Deal: Cold chain audit</p>
                    <p>PO-2291</p>
                </PrintBlock>
            </div>
            <PrintLines columns={columns} rows={rows} />
            <PrintTotals
                totals={[
                    { label: 'Subtotal', value: '11,020.00' },
                    { label: 'VAT 5%', value: '551.00' },
                    { label: 'Total USD', value: '11,571.00', strong: true },
                ]}
            />
            <PrintBlock title="Pay to">
                <p>Premier Bank · Account 0012 4471 9930 · SWIFT PRMBSOSM</p>
                <p>Quote INV-0413 with the payment.</p>
            </PrintBlock>
        </PrintSheet>
    );
}
