import { useMemo } from 'react';

import ErrorBoundary from '@/components/feedback/ErrorBoundary';

const createLeafColumnRenderer = ({ columnSizing, table }) => {
	return (col) => {
		const maxWidth = col.columnDef.maxSize ?? table.options.defaultColumn.maxSize;
		const minWidth = col.columnDef.minSize ?? table.options.defaultColumn.minSize;
		const width = columnSizing[col.id] ?? col.columnDef.size ?? col.getSize();

		return <col key={col.id} data-id={col.id} style={{ maxWidth, minWidth, width }} />;
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

	const colgroup = useMemo(() => {
		/**
		 * I'm checking the length to ensure we recalc if columns are added/removed (e.g. via column
		 * visibility or adding a checkbox selection column).
		 */
		const leafColumnRenderer = createLeafColumnRenderer({ columnSizing, table });
		return <colgroup>{table.getAllLeafColumns().map(leafColumnRenderer)}</colgroup>;
	}, [table.getAllLeafColumns().length, columnSizing]);

	return <ErrorBoundary>{colgroup}</ErrorBoundary>;
};

export default ColumnGroup;
