import DataTable from '@/components/grids/DataTable';
import { useState } from 'react';

const rowData = [
	{
		category: 'Cpttn/Vendor',
		pmpmPrior: 133.15,
		pmpmCurrent: 110.02,
		pmpmDiff: -23.13000000000001,
		pmpmDiffPercent: -17.4,
		expensePrior: 603895775.43,
		expenseCurrent: 513408927.55,
		expenseDiff: -90486847.87999994,
		expenseDiffPercent: -15,
		children: [
			{
				category: 'Cpttn/Vendor',
				pmpmPrior: 133.15,
				pmpmCurrent: 110.02,
				pmpmDiff: -23.12,
				pmpmDiffPercent: -17.4,
				expensePrior: 603895775.43,
				expenseCurrent: 513408927.55,
				expenseDiff: -90486847.88,
				expenseDiffPercent: -15,
				children: [
					{
						category: 'Cpttn/Vendor',
						pmpmPrior: 133.15,
						pmpmCurrent: 110.02,
						pmpmDiff: -23.12,
						pmpmDiffPercent: -17.4,
						expensePrior: 603895775.43,
						expenseCurrent: 513408927.55,
						expenseDiff: -90486847.88,
						expenseDiffPercent: -15,
					},
				],
			},
		],
	},
	{
		category: 'Intrst/Net Reins/Oth Med forced Overflow',
		pmpmPrior: 0.6,
		pmpmCurrent: 1.25,
		pmpmDiff: 0.65,
		pmpmDiffPercent: 108.3,
		expensePrior: 2708724.63,
		expenseCurrent: 5822785.03,
		expenseDiff: 3114060.4000000004,
		expenseDiffPercent: 115,
		children: [
			{
				category: 'Intrst/Net Reins/Oth Med',
				pmpmPrior: 0.6,
				pmpmCurrent: 1.25,
				pmpmDiff: 0.65,
				pmpmDiffPercent: 108.9,
				expensePrior: 2708724.63,
				expenseCurrent: 5822785.03,
				expenseDiff: 3114060.4,
				expenseDiffPercent: 115,
			},
		],
	},
	{
		category: 'IP',
		pmpmPrior: 108.82,
		pmpmCurrent: 113.05999999999999,
		pmpmDiff: 4.239999999999995,
		pmpmDiffPercent: 3.9,
		expensePrior: 493577676.37,
		expenseCurrent: 527559948.6999999,
		expenseDiff: 33982272.32999992,
		expenseDiffPercent: 6.9,
		children: [
			{
				category: 'IP BH',
				pmpmPrior: 2.04,
				pmpmCurrent: 2.6,
				pmpmDiff: 0.56,
				pmpmDiffPercent: 27.4,
				expensePrior: 9255384.62,
				expenseCurrent: 12129160.7,
				expenseDiff: 2873776.08,
				expenseDiffPercent: 31,
			},
			{
				category: 'IP Med/Surg',
				pmpmPrior: 86.27,
				pmpmCurrent: 88,
				pmpmDiff: 1.74,
				pmpmDiffPercent: 2,
				expensePrior: 391268088.9,
				expenseCurrent: 410645731.34,
				expenseDiff: 19377642.44,
				expenseDiffPercent: 5,
			},
			{
				category: 'IP OB Dlvry NB',
				pmpmPrior: 19.77,
				pmpmCurrent: 21.86,
				pmpmDiff: 2.09,
				pmpmDiffPercent: 10.6,
				expensePrior: 89675570.25,
				expenseCurrent: 101995573.52,
				expenseDiff: 12320003.27,
				expenseDiffPercent: 13.7,
			},
			{
				category: 'NF',
				pmpmPrior: 0.74,
				pmpmCurrent: 0.6,
				pmpmDiff: -0.15,
				pmpmDiffPercent: -19.8,
				expensePrior: 3378632.6,
				expenseCurrent: 2789483.14,
				expenseDiff: -589149.46,
				expenseDiffPercent: -17.4,
			},
		],
	},
	{
		category: 'OP',
		pmpmPrior: 156.01999999999998,
		pmpmCurrent: 179.06,
		pmpmDiff: 23.04000000000002,
		pmpmDiffPercent: 14.8,
		expensePrior: 707690262.71,
		expenseCurrent: 835550986.3000001,
		expenseDiff: 127860723.59000003,
		expenseDiffPercent: 18.1,
		children: [
			{
				category: 'OP ER',
				pmpmPrior: 46.19,
				pmpmCurrent: 50.09,
				pmpmDiff: 3.9,
				pmpmDiffPercent: 8.4,
				expensePrior: 209490678.57,
				expenseCurrent: 233722633.4,
				expenseDiff: 24231954.83,
				expenseDiffPercent: 11.6,
			},
			{
				category: 'OP Hgh Tech Rdlgy',
				pmpmPrior: 2.08,
				pmpmCurrent: 3.25,
				pmpmDiff: 1.17,
				pmpmDiffPercent: 56.3,
				expensePrior: 9421560.52,
				expenseCurrent: 15152914.06,
				expenseDiff: 5731353.54,
				expenseDiffPercent: 60.8,
			},
			{
				category: 'OP HH/DME',
				pmpmPrior: 1.45,
				pmpmCurrent: 1.41,
				pmpmDiff: -0.05,
				pmpmDiffPercent: -3.2,
				expensePrior: 6582336.13,
				expenseCurrent: 6556720.21,
				expenseDiff: -25615.92,
				expenseDiffPercent: -0.4,
			},
			{
				category: 'OP IV Thrpy/Oncology/Chemo/Pharmacy Misc',
				pmpmPrior: 21.34,
				pmpmCurrent: 40.52,
				pmpmDiff: 19.18,
				pmpmDiffPercent: 89.9,
				expensePrior: 96804541.88,
				expenseCurrent: 189098878,
				expenseDiff: 92294336.12,
				expenseDiffPercent: 95.3,
			},
			{
				category: 'Op Med Tstg/Stdys',
				pmpmPrior: 9.92,
				pmpmCurrent: 12.71,
				pmpmDiff: 2.79,
				pmpmDiffPercent: 28.1,
				expensePrior: 44999209.72,
				expenseCurrent: 59315001.05,
				expenseDiff: 14315791.33,
				expenseDiffPercent: 31.8,
			},
			{
				category: 'OP Mgmt Oth Misc',
				pmpmPrior: 21.18,
				pmpmCurrent: 20.66,
				pmpmDiff: -0.52,
				pmpmDiffPercent: -2.5,
				expensePrior: 96071035.97,
				expenseCurrent: 96410962.2,
				expenseDiff: 339926.23,
				expenseDiffPercent: 0.4,
			},
			{
				category: 'OP Oth - Dialysis',
				pmpmPrior: 3.26,
				pmpmCurrent: 1.85,
				pmpmDiff: -1.41,
				pmpmDiffPercent: -43.2,
				expensePrior: 14797470.41,
				expenseCurrent: 8652586.72,
				expenseDiff: -6144883.69,
				expenseDiffPercent: -41.5,
			},
			{
				category: 'OP Oth BH',
				pmpmPrior: 0.52,
				pmpmCurrent: 0.48,
				pmpmDiff: -0.04,
				pmpmDiffPercent: -8.6,
				expensePrior: 2362108.2,
				expenseCurrent: 2220855.89,
				expenseDiff: -141252.31,
				expenseDiffPercent: -6,
			},
			{
				category: 'OP Surg',
				pmpmPrior: 50.08,
				pmpmCurrent: 48.09,
				pmpmDiff: -1.99,
				pmpmDiffPercent: -4,
				expensePrior: 227161321.31,
				expenseCurrent: 224420434.77,
				expenseDiff: -2740886.54,
				expenseDiffPercent: -1.2,
			},
		],
	},
	{
		category: 'Pharmacy Net Rebates',
		pmpmPrior: 130.35999999999999,
		pmpmCurrent: 142.89999999999998,
		pmpmDiff: 12.539999999999992,
		pmpmDiffPercent: 9.6,
		expensePrior: 583029795.0600001,
		expenseCurrent: 657461686.7,
		expenseDiff: 74431891.63999999,
		expenseDiffPercent: 12.8,
		children: [
			{
				category: 'Pharmacy',
				pmpmPrior: 155.98,
				pmpmCurrent: 175.32,
				pmpmDiff: 19.34,
				pmpmDiffPercent: 12.4,
				expensePrior: 697597590.97,
				expenseCurrent: 806604179.65,
				expenseDiff: 109006588.68,
				expenseDiffPercent: 15.6,
			},
			{
				category: 'Pharmacy Rebates',
				pmpmPrior: -25.62,
				pmpmCurrent: -32.42,
				pmpmDiff: -6.8,
				pmpmDiffPercent: 26.5,
				expensePrior: -114567795.91,
				expenseCurrent: -149142492.95,
				expenseDiff: -34574697.04,
				expenseDiffPercent: 30.2,
			},
		],
	},
	{
		category: 'Phys',
		pmpmPrior: 114.67,
		pmpmCurrent: 124.67,
		pmpmDiff: 10,
		pmpmDiffPercent: 8.7,
		expensePrior: 520088233.6,
		expenseCurrent: 581731604.31,
		expenseDiff: 61643370.70999992,
		expenseDiffPercent: 11.9,
		children: [
			{
				category: 'Phys',
				pmpmPrior: 114.67,
				pmpmCurrent: 124.67,
				pmpmDiff: 10,
				pmpmDiffPercent: 8.7,
				expensePrior: 520088233.6,
				expenseCurrent: 581731604.31,
				expenseDiff: 61643370.71,
				expenseDiffPercent: 11.9,
			},
		],
	},
];

