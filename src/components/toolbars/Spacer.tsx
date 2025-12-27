type SpacerProps = {
	/**
	 * Direction for flex items (e.g., 'horizontal', 'vertical'). Defaults to 'horizontal'.
	 */
	orientation?: 'horizontal' | 'vertical';
} & React.HTMLAttributes<HTMLDivElement>;

const Spacer = (props: SpacerProps) => {
	const { orientation = 'horizontal', style, ...rest } = props;
	const flexDirection = orientation === 'horizontal' ? 'row' : 'column';

	return <div className={'spacer'} style={{ display: 'flex', flex: 1, flexDirection, ...style }} {...rest} />;
};

export default Spacer;
