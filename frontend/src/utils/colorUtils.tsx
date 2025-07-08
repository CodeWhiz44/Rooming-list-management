const colorPalette = [
    "#FF6B6B",
    "#00C2A6",
    "#6707FD",
    "#4323FF",
    "#3E8CFF",
    "#FF5C93",
    "#FFA63D",
    "#6DD3CE",
];

export const hashColor = (key: string) => {
    const hash = [...key].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colorPalette[hash % colorPalette.length];
};
