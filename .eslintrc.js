// https://cn.eslint.org/docs/rules/
module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "plugins": [
    "react-hooks"
  ],
  'extends': [
    'plugin:react/recommended',
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true,
      "modules": true
    }
  },
  "rules": {
    "indent": 0,
    "semi": [0, "always"],
    "react/prop-types": ["ignore"],
    "react/display-name": ["ignore"],
    "linebreak-style": [0, "windows"],
    "react-hooks/rules-of-hooks": "error", // 检查 Hook 的规则
    "react-hooks/exhaustive-deps": "warn" // 检查 effect 的依赖
  },
}
