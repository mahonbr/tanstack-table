import { IconDotsVertical } from '@tabler/icons-react';
import { produce } from 'immer';

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

		table.setColumnPinning(
			produce((draft) => {
				const pinned = column.getIsPinned();

				if (pinned) {
					draft[pinned] = draft[pinned].filter((columnId) => columnId !== column.id);
				} else {
					draft.left.push(column.id);
				}
			})
		);
	};

	return (
		<div className={(className, classes?.headerMenuTool)} onClick={onClickCallback} {...rest}>
			<Icon />
		</div>
	);
};

export default MenuTool;
