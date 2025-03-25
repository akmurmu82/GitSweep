import { toast } from "react-toastify";
import { deleteRepo } from "../redux/features/slices/repoSlice";

export const deleteSelectedRepos = async (repoFullName, dispatch) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        toast.error("Authentication failed. Please log in again.");
        return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete "${repoFullName}"?`);
    if (!confirmDelete) return;

    try {
        const res = await fetch(`https://api.github.com/repos/${repoFullName}`, {
            method: "DELETE",
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: "application/vnd.github+json",
            },
        });

        if (res.ok) {
            toast.success(`Repository "${repoFullName}" deleted successfully.`);
            dispatch(deleteRepo(repoFullName)); // 🔥 Updates Redux store
        } else if (res.status === 401) {
            toast.error("Unauthorized! Please log in again.");
            localStorage.removeItem("accessToken");
            window.location.reload();
        } else if (res.status === 403) {
            toast.error("Action forbidden! You may not have permission to delete this repository.");
        } else if (res.status === 404) {
            toast.error(`Repository "${repoFullName}" not found.`);
        } else {
            const errorData = await res.json();
            toast.error(`Failed to delete: ${repoFullName}. ${errorData.message || "Unknown error."}`);
        }
    } catch (err) {
        console.error("Error deleting repo:", err);
        toast.error("An error occurred while deleting the repository.");
    }
};
