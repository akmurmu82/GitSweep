import { toast } from "react-toastify";
import { deleteRepo } from "../redux/features/slices/repoSlice";

export const deleteSelectedRepos = async (repoFullName, dispatch) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
    
    try {
        const [owner, repo] = repoFullName.split('/');

        // Make the delete request through our backend
        const response = await fetch(`${backendUrl}/repos/${owner}/${repo}`, {
            method: "DELETE",
            credentials: 'include'
        });

        if (response.ok || response.status === 204) {
            toast.success(`Repository "${repoFullName}" deleted successfully.`);
            dispatch(deleteRepo(repoFullName));
            return true;
        } else if (response.status === 401) {
            toast.error("Unauthorized! Please log in again.");
            window.location.reload();
            return false;
        } else if (response.status === 403) {
            toast.error("Action forbidden! You may not have permission to delete this repository.");
            return false;
        } else if (response.status === 404) {
            toast.error(`Repository "${repoFullName}" not found.`);
            return false;
        } else {
            const errorData = await response.json().catch(() => ({}));
            toast.error(`Failed to delete: ${repoFullName}. ${errorData.message || "Unknown error."}`);
            return false;
        }
    } catch (error) {
        console.error("Error deleting repo:", error);
        toast.error(`An error occurred while deleting the repository: ${error.message}`);
        return false;
    }
};