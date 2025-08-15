import { toast } from "react-toastify";
import { deleteRepo } from "../redux/features/slices/repoSlice";
import api from "./api";

export const deleteSelectedRepos = async (repoFullName, dispatch) => {
    
    try {
        const [owner, repo] = repoFullName.split('/');

        // Make the delete request through our backend
        const response = await api.delete(`/repos/${owner}/${repo}`);

        toast.success(`Repository "${repoFullName}" deleted successfully.`);
        dispatch(deleteRepo(repoFullName));
        return true;
    } catch (error) {
        console.error("Error deleting repo:", error);
        
        if (error.response?.status === 401) {
            toast.error("Unauthorized! Please log in again.");
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.reload();
        } else if (error.response?.status === 403) {
            toast.error("Action forbidden! You may not have permission to delete this repository.");
        } else if (error.response?.status === 404) {
            toast.error(`Repository "${repoFullName}" not found.`);
        } else {
            toast.error(`Failed to delete: ${repoFullName}. ${error.response?.data?.message || error.message}`);
        }
        return false;
    }
};