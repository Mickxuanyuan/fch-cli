export type Asset = 'string' | AssetEntry;
export interface AssetEntry {
  include?: string;
  flat?: boolean;
  exclude?: string;
  outDir?: string;
}

interface CompilerOptions {
  tsConfigPath?: string;
  webpack?: boolean;
  webpackConfigPath?: string;
  plugins?: string[];
  assets?: string[];
  deleteOutDir?: boolean;
}

export interface ProjectConfiguration {
  type?: string;
  root?: string;
  entryFile?: string;
  sourceRoot?: string;
  compilerOptions?: CompilerOptions;
}

export interface Configuration {
  collection?: string;
  type?: string;
  defaultSrcRoot?: string;
  needRouter?: Array<string>;
  needDto?: Array<string>;
  baseUrl: {service: string, dto: string};
}
