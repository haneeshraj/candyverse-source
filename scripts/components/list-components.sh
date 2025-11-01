#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../common.sh"

COMPONENTS_DIR="src/renderer/src/components"

if [ ! -d "$COMPONENTS_DIR" ]; then
    echo "Components directory not found: $COMPONENTS_DIR"
    exit 1
fi

echo -e "${BOLD}${BLUE}Available Components${NC}"
echo ""

count=0
# List all .tsx files directly in components directory
for file in "$COMPONENTS_DIR"/*.tsx; do
    if [ -f "$file" ]; then
        component_name=$(basename "$file" .tsx)
        
        # Skip index files
        if [ "$component_name" != "index" ]; then
            ((count++))
            
            # Check if it has a corresponding style file
            style_file="src/renderer/src/styles/components/$component_name.module.scss"
            if [ -f "$style_file" ]; then
                echo -e "  ${GREEN}$count.${NC} $component_name ${CYAN}(with styles)${NC}"
            else
                echo -e "  ${GREEN}$count.${NC} $component_name"
            fi
        fi
    fi
done

echo ""
echo "Total components: $count"