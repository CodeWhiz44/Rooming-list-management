import React from "react";
import { get20 } from "../../utils/format";

interface DividerTitleProps {
    title: string;
    color?: string;
}

export const DividerTitle: React.FC<DividerTitleProps> = ({
    title,
    color = "#14b8a6",
}) => (
    <div className="flex items-center w-full">
        <span
            className="flex-1 h-[1px]"
            style={{
                background: `linear-gradient(to left, ${color}, transparent)`,
            }}
        />
        <span
            className="px-2 py-1.5 rounded-sm border text-sm font-bold whitespace-nowrap select-none"
            style={{ color, borderColor: color, backgroundColor: get20(color) }}
        >
            {title}
        </span>
        <span
            className="flex-1 h-[1px]"
            style={{
                background: `linear-gradient(to right, ${color}, transparent)`,
            }}
        />
    </div>
);
