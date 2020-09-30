module.exports = {
  client: {
    service: {
      name: "my-app",
      // URL to the GraphQL API
      url: "http://localhost:4000/api",
    },
    // Files processed by the extension
    includes: ["src/**/*.vue", "src/**/*.ts", "src/**/*.graphql"],
    excludes: ["src/apollo-graphql/generated/*.ts"],
  },
};
