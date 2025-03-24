const deleteSelectedRepos = () => {
    const selectedRepos = [...document.querySelectorAll("input[type=checkbox]:checked")]
        .map((checkbox) => checkbox.value);

    if (selectedRepos.length === 0) {
        alert("Select at least one repo to delete!");
        return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedRepos.length} repos?`)) {
        return;
    }

    selectedRepos.forEach((repoFullName) => {
        fetch(`https://api.github.com/repos/${repoFullName}`, {
            method: "DELETE",
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: "application/vnd.github+json",
            },
        })
            .then((res) => {
                if (res.ok) {
                    alert(`Deleted: ${repoFullName}`);
                    setRepos(repos.filter((repo) => repo.full_name !== repoFullName));
                } else {
                    alert(`Failed to delete: ${repoFullName}`);
                }
            })
            .catch((err) => console.error("Error deleting repo", err));
    });
};
