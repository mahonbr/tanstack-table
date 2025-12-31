import { HTMLAttributes } from 'react';

import clsx from 'clsx';
import styled from '@emotion/styled';

import { ThemeProps } from '@/components/themes/ThemeProvider';

const PREFIX = 'eda-datatable-typography';

type TypographyProps = {
	/**
	 * Sets the text-align on the component.
	 */
	align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';

	/**
	 * If true, the text will not wrap, but instead will truncate with a text overflow
	 * ellipsis.
	 */
	noWrap?: boolean;

	/**
	 * The theme object passed down from the component tree via ThemeProvider.
	 */
	theme?: ThemeProps;
} & HTMLAttributes<HTMLSpanElement>;

const classes = {
	root: `${PREFIX}-root`,
	noWrap: `${PREFIX}-noWrap`,
};

const TypographyRoot = styled('span', {
	shouldForwardProp: (prop) => !/(action|theme)/.test(prop),
})<TypographyProps>(({ align = 'left', theme }) => ({
	[`&.${classes.root}`]: {
		letterSpacing: 0,
		lineHeight: theme.spacing(2),
		margin: 0,
		textAlign: align,

		[`&.${classes.noWrap}`]: {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
		},
	},
}));

const Typography = (props: TypographyProps) => {
	const { className, noWrap, ...rest } = props;

	return (
		<TypographyRoot
			{...rest}
			className={clsx(classes.root, className, {
				[classes.noWrap]: noWrap,
			})}
		/>
	);
};

export default Typography;
