# GitSweep - GitHub Repository Manager

GitSweep is a web application that helps users manage their GitHub repositories efficiently. It allows users to authenticate with GitHub, filter repositories by type, search by name, and delete repositories directly from the interface.

---

## Frontend

### Tech Stack

- **Framework:** React.js (with Vite)
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Authentication:** GitHub OAuth
- **Notifications:** React Toastify

### Features

- **GitHub Authentication** using OAuth
- **Repository Filtering:** Filter repositories by `Private`, `Forked`, and `Public`
- **Search Functionality:** Search repositories by name
- **Redux Integration:** State management for repositories
- **Delete Repositories:** Remove repositories with a confirmation prompt
- **User Profile Display**: Show logged-in user's profile picture and name

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/GitSweep.git
   cd GitSweep/frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add:
   ```env
   VITE_GITHUB_CLIENT_ID=your_client_id
   VITE_API_BASE_URL=http://localhost:5000
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

### Redux Setup

Redux is used to manage the state of repositories:

- **Store:** `redux/store.js`
- **Slice:** `redux/features/slices/repoSlice.js`
- **Actions:** `fetchRepos`, `deleteRepo`, `setFilterType`, `setSearchQuery`

---

## Backend

### Tech Stack

- **Framework:** Node.js with Express.js
- **Database:** MongoDB (for storing user sessions if needed)
- **Authentication:** Passport.js with GitHub OAuth
- **CORS Handling:** cors package

### Features

- **GitHub OAuth Authentication**
- **Fetch User Repositories** via GitHub API
- **Filter Repositories** based on type (private, forked, public)
- **Delete Repositories** using GitHub API

### Setup

1. Navigate to the backend directory:
   ```sh
   cd GitSweep/backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add:
   ```env
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   SESSION_SECRET=your_session_secret
   ```
4. Start the server:
   ```sh
   npm run dev
   ```

### API Routes

| Method | Endpoint               | Description                     |
| ------ | ---------------------- | ------------------------------- |
| GET    | `/auth/github`         | Initiates GitHub login          |
| GET    | `/auth/user`           | Returns authenticated user data |
| GET    | `/repos`               | Fetches user repositories       |
| DELETE | `/repos/:repoFullName` | Deletes a repository            |

---

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch`
3. Commit changes: `git commit -m "Added a new feature"`
4. Push to the branch: `git push origin feature-branch`
5. Submit a Pull Request

---

## License

This project is open-source and available under the MIT License.

---

### Upcoming Features 🚀

- Repository sorting options
- Pagination for large repositories
- Bulk delete functionality

---

For any issues or feature requests, feel free to open an issue on [GitHub](https://github.com/akmurmu82/GitSweep/issues).