/**
 * Added "type" property to column definitions to allow for extension of predefined column types.
 */
const columns = [
	{
		accessorKey: 'category',
		header: 'Type of Service Long Header Name 1',
		type: ['expander'],
		size: 200, // '200%', // 200, // It is important to note that size needs to be on a leaf column.
		minSize: 200,
		// headerTooltip
	},
	{
		id: 'test',
		accessorKey: 'category',
		header: 'Type of Service Long Header Name 2',
		size: '200%',
		minSize: 200,
		type: ['text'],
		wrapHeaderText: true,
		wrapText: false,
	},
	// {
	// 	accessorKey: 'test',
	// 	header: 'Test',
	// 	size: '200%',
	// 	columns: [
	// 		{
	// 			id: 'test1',
	// 			header: 'Test 1',
	// 			accessorKey: 'test',
	// 			// header: 'Type of Service 1',
	// 			columns: [
	// 				{
	// 					id: 'test2',
	// 					header: 'Test 2',
	// 					accessorKey: 'test',
	// 					// header: 'Type of Service 2',
	// 				},
	// 			],
	// 		},
	// 	],
	// },
	// {
	// 	accessorKey: 'retest',
	// 	header: 'Retest',
	// 	size: '200%', // 200,
	// 	columns: [
	// 		// {
	// 		// 	id: 'retest1',
	// 		// 	// header: 'Test 1',
	// 		// 	accessorKey: 'retest',
	// 		// 	// header: 'Type of Service 1',
	// 		// 	columns: [
	// 		{
	// 			id: 'retest2',
	// 			header: 'Retest 2',
	// 			accessorKey: 'retest',
	// 			// header: 'Type of Service 2',
	// 			size: '200%',
	// 		},
	// 		// 	],
	// 		// },
	// 	],
	// },
	{
		header: 'PMPM',
		headerClass: 'ag-center-aligned-header',
		columns: [
			{
				accessorKey: 'pmpmCurrent',
				header: 'Current',
				type: ['number'],
				meta: {
					format: '$0,0.00',
				},
			},
			{
				accessorKey: 'pmpmPrior',
				header: 'Prior',
				type: ['number'],
				meta: {
					format: '$0,0.00',
				},
			},
			{
				accessorKey: 'pmpmDiff',
				header: 'Diff',
				type: ['number'],
				meta: {
					format: '$0,0.00',
				},
			},
			{
				accessorKey: 'pmpmDiffPercent',
				header: 'Diff %',
				type: ['number'],
				meta: {
					format: '0,0.0%',
				},
			},
		],
	},
	{
		header: 'Expenses',
		headerClass: 'ag-center-aligned-header',
		columns: [
			{
				accessorKey: 'expenseCurrent',
				header: 'Current',
				type: ['number'],
				meta: {
					format: '$0,0',
				},
			},
			{
				accessorKey: 'expensePrior',
				header: 'Prior',
				type: ['number'],
				meta: {
					format: '$0,0',
				},
			},
			{
				accessorKey: 'expenseDiff',
				header: 'Diff',
				type: ['number'],
				meta: {
					format: '$0,0',
				},
			},
			{
				accessorKey: 'expenseDiffPercent',
				header: 'Diff %',
				type: ['number'],
				meta: {
					format: '0,0.0%',
				},
			},
		],
	},
];

