#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../common.sh"

PROTECTED_FILE="$SCRIPT_DIR/protected-components.json"

if [ ! -f "$PROTECTED_FILE" ]; then
    echo -e "${YELLOW}No protected components found${NC}"
    exit 0
fi

echo -e "${BOLD}${CYAN}Protected Components${NC}"
echo ""

# List simple protected components
echo -e "${BOLD}Simple Protection:${NC}"
simple_count=$(jq -r '.protected | length' "$PROTECTED_FILE")
if [ "$simple_count" -gt 0 ]; then
    jq -r '.protected[]' "$PROTECTED_FILE" | while read -r comp; do
        echo -e "  ${GREEN}•${NC} $comp"
    done
else
    echo -e "  ${YELLOW}None${NC}"
fi

echo ""

# List custom protected components with reasons
echo -e "${BOLD}Custom Protection:${NC}"
custom_count=$(jq -r '.customProtection | length' "$PROTECTED_FILE")
if [ "$custom_count" -gt 0 ]; then
    jq -r '.customProtection | to_entries[] | "\(.key)|\(.value.protected)|\(.value.reason)"' "$PROTECTED_FILE" | while IFS='|' read -r comp protected reason; do
        if [ "$protected" == "true" ]; then
            echo -e "  ${GREEN}•${NC} ${BOLD}$comp${NC}"
            echo -e "    ${CYAN}→${NC} $reason"
        fi
    done
else
    echo -e "  ${YELLOW}None${NC}"
fi

echo ""
total=$((simple_count + custom_count))
echo -e "Total protected: ${BOLD}$total${NC}"