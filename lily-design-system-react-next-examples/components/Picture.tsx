// Picture component
//
// A headless wrapper around the native picture element: the browser chooses among the source
// children (by media query, image type or resolution) and falls back to the img child.
// Draws nothing and carries no strings of its own; the consumer supplies the source and img
// elements, including the img's alt text.

import React from "react";

export interface PictureProps {
    className?: string;

    /** The source elements, then one img with its alt, width and height. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function Picture({
    className = "",

    children,
    ...restProps
}: PictureProps) {
    return (
        <picture
            className={`picture ${className}`}

            {...restProps}
        >
            {children}
        </picture>
    );
}
