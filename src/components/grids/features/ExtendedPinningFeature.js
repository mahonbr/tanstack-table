const ExtendedPinningFeature = {
	createColumn: (column, table) => {
		const pinned = column.columnDef.meta?.pinned;

		if (pinned === 'left' || pinned === 'right') {
			table._queue(() => {
				column.pin(pinned);
			});
		}
	},
};

export default ExtendedPinningFeature;
