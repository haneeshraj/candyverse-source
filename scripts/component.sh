#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPONENTS_SCRIPT_DIR="$SCRIPT_DIR/components"

case "$1" in
  create|c)
    bash "$COMPONENTS_SCRIPT_DIR/create-component.sh" "$2" "$3"
    ;;
  delete|d)
    bash "$COMPONENTS_SCRIPT_DIR/delete-component.sh" "$2" "$3"
    ;;
  list|ls)
    bash "$COMPONENTS_SCRIPT_DIR/list-components.sh"
    ;;
  validate|v)
    bash "$COMPONENTS_SCRIPT_DIR/validate-component-name.sh" "$2"
    ;;
  protect|p)
    bash "$COMPONENTS_SCRIPT_DIR/protect-component.sh" "$2" "add" "$3"
    ;;
  unprotect|up)
    bash "$COMPONENTS_SCRIPT_DIR/protect-component.sh" "$2" "remove"
    ;;
  protected|lsp)
    bash "$COMPONENTS_SCRIPT_DIR/list-protected.sh"
    ;;
  help|h|--help|-h|"")
    echo -e "\033[1m\033[0;36mComponent Management CLI\033[0m"
    echo -e ""
    echo -e "\033[1mUsage:\033[0m npm run comp \033[1;33m<command>\033[0m \033[0;32m[options]\033[0m"
    echo -e ""
    echo -e "\033[1mCommands:\033[0m"
    echo -e "  \033[1;33mcreate\033[0m, \033[1;33mc\033[0m \033[0;32m<name>\033[0m              Create a new component"
    echo -e "  \033[1;33mdelete\033[0m, \033[1;33md\033[0m \033[0;32m<name>\033[0m              Delete an existing component"
    echo -e "  \033[1;33mlist\033[0m, \033[1;33mls\033[0m                      List all components"
    echo -e "  \033[1;33mprotect\033[0m, \033[1;33mp\033[0m \033[0;32m<name>\033[0m \033[0;32m[reason]\033[0m    Protect a component from deletion"
    echo -e "  \033[1;33munprotect\033[0m, \033[1;33mup\033[0m \033[0;32m<name>\033[0m         Unprotect a component"
    echo -e "  \033[1;33mprotected\033[0m, \033[1;33mlsp\033[0m                List all protected components"
    echo -e "  \033[1;33mvalidate\033[0m, \033[1;33mv\033[0m \033[0;32m<name>\033[0m           Validate component name"
    echo -e "  \033[1;33mhelp\033[0m, \033[1;33mh\033[0m                       Show this help message"
    echo -e ""
    echo -e "\033[1mOptions:\033[0m"
    echo -e "  \033[0;32m--force\033[0m, \033[0;32m-f\033[0m                   Skip confirmation prompts"
    echo -e "  \033[0;32m--no-scss\033[0m                   Skip SCSS file creation"
    echo -e ""
    echo -e "\033[1mExamples:\033[0m"
    echo -e "  \033[0;36mnpm run comp create MyButton\033[0m                    # Creates with SCSS (default)"
    echo -e "  \033[0;36mnpm run comp create MyButton -- --no-scss\033[0m       # Creates without SCSS"
    echo -e "  \033[0;36mnpm run comp create MyButton -- --force\033[0m         # Force overwrite with SCSS"
    echo -e "  \033[0;36mnpm run comp delete MyButton -- --force\033[0m"
    echo -e "  \033[0;36mnpm run comp list\033[0m"
    echo -e "  \033[0;36mnpm run comp protect App \"Core application component\"\033[0m"
    echo -e "  \033[0;36mnpm run comp unprotect MyButton\033[0m"
    echo -e "  \033[0;36mnpm run comp protected\033[0m"
    echo -e "  \033[0;36mnpm run comp validate MyButton\033[0m"
    echo -e ""
    echo -e "\033[1mComponent naming rules:\033[0m"
    echo -e "  \033[0;32m•\033[0m Must start with uppercase letter"
    echo -e "  \033[0;32m•\033[0m Minimum 3 characters"
    echo -e "  \033[0;32m•\033[0m Letters only (no numbers or special characters)"
    ;;
esac