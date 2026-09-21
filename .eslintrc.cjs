module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',   // Suppress "React must be in scope" for React 17+ JSX transform
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: 'detect' },
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    // Unused variables are errors — keep code clean.
    'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    // console.log left in production is a smell; console.error/warn are allowed.
    'no-console': ['warn', { allow: ['error', 'warn'] }],
    // PropTypes not enforced — TypeScript migration is the long-term plan.
    'react/prop-types': 'off',
    // Hooks rules — always enforced.
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.config.js', '*.config.cjs'],
};
