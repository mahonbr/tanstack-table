import { useMemo } from 'react';

const createLeafColumnRenderer = ({ columnSizing, table }) => {
	return (col) => {
		const maxWidth = col.columnDef.maxSize ?? table.options.defaultColumn.maxSize;
		const minWidth = col.columnDef.minSize ?? table.options.defaultColumn.minSize;
		const width = columnSizing[col.id] ?? col.columnDef.size ?? col.getSize();

		return <col key={col.id} data-id={`${col.id}`} style={{ maxWidth, minWidth, width }} />;
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
		const leafColumnRenderer = createLeafColumnRenderer({ columnSizing, table });
		return <colgroup>{table.getAllLeafColumns().map(leafColumnRenderer)}</colgroup>;
	}, [columnSizing]);

	return colgroup;
};

export default ColumnGroup;
