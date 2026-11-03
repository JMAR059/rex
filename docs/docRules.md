### Checking your repository status

Before making changes, check the status of your repository:
git status

### Checking your current branch

To see which branch you're currently working on:
git branch

### Updating your repository when behind

If GitHub says your branch is X commits behind, pull the latest changes from the remote repository:
git pull origin main

If you're working on a separate branch and want to incorporate the latest changes from main:
git pull origin main

### Saving your local changes

If you have local changes you want to keep, stage and commit them before pulling updates:
git add .
git commit -m "Your commit message"

Then pull the latest updates:
git pull --rebase origin main

### Pushing your changes to GitHub

To upload your committed changes to GitHub:
git push

### Other useful Git commands

git fetch origin — Checks for remote updates without merging them.

git log --oneline — Displays recent commits.

git diff — Shows unstaged changes.

git stash — Temporarily saves uncommitted changes.

git stash pop — Restores temporarily saved changes.