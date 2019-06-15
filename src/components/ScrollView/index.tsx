import * as React from "react";
import classes from "./index.module.less";

export default class CmyScrollView extends React.Component<{
    className?: string;
    isLock?:boolean;
	[propsName: string]: any;
}> {
    static defaultProps={
        className:'',
        isLock:false
    }
	render() {
		const { className,isLock, ...props } = this.props;
		return (
			<div
				className={[classes["c-scrollview"], className].join(" ")}
				{...props}
			/>
		);
	}
}
