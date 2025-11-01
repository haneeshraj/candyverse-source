#!/bin/bash

set -e

COMPONENT_NAME=$1
FORCE_FLAG=$2

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../common.sh"
PROTECTED_FILE="$SCRIPT_DIR/protected-components.json"

# Check if component is protected
is_protected() {
    local comp_name=$1
    
    if [ ! -f "$PROTECTED_FILE" ]; then
        return 1
    fi
    
    if jq -e ".protected | index(\"$comp_name\")" "$PROTECTED_FILE" > /dev/null 2>&1; then
        return 0
    fi
    
    if jq -e ".customProtection[\"$comp_name\"].protected == true" "$PROTECTED_FILE" > /dev/null 2>&1; then
        return 0
    fi
    
    return 1
}

# Get protection reason
get_protection_reason() {
    local comp_name=$1
    
    if [ ! -f "$PROTECTED_FILE" ]; then
        echo ""
        return
    fi
    
    reason=$(jq -r ".customProtection[\"$comp_name\"].reason // empty" "$PROTECTED_FILE" 2>/dev/null)
    echo "$reason"
}

# Check component usage in the codebase
check_component_usage() {
    local comp_name=$1
    local project_root="$(cd "$SCRIPT_DIR/../.." && pwd)"
    local component_own_file="$project_root/src/renderer/src/components/$comp_name.tsx"
    
    echo -e "${CYAN}Checking for usage of $comp_name...${NC}"
    echo ""
    
    # Search patterns - UPDATED to include renamed imports
    local import_pattern1="import.*$comp_name.*from"
    local import_pattern2="import.*{.*$comp_name.*}.*from"
    local import_pattern3="import.*{.*$comp_name\s+as"
    local component_usage="<$comp_name"
    
    # Files to search in
    local search_dirs=(
        "src/renderer/src/components"
        "src/renderer/src/pages"
        "src/renderer/src/App.tsx"
        "src/renderer/src/router"
        "src/renderer/src/layouts"
    )
    
    local found_usage=false
    local usage_files=()
    
    # Search for imports and usage
    for dir in "${search_dirs[@]}"; do
        local full_path="$project_root/$dir"
        if [ -e "$full_path" ]; then
            while IFS= read -r file; do
                if [ -f "$file" ]; then
                    # Skip the component's own file
                    if [ "$file" = "$component_own_file" ]; then
                        continue
                    fi
                    
                    if grep -l -E "$import_pattern1|$import_pattern2|$import_pattern3|$component_usage" "$file" 2>/dev/null; then
                        found_usage=true
                        # Get relative path from project root
                        local rel_path="${file#$project_root/}"
                        usage_files+=("$rel_path")
                    fi
                fi
            done < <(find "$full_path" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) 2>/dev/null)
        fi
    done
    
    if [ "$found_usage" = true ]; then
        echo -e "${YELLOW}${BOLD}⚠ Warning: $comp_name is being used in the following files:${NC}"
        echo ""
        for file in "${usage_files[@]}"; do
            echo -e "  ${RED}•${NC} $file"
            
            # Show the actual lines where it's used
            local full_file_path="$project_root/$file"
            grep -n -E "$import_pattern1|$import_pattern2|$import_pattern3|$component_usage" "$full_file_path" 2>/dev/null | head -3 | while IFS=: read -r line_num line_content; do
                echo -e "    ${CYAN}Line $line_num:${NC} ${line_content}"
            done
            echo ""
        done
        
        return 1  # Return failure to indicate usage found
    else
        echo -e "${GREEN}✓ No usage found${NC}"
        echo ""
        return 0  # Return success
    fi
}

# Validation
[ -z "$COMPONENT_NAME" ] && error_exit "Component name cannot be empty.\nUsage: ./delete-component.sh ComponentName [--force]"

# Check if protected
if is_protected "$COMPONENT_NAME"; then
    reason=$(get_protection_reason "$COMPONENT_NAME")
    echo -e "${RED}✗ Cannot delete $COMPONENT_NAME - Component is protected${NC}"
    if [ -n "$reason" ]; then
        echo -e "${YELLOW}Reason: $reason${NC}"
    fi
    echo -e "\nTo unprotect, run: ${CYAN}npm run comp unprotect $COMPONENT_NAME${NC}"
    exit 1
fi

# UPDATED paths
COMPONENT_FILE="src/renderer/src/components/$COMPONENT_NAME.tsx"
STYLE_FILE="src/renderer/src/styles/components/$COMPONENT_NAME.module.scss"
INDEX_FILE="src/renderer/src/components/index.ts"

# Check if component exists
if [ ! -f "$COMPONENT_FILE" ] && [ ! -f "$STYLE_FILE" ]; then
    error_exit "Component $COMPONENT_NAME does not exist."
fi

# Check for component usage
if ! check_component_usage "$COMPONENT_NAME"; then
    if [ "$FORCE_FLAG" != "--force" ] && [ "$FORCE_FLAG" != "-f" ]; then
        echo -e "${YELLOW}${BOLD}Deleting this component may break your application!${NC}"
        echo -e "${YELLOW}Use --force to delete anyway, or remove the usage first.${NC}"
        echo ""
        echo -e "Continue with deletion? (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            echo "Deletion cancelled."
            exit 0
        fi
    else
        warn_msg "Component is in use, but deleting due to --force flag"
    fi
fi

# Confirmation prompt unless --force is used
if [ "$FORCE_FLAG" != "--force" ] && [ "$FORCE_FLAG" != "-f" ]; then
    echo -e "${YELLOW}Are you sure you want to delete component $COMPONENT_NAME? (y/N)${NC}"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Deletion cancelled."
        exit 0
    fi
fi

# Delete component file
if [ -f "$COMPONENT_FILE" ]; then
    rm -f "$COMPONENT_FILE"
    success_msg "Deleted component file: $COMPONENT_FILE"
else
    warn_msg "Component file not found: $COMPONENT_FILE"
fi

# Delete style file
if [ -f "$STYLE_FILE" ]; then
    rm "$STYLE_FILE"
    success_msg "Deleted style file: $STYLE_FILE"
else
    warn_msg "Style file not found: $STYLE_FILE"
fi

# Update index file
if [ -f "$INDEX_FILE" ]; then
    sed -i.bak "/export.*$COMPONENT_NAME.*from.*['\"]\\.\/$COMPONENT_NAME['\"]/d" "$INDEX_FILE"
    rm "$INDEX_FILE.bak"
    success_msg "Updated index file: $INDEX_FILE"
else
    warn_msg "Index file not found: $INDEX_FILE"
fi

success_msg "Component $COMPONENT_NAME deleted successfully!"