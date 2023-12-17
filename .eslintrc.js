module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "prettier",
    ],
    "ignorePatterns": [
      ".eslintrc.js",
      "node_modules/",
      "config-overrides.js",
    ],
    "overrides": [
        {
            "files": ['*.ts', '*.tsx'],
            "rules": {
                "react-hooks/rules-of-hooks": "error",
                "react-hooks/exhaustive-deps": "warn",
              'prettier/prettier': [
                'error',
                {
                  arrowParens: "avoid",
                  quoteProps: 'consistent',
                  singleQuote: true,
                  tabWidth: 2,
                  trailingComma: 'all',
                  printWidth: 200,
                  useTabs: false,
                  semi: true,
                  bracketSameLine: false,
                  bracketSpacing: true,
                },
              ],
              "perfectionist/sort-objects": [
                "error",
                {
                  "type": "alphabetical",
                  "order": "asc"
                }
              ],
              "perfectionist/sort-imports": [
                "error",
                {
                  "type": "alphabetical",
                  "order": "asc",
                  "groups": [
                    "type",
                    "react",
                    "nanostores",
                    ["builtin", "external"],
                    "internal-type",
                    "internal",
                    ["parent-type", "sibling-type", "index-type"],
                    ["parent", "sibling", "index"],
                    "side-effect",
                    "style",
                    "object",
                    "unknown"
                  ],
                  "newlines-between": "always",
                }
              ],
                'react/react-in-jsx-scope': 'off',
            }
        }
    ],
    "parserOptions": {
      "ecmaFeatures": {
        "jsx": true
      },
    },
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "perfectionist",
        "prettier",
        "react-hooks"
    ],
}
