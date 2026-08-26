// Container component
// A generic block-level content container.

import React from "react";

export interface ContainerProps {
    className?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function Container({
    className = "",
    children,
    ...restProps
}: ContainerProps) {
    return (
        <div className={`container ${className}`} {...restProps}>{children}</div>
    );
}
