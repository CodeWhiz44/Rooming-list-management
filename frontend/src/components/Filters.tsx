import { useEffect, useState, useRef } from "react";
import { FiSearch, FiSliders, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { useDebounce } from "../hooks/useDebounce";
import { useRoomingListStore } from "../store/roomingListStore";
import { Button } from "./ui";

export default function Filters() {
    const [input, setInput] = useState("");
    const [open, setOpen] = useState(false);
    const [draftStatus, setDraftStatus] = useState<string>("");
    const [isFocused, setIsFocused] = useState(false);

    const debounced = useDebounce(input, 400);

    const { status, sort, setQuery, setStatus, setSort, fetchLists } =
        useRoomingListStore();

    useEffect(() => {
        setQuery(debounced);
        fetchLists();
    }, [debounced]);

    useEffect(() => {
        if (open) setDraftStatus(status ?? "");
    }, [open, status]);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            const pop = document.getElementById("filter-pop");
            const btn = document.getElementById("filter-btn");
            if (
                pop &&
                !pop.contains(e.target as Node) &&
                btn &&
                !btn.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        window.addEventListener("mousedown", onClickOutside);
        return () => window.removeEventListener("mousedown", onClickOutside);
    }, []);

    const handleSave = () => {
        setStatus(draftStatus);
        fetchLists();
        setOpen(false);
    };

    const toggleSort = () => {
        const next = sort === "asc" ? "desc" : "asc";
        setSort(next);
        fetchLists();
    };

    return (
        <section className="relative flex flex-wrap items-center gap-4">
            <div
                className={`relative flex items-center border  rounded-lg p-1 bg-white ${
                    isFocused ? "border-brand" : "border-gray-300"
                }`}
            >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-gray-200 text-gray-500">
                    <FiSearch size={20} />
                </span>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search"
                    className="h-10 w-68 pl-2 outline-none focus:ring-0"
                />
            </div>

            <button
                id="filter-btn"
                onClick={() => setOpen((v) => !v)}
                className={`group flex h-12 items-center gap-2 rounded-lg px-6 font-semibold border ${
                    open ? "border-brand" : "border-gray-300"
                } bg-white`}
            >
                Filters
                <FiSliders size={20} className="text-green" />
            </button>

            {open && (
                <div
                    id="filter-pop"
                    className="absolute right-0 top-14 z-20 w-64 space-y-4 rounded-xl bg-white px-6 py-4 shadow-lg"
                >
                    <h4 className="text-xs font-semibold tracking-wider text-gray-400">
                        RFP STATUS
                    </h4>

                    {[
                        ["received", "Active"],
                        ["completed", "Closed"],
                        ["archived", "Canceled"],
                    ].map(([val, label]) => (
                        <label
                            key={val}
                            className="flex cursor-pointer items-center gap-3 select-none"
                        >
                            <input
                                type="checkbox"
                                checked={draftStatus === val}
                                onChange={() =>
                                    setDraftStatus(
                                        draftStatus === val ? "" : val
                                    )
                                }
                                className="peer hidden"
                            />
                            <span
                                className="inline-block h-5 w-5 rounded-md border-2 border-gray-300
                  peer-checked:border-green peer-checked:bg-green
                  peer-checked:[box-shadow:inset_0_0_0_2px_white]"
                            />
                            <span className="font-medium">{label}</span>
                        </label>
                    ))}

                    <Button onClick={handleSave} className="w-full">
                        Save
                    </Button>
                </div>
            )}

            <button
                onClick={toggleSort}
                title="Sort by cut-off date"
                className="flex h-12 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 font-semibold hover:border-brand"
            >
                Cut-off&nbsp;
                {sort === "asc" ? (
                    <FiArrowUp className="text-green" />
                ) : (
                    <FiArrowDown className="text-green" />
                )}
            </button>
        </section>
    );
}
