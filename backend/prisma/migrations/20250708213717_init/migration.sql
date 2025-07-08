-- CreateTable
CREATE TABLE "Booking" (
    "bookingId" INTEGER NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestPhoneNumber" TEXT NOT NULL,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "checkOutDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("bookingId")
);

-- CreateTable
CREATE TABLE "RoomingList" (
    "roomingListId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "eventName" TEXT NOT NULL,
    "rfpName" TEXT NOT NULL,
    "cutOffDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "agreement_type" TEXT NOT NULL,

    CONSTRAINT "RoomingList_pkey" PRIMARY KEY ("roomingListId")
);

-- CreateTable
CREATE TABLE "RoomingListBooking" (
    "id" SERIAL NOT NULL,
    "roomingListId" INTEGER NOT NULL,
    "bookingId" INTEGER NOT NULL,

    CONSTRAINT "RoomingListBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomingListBooking_roomingListId_bookingId_key" ON "RoomingListBooking"("roomingListId", "bookingId");

-- AddForeignKey
ALTER TABLE "RoomingListBooking" ADD CONSTRAINT "RoomingListBooking_roomingListId_fkey" FOREIGN KEY ("roomingListId") REFERENCES "RoomingList"("roomingListId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomingListBooking" ADD CONSTRAINT "RoomingListBooking_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("bookingId") ON DELETE RESTRICT ON UPDATE CASCADE;
