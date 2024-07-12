module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-css-modules',
    'stylelint-config-rational-order',
    'stylelint-stylistic/config',
  ],
  rules: {
    'rule-empty-line-before': 'never-multi-line',
    'block-closing-brace-empty-line-before': 'never',
    'selector-class-pattern': null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": ["global"]
      }
    ]
  },
};
