import { Configuration } from "./configuration";
import { strings } from '@angular-devkit/core';

export const defaultConfiguration: Required<Configuration> = {
    collection: '@fch/fch-react-schematic',
    type: "web",
    defaultSrcRoot: "/src/solution/",
    needRouter: [
      "c"
    ],
    needDto: [
      "s"
    ],
    baseUrl: {
      service: "/src/solution/model/services",
      dto: "/src/solution/model/dto"
    }
  };
  export const defaultApplicationRouteConfig = {
    web: (name: string) => `,
      {
        path: \`\${MODULE_PATH}/${strings.camelize(name)}\`,
        component: ROUTERS.${strings.camelize(name)},
        lazyload: true,
        exact: true
      }`,
    h5: (name: string) => `,
      {
        path: \`\${MODULE_PATH}/${strings.camelize(name)}\`,
        component: ${strings.classify(name)},
        lazyload: true,
        exact: true
      }`,
    taro_h5: (name: string) => `, "solution/pages/${name}-page/index"`,
  }