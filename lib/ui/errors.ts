// tslint:disable:max-line-length

export const CLI_ERRORS = {
  MISSING_TYPESCRIPT: (path: string) =>
    `没有找到该路径 "${path}"..`,
  WRONG_PLUGIN: (name: string) =>
    `The "${name}" plugin is not compatible with Nest CLI. Neither "after()" nor "before()" function have been provided.`,
};
