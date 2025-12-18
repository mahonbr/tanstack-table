import { flexRender } from '@tanstack/react-table';
import { omit } from 'lodash';
import clsx from 'clsx';

import ErrorBoundary from '@/components/feedback/ErrorBoundary';
import useDeepCompareMemo from '@/hooks/useDeepCompareMemo';

/**
 * In an attempt to optimize rendering performance of table cells, I'm was memoizing the TableCell
 * but that didn't work as hoped. Instead, it will be important for cells with "heavy" rendering
 * logic to implement their own memoization.
 */
const TableCell = (props) => {
	const { cell, ...rest } = props;
	const context = cell.getContext();

	return <td {...rest}>{flexRender(context.column.columnDef.cell, context)}</td>;
};

const cellRenderer = (cell) => {
	// console.log('TableCell');
	const context = cell.getContext();

	const { column, row, table } = context;
	const { align, cellClass, cellStyle, getCellClass, getCellStyle, wrapText } = column.getMeta() ?? {};
	const { classes, onCellClicked, onCellDoubleClicked } = table.getMeta() ?? {};
	const isPinned = column.getIsPinned();

	return (
		<TableCell
			key={`cell-${row.id}-${column.id}-${cell.id}`}
			cell={cell}
			onClick={(event) => onCellClicked?.(event, context)}
			onDoubleClick={(event) => onCellDoubleClicked?.(event, context)}
			className={clsx(cellClass, `ag-${align}-aligned-cell`, getCellClass?.(context), {
				[classes.pinned]: isPinned,
				[classes.pinnedFirstRight]: column.getIsFirstColumn('right'),
				[classes.pinnedLastLeft]: column.getIsLastColumn('left'),
				[classes.wrapText]: wrapText,
			})}
			style={{
				...cellStyle,
				...getCellStyle?.(context),
				left: isPinned === 'left' ? column.getStart('left') : undefined,
				right: isPinned === 'right' ? column.getAfter('right') : undefined,
				// width: column.getSize(),
			}}
		/>
	);
};

const TableRow = (props) => {
	const { row, ...rest } = props;
	return <tr {...rest}>{row.getVisibleCells().map(cellRenderer)}</tr>;
};

const rowRenderer = (row) => {
	const { table } = row.getContext();

	const {
		classes,
		enableCheckboxSelection,
		enableClickSelection,
		getRowClass,
		getRowStyle,
		onRowClicked,
		onRowDoubleClicked,
		rowClass,
		rowStyle,
	} = table.getMeta();

	const onClickCallback = (event) => {
		if (onRowClicked?.(event, { row, table }) !== false) {
			/**
			 * If the row is selectable and checkbox selection is disabled, "force" toggle selection
			 * on row click.
			 */
			if (row.getCanSelect() && enableCheckboxSelection && !enableClickSelection) return;

			row.getToggleSelectedHandler()(event);
		}
	};

	return (
		<TableRow
			key={`row-${row.id}`}
			row={row}
			onClick={onClickCallback}
			onDoubleClick={(event) => onRowDoubleClicked?.(event, { row, table })}
			className={clsx(rowClass, getRowClass?.({ row, table }), {
				[classes.selectable]: row.getCanSelect(),
				[classes.selected]: row.getIsSelected(),
			})}
			style={{
				...rowStyle,
				...getRowStyle?.({ row, table }),
			}}
		/>
	);
};

const TableBody = (props) => {
	const { table } = props;

	/**
	 * In an effort to make cell rendering more performant I'm removing table options that seem to
	 * cause unnecessary rerenders. I'm additionally removing the column sizing states so cells
	 * aren't rerendered during resizing.
	 *
	 * @important We may need to add additional model's as we add more features. (e.g. filtering).
	 */
	const rows = useDeepCompareMemo(
		() => table.getRowModel().rows.map(rowRenderer),
		[
			omit(table.options, [
				'getCoreRowModel',
				'getExpandedRowModel',
				'getFacetedRowModel',
				'getFilteredRowModel',
				'getGroupedRowModel',
				'getPaginationRowModel',
				'getSelectedRowModel',
				'getSortedRowModel',
				'onStateChange',
				'state.columnSizing',
				'state.columnSizingInfo',
			]),
		]
	);

	return (
		<ErrorBoundary>
			<tbody>{rows}</tbody>
		</ErrorBoundary>
	);
};

export default TableBody;
