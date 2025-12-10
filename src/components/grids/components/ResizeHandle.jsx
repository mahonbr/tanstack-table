import clsx from 'clsx';
import styled from '@emotion/styled';

const PREFIX = 'eda-resizehandle';

const classes = {
	root: `${PREFIX}-root`,
};

const ResizeHandleRoot = styled('div')(() => ({
	[`&.${classes.root}`]: {
		cursor: 'ew-resize',
		height: '100%',
		position: 'absolute',
		right: 0,
		top: 0,
		userSelect: 'none',
		width: 'var(--ag-cell-horizontal-padding)',

		'&:after': {
			backgroundColor: 'var(--ag-header-column-resize-handle-color)',
			content: '""',
			height: 'var(--ag-header-column-resize-handle-height)',
			position: 'absolute',
			right: 0,
			top: 'calc(50% - var(--ag-header-column-resize-handle-height) * .5)',
			width: 'var(--ag-header-column-resize-handle-width)',
		},
	},
}));

const ResizeHandle = (props) => {
	const { header, table } = props;

	return (
		<ResizeHandleRoot
			className={clsx(classes.root)}
			onClick={(event) => event.stopPropagation()}
			onDoubleClick={() => header.column.resetSize()}
			onMouseDown={header.getResizeHandler()}
			style={{
				/**
				 * We want a smooth column resizing experience. Because of this, we "suspend" pointer
				 * events for the table's TH tags if ANY column is being resized to avoid the "flickering"
				 * of the cursor. However, if we do that then the onDoubleClick doesn't work as expected.
				 * To enable onDoubleClick we have to have pointerEvents.
				 */
				pointerEvents: header.column.getIsResizing() ? 'auto' : '',
				transform:
					table.options.columnResizeMode === 'onEnd' && header.column.getIsResizing()
						? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
						: '',
			}}
		/>
	);
};

export default ResizeHandle;
