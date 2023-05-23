module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: 'airbnb-base',
    overrides: [
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'camelcase': 'off',
        'consistent-return': 'off',
        'import/prefer-default-export': 'off',
    },
};