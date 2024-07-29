module.exports = {
  root: true,
  extends: '@react-native',
  plugins: [
    // ...
    'react-hooks',
  ],
  rules: {
    // ...
    // 检查 Hooks 的使用规则
    'react-hooks/rules-of-hooks': 'error', // 检查依赖项的声明
    'react-hooks/exhaustive-deps': 'warn',
  },
};
