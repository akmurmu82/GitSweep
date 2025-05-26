# Frontend - GitHub Repo Cleanup

## Overview
This frontend allows users to authenticate via GitHub and manage their repositories, including deleting selected repositories.

👉 Rename `.env.example` to `.env` and fill in the required environment variable values before running the project.

## Setup

1. Clone the repository.
2. Navigate to the frontend folder.
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Login Flow

1. User clicks the `Login with GitHub` button.
2. Redirects to GitHub for authentication.
3. After login, GitHub redirects back to the frontend (`http://localhost:5173/dashboard`).
4. The frontend fetches the user’s repositories from the backend.

## Repo Deletion Instructions

1. The frontend displays a list of repositories with checkboxes.
2. User selects repositories they want to delete.
3. Clicking `Delete Selected` sends a DELETE request to the GitHub API.
4. If successful, the deleted repositories are removed from the UI.
5. If a repository cannot be deleted (e.g., permission issues), an error message is shown.

## Notes
- Ensure that the backend is running and accessible at `http://localhost:5000`.
- The GitHub OAuth app must be configured correctly to authorize repo deletion.

For API details, refer to the `README.md` in the backend folder.

