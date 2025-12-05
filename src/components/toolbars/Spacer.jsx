const Spacer = (props) => {
	const { style, ...rest } = props;
	return <div className={'spacer'} style={{ flex: 1, ...style }} {...rest} />;
};

export default Spacer;
