import { useMemo, useRef } from 'react';

import { castArray, isEmpty } from 'lodash';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import clsx from 'clsx';
import styled from '@emotion/styled';

import { ConfigMap, number } from '@/utils';
import { down, menu_alt, up } from '@/assets/themes';

import { defaultData } from './Grid.utils';

const PREFIX = 'TanStackGrid';

/**
 * @todo Add slots to classes.
 */
export const classes = {
	root: `${PREFIX}-root`,

	headerCellWrapper: `${PREFIX}-headerCellWrapper`,

	sortable: `${PREFIX}-sortable`,
	hidden: `${PREFIX}-hidden`,
};

const GridRoot = styled('table')(() => ({
	[`&.${classes.root}`]: {
		'--ag-border-color': '#D9D9D9',
		'--ag-cell-horizontal-padding': '10px',
		'--ag-font-family': "'Open Sans', 'Roboto', 'Helvetica', 'Arial', sans-serif",
		'--ag-font-size': '12px',
		'--ag-odd-row-background-color': '#F7F7F8',
		'--ag-row-height': '28px',

		// Custom variables.
		'--ag-header-horizontal-padding': '6px',
		'--eda-default-column-width': '150px',

		borderCollapse: 'collapse',
		fontFamily: 'var(--ag-font-family)',
		fontSize: 'var(--ag-font-size)',
		lineHeight: 'var(--ag-row-height)',
		tableLayout: 'fixed', // Important for overflow ellipsis to work.
		width: '100%',

		'tr:nth-of-type(even)': {
			td: {
				// Applying to the cell to accommodate the "shim" column.
				backgroundColor: 'var(--ag-odd-row-background-color)',
			},
		},

		'td, th': {
			border: '1px solid var(--ag-border-color)',
			boxSizing: 'border-box',
			padding: `0 var(--ag-cell-horizontal-padding)`,
			width: 'var(--eda-default-column-width)',

			// Overflow handling.
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',

			// Shim column used to facilitate "table-layout: fixed" with ellipsis and to mirror AG Grid behavior.
			'&.column-shim': {
				border: 'none',
				opacity: 0,
				userSelect: 'none',
				width: 'auto',
			},

			[`.${classes.headerCellWrapper}`]: {
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
			cellClass: 'ag-center-aligned-cell',
			headerClass: 'ag-center-aligned-header',
		},
	],
];

/**
 * Added "type" property to column definitions to allow for extension of predefined column types.
 */
const defaultColumns = [
	{
		accessorKey: 'category',
		enableSorting: true,
		header: 'Type of Service',
		type: ['text'],
		// headerComponent
		// headerTooltip
		// wrapHeaderText
		// wrapText
	},
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
];

const onMenuClick = (event) => {
	event.stopPropagation();
	alert('Menu clicked!');
};

const SortIndicatorTool = (props) => {
	const { sorted = false, style, ...rest } = props;

	if (sorted) {
		const src = sorted === 'asc' ? up : down;
		return <img alt={''} src={src} style={{ width: 16, ...style }} {...rest} />;
	}
};

const Spacer = (props) => {
	return <div className={'spacer'} style={{ flex: 1 }} {...props} />;
};

const Grid = (props) => {
	const { columns: columnsProp = defaultColumns, columnTypes = defaultColumnTypes, data = defaultData } = props;
	const columnMapRef = useRef(new ConfigMap(columnTypes));

	const resolvedColumns = useMemo(() => {
		const configs = columnMapRef.current;

		/**
		 * @todo Needs to handle grouped headers.
		 */
		return columnsProp.map((column) => {
			if (isEmpty(column.type)) {
				return column;
			} else {
				const { accessorKey, type, ...rest } = column;
				configs.set(accessorKey, { ...rest, accessorKey, extends: type });

				return configs.get(accessorKey);
			}
		});
		// Need to note about stable references for columnTypes and columnsProp.
	}, [columnsProp]);

	const table = useReactTable({
		columns: resolvedColumns,
		data,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<GridRoot className={clsx(classes.root)}>
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							// Guard clause for placeholder headers.
							if (header.isPlaceholder) return <th key={header.id} />;

							const headerClass = header.column.columnDef?.headerClass
								? castArray(header.column.columnDef?.headerClass)
								: [];

							return (
								<th
									key={header.id}
									onClick={header.column.getToggleSortingHandler()}
									className={clsx(...headerClass, {
										[classes.sortable]: header.column.getCanSort(),
									})}
								>
									<div className={clsx(classes.headerCellWrapper)}>
										{flexRender(header.column.columnDef.header, header.getContext())}

										{header.column.getCanSort() && (
											<SortIndicatorTool sorted={header.column.getIsSorted()} />
										)}

										<Spacer />

										<button className={'menuTool'} onClick={onMenuClick}>
											<img alt={'Menu'} src={menu_alt} style={{ width: 16 }} />
										</button>
									</div>
								</th>
							);
						})}
					</tr>
				))}
			</thead>

			<tbody>
				{table.getRowModel().rows.map((row) => (
					<tr key={row.id}>
						{row.getVisibleCells().map((cell) => {
							const cellClass = cell.column.columnDef?.cellClass
								? castArray(cell.column.columnDef?.cellClass)
								: [];

							return (
								<td key={cell.id} className={clsx(...cellClass)}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							);
						})}

						<td className={'column-shim'}></td>
					</tr>
				))}
			</tbody>
		</GridRoot>
	);
};

export default Grid;
