# Backend - GitHub Repo Cleanup

## Overview
This backend handles authentication with GitHub using Passport.js and allows users to fetch and delete their repositories.

## Setup

1. Clone the repository.
2. Navigate to the backend folder.
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file and add the following environment variables:
   ```env
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```
5. Start the server:
   ```sh
   npm start
   ```

## API Routes

### 1. GitHub Authentication

#### `GET /auth/github`
- Redirects the user to GitHub for authentication.

#### `GET /auth/github/callback`
- Callback URL for GitHub OAuth.
- On success, redirects to the frontend.

### 2. Fetch User Repositories

#### `GET /repos`
- **Description**: Fetches the authenticated user's repositories.
- **Request Headers**:
  ```json
  {
    "Authorization": "token <access_token>"
  }
  ```
- **Response**:
  ```json
  [
    {
      "id": 123456,
      "name": "repo-name",
      "full_name": "username/repo-name"
    }
  ]
  ```

### 3. Delete a Repository

#### `DELETE https://api.github.com/repos/:owner/:repo`
- **Description**: Deletes the specified repository.
- **Request Headers**:
  ```json
  {
    "Authorization": "token <access_token>"
  }
  ```
- **Response**:
  - `204 No Content` on success.
  - `403 Forbidden` if the user lacks permissions.

## Notes
- Ensure the GitHub OAuth app is correctly configured with the appropriate permissions (`repo` scope).
- Only repositories owned by the authenticated user can be deleted.
