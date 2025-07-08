import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");

export function loadSeedData() {
    return {
        roomingLists: JSON.parse(
            fs.readFileSync(path.join(DATA_DIR, "rooming-lists.json"), "utf8")
        ),
        bookings: JSON.parse(
            fs.readFileSync(path.join(DATA_DIR, "bookings.json"), "utf8")
        ),
        links: JSON.parse(
            fs.readFileSync(
                path.join(DATA_DIR, "rooming-list-bookings.json"),
                "utf8"
            )
        ),
    };
}
