import {
	IconArrowDown,
	IconArrowNarrowDown,
	IconArrowNarrowUp,
	IconArrowUp,
	IconCheck,
	IconChevronDown,
	IconChevronRight,
	IconDotsVertical,
	IconProps,
	IconSelector,
} from '@tabler/icons-react';

import IconBase, { IconBaseProps } from './IconBase';

const ArrowDownIcon = (props: IconProps) => <IconBase icon={IconArrowDown} {...props} />;
const ArrowNarrowDownIcon = (props: IconProps) => <IconBase icon={IconArrowNarrowDown} {...props} />;
const ArrowNarrowUpIcon = (props: IconProps) => <IconBase icon={IconArrowNarrowUp} {...props} />;
const ArrowUpIcon = (props: IconProps) => <IconBase icon={IconArrowUp} {...props} />;
const CheckIcon = (props: IconProps) => <IconBase icon={IconCheck} {...props} />;
const ChevronDownIcon = (props: IconProps) => <IconBase icon={IconChevronDown} {...props} />;
const ChevronRightIcon = (props: IconProps) => <IconBase icon={IconChevronRight} {...props} />;
const DotsVerticalIcon = (props: IconProps) => <IconBase icon={IconDotsVertical} {...props} />;
const SelectorIcon = (props: IconProps) => <IconBase icon={IconSelector} {...props} />;

export {
	IconBase as default,
	type IconBaseProps,
	ArrowDownIcon,
	ArrowNarrowDownIcon,
	ArrowNarrowUpIcon,
	ArrowUpIcon,
	CheckIcon,
	ChevronDownIcon,
	ChevronRightIcon,
	DotsVerticalIcon,
	SelectorIcon,
};
