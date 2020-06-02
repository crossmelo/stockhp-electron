/*
 * @Descripttion: 
 * @version: 
 * @Author: lizhengang9
 * @Date: 2020-06-02 15:34:31
 * @LastEditors: lizhengang9
 * @LastEditTime: 2020-06-02 16:02:43
 */ 
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'semi': 0,
    'comma-dangle': 0,
    'no-trailing-spaces': 0,
    'quotes': 0
  }
}
