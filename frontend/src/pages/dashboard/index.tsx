import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoomingListStore } from "../../store/roomingListStore";
import { useAuthStore } from "../../store/authStore";
import Filters from "../../components/Filters";
import { Button } from "../../components/ui";
import { createSeedRoomingList } from "../../api/roomingList";
import type { Store } from "../../store/roomingListStore";
import toast from "react-hot-toast";
import InfiniteRoomingList from "./components/InfiniteRoomingList";

const Dashboard: React.FC = () => {
    const fetchLists = useRoomingListStore((s: Store) => s.fetchLists);
    const logout = useAuthStore((s) => s.logout);
    const user = useAuthStore((s) => s.user);
    const navigate = useNavigate();

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

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-[1368px] px-4">
                <div className="flex items-center justify-between mt-6 mb-8">
                    <h1 className="text-2xl font-bold">
                        Rooming List Management: Events
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            Logged in as: <strong>{user?.username}</strong>
                        </span>
                        <Button
                            variant="outline"
                            className="h-10"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-8 justify-between">
                    <Filters />
                    <Button
                        variant="outline"
                        className="h-10"
                        onClick={handleInsertInit}
                    >
                        Insert Initial Data
                    </Button>
                </div>
                <InfiniteRoomingList />
            </div>
        </div>
    );
};
export default Dashboard;
