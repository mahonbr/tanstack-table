import { useMemo, useRef } from 'react';
import ErrorBoundary from '@/components/feedback/ErrorBoundary';

const Column = (props) => {
	const { context, ...rest } = props;
	const ref = useRef(null);

	context.column.columnDef.meta.columnGroupRef = ref;

	return <col ref={ref} {...rest} />;
};

const createLeafColumnRenderer = ({ columnSizing, table }) => {
	return (column) => {
		const maxWidth = column.columnDef.maxSize ?? table.options.defaultColumn.maxSize;
		const minWidth = column.columnDef.minSize ?? table.options.defaultColumn.minSize;
		const width = columnSizing[column.id] ?? column.columnDef.size ?? column.getSize();

		// return <col key={column.id} data-id={column.id} style={{ maxWidth, minWidth, width }} />;
		return <Column key={column.id} context={{ column }} style={{ maxWidth, minWidth, width }} />;
	};
};

/**
 * Since we are using a table layout, we are using a colgroup to...
 * 	- Make column resizing more performant.
 * 	- Support column width percentages (for flexing).
 */
const ColumnGroup = (props) => {
	const { table } = props;
	const { columnPinning, columnSizing } = table.getState();

	const colgroup = useMemo(() => {
		/**
		 * I'm checking the length to ensure we recalc if columns are added/removed (e.g. via column
		 * visibility or adding a checkbox selection column).
		 */
		const leafColumnRenderer = createLeafColumnRenderer({ columnSizing, table });

		const visibleLeafColumns = [
			...table.getLeftVisibleLeafColumns(),
			...table.getCenterVisibleLeafColumns(),
			...table.getRightVisibleLeafColumns(),
		];

		return <colgroup>{visibleLeafColumns.map(leafColumnRenderer)}</colgroup>;
	}, [table.getAllLeafColumns(), columnPinning, columnSizing]);

	return <ErrorBoundary>{colgroup}</ErrorBoundary>;
};

export default ColumnGroup;
