#!/bin/bash

COMPONENT_NAME=$1

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../common.sh"

error_msg() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if name is provided
if [ -z "$COMPONENT_NAME" ]; then
    error_msg "Component name cannot be empty"
    echo -e "${YELLOW}Usage: npm run comp validate <ComponentName>${NC}"
    exit 1
fi

echo -e "${BOLD}Validating component name: ${CYAN}$COMPONENT_NAME${NC}"
echo ""

# Track if validation passes
VALID=true

# Check 1: Starts with uppercase
if [[ $COMPONENT_NAME =~ ^[A-Z] ]]; then
    success_msg "Starts with uppercase letter"
else
    error_msg "Must start with uppercase letter (A-Z)"
    VALID=false
fi

# Check 2: Minimum length
if [ ${#COMPONENT_NAME} -ge 3 ]; then
    success_msg "Has at least 3 characters (length: ${#COMPONENT_NAME})"
else
    error_msg "Must be at least 3 characters long (current: ${#COMPONENT_NAME})"
    VALID=false
fi

# Check 3: Only letters
if [[ $COMPONENT_NAME =~ ^[A-Za-z]+$ ]]; then
    success_msg "Contains only letters"
else
    error_msg "Can only contain letters (no numbers or special characters)"
    VALID=false
fi

echo ""

# Final result
if [ "$VALID" = true ]; then
    echo -e "${GREEN}${BOLD}✓ Component name is valid!${NC}"
    exit 0
else
    echo -e "${RED}${BOLD}✗ Component name is invalid${NC}"
    echo ""
    echo -e "${YELLOW}Component naming rules:${NC}"
    echo -e "  ${CYAN}•${NC} Must start with uppercase letter"
    echo -e "  ${CYAN}•${NC} Minimum 3 characters"
    echo -e "  ${CYAN}•${NC} Letters only (no numbers or special characters)"
    exit 1
fi