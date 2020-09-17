# fch-cli

## 起步

### 安装

```bash
npm i -g @fch/fch-cli
```
### 创建新项目

```bash
fch new|n [options] [name]
```
fch.json 务必保证当前的project是有的
```json
{
    "collection": "@fch/fch-react-schematic", -- 生成过程用的子schematics
    "type": "web", -- 当前的项目类型 web 和 h5 暂时支持
    "defaultSrcRoot": "/src/solution/", -- 最好不要更改当前的作用路径
    "needRouter": [ -- 哪些生成命令需要额外添加路由注入
        "c"
    ],
    "needDto": [  -- 哪些生成命令需要同时生成dto文件
        "s"
    ],
    "baseUrl": {  -- 设置service、dto文件夹所在路径
      "service": "/src/solution/model/services",
      "dto": "/src/solution/model/dto"
    }
}
```

options 可选参数

- `-d` 只能看到生成的目录结构和文件，不会真的生成文件
- `-s` 跳过安装node_modules

eg.
```bash
fch new my-project 可选h5 和 web
# OR
fch n my-project
```

## 使用

### 快速生成文件至当前目录

```bash
fch generate|g <schematic> [name]
```
schematic 可选参数
- `c`: 生成hooks组件
  ```bash
  fch g c <your-component-name>
  ```
- `rc`: 生成带有reducer的组件
  ```bash
  fch g rc <your-component-name>
  ```
- `s`: 生成请求的service文件
  ```bash
  fch g s <your-service-name>
  ```
- `d`: 生成相应dto文件
  ```bash
  fch g d <your-dto-name>
  ```
- `m`: 生成相应module模板文件
  ```bash
  fch g m <your-module-name>
  ```
- `table`: 生成相应component table模板文件
  ```bash
  fch g table <your-table-name>
  ```
- `modal`: 生成相应modal模板文件
  ```bash
  fch g modal <your-modal-name>
  ```


