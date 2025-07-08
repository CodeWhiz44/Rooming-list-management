import * as React from "react";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className = "",
    ...props
}) => {
    return (
        <div
            className={`bg-white border rounded-xl border-gray-300 ${className}`}
            {...props}
        />
    );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className = "",
    ...props
}) => {
    return <div className={`p-4  ${className}`} {...props} />;
};
