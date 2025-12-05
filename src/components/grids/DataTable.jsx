import React, { useMemo, useRef, useState } from 'react';

import { getCoreRowModel, getExpandedRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { isEmpty } from 'lodash';
import clsx from 'clsx';
import styled from '@emotion/styled';

import { ConfigMap } from '@/utils';
import ColumnTypes from './ColumnTypes';
import DefaultColumnGroup from './components/ColumnGroup';
import DefaultTableBody from './components/TableBody';
import DefaultTableHead from './components/TableHead';

const PREFIX = 'eda-datatable';

export const classes = {
	// Slot classes.
	root: `${PREFIX}-root`,
	headerMenuTool: `${PREFIX}-headerMenuTool`,
	headerPlaceholder: `${PREFIX}-headerPlaceholder`,

	// Modifier classes.
	sortable: `${PREFIX}-sortable`,
	hidden: `${PREFIX}-hidden`,
};

const DataTableRoot = styled('table')(() => ({
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
		tableLayout: 'fixed', // Important for the ellipsis overflow to work.
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

			overflow: 'hidden',
			textAlign: 'left',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			'&.wrapText': {
				whiteSpace: 'break-spaces',
			},

			// Style for the grouped header rows.
			'&.ag-header-row-column-group': {
				[`&.${classes.headerPlaceholder}`]: {
					borderBottomColor: 'transparent',
				},
			},

			[`.${classes.headerMenuTool}`]: {
				background: 'transparent',
				border: 'none',
				borderRadius: '50%',
				cursor: 'pointer',
				height: 22,
				padding: 0,
				width: 22,

				'&:hover': {
					backgroundColor: 'rgba(0, 0, 0, 0.1)',
				},
			},

			/** Header Vertical Alignment */
			'&.ag-bottom-aligned-header': {
				verticalAlign: 'bottom',
			},

			'&.ag-middle-aligned-header': {
				verticalAlign: 'middle',
			},

			'&.ag-top-aligned-header': {
				verticalAlign: 'top',
			},

			/** Cell Horizontal Alignment */
			'&.ag-center-aligned-cell': {
				textAlign: 'center',
			},

			'&.ag-left-aligned-cell': {
				textAlign: 'left',
			},

			'&.ag-right-aligned-cell': {
				textAlign: 'right',
			},

			'.ag-header-cell-label-container': {
				display: 'block', // Important for the ellipsis overflow to work.

				'.ag-header-cell-label': {
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'row',

					'.ag-header-cell-text': {
						overflow: 'hidden',
						textAlign: 'left',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',

						'&.wrapHeaderText': {
							whiteSpace: 'break-spaces',
						},
					},
				},
			},

			'&.ag-center-aligned-header': {
				// Adding this for CSS specificity.
				'.ag-header-cell-label': {
					'.ag-header-cell-text': {
						flex: 1,
						textAlign: 'center',
					},
				},

				'.spacer': {
					display: 'none',
				},
			},

			'&.ag-right-aligned-header': {
				'.ag-header-cell-label': {
					flexDirection: 'row-reverse',
					justifyContent: 'flex-start',

					'.ag-header-cell-text': {
						textAlign: 'right',
					},
				},
			},

			'&.ag-left-aligned-header': {
				'.ag-header-cell-text': {
					textAlign: 'left',
				},
			},
		},

		tr: {
			'&:hover': {
				td: {
					backgroundColor: '#E6F7FF',
				},
			},

			th: {
				verticalAlign: 'bottom',
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

/**
 * HelperFeatures is a custom feature that injects helper methods to the table and column instances.
 *
 * - `createTable(table)`: Adds a `getMeta()` method to the table instance, returning `table.options.meta`.
 * - `createColumn(column)`: Adds a `getMeta()` method to the column instance, returning `column.columnDef?.meta`.
 *
 * This allows convenient access to custom metadata (such as classes or value formatters) throughout
 * the table and column lifecycle, especially in cell/column renderers.
 */
const HelperFeatures = {
	createTable: (table) => {
		table.getMeta = () => table.options.meta;
	},

	createColumn: (column) => {
		column.getMeta = () => column.columnDef?.meta;
	},
};

const DataTable = React.forwardRef((props, ref) => {
	const {
		columns: columnsProp = props.columnDefs,
		columnTypes = [],
		data = props.rowData ?? [],
		debugTable = false,
		getSubRows = (row) => row.children, // return the children array as sub-rows
		slots = {},
		defaultColumn = {
			enableMultiSort: true,
			enableSorting: true,
			size: 125,
			// Custom Properties
			suppressHeaderMenuButton: false,
			wrapHeaderText: false,
			wrapText: false,
		},
	} = props;

	const { ColumnGroup = DefaultColumnGroup, TableBody = DefaultTableBody, TableHead = DefaultTableHead } = slots;

	const [expanded, setExpanded] = useState({});
	const [sorting, setSorting] = useState([]);
	const columnMapRef = useRef(new ConfigMap([...ColumnTypes, ...columnTypes]));

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
		_features: [HelperFeatures],
		columns: resolvedColumns,
		data,
		debugTable,
		defaultColumn,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getSubRows,
		onExpandedChange: setExpanded,
		onSortingChange: setSorting,
		meta: {
			classes,
			props,
		},
		state: {
			expanded,
			sorting,
		},
	});

	return (
		<DataTableRoot ref={ref} className={clsx(classes.root)}>
			{/* We create the colgroup so that we can support a version of column "flexing". */}
			<ColumnGroup classes={classes} table={table} />
			<TableHead classes={classes} table={table} />
			<TableBody classes={classes} table={table} />
		</DataTableRoot>
	);
});

export default DataTable;
