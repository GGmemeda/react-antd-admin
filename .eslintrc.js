// https://cn.eslint.org/docs/rules/
module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },
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
    "linebreak-style":[0,"windows"]
  },
}
