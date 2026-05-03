#!/bin/bash

# Automated Atomic Git Commit Strategy for Monorepos
# Following Prompt 18 and Expert Git Workflow (Prompt 17)

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Automated Atomic Git Commit Process...${NC}"

# 1. Get list of modified files
files=$(git status --porcelain | awk '{print $2}')

if [ -z "$files" ]; then
    echo -e "${YELLOW}✨ No changes to commit.${NC}"
    exit 0
fi

# 2. Group files by top-level app/directory
declare -A groups
for file in $files; do
    # Get the app name (e.g., apps/api or apps/web)
    if [[ $file == apps/* ]]; then
        group=$(echo $file | cut -d'/' -f1-2)
    else
        group="root"
    fi
    groups[$group]+="$file "
done

# 3. Commit each group separately
for group in "${!groups[@]}"; do
    group_files=${groups[$group]}
    echo -e "${GREEN}📦 Processing group: $group${NC}"
    
    # Suggest a prefix based on the group
    if [[ $group == "apps/api" ]]; then
        prefix="feat(api):"
    elif [[ $group == "apps/web" ]]; then
        prefix="feat(web):"
    else
        prefix="chore:"
    fi

    echo -e "Files: $group_files"
    echo -e "${YELLOW}Suggested commit message: $prefix <description>${NC}"
    
    # In an automated environment, we can't wait for user input easily
    # So we'll just show the command to run
    echo -e "To commit this group, run:"
    echo -e "git add $group_files && git commit -m \"$prefix <your message>\""
    echo ""
done

echo -e "${BLUE}✅ Strategy guide completed.${NC}"
