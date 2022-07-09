module.exports = {
    "env": {
        "browser": true,
        // "es2021": true,
        // "es2020": true
        node: true,
        // "es6": true
    },
    "extends": [
        // "eslint:recommended",
        // "plugin:vue/essential",
        "plugin:vue/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 2018, //fix ...MapGetters ... unexcepted token
        "sourceType": "module",
        "allowImportExportEverywhere": true,
        "ecmaFeatures": {
            "modules": true
        }

    },
    "plugins": [
        "vue"
    ],
    "rules": {
    }
}
