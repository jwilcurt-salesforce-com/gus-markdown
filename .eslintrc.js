module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "warnFileIgnored": true,
    "rules": {
        "brace-style":                 ["error", "1tbs", { "allowSingleLine": true }],
        "comma-dangle":                ["error", "never"],
        "comma-spacing":               ["error", { "before": false, "after": true }],
        "comma-style":                 ["error", "last"],
        "indent":                      ["error", 4],
        "keyword-spacing":             ["error", { "before": true, "after": true }],
        "no-multi-spaces":             ["error"],
        "no-ternary":                  ["error"],
        "no-unused-vars":              ["error", { "args": "none" }],
        "one-var":                     ["error", "never"],
        "quotes":                      ["error", "single"],
        "semi":                        ["error", "always"],
        "space-before-function-paren": ["error", "always"],
        "space-in-parens":             ["error", "never"],
        "space-infix-ops":             ["error"]
    },
    "parserOptions": {
        "ecmaversion": 7,
        "sourceType": "module"
    }
};
