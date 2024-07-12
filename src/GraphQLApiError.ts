export default class GraphQLApiError extends Error {
  constructor(errors: Error[]) {
    super(errors.map((e, i) => `${i + 1}) ${e.message}`).join(' '));
  }
}
