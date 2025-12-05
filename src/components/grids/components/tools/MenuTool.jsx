import { IconDotsVertical } from '@tabler/icons-react';

const onMenuClick = (event) => {
	event.stopPropagation();
	alert('Menu clicked!');
};

const MenuTool = (props) => {
	const { classes, className, ...rest } = props;

	return (
		<button className={(className, classes?.headerMenuTool)} onClick={onMenuClick} {...rest}>
			<IconDotsVertical size={16} />
		</button>
	);
};

export default MenuTool;
