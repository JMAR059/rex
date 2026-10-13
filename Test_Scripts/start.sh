projectRoot="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Start Docker compose in background
docker compose --project-directory "$projectRoot" -p rex_fork up &
composeProcess=$!

# Wait for services to be ready
sleep 3

# Open browser tabs
frontend_url="http://localhost:5173"
backend_url="http://localhost:8000"

# Open browser (using Windows host if on WSL, or xdg-open on Linux)
if grep -qi microsoft /proc/version 2>/dev/null; then
    cmd.exe /c start "$frontend_url" > /dev/null 2>&1
else
    xdg-open "$frontend_url" > /dev/null 2>&1 &
fi

# Only needed for ensuring the backend is working, but isnt nessecary
#xdg-open "$backend_url" > /dev/null 2>&1 &

# Wait for user input
echo ""
echo -e "\033[36mPress ENTER to stop Docker Compose and clean up...\033[0m"
read -r

# Stop Docker compose
echo -e "\033[33mStopping Docker Compose...\033[0m"
docker compose --project-directory "$projectRoot" -p rex_fork down
echo -e "\e[32mDone.\e[0m"