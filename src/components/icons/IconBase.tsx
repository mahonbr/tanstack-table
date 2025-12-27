import { IconProps } from '@tabler/icons-react';

interface IconBaseProps extends IconProps {
	/**
	 * The SVG icon component to render. Should accept `IconProps`.
	 */
	icon: React.ComponentType<IconProps>;
}

const IconBase = (props: IconBaseProps) => {
	const { icon: Icon, ...rest } = props;
	return <Icon {...rest} />;
};

export { IconBase as default, IconBaseProps };
