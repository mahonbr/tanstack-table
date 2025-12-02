const ColumnGroup = (props) => {
	const { table } = props;

	const ColumnGroupCallback = (col) => {
		const width = col.columnDef.size ?? col.getSize();
		return <col key={col.id} style={{ minWidth: '100px', width }} />;
	};

	return <colgroup>{table.getAllLeafColumns().map(ColumnGroupCallback)}</colgroup>;
};

export default ColumnGroup;
