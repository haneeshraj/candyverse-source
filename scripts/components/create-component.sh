#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../common.sh"

# This script creates a new React component with the necessary files and boilerplate code.
# Usage: ./create-component.sh ComponentName [--force] [--no-scss]

set -e  # Exit on any error

COMPONENT_NAME=$1
CREATE_SCSS=true

# Parse flags
shift  # Remove first argument (component name)
while [[ $# -gt 0 ]]; do
    case $1 in
        --force|-f)
            FORCE_FLAG="--force"
            shift
            ;;
        --no-scss|--no-styles)
            CREATE_SCSS=false
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Validation checks
[ -z "$COMPONENT_NAME" ] && error_exit "Component name cannot be empty.\nUsage: ./create-component.sh ComponentName [--force] [--no-scss]"

[[ ! $COMPONENT_NAME =~ ^[A-Z] ]] && error_exit "Component name must start with an uppercase letter."

[ ${#COMPONENT_NAME} -lt 3 ] && error_exit "Component name must be at least 3 characters long."

[[ ! $COMPONENT_NAME =~ ^[A-Za-z]+$ ]] && error_exit "Component name can only contain letters (no numbers or special characters)."

# Define paths
COMPONENT_FILE="src/renderer/src/components/$COMPONENT_NAME.tsx"
STYLE_FILE="src/renderer/src/styles/components/$COMPONENT_NAME.module.scss"
INDEX_FILE="src/renderer/src/components/index.ts"

# Check if component already exists
if [ -f "$COMPONENT_FILE" ]; then
    if [ "$FORCE_FLAG" == "--force" ]; then
        warn_msg "Component $COMPONENT_NAME already exists. Overwriting due to --force flag..."
        rm -f "$COMPONENT_FILE"
        [ -f "$STYLE_FILE" ] && rm "$STYLE_FILE"
    else
        error_exit "Component $COMPONENT_NAME already exists at $COMPONENT_FILE\nUse --force flag to overwrite."
    fi
fi

# Ask about SCSS file creation (only if not specified via flag)
if [ "$CREATE_SCSS" = true ] && [ "$FORCE_FLAG" != "--force" ]; then
    echo -e "${CYAN}${BOLD}Create SCSS file for $COMPONENT_NAME?${NC}"
    echo -e "${CYAN}(Y/n):${NC} "
    read -r response
    
    if [[ "$response" =~ ^[Nn]$ ]]; then
        CREATE_SCSS=false
        info_msg "Skipping SCSS file creation"
    fi
fi

# Create directories
mkdir -p "$(dirname "$COMPONENT_FILE")"

# Create the component file with or without styles import
if [ "$CREATE_SCSS" = true ]; then
    cat > "$COMPONENT_FILE" << 'EOF'
import React from 'react';
import styles from '@renderer/styles/components/COMPONENT_NAME.module.scss';

interface COMPONENT_NAMEProps {
  // Define your component props here
  testProp?: string;
}

const COMPONENT_NAME: React.FC<COMPONENT_NAMEProps> = ({ testProp }) => {
  return (
    <div className={styles.container}>
      {/* Your component implementation */}
    </div>
  );
};

export default COMPONENT_NAME;
EOF
else
    cat > "$COMPONENT_FILE" << 'EOF'
import React from 'react';

interface COMPONENT_NAMEProps {
  // Define your component props here
  testProp?: string;
}

const COMPONENT_NAME: React.FC<COMPONENT_NAMEProps> = ({ testProp }) => {
  return (
    <div>
      {/* Your component implementation */}
    </div>
  );
};

export default COMPONENT_NAME;
EOF
fi

# Replace placeholders
sed -i.bak "s/COMPONENT_NAME/$COMPONENT_NAME/g" "$COMPONENT_FILE"
rm "$COMPONENT_FILE.bak"

success_msg "Created component file: $COMPONENT_FILE"

# Create the styles file if requested
if [ "$CREATE_SCSS" = true ]; then
    mkdir -p "$(dirname "$STYLE_FILE")"
    
    cat > "$STYLE_FILE" << 'EOF'
.container {
  /* Add your styles here */
}
EOF
    
    success_msg "Created style file: $STYLE_FILE"
fi

# Create/update the index file without overwriting existing exports
mkdir -p "$(dirname "$INDEX_FILE")"
touch "$INDEX_FILE"

# Check if export already exists (case-insensitive to catch duplicates)
if grep -qi "export.*$COMPONENT_NAME.*from.*['\"]\\.\/$COMPONENT_NAME['\"]" "$INDEX_FILE"; then
    warn_msg "Export for $COMPONENT_NAME already exists in index file. Skipping..."
else
    echo "export { default as $COMPONENT_NAME } from './$COMPONENT_NAME';" >> "$INDEX_FILE"
    success_msg "Added export to index file"
fi

echo ""
echo -e "${GREEN}${BOLD}✓ Component $COMPONENT_NAME created successfully!${NC}"
echo ""
echo -e "${BOLD}Files created:${NC}"
echo "  - $COMPONENT_FILE"
if [ "$CREATE_SCSS" = true ]; then
    echo "  - $STYLE_FILE"
fi
echo ""
echo -e "${BOLD}Import with:${NC} ${CYAN}import { $COMPONENT_NAME } from '@renderer/components';${NC}"