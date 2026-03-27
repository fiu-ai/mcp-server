## FIU MCP Server
A Model Context Protocol (MCP) server implementation for FIU AI services.

深圳市融聚汇信息科技有限公司，提供全球金融市场行情数据，同时一站式提供上市公司基本面信息、新闻舆情，帮助深入研究、跟踪各类投资标的动态，以及进行指标分析和量化策略回测。


## Openclaw使用效果
1. 让openclaw 安装 find-skills;
2. 和openclaw说: "如何给你配置新的mcp 工具,我有一些股票mcp工具?";
3. 然后将mcp服务配置告诉openclaw, 让它自动配置.
 
### 效果(演示钉钉机器人+openclaw使用mcp的情况)
![](./演示效果/openclaw/openclaw_fiu_mcp_list.jpg)
![](./演示效果/openclaw/openclaw_fiu_mcp_q1.jpg)

![](./演示效果/openclaw/openclaw_fiu_mcp_q2_1.jpg)
![](./演示效果/openclaw/openclaw_fiu_mcp_q2_2.jpg)

![](./演示效果/openclaw/openclaw_fiu_mcp_q2_3.jpg)
![](./演示效果/openclaw/openclaw_fiu_mcp_q2_4.jpg)

## cherry-studio使用效果

配置助手提示词

![](./演示效果/提示词样例.png)

### 港股效果
#### 启动港股MCP

![](./演示效果/港股-启动MCP.png)

#### 港股演示
![](./演示效果/港股-腾讯怎么样.png)

### 美股效果
#### 启动美股MCP

![](./演示效果/美股-启动MCP.png)

#### 美股演示
![](./演示效果/美股-查询苹果公司利润表.png)

## 免费获取 API Key
申请即可使用

