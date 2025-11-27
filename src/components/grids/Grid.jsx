import { useMemo, useRef, useState } from 'react';

import {
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

import { isEmpty } from 'lodash';
import { IconArrowDown, IconArrowUp, IconChevronDown, IconChevronRight, IconDotsVertical } from '@tabler/icons-react';
import clsx from 'clsx';
import styled from '@emotion/styled';

import { ConfigMap, number } from '@/utils';

import { defaultData } from './Grid.utils';

const PREFIX = 'eda-table';

export const classes = {
	// Slot classes.
	root: `${PREFIX}-root`,
	headerCellWrapper: `${PREFIX}-headerCellWrapper`,

	// Modifier classes.
	sortable: `${PREFIX}-sortable`,
	hidden: `${PREFIX}-hidden`,
};

const GridRoot = styled('table')(() => ({
	[`&.${classes.root}`]: {
		// AG Grid CSS variables.
		'--ag-border-color': '#D9D9D9',
		'--ag-cell-horizontal-padding': '10px',
		'--ag-font-family': "'Open Sans', 'Roboto', 'Helvetica', 'Arial', sans-serif",
		'--ag-font-size': '12px',
		'--ag-odd-row-background-color': '#F7F7F8',
		'--ag-row-height': '28px',

		// Custom CSS variables.
		'--eda-default-column-width': '125px',

		borderCollapse: 'collapse',
		fontFamily: 'var(--ag-font-family)',
		fontSize: 'var(--ag-font-size)',
		lineHeight: 'var(--ag-row-height)',
		tableLayout: 'fixed', // Important for overflow ellipsis to work.
		width: 'fit-content', // We are adding the column groups for layout sizing.

		// Row striping.
		'tr:nth-of-type(even)': {
			td: {
				backgroundColor: 'var(--ag-odd-row-background-color)',
			},
		},

		'td, th': {
			border: '1px solid var(--ag-border-color)',
			boxSizing: 'border-box',
			padding: `0 var(--ag-cell-horizontal-padding)`,
			width: 'var(--eda-default-column-width)',

			// Style for the grouped header rows.
			'&.ag-header-row-column-group': {
				'&.placeholder': {
					borderBottomColor: 'transparent',
				},
			},

			// Overflow handling.
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',

			[`.${classes.headerCellWrapper}`]: {
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'row',
				gap: 6,
				justifyContent: 'flex-start',
				position: 'relative',
			},

			'.menuTool': {
				background: 'transparent',
				border: 'none',
				cursor: 'pointer',
				padding: 0,

				borderRadius: 6,
				marginRight: 2,

				'&:hover': {
					backgroundColor: 'rgba(0, 0, 0, 0.1)',
				},
			},

			'&.ag-center-aligned-header': {
				[`.${classes.headerCellWrapper}`]: {
					justifyContent: 'center',
				},

				'.menuTool': {
					left: 0,
					position: 'absolute',
					top: '50%',
					transform: 'translateY(-50%)',
				},

				'.spacer': {
					display: 'none',
				},
			},

			'&.ag-left-aligned-header': {
				[`.${classes.headerCellWrapper}`]: {
					justifyContent: 'flex-start',
				},
			},

			'&.ag-right-aligned-header': {
				[`.${classes.headerCellWrapper}`]: {
					flexDirection: 'row-reverse',
					justifyContent: 'flex-start',
				},
			},

			'&.ag-center-aligned-cell': {
				textAlign: 'center',
			},

			'&.ag-left-aligned-cell': {
				textAlign: 'left',
			},

			'&.ag-right-aligned-cell': {
				textAlign: 'right',
			},
		},

		tr: {
			'&:hover': {
				td: {
					backgroundColor: '#E6F7FF',
				},
			},
		},

		[`.${classes.hidden}`]: {
			display: 'none',
		},

		[`.${classes.sortable}`]: {
			cursor: 'pointer',
			userSelect: 'none',
		},
	},
}));

const defaultColumnTypes = [
	[
		'number',
		{
			cellClass: 'ag-right-aligned-cell',
			headerClass: 'ag-right-aligned-header',
			cell: (info) => {
				return number(info.getValue(), info.column.columnDef?.meta?.format ?? '0,0');
			},
		},
	],
	[
		'text',
		{
			cellClass: 'ag-left-aligned-cell',
			headerClass: 'ag-left-aligned-header',
		},
	],
];

/**
 * Added "type" property to column definitions to allow for extension of predefined column types.
 */
const defaultColumns = [
	{
		accessorKey: 'category',
		header: 'Type of Service',
		type: ['text'],
		size: '200%', // 200,
		// headerComponent
		// headerTooltip
		// wrapHeaderText
		// wrapText,
		cell: ({ row, getValue }) => (
			<div
				style={{
					overflow: 'hidden',
					paddingLeft: `${row.depth * 2}rem`,
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
				}}
			>
				{row.getCanExpand() && (
					<button
						className={'menuTool'}
						onClick={row.getToggleExpandedHandler()}
						style={{
							alignItems: 'baseline',
							display: 'inline-flex',
							padding: 3,
							verticalAlign: 'middle',
						}}
					>
						{row.getIsExpanded() ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
					</button>
				)}
				{getValue()}
			</div>
		),
	},
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

const onMenuClick = (event) => {
	event.stopPropagation();
	alert('Menu clicked!');
};

const SortIndicatorTool = ({ sorted }) => {
	if (sorted) {
		return sorted === 'asc' ? <IconArrowUp size={16} /> : <IconArrowDown size={16} />;
	}
};

const Spacer = (props) => {
	return <div className={'spacer'} style={{ flex: 1 }} {...props} />;
};

const Grid = (props) => {
	const { columns: columnsProp = defaultColumns, columnTypes = defaultColumnTypes, data = defaultData } = props;

	const [expanded, setExpanded] = useState({});
	const columnMapRef = useRef(new ConfigMap(columnTypes));

	const resolvedColumns = useMemo(() => {
		const configs = columnMapRef.current;

		// Recursively resolve columns and their type inheritence.
		const fn = (column) => {
			if (column.columns) {
				column.columns = column.columns.map(fn);
			}

			if (isEmpty(column.type)) {
				return column;
			} else {
				const { accessorKey, type, ...rest } = column;
				configs.set(accessorKey, { ...rest, accessorKey, extends: type });

				return configs.get(accessorKey);
			}
		};

		return columnsProp.map(fn);
		// Need to note about stable references for columnTypes and columnsProp.
	}, [columnsProp]);

	const table = useReactTable({
		columns: resolvedColumns,
		data,
		debugTable: true,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getSubRows: (row) => row.children, // return the children array as sub-rows
		onExpandedChange: setExpanded,
		defaultColumn: {
			enableMultiSort: true,
			enableSorting: true,
			size: 125,
		},
		state: {
			expanded, // Passing expanded state back to the table.
		},
	});

	return (
		<GridRoot className={clsx(classes.root)}>
			{/* We create the colgroup so that we can support a version of column "flexing". */}
			<colgroup>
				{table.getAllLeafColumns().map((col, i) => {
					const width = col.columnDef.size ?? col.getSize();
					return <col key={col.id} style={{ minWidth: '100px', width }} />;
				})}
			</colgroup>

			<thead>
				{table.getHeaderGroups().map((headerGroup, i, headerGroups) => {
					const isLeafRow = i === headerGroups.length - 1;

					return (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								// Guard clause for placeholder headers.
								if (header.isPlaceholder) {
									return (
										<th
											key={header.id}
											className={clsx('placeholder', {
												'ag-header-row-column-group': !isLeafRow,
											})}
										/>
									);
								}

								return (
									<th
										key={header.id}
										colSpan={header.colSpan}
										onClick={header.column.getToggleSortingHandler()}
										className={clsx(header.column.columnDef?.headerClass, {
											[classes.sortable]: header.column.getCanSort(),
											'ag-header-row-column-group': !isLeafRow,
										})}
									>
										<div className={clsx(classes.headerCellWrapper)}>
											{flexRender(header.column.columnDef.header, header.getContext())}

											{isLeafRow && (
												<>
													{header.column.getCanSort() && (
														<SortIndicatorTool sorted={header.column.getIsSorted()} />
													)}

													<Spacer />

													<button className={'menuTool'} onClick={onMenuClick}>
														<IconDotsVertical size={16} />
													</button>
												</>
											)}
										</div>
									</th>
								);
							})}
						</tr>
					);
				})}
			</thead>

			<tbody>
				{table.getRowModel().rows.map((row) => {
					return (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => {
								return (
									<td key={cell.id} className={clsx(cell.column.columnDef?.cellClass)}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</GridRoot>
	);
};

export default Grid;
