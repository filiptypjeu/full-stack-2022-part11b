module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "react-app", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    quotes: ["error", "double"],
    semi: ["error", "always"],
    eqeqeq: "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": ["error", "always"],
    "arrow-spacing": ["error", { before: true, after: true }],
    "no-console": 0,
  },
};
