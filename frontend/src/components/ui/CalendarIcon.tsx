import React from "react";

interface CalendarIconProps {
    date: string | Date;
}

export const CalendarIcon: React.FC<CalendarIconProps> = ({ date }) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const day = d.getDate();

    return (
        <div className="inline-block rounded-lg overflow-hidden w-14">
            <div className="bg-[#cee2ff] text-[#3E8CFF] font-semibold tracking-widest text-xs text-center h-4">
                {month}
            </div>
            <div className="bg-[#ecf4ff] text-[#3E8CFF] font-bold text-2xl leading-none p-0.5 text-center h-8">
                {day}
            </div>
        </div>
    );
};
