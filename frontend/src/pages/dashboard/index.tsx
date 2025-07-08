import { useEffect } from "react";
import { useRoomingListStore } from "../../store/roomingListStore";
import Filters from "../../components/Filters";
import { Button } from "../../components/ui";
import { createSeedRoomingList } from "../../api/roomingList";
import type { Store } from "../../store/roomingListStore";
import { login } from "../../api/auth";
import toast from "react-hot-toast";
import InfiniteRoomingList from "./components/InfiniteRoomingList";

const Dashboard: React.FC = () => {
    const fetchLists = useRoomingListStore((s: Store) => s.fetchLists);

    useEffect(() => {
        fetchLists();
    }, []);

    const handleInsertInit = () => {
        toast.promise(
            createSeedRoomingList().then(() => fetchLists(false)),
            {
                loading: "Inserting initial data...",
                success: "Initial data inserted",
                error: "Seeding failed",
            }
        );
    };
    const handleLogin = async () => {
        try {
            const response = await login("username", "postgreSQL");
            const token = response.token;
            localStorage.setItem("token", token);
            toast.success("Logged in successfully");
        } catch (err) {
            console.error("Login Failed:", err);
            toast.error("Login failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-[1368px] px-4">
                <h1 className="text-2xl font-bold mb-8 mt-11">
                    Rooming List Management: Events
                </h1>

                <div className="flex items-center gap-2 mb-8 justify-between">
                    <Filters />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="h-10"
                            onClick={handleLogin}
                        >
                            LogIn
                        </Button>
                        <Button
                            variant="outline"
                            className="h-10"
                            onClick={handleInsertInit}
                        >
                            Insert Intitial Data
                        </Button>
                    </div>
                </div>
                <InfiniteRoomingList />
            </div>
        </div>
    );
};
export default Dashboard;
