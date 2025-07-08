import React from "react";
import type { IRoomingList } from "../../../types";
import pdfIcon from "../../../assets/svg/pdf_icon.svg";
import calendarIcon from "../../../assets/svg/calendar_icon.svg";
import {
    Button,
    Card,
    CardContent,
    CalendarIcon,
} from "../../../components/ui";
import { formatRange } from "../../../utils/format";

function getEarliestCheckIn(bookings: { booking: { checkInDate: string } }[]) {
    if (!bookings.length) return "";
    return bookings.reduce((earliest, curr) =>
        new Date(curr.booking.checkInDate) <
        new Date(earliest.booking.checkInDate)
            ? curr
            : earliest
    ).booking.checkInDate;
}
function getLatestCheckOut(bookings: { booking: { checkOutDate: string } }[]) {
    if (!bookings.length) return "";
    return bookings.reduce((latest, curr) =>
        new Date(curr.booking.checkOutDate) >
        new Date(latest.booking.checkOutDate)
            ? curr
            : latest
    ).booking.checkOutDate;
}

interface Props {
    list: IRoomingList;
}

const RoomingListCard: React.FC<Props> = ({ list }) => {
    const checkIn = getEarliestCheckIn(list.roomingListLinks);
    const checkOut = getLatestCheckOut(list.roomingListLinks);
    const onViewBookings = () => {
        console.log(list.roomingListLinks);
    };

    return (
        <Card
            className="flex-none w-100 flex flex-col justify-between ring-1 ring-gray-200"
            data-status={list.status.toLowerCase()}
        >
            <CardContent>
                <div className="justify-between items-start">
                    <div className="flex items-center">
                        <div className="flex flex-1 flex-col">
                            <h3 className="font-semibold">{list.rfpName}</h3>
                            <p className="mt-1 text-xs text-gray-600">
                                Agreement:{" "}
                                <span className="font-bold">
                                    {list.agreement_type}
                                </span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-gray-500">
                            <CalendarIcon date={list.cutOffDate} />
                            <span className="text-xs">Cut-Off-Date</span>
                        </div>
                    </div>
                    <div className="flex gap-1 items-center mt-3 ">
                        <img src={calendarIcon} alt="calendar_icon" />
                        <p className="text-sm text-gray-500">
                            {checkIn && checkOut
                                ? formatRange(checkIn, checkOut)
                                : "—"}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    <Button
                        className="flex-1 py-1 text-sm"
                        onClick={onViewBookings}
                    >
                        View Bookings ({list.roomingListLinks.length})
                    </Button>

                    <Button
                        variant="outline"
                        className="py-1 text-sm relative group flex items-center justify-center"
                        title="Show Agreement as PDF"
                    >
                        <img src={pdfIcon} alt="PDF Icon" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default React.memo(RoomingListCard);
