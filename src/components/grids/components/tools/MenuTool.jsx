import { IconDotsVertical } from '@tabler/icons-react';

// const onClickCallback = (event) => {
// 	event.stopPropagation();
// 	alert('Menu clicked!');
// };

const MenuTool = (props) => {
	const { classes, className, header, Icon = IconDotsVertical, onClick: onClickProp, ...rest } = props;
	const { table, column } = header.getContext();

	const onClickCallback = (event) => {
		event.stopPropagation();

		onClickProp?.(event);
		column.pin(column.getIsPinned() ? false : 'left');
	};

	return (
		<div className={(className, classes?.headerMenuTool)} onClick={onClickCallback} {...rest}>
			<Icon />
		</div>
	);
};

export default MenuTool;
