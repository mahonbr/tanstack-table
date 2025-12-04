const leafColumnRenderer = (col) => {
	const width = col.columnDef.size ?? col.getSize();
	return <col key={col.id} style={{ minWidth: '100px', width }} />;
};

const ColumnGroup = (props) => {
	const { table } = props;
	return <colgroup>{table.getAllLeafColumns().map(leafColumnRenderer)}</colgroup>;
};

export default ColumnGroup;