function App(props) {
	const [columnLines, setColumnLines] = useState(false);
	const [hideHeaderBorder, setHideHeaderBorder] = useState(false);
	const [hideHeaders, setHideHeaders] = useState(false);
	const [rowLines, setRowLines] = useState(false);
	const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
	const [showNoRowsOverlay, setShowNoRowsOverlay] = useState(false);
	const [striped, setStriped] = useState(true);

	return (
		<div>
			<form style={{ display: 'flex', fontFamily: '"Open Sans"', fontSize: 13, gap: 24, marginBottom: 24 }}>
				<div>
					<input
						type='checkbox'
						checked={columnLines}
						onChange={(event) => setColumnLines(event.target.checked)}
					></input>
					<label>Column Lines</label>
					<br />
					<input
						type='checkbox'
						checked={rowLines}
						onChange={(event) => setRowLines(event.target.checked)}
					></input>
					<label>Row Lines</label>
					<br />
					<input
						type='checkbox'
						checked={striped}
						onChange={(event) => setStriped(event.target.checked)}
					></input>
					<label>Striped</label>
				</div>
				<div>
					<input
						type='checkbox'
						checked={hideHeaderBorder}
						onChange={(event) => setHideHeaderBorder(event.target.checked)}
					></input>
					<label>Hide Header Border</label>
					<br />
					<input
						type='checkbox'
						checked={hideHeaders}
						onChange={(event) => setHideHeaders(event.target.checked)}
					></input>
					<label>Hide Headers</label>
				</div>
				<div>
					<input
						type='checkbox'
						checked={showLoadingOverlay}
						onChange={(event) => setShowLoadingOverlay(event.target.checked)}
					></input>
					<label>Show Loading Overlay</label>
					<br />
					<input
						type='checkbox'
						checked={showNoRowsOverlay}
						onChange={(event) => setShowNoRowsOverlay(event.target.checked)}
					></input>
					<label>Show No Rows Overlay</label>
				</div>
			</form>

			<DataTable
				columnLines={columnLines}
				columns={columns}
				data={rowData}
				hideHeaderBorder={hideHeaderBorder}
				hideHeaders={hideHeaders}
				onGridReady={(table) => console.log('onGridReady', table)}
				rowLines={rowLines}
				showLoadingOverlay={showLoadingOverlay}
				showNoRowsOverlay={showNoRowsOverlay}
				striped={striped}
			/>
			<p />
		</div>
	);
	// return <DataTable columnDefs={columns} rowData={rowData} />;
}

export default App;
