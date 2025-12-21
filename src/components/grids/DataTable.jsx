import { forwardRef, useRef } from 'react';

import { getCoreRowModel, getExpandedRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import clsx from 'clsx';
import styled from '@emotion/styled';

import * as Global from '@/utils/Global';
import ErrorBoundary from '@/components/feedback/ErrorBoundary';
import useControlled from '@/hooks/useControlled';
import useMergedRefs from '@/hooks/useMergedRefs';

import ColumnTypesFeature from './features/ColumnTypesFeature';
import DefaultColumnGroup from './components/ColumnGroup';
import DefaultTableBody from './components/TableBody';
import DefaultTableHead from './components/TableHead';
import HelpersFeature from './features/HelpersFeature';
import Overlay from './components/Overlay';
import useCheckBoxSelection from './hooks/useCheckboxSelection';

const PREFIX = 'eda-datatable';

const classes = {
	// Slot classes.
	wrapper: `${PREFIX}-wrapper`,
	root: `${PREFIX}-root`,

	// Header classes.
	header: `${PREFIX}-header`,
	headerCell: `${PREFIX}-header-cell`,
	headerCellLabel: `${PREFIX}-header-cell-label`,
	headerCellLabelContainer: `${PREFIX}-header-cell-label-container`,
	headerCellText: `${PREFIX}-header-cell-text`,
	headerMenuTool: `${PREFIX}-header-menu-tool`,
	headerPlaceholder: `${PREFIX}-header-placeholder`,
	headerRowColumnGroup: `${PREFIX}-header-row-column-group`,

	// Row classes.
	rowExpanderTool: `${PREFIX}-row-expander-tool`,

	// Feature classes
	pinned: `${PREFIX}-pinned`,
	pinnedFirstRight: `${PREFIX}-first-right-pinned`,
	pinnedLastLeft: `${PREFIX}-last-left-pinned`,
	resizing: `${PREFIX}-resizing`,
	selectable: `${PREFIX}-selectable`,
	selected: `${PREFIX}-selected`,
	sortable: `${PREFIX}-sortable`,

	// Modifier classes.
	autoHeight: `${PREFIX}-auto-height`,
	columnLines: `${PREFIX}-column-lines`,
	hidden: `${PREFIX}-hidden`,
	hideHeaderBorder: `${PREFIX}-hide-header-border`,
	outlined: `${PREFIX}-outlined`,
	rowLines: `${PREFIX}-row-lines`,
	striped: `${PREFIX}-striped`,
	wrapText: `${PREFIX}-wrap-text`,
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
			tbody: {
				[`tr:nth-of-type(even):not(.${classes.selected}):not(:hover)`]: {
					backgroundColor: 'var(--ag-odd-row-background-color)',

					/**
					 * When we pin a column we add a pseudo element to create the "overlay" effect
					 * which requires us to explicitly handle striping due to the "overlay" being added.
					 */
					'td, th': {
						[`&.${classes.pinned}`]: {
							'&:before': {
								backgroundColor: 'var(--ag-odd-row-background-color)',
							},
						},
					},
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

			[`&.${classes.pinned}`]: {
				position: 'sticky',
				zIndex: 1,

				/**
				 * When we pin a column we add a pseudo element to create and "overlay" effect that
				 * prevents the other row content from "bleeding" through when scrolled horizontally.
				 */
				'&:before': {
					backgroundColor: 'var(--ag-background-color)',
					content: '""',
					inset: 0,
					pointerEvents: 'none',
					position: 'absolute',
					zIndex: -1,
				},

				[`&.${classes.pinnedFirstRight}`]: {
					borderLeft: 'var(--ag-borders) var(--ag-border-color)',
				},

				[`&.${classes.pinnedLastLeft}`]: {
					borderRight: 'var(--ag-borders) var(--ag-border-color)',
				},
			},

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
			backgroundColor: 'var(--ag-background-color)',

			th: {
				borderBottom: 'var(--ag-borders) var(--ag-border-color)',
				verticalAlign: 'bottom',
			},
		},

		tbody: {
			tr: {
				'&:hover': {
					backgroundColor: 'var(--ag-row-hover-color)',

					/**
					 * When we pin a column we add a pseudo element to create the "overlay" effect
					 * which requires us to explicitly handle the hover effect due to the "overlay"
					 * being added. If we don't "remove" the effect from the normal content then we
					 * "double-dip" on the effect color (if it is partially transparent).
					 */
					'td, th': {
						[`&.${classes.pinned}`]: {
							backgroundColor: 'var(--ag-background-color)',

							'&:before': {
								backgroundColor: 'var(--ag-row-hover-color)',
							},
						},
					},
				},

				[`&.${classes.selectable}`]: {
					cursor: 'pointer',
				},

				[`&.${classes.selected}`]: {
					backgroundColor: 'var(--ag-selected-row-background-color)',

					/**
					 * When we pin a column we add a pseudo element to create the "overlay" effect
					 * which requires us to explicitly handle the selected effect due to the "overlay"
					 * being added. If we don't "remove" the effect from the normal content then we
					 * "double-dip" on the effect color (if it is partially transparent).
					 */
					td: {
						[`&.${classes.pinned}`]: {
							backgroundColor: 'var(--ag-background-color)',

							'&:before': {
								backgroundColor: 'var(--ag-selected-row-background-color)',
							},
						},
					},
				},
			},
		},

		[`.${classes.header}`]: {
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

const getSubRowsCallback = (row) => row.children; // return the children array as sub-rows

const DataTable = forwardRef((props, ref) => {
	const {
		_features = Global.emptyArray,
		columnLines = false,
		columnPinning: columnPinningProp,
		columnResizeMode = 'onChange',
		columns: columnsProp = props.columnDefs,
		columnSizing: columnSizingProp,
		columnSizingInfo: columnSizingInfoProp,
		columnTypes = Global.emptyArray,
		data = props.rowData ?? Global.emptyArray,
		domLayout = 'normal',
		enableCheckboxSelection = false,
		enableClickSelection = false,
		enableColumnPinning = false,
		enableExpanding = props.treeData ?? false,
		enableMultiRowSelection = false,
		enableRowSelection = props.enableCheckboxSelection ||
			props.enableClickSelection ||
			props.enableMultiRowSelection,
		enableSubRowSelection = false,
		expanded: expandedProp,
		getRowClass,
		getRowStyle,
		getSubRows = getSubRowsCallback,
		hideHeaderBorder = false,
		hideHeaders = false,
		loadingOverlayProps = Global.emptyObject,
		meta = Global.emptyObject,
		noRowsOverlayProps = Global.emptyObject,
		onCellClicked,
		onCellDoubleClicked,
		onColumnPinningChange: onColumnPinningChangeProp,
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
		slotProps = Global.emptyObject,
		slots = Global.emptyObject,
		sorting: sortingProp,
		state,
		striped = false,
		defaultColumn = {
			enableMultiSort: true,
			enableResizing: true,
			enableSorting: true,
			maxSize: 800,
			minSize: 50,
			size: 125,
			meta: {
				suppressHeaderMenuButton: false,
				wrapHeaderText: false,
				wrapText: false,
			},
		},
		...rest
	} = props;

	const { ColumnGroup = DefaultColumnGroup, TableBody = DefaultTableBody, TableHead = DefaultTableHead } = slots;

	const {
		columnGroupProps = slotProps.ColumnGroupProps,
		tableBodyProps = slotProps.TableBodyProps,
		tableHeadProps = slotProps.TableHeadProps,
		tableProps = slotProps.TableProps,
		tableWrapperProps = slotProps.TableWrapperProps,
	} = slotProps;

	const tableRef = useRef();
	const refs = useMergedRefs(ref, tableRef);

	/**
	 * We are using the useControlled hook to manage state that can be either controlled or
	 * uncontrolled.
	 */
	const [columnPinning, setColumnPinning] = useControlled({
		controlled: columnPinningProp,
		default: { left: [], right: [] },
		onChange: onColumnPinningChangeProp,
	});

	const [columnSizing, setColumnSizing] = useControlled({
		controlled: columnSizingProp,
		default: {},
		onChange: onColumnSizingChangeProp,
	});

	const [columnSizingInfo, setColumnSizingInfo] = useControlled({
		controlled: columnSizingInfoProp,
		default: {},
		onChange: onColumnSizingInfoChangeProp,
	});

	const [expanded, setExpanded] = useControlled({
		controlled: expandedProp,
		default: {},
		onChange: onExpandedChangeProp,
	});

	const [rowSelection, setRowSelection] = useControlled({
		controlled: rowSelectionProp,
		default: {},
		onChange: onRowSelectionChangedProp,
	});

	const [sorting, setSorting] = useControlled({
		controlled: sortingProp,
		default: [],
		onChange: onSortingChangeProp,
	});

	const columns = useCheckBoxSelection({ columns: columnsProp, enableCheckboxSelection, setColumnPinning });

	const table = useReactTable({
		...rest,
		_features: [..._features, ColumnTypesFeature, HelpersFeature],
		columnResizeMode,
		columns,
		columnTypes,
		data,
		defaultColumn,
		enableColumnPinning,
		enableExpanding,
		enableMultiRowSelection,
		enableRowSelection, // (row) => row.original.age > 18
		enableSubRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getSubRows,
		onColumnPinningChange: setColumnPinning,
		onColumnSizingChange: setColumnSizing,
		onColumnSizingInfoChange: setColumnSizingInfo,
		onExpandedChange: setExpanded,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		meta: {
			...meta,
			classes,
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
			...state,
			columnPinning,
			columnSizing,
			columnSizingInfo,
			expanded,
			rowSelection,
			sorting,
		},
	});

	/**
	 * We want to call the onGridReady callback when the grid is ready.
	 */
	useEffectOnce(() => {
		onGridReady?.(table);
	});

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
					ref={refs}
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
