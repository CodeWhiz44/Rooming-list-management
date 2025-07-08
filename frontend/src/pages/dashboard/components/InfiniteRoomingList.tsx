import React, { useEffect, useRef } from "react";
import { useRoomingListStore } from "../../../store/roomingListStore";
import { DividerTitle } from "../../../components/ui/DividerTitle";
import RoomingListCard from "./RoomingListCard";
import { hashColor } from "../../../utils/colorUtils";
import "./scrollbar.css";

const InfiniteGroupedRoomingList: React.FC = () => {
    const {
        roomingListsGrouped: grouped,
        fetchMore,
        loading,
        total,
        page,
        pageSize,
    } = useRoomingListStore();

    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const hasMore = page * pageSize < total;

    useEffect(() => {
        if (!hasMore) return;
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const io = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    fetchMore();
                }
            },
            { rootMargin: "50px" }
        );
        io.observe(sentinel);
        return () => io.disconnect();
    }, [fetchMore, hasMore]);

    return (
        <>
            {loading && (!grouped || !grouped.length) && (
                <div className="py-6 flex justify-center text-sm">Loading…</div>
            )}
            {!loading && (!grouped || !grouped.length) && (
                <div className="py-6 flex justify-center text-sm">
                    No rooming lists found.
                </div>
            )}
            {grouped &&
                grouped.map((group) => {
                    const color = hashColor(`${group.eventId ?? ""}`);
                    return (
                        <div key={group.eventId} className="mb-12">
                            <div className="mb-2">
                                <DividerTitle
                                    title={group.eventName}
                                    color={color}
                                />
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-pill">
                                {group.lists.map((rl) => (
                                    <RoomingListCard
                                        key={rl.roomingListId}
                                        list={rl}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            {hasMore && (
                <div
                    ref={sentinelRef}
                    className="py-6 flex justify-center text-sm"
                >
                    {loading ? "Loading…" : "Scroll down for more"}
                </div>
            )}
        </>
    );
};

export default InfiniteGroupedRoomingList;
