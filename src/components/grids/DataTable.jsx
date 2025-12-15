import React, { useImperativeHandle, useMemo, useRef } from 'react';

import { getCoreRowModel, getExpandedRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { isEmpty } from 'lodash';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import clsx from 'clsx';
import styled from '@emotion/styled';

import { ConfigMap } from '@/utils';
import ErrorBoundary from '@/components/feedback/ErrorBoundary';
import useControllableState from '@/hooks/useControllableState';

import { convertColumnDef } from './DataTable.utils';
import ColumnTypes from './ColumnTypes';
import DefaultColumnGroup from './components/ColumnGroup';
import DefaultTableBody from './components/TableBody';
import DefaultTableHead from './components/TableHead';
import Overlay from './components/Overlay';
import TableFeatures from './TableFeatures';

const PREFIX = 'eda-datatable';

const classes = {
	// Slot classes.
	wrapper: `${PREFIX}-wrapper`,
	root: `${PREFIX}-root`,

	// Header classes.
	header: `${PREFIX}-header`,
	headerCell: `${PREFIX}-headerCell`,
	headerCellLabel: `${PREFIX}-headerCellLabel`,
	headerCellLabelContainer: `${PREFIX}-headerCellLabelContainer`,
	headerCellText: `${PREFIX}-headerCellText`,
	headerMenuTool: `${PREFIX}-headerMenuTool`,
	headerPlaceholder: `${PREFIX}-headerPlaceholder`,
	headerRowColumnGroup: `${PREFIX}-headerRowColumnGroup`,

	rowExpanderTool: `${PREFIX}-rowExpanderTool`,

	// Modifier classes.
	autoHeight: `${PREFIX}-autoHeight`,
	columnLines: `${PREFIX}-columnLines`,
	hidden: `${PREFIX}-hidden`,
	hideHeaderBorder: `${PREFIX}-hideHeaderBorder`,
	outlined: `${PREFIX}-outlined`,
	resizing: `${PREFIX}-resizing`,
	rowLines: `${PREFIX}-rowLines`,
	selectable: `${PREFIX}-selectable`,
	selected: `${PREFIX}-selected`,
	sortable: `${PREFIX}-sortable`,
	striped: `${PREFIX}-striped`,
	wrapText: `${PREFIX}-wrapText`,
};

const DataTableWrapper = styled('div')(() => ({
	[`&.${classes.wrapper}`]: {
		// AG Grid CSS variables.
		'--ag-background-color': '#FFFFFF',
		'--ag-border-color': '#D9D9D9',
		'--ag-border-radius': '3px',
		'--ag-borders': 'solid 1px',
		'--ag-card-shadow': '0 1px 4px 1px rgba(186, 191, 199, 0.4)',
		'--ag-cell-horizontal-padding': '10px',
		'--ag-cell-widget-spacing': '12px',
		'--ag-font-family': "'Open Sans', 'Roboto', 'Helvetica', 'Arial', sans-serif",
		'--ag-font-size': '12px',
		'--ag-grid-size': '6px', // padding
		'--ag-header-background-color': '#FFFFFF',
		'--ag-header-column-resize-handle-color': '#DDE2EB',
		'--ag-header-column-resize-handle-height': '30%',
		'--ag-header-column-resize-handle-width': '2px',
		'--ag-icon-button-background-spread': '4px',
		'--ag-icon-button-border-radius': '16px', // '1px',
		'--ag-icon-button-hover-background-color': 'rgba(0, 0, 0, 0.1)',
		'--ag-icon-size': '16px',
		'--ag-modal-overlay-background-color': 'rgba(255, 255, 255, 0.66)',
		'--ag-odd-row-background-color': '#F7F7F8',
		'--ag-row-height': '28px',
		'--ag-row-hover-color': 'rgba(33, 150, 243, 0.1)',
		'--ag-selected-row-background-color': 'rgba(33, 150, 243, 0.3)',
		'--ag-spacing': '8px',

		// Custom Properties
		'--ag-tool-shadow':
			'0 0 0 var(--ag-icon-button-background-spread) var(--ag-icon-button-hover-background-color)',

		boxSizing: 'border-box',
		flex: 1,
		height: '100%',
		overflow: 'auto',
		position: 'relative',
		width: '100%',

		[`&.${classes.autoHeight}`]: {
			height: 'unset',
			width: 'unset',
		},

		[`&.${classes.outlined}`]: {
			border: 'var(--ag-borders) var(--ag-border-color)',
		},
	},
}));

const DataTableRoot = styled('table')(() => ({
	[`&.${classes.root}`]: {
		borderCollapse: 'separate',
		borderSpacing: 0,
		fontFamily: 'var(--ag-font-family)',
		fontSize: 'var(--ag-font-size)',
		lineHeight: 'var(--ag-row-height)',
		tableLayout: 'fixed', // Important for the ellipsis overflow to work.
		width: 'fit-content', // We are adding the column groups for layout sizing.

		// Column Lines.
		[`&.${classes.columnLines}`]: {
			'td, th': {
				borderRight: 'var(--ag-borders) var(--ag-border-color)',

				'&:first-of-type': {
					borderLeft: 'var(--ag-borders) var(--ag-border-color)',
				},
			},
		},

		// Table border(outline).
		[`&.${classes.outlined}`]: {
			'td, th': {
				'&:first-of-type': {
					borderLeft: 'none',
				},

				'&:last-of-type': {
					borderRight: 'none',
				},
			},

			tbody: {
				'tr:last-of-type': {
					td: {
						borderBottom: 'none',
					},
				},
			},
		},

		// Row Lines.
		[`&.${classes.rowLines}`]: {
			'td, th': {
				borderBottom: 'var(--ag-borders) var(--ag-border-color)',
			},

			[`&.${classes.hideHeaderBorder}`]: {
				tbody: {
					'tr:first-of-type': {
						td: {
							borderTop: 'var(--ag-borders) var(--ag-border-color)',
						},
					},
				},
			},
		},

		// Row striping.
		[`&.${classes.striped}`]: {
			[`tr:nth-of-type(even):not(.${classes.selected}):not(:hover)`]: {
				td: {
					backgroundColor: 'var(--ag-odd-row-background-color)',
				},
			},
		},

		'td, th': {
			boxSizing: 'border-box',
			overflow: 'hidden',
			padding: `0 var(--ag-cell-horizontal-padding)`,
			position: 'relative',
			textAlign: 'left',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',

			// Style for the grouped header rows.
			[`&.${classes.headerRowColumnGroup}`]: {
				[`&.${classes.headerPlaceholder}`]: {
					borderBottomColor: 'transparent',
				},
			},

			[`.${classes.headerMenuTool}`]: {
				display: 'flex',
				justifyContent: 'center',

				svg: {
					borderRadius: 'var(--ag-icon-button-border-radius)',
					cursor: 'pointer',
					height: 'var(--ag-icon-size)',
					minWidth: 'var(--ag-icon-size)',
					width: 'var(--ag-icon-size)',

					'&:hover': {
						backgroundColor: 'var(--ag-icon-button-hover-background-color)',
						boxShadow: 'var(--ag-tool-shadow)',
					},
				},
			},

			[`.${classes.rowExpanderTool}`]: {
				borderRadius: 'var(--ag-icon-button-border-radius)',
				cursor: 'pointer',
				display: 'inline-flex',
				marginRight: 'var(--ag-cell-widget-spacing)',

				'&:hover': {
					backgroundColor: 'var(--ag-icon-button-hover-background-color)',
					boxShadow: 'var(--ag-tool-shadow)',
				},

				svg: {
					height: 'var(--ag-icon-size)',
					width: 'var(--ag-icon-size)',
				},
			},

			// Header Vertical Alignment
			'&.ag-bottom-aligned-header': {
				verticalAlign: 'bottom',
			},

			'&.ag-middle-aligned-header': {
				verticalAlign: 'middle',
			},

			'&.ag-top-aligned-header': {
				verticalAlign: 'top',
			},

			// Cell Horizontal Alignment
			'&.ag-center-aligned-cell': {
				textAlign: 'center',
			},

			'&.ag-left-aligned-cell': {
				textAlign: 'left',
			},

			'&.ag-right-aligned-cell': {
				textAlign: 'right',
			},

			[`.${classes.headerCellLabelContainer}`]: {
				display: 'block', // Important for the ellipsis overflow to work.

				[`.${classes.headerCellLabel}`]: {
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'row',

					[`.${classes.headerCellText}`]: {
						overflow: 'hidden',
						textAlign: 'left',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',

						[`&.${classes.wrapText}`]: {
							whiteSpace: 'break-spaces',
						},
					},
				},
			},

			'&.ag-center-aligned-header': {
				// Adding this for CSS specificity.
				[`.${classes.headerCellLabel}`]: {
					[`.${classes.headerCellText}`]: {
						flex: 1,
						textAlign: 'center',
					},
				},

				'.spacer': {
					display: 'none',
				},
			},

			'&.ag-right-aligned-header': {
				[`.${classes.headerCellLabel}`]: {
					flexDirection: 'row-reverse',
					justifyContent: 'flex-start',

					[`.${classes.headerCellText}`]: {
						textAlign: 'right',
					},
				},
			},

			'&.ag-left-aligned-header': {
				[`.${classes.headerCellText}`]: {
					textAlign: 'left',
				},
			},
		},

		tr: {
			'&:hover': {
				td: {
					backgroundColor: 'var(--ag-row-hover-color)',
				},
			},

			[`&.${classes.selectable}`]: {
				cursor: 'pointer',
			},

			[`&.${classes.selected}`]: {
				td: {
					backgroundColor: 'var(--ag-selected-row-background-color)',
				},
			},

			th: {
				borderBottom: 'var(--ag-borders) var(--ag-border-color)',
				verticalAlign: 'bottom',
			},
		},

		[`.${classes.header}`]: {
			backgroundColor: 'var(--ag-header-background-color)',
			position: 'sticky',
			top: 0,
			zIndex: 2,

			[`.${classes.headerCell}`]: {
				overflow: 'hidden',

				[`&.${classes.resizing}`]: {
					overflow: 'visible',
				},
			},
		},

		[`&.${classes.hideHeaderBorder}`]: {
			th: {
				borderBottom: 'none',
			},
		},

		/**
		 * We want to "smooth out" the cursor when resizing columns in order to avoid the "flicker"
		 * effect.
		 */
		[`&:has(th.${classes.resizing})`]: {
			cursor: 'ew-resize',

			th: {
				pointerEvents: 'none',
			},
		},

		[`.${classes.hidden}`]: {
			display: 'none',
		},

		[`.${classes.sortable}`]: {
			cursor: 'pointer',
			userSelect: 'none',
		},

		[`.${classes.wrapText}`]: {
			whiteSpace: 'break-spaces',
		},
	},
}));

const DataTable = React.forwardRef((props, ref) => {
	const {
		columnLines = false,
		columnResizeMode = 'onChange',
		columns: columnsProp = props.columnDefs,
		columnSizing: columnSizingProp,
		columnSizingInfo: columnSizingInfoProp,
		columnTypes = [],
		data = props.rowData ?? [],
		debugColumns = false,
		debugHeaders = false,
		debugTable = false,
		domLayout = 'normal',
		enableCheckboxSelection = false,
		enableClickSelection = false,
		enableExpanding = props.treeData ?? false,
		enableMultiRowSelection = false,
		enableRowSelection = enableCheckboxSelection || enableClickSelection || enableMultiRowSelection,
		enableSubRowSelection = false,
		expanded: expandedProp,
		getRowClass,
		getRowStyle,
		getSubRows = (row) => row.children, // return the children array as sub-rows
		hideHeaderBorder = false,
		hideHeaders = false,
		loadingOverlayProps = {},
		meta = {},
		noRowsOverlayProps = {},
		onCellClicked,
		onCellDoubleClicked,
		onColumnSizingChange: onColumnSizingChangeProp,
		onColumnSizingInfoChange: onColumnSizingInfoChangeProp,
		onExpandedChange: onExpandedChangeProp,
		onGridReady,
		onRowClicked,
		onRowDoubleClicked,
		onRowSelectionChanged: onRowSelectionChangedProp,
		onSelectionChanged,
		onSortingChange: onSortingChangeProp,
		outlined = false,
		rowClass,
		rowLines = false,
		rowSelection: rowSelectionProp,
		rowStyle,
		showLoadingOverlay = false,
		showNoRowsOverlay = false,
		slotProps = {},
		slots = {},
		sorting: sortingProp,
		striped = false,
		defaultColumn = {
			enableMultiSort: true,
			enableResizing: true,
			enableSorting: true,
			maxSize: 800,
			minSize: 50,
			size: 125,
			// Custom Properties
			suppressHeaderMenuButton: false,
			wrapHeaderText: false,
			wrapText: false,
		},
	} = props;

	const { ColumnGroup = DefaultColumnGroup, TableBody = DefaultTableBody, TableHead = DefaultTableHead } = slots;

	const {
		columnGroupProps = slotProps.ColumnGroupProps,
		tableBodyProps = slotProps.TableBodyProps,
		tableHeadProps = slotProps.TableHeadProps,
		tableProps = slotProps.TableProps,
		tableWrapperProps = slotProps.TableWrapperProps,
	} = slotProps;

	/**
	 * We are using the useControllableState hook to manage state that can be either
	 * controlled or uncontrolled.
	 */
	const [columnSizing, setColumnSizing] = useControllableState({
		defaultValue: {},
		onChange: onColumnSizingChangeProp,
		value: columnSizingProp,
	});

	const [columnSizingInfo, setColumnSizingInfo] = useControllableState({
		defaultValue: {},
		onChange: onColumnSizingInfoChangeProp,
		value: columnSizingInfoProp,
	});

	const [expanded, setExpanded] = useControllableState({
		defaultValue: {},
		onChange: onExpandedChangeProp,
		value: expandedProp,
	});

	const [rowSelection, setRowSelection] = useControllableState({
		defaultValue: {},
		onChange: onRowSelectionChangedProp,
		value: rowSelectionProp,
	});

	const [sorting, setSorting] = useControllableState({
		defaultValue: [],
		onChange: onSortingChangeProp,
		value: sortingProp,
	});

	const columnMapRef = useRef(new ConfigMap([...ColumnTypes, ...columnTypes]));
	const tableRef = useRef();

	/**
	 * We want to resolve the columns with their types and also add the selection column
	 * if checkbox selection is enabled.
	 */
	const resolvedColumns = useMemo(() => {
		const configs = columnMapRef.current;
		const columns = [...columnsProp];

		if (enableCheckboxSelection) {
			columns.unshift(columnMapRef.current.get('selection'));
		}

		// Recursively resolve columns and their type inheritence.
		const callback = (columnIn) => {
			/**
			 * I need to add UI props to the column definitions. Those props ideally are added to the
			 * columnDef meta section; however, I'm allowing the user to enter the configs as a flattened
			 * structure and I migrate the UI configs to the meta section via the `convertColumnDef`.
			 */
			const column = convertColumnDef(columnIn);

			if (column.columns) {
				column.columns = column.columns.map(callback);
			}

			if (isEmpty(column.meta.type)) {
				return column;
			} else {
				const { accessorKey = column.id, ...rest } = column;
				configs.set(accessorKey, { ...rest, accessorKey, extends: column.meta.type });

				return configs.get(accessorKey);
			}
		};

		return columns.map(callback);
		/**
		 * @important Need to note about stable references for columnsProp.
		 */
	}, [columnsProp, enableCheckboxSelection]);

	const table = useReactTable({
		_features: [TableFeatures],
		columnResizeMode,
		columns: resolvedColumns,
		data,
		debugColumns,
		debugHeaders,
		debugTable,
		defaultColumn,
		enableExpanding: enableExpanding,
		enableMultiRowSelection: enableMultiRowSelection,
		enableRowSelection: enableRowSelection, // (row) => row.original.age > 18
		enableSubRowSelection: enableSubRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getSubRows,
		onColumnSizingChange: setColumnSizing,
		onColumnSizingInfoChange: setColumnSizingInfo,
		onExpandedChange: setExpanded,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		// getRowId: (row) => row.uuid,
		meta: {
			...meta,
			classes,
			enableCheckboxSelection,
			enableClickSelection,
			getRowClass,
			getRowStyle,
			onCellClicked,
			onCellDoubleClicked,
			onRowClicked,
			onRowDoubleClicked,
			props,
			rowClass,
			rowStyle,
			tableRef,
		},
		state: {
			columnSizing,
			columnSizingInfo,
			expanded,
			rowSelection,
			sorting,
		},
	});

	/**
	 * We need access to the table within the component but we also want the parent component to be able
	 * to access the table as well. However, I don't want to make the ref a required prop. Consequently,
	 * if a ref is passed it returns an object that exposes the getTable method which then allows access
	 * to the table instance and its api.
	 *
	 * @example
	 * `ref.current.getTable()` returns the table instance.
	 */
	useImperativeHandle(
		ref,
		() => {
			return { getTable: () => tableRef.current };
		},
		[]
	);

	/**
	 * We want to call the onGridReady callback when the grid is ready.
	 */
	useEffectOnce(() => {
		onGridReady?.(table);
	});

	/**
	 * If row expanding is disabled, we want to reset the expanded state.
	 */
	useUpdateEffect(() => {
		if (!enableExpanding) {
			table.resetExpanded();
		}
	}, [enableExpanding]);

	/**
	 * If row selection is disabled, we want to reset the row selection state.
	 */
	// useUpdateEffect(() => {
	// 	if (!enableRowSelection) {
	// 		table.resetRowSelection();
	// 	}
	// }, [enableRowSelection]);

	/**
	 * We want to call the onSelectionChanged callback when the selection changes.
	 */
	useUpdateEffect(() => {
		onSelectionChanged?.(table.getSelectedRowModel().rows);
	}, [rowSelection]);

	return (
		<ErrorBoundary>
			<DataTableWrapper
				{...tableWrapperProps}
				className={clsx(classes.wrapper, tableWrapperProps?.className, {
					[classes.autoHeight]: domLayout === 'autoHeight',
					[classes.outlined]: outlined,
				})}
			>
				<DataTableRoot
					ref={tableRef}
					{...tableProps}
					className={clsx(classes.root, tableProps?.className, {
						[classes.columnLines]: columnLines,
						[classes.hideHeaderBorder]: hideHeaderBorder,
						[classes.outlined]: outlined,
						[classes.rowLines]: rowLines,
						[classes.striped]: striped,
					})}
				>
					{/* We create the colgroup so that we can support a version of column "flexing". */}
					<ColumnGroup table={table} {...columnGroupProps} />
					{!hideHeaders && <TableHead table={table} {...tableHeadProps} />}
					<TableBody table={table} {...tableBodyProps} />
				</DataTableRoot>
				{showLoadingOverlay && <Overlay overlayText={'Loading...'} {...loadingOverlayProps} />}
				{showNoRowsOverlay && <Overlay overlayText={'No Rows to Show'} {...noRowsOverlayProps} />}
			</DataTableWrapper>
		</ErrorBoundary>
	);
});

export default DataTable;
