export const formatRange = (
    checkIn: string | Date,
    checkOut: string | Date
) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const md = (d: Date) =>
        d.toLocaleString("en-US", { month: "short", day: "numeric" });
    const mdy = (d: Date) =>
        d.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    return start.getFullYear() === end.getFullYear()
        ? `${md(start)} - ${md(end)}, ${end.getFullYear()}`
        : `${mdy(start)} - ${mdy(end)}`;
};

export const get20 = (c: string) => {
    if (!c.startsWith("#")) return c;
    const hex =
        c.length === 4
            ? [...c.slice(1)].map((ch) => ch + ch).join("")
            : c.slice(1);
    return `#${hex}33`;
};
