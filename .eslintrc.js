module.exports = {
    // "env": [
    //   'plugin:vue/recommended',
    //   'plugin:vue/essential',
    //   'eslint:recommended',
    //   'plugin:prettier/recommended'
    // ],

    "extends": [
        "eslint:recommended",
        // "plugin:vue/essential",
        "plugin:vue/recommended"
    ],

    // "parserOptions": {
    //     "ecmaVersion": 2018, //fix ...MapGetters ... unexcepted token
    //     "sourceType": "module",
    //     "allowImportExportEverywhere": true,
    //     "ecmaFeatures": {
    //         "modules": true
    //     }
    //
    // },

    "plugins": [
        "vue"
    ],

    // "rules": {
    //   "vue/no-use-v-if-with-v-for": ["error", {
    //     "allowUsingIterationVar": true
    //   }]
    //
    // },

    root: true,

    env: {
      browser: true,
      node: true
    },

    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      allowImportExportEverywhere: true,
      ecmaFeatures: {
        modules: true
      },
      parser: '@babel/eslint-parser'
    },

    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    },

    overrides: [
      {
        files: [
          '**/__tests__/*.{j,t}s?(x)',
          '**/tests/unit/**/*.spec.{j,t}s?(x)'
        ],
        env: {
          jest: true
        }
      },
      {
        files: [
          '**/__tests__/*.{j,t}s?(x)',
          '**/tests/unit/**/*.spec.{j,t}s?(x)'
        ],
        env: {
          jest: true
        }
      }
    ]
}
