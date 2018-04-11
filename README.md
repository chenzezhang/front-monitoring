前端监控平台

### 上线步骤 ===》 修改配置
1、修改config/default.js 中 redis 连接方式， 使用 ‘哨兵‘启动。

如图一：

```
    redis: {
        port: 6379,             // Redis port
        host: '127.0.0.1',   // Redis host
        family: 4,               // 4 (IPv4) or 6 (IPv6)
        password: ''           // password 
    }
    
```

修改为：
如图二：

```
redis: {
        sentinels: [
            {
                port: 26379,             // Redis port
                host: '',   // Redis host
                family: 4               // 4 (IPv4) or 6 (IPv6)
            }
        ],
        password: 't1',           // password
        name:'mymaster'
    }
```
2、修改confit/default.js host代码
例如：
如图一：
```
// host: 'samzhang.com.cn',
```
修改为：
如图二：
```
    host: '线上域名',
```
3、修改config/mysql.js 中 mysql 连接 账号、密码、服务地址.（注意必须创建数据库，使用utf_8 bin）格式。
```
    const development = {
        host        : 'localhost',
        user        : '',
        password    : '',
        database    : 'db_monitoring'
    };

```
4、修改index.js中，请求代理服务地址。

如图一：
```
var packJSON = {
        'jfVersion': '1.0.0',
        'openTime': t,
        'httpUrlBasic': '/plugin/api/setBasic',
        'httpUrl': '/plugin/api/setHtmlError',
        'departmentId': 8
    };

```
修改为：
如图二：
```
var packJSON = {
        'jfVersion': '1.0.0',
        'openTime': t,
        'httpUrlBasic': 'http://*********.com.cn/plugin/api/setBasic',
        'httpUrl': 'http://*********.com.cn/plugin/api/setHtmlError',
        'departmentId': 8
    };

```

5、在module/orm/mysql.js中增加相应的配置,使用读写分离。
如图一：
```
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        idle: 10000,
        evict: 0
    },
    timezone: '+08:00'

```
增加配置文件：
如图二：
```
 host: config.host,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        idle: 10000,
        evict: 0
    },
    replication: {
        read: [
            {
                host: '', username: '', password: ''
            },
            {
                host: '', username: '', password: ''
            }
        ],
        write: {
            host: '', username: '', password: ''
        }
    },
    timezone: '+08:00'
```

新增  typescript:
```
npm install -g typescript
ts-node index.ts
```


