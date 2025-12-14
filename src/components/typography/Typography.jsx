import styled from '@emotion/styled';
import clsx from 'clsx';

const PREFIX = 'eda-datatable-typography';

const classes = {
	root: `${PREFIX}-root`,
	noWrap: `${PREFIX}-noWrap`,
};

const TypographyRoot = styled('span')(() => ({
	[`&.${classes.root}`]: {
		letterSpacing: 0,
		lineHeight: '16px',
		margin: 0,

		[`&.${classes.noWrap}`]: {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
		},
	},
}));

const Typography = (props) => {
	const { align, children, className, noWrap, ...rest } = props;

	return (
		<TypographyRoot
			className={clsx(classes.root, className, {
				[classes.noWrap]: noWrap,
			})}
			{...rest}
		>
			{children}
		</TypographyRoot>
	);
};

export default Typography;
