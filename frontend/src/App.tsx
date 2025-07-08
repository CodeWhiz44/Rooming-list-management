import Dashboard from "./pages/dashboard";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <>
            <Dashboard />
            <Toaster position="top-left" />
        </>
    );
}
export default App;
