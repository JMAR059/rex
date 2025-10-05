import CheatSheet from "./cheat";
import HistoryBody from "./history";

const SideBar: React.FC<NavbarProps>= ({}) => {
    return(
    <>
        <div
        class="relative flex h-[calc(100vh-20rem)] w-full max-w-[20rem] flex-col rounded-xl bg-white bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/5">
        <div class="p-4 mb-2">
            <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                <HistoryBody></HistoryBody>
            </h5>
        </div>
            <CheatSheet></CheatSheet>
        </div>
    </>
    )
};

export default SideBar;