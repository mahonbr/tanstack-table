import { IconDotsVertical } from '@tabler/icons-react';

const onClickCallback = (event) => {
	event.stopPropagation();
	alert('Menu clicked!');
};

const MenuTool = (props) => {
	const { classes, className, Icon = IconDotsVertical, onClick = onClickCallback, ...rest } = props;

	return (
		<div className={(className, classes?.headerMenuTool)} onClick={onClick} {...rest}>
			<Icon />
		</div>
	);
};

export default MenuTool;
