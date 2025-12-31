import { useMemo } from 'react';
import ErrorBoundary from '@/components/feedback/ErrorBoundary';

const Column = (props) => {
	const { context, ...rest } = props;
	return <col data-id={context.column.id} {...rest} />;
};

const createLeafColumnRenderer = ({ columnSizing, table }) => {
	return function LeafColumnRenderer(column) {
		const maxWidth = column.columnDef.maxSize ?? table.options.defaultColumn.maxSize;
		const minWidth = column.columnDef.minSize ?? table.options.defaultColumn.minSize;
		const width = columnSizing[column.id] ?? column.columnDef.size ?? column.getSize();

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
	const { columnSizing } = table.getState();

	const centerLeaves = table.getCenterVisibleLeafColumns();
	const leftLeaves = table.getLeftVisibleLeafColumns();
	const rightLeaves = table.getRightVisibleLeafColumns();

	const colgroup = useMemo(() => {
		/**
		 * I'm checking the length to ensure we recalc if columns are added/removed (e.g. via column
		 * visibility or adding a checkbox selection column).
		 */
		const leafColumnRenderer = createLeafColumnRenderer({ columnSizing, table });
		const visibleLeafColumns = [...leftLeaves, ...centerLeaves, ...rightLeaves];

		return <colgroup>{visibleLeafColumns.map(leafColumnRenderer)}</colgroup>;
	}, [centerLeaves, columnSizing, leftLeaves, rightLeaves, table]);

	return <ErrorBoundary>{colgroup}</ErrorBoundary>;
};

ColumnGroup.displayName = 'ColumnGroup';

export default ColumnGroup;
