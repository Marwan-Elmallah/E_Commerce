const js = require("@eslint/js")

module.exports = [
    { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
    {
        rules: {
            "spaced-comment": "off",
            "no-console": "off",
            "consistent-return": "off",
            "func-names": "off",
            "object-shorthand": "off",
            "no-process-exit": "off",
            "no-param-reassign": "warn",
            "no-return-await": "off",
            "no-underscore-dangle": "off",
            "class-methods-use-this": "off",
            "no-undef": "error",
            "node/no-unsupported-features/es-syntax": "off",
            "prefer-destructuring": [
                "warn",
                {
                    "object": true,
                    "array": false
                }
            ],
            "no-unused-vars": [
                "warn",
                {
                    "argsIgnorePattern": "req|res|next|val"
                }
            ]
        }
    }
]