To use the FIU MCP Server, you need to have a Variflight API key. You can get it from [here](https://mcp.szfiu.com/auth/login).

![](./pic/szfiu-mcp-jwt-index.png)

![](./pic/szfiu-mcp-signin-signup.png)

![](./pic/szfiu-mcp-jwt-list.png)

## Available Tools
### 港股市场f10 MCP

``` json
{
    "mcpServers": {
        "stockHkF10": {
            "description": "港股市场F10数据",
            "transport": "streamable_http",
            "url": "https://mcp.szfiu.com/stock_hk_f10/",
            "headers": {
                "Authorization": "Bearer {api_key}"
            }
        }
    }
}
```

查询港股市场f10数据, 包括:公司简况,财务, 基础信息,基金等类型数据.

详情请见:[工具列表](https://doc.weixin.qq.com/doc/w3_AbgA3gZ5AK0CNpjKCSFZ6TuOKiTNO?scode=AFgAVQd2AAsnhq3NL2AbgA3gZ5AK0)

### 美股市场f10 MCP
``` json
{
    "mcpServers": {
        "stockUsF10": {
            "description": "美股市场F10数据",
            "transport": "streamable_http",
            "url": "https://mcp.szfiu.com/stock_us_f10/",
            "headers": {
                "Authorization": "Bearer {api_key}"
            }
        }
    }
}
```

查询美股市场f10数据, 包括:公司简况,财务, 基础信息,基金等类型数据.

详情请见:[工具列表](https://doc.weixin.qq.com/doc/w3_AbgA3gZ5AK0CN8MwG0JhsQP6m0wFm?scode=AFgAVQd2AAs4cJBJ49AbgA3gZ5AK0)

### 港股市场SDK Mcp
``` json
{
    "mcpServers": {
        "stockHkSdk": {
            "description": "港股市场SDK数据",
            "transport": "streamable_http",
            "url": "https://mcp.szfiu.com/stock_hk_sdk/",
            "headers": {
                "Authorization": "Bearer {api_key}"
            }
        }
    }
}
```

查询港股市场数据, 包括: 基础数据, 码表, 大盘统计, 盘口数据, 资金分析,排行榜,图表K线, 行业数据,指数信息, 沪深港股通, 衍生品, 筹码分布, 衍生品等类型数据.

详情请见:[工具列表](https://doc.weixin.qq.com/doc/w3_AbgA3gZ5AK0CNSuAFX22uSE0M3H4P?scode=AFgAVQd2AAsz4Ilf6eAbgA3gZ5AK0) 

### 美股市场SDK Mcp
``` json
{
    "mcpServers": {
        "stockUsSdk": {
            "description": "美股市场SDK数据",
            "transport": "streamable_http",
            "url": "https://mcp.szfiu.com/stock_us_sdk/",
            "headers": {
                "Authorization": "Bearer {api_key}"
            }
        }
    }
}
```

查询美股市场数据, 包括: 基础数据, 码表, 大盘统计, 盘口数据, 资金分析,排行榜,图表K线, 行业数据,指数信息, 沪深港股通, 衍生品, 筹码分布, 衍生品等类型数据.

详情请见:[工具列表](https://doc.weixin.qq.com/doc/w3_AbgA3gZ5AK0CNAogSqbT4RnGImtJf?scode=AFgAVQd2AAsttfxFnjAbgA3gZ5AK0)

### FIU Toolkit Mcp
``` json
{
    "mcpServers": {
        "szfiuToolkit": {
            "description": "FIU检索证券代码服务",
            "transport": "streamable_http",
            "url": "https://mcp.szfiu.com/toolkit/"
        }
    }
}
```

里面有检索证券代码的工具.

## Usage

### 标准json配置:
#### 传输方式: streamable http
``` json
{
    "mcpServers": {
        "stockHkF10": {
            "transport": "streamable_http",
            "url": "https://mcp.szfiu.com/stock_hk_f10/",
            "headers": {
                "Authorization": "Bearer {api_key}"
            }
        },
        "stockUsF10": {
            "transport": "streamable_http",
            "url": "https://mcp.szfiu.com/stock_us_f10/",
            "headers": {
                "Authorization": "Bearer {api_key}"
            }
        },
        "stockHkSdk": {
            "transport": "streamable_http",
            "url": "https://mcp.szfiu.com/stock_hk_sdk/",
            "headers": {
                "Authorization": "Bearer {api_key}"
            }
        },
        "stockUsSdk": {
            "transport": "streamable_http",
            "url": "https://mcp.szfiu.com/stock_us_sdk/",
            "headers": {
                "Authorization": "Bearer {api_key}"
            }
        },
        "szfiuToolkit": {
            "transport": "streamable_http",
            "url": "https://mcp.szfiu.com/toolkit/"
        }
    }
}
```

#### 传输方式: sse
``` json
{
    "mcpServers": {
        "stockHkF10SSE": {
            "transport": "streamable_http",
            "url": "https://mcp.szfiu.com/sse/stock_hk_f10/",
            "headers": {
                "Authorization": "Bearer {api_key}"
            }
        },
        "stockUsF10SSE": {
            "transport": "streamable_http",
            "url": "https://mcp.szfiu.com/sse/stock_us_f10/",
            "headers": {
                "Authorization": "Bearer {api_key}"
            }
        },
        "stockHkSdkSSE": {
            "transport": "streamable_http",
            "url": "https://mcp.szfiu.com/sse/stock_hk_sdk/",
            "headers": {
                "Authorization": "Bearer {api_key}"
            }
        },
        "stockUsSdkSSE": {
            "transport": "streamable_http",
            "url": "https://mcp.szfiu.com/sse/stock_us_sdk/",
            "headers": {
                "Authorization": "Bearer {api_key}"
            }
        },
        "szfiuToolkitSSE": {
            "transport": "streamable_http",
            "url": "https://mcp.szfiu.com/sse/toolkit/"
        }
    }
}
```

### 在cherry-studio中使用
1. 手动添加

   - ![手动添加方式](./pic/cherry-studio-add-mcp.png)   

2. json导入方式.

   - [cherry-studio 通过json配置导入服务](./Cherry-Studio.md)

## 智能助手

system prompt:
``` shell
你是金融助手
- 今天是20250909
- 查询数据前, 请先使用工具确认证券代码
- 使用工具查询实时数据 分析用户问题:
```

效果:

![详细分析贵州茅台](./演示效果/A股-详细分析贵州茅台600519.SH.png)

![腾讯控股利润情况](./pic/usage_1.png)

## 注意事项
1. 填写配置, 注意url 需要 '/' 结尾;
2. api_key 需要替换成自己的;
3. 在工具中启用想要工具;
4. 工具参数需要证券代码, 证券代码可以使用fiu检索证券代码查询;
5. 大模型的时间可能是过去时间例如2023年, 建议增加一个[time服务](https://github.com/modelcontextprotocol/servers/tree/main/src/time), 让大模型model 获取当前时间, 并且将时间作为参数传递给工具;
   - ![](./pic/time-mcp-server.png)
