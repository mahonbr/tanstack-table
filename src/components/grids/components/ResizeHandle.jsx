import clsx from 'clsx';
import styled from '@emotion/styled';

const PREFIX = 'eda-resizehandle';

export const classes = {
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
				transform:
					table.options.columnResizeMode === 'onEnd' && header.column.getIsResizing()
						? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
						: '',
			}}
		/>
	);
};

export default ResizeHandle;
