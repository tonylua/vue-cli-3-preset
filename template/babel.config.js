module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
    ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
    ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }]
  ]
};
