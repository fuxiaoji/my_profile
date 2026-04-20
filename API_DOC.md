# 贴吧爬虫核心引擎（API 调用文档）

由于域名解析尚未生效（或不想分配独立域名），你可以直接将本项目的后端“寄生”在你服务器现有的正常网站（例如 `fuwenji.asia`）之下。
服务器已经在 `127.0.0.1:5000` 全天候常驻运行了该爬虫引擎的底层 API。本套接口完全无头（Headless），供你的其他前端站点或脚本调用。

---

## 1. 核心接口说明 (API Endpoint)

### **启动爬虫任务**
- **路径 (Endpoint)**：`/api/run`
- **请求方式 (Method)**：`POST`

**请求参数 (支持 Form 表单或 JSON 格式)：**

| 字段名 | 类型   | 必填 | 描述 | 示例 |
|--------|--------|------|------|------|
| `url`  | string | 是   | 贴吧帖子的完整链接 | `https://tieba.baidu.com/p/123456789` |

**正常响应示例 (200 OK)：**
```json
{
    "code": 200,
    "msg": "爬虫已就绪，正在榨取帖子 123456789..."
}
```

**错误响应示例 (400 Bad Request / 500 Internal Server Error)：**
```json
{
    "code": 400,
    "msg": "未找到有效的帖子ID，请检查链接"
}
```

---

## 2. 寄生指南：如何通过另一个网站 (`fuwenji.asia`) 调用它？

目前的接口被保护在服务器的 `127.0.0.1:5000` 内部。你可以打开你另一个网站的 Nginx 配置文件（如 `/etc/nginx/conf.d/fuwenji.asia.conf`），在其中插入一个 `location` 反向代理，将特定的请求直接丢给爬虫。

**找到你当前正常运转的网站配置 (`fuwenji.asia.conf`):**

```nginx
server {
    listen 443 ssl;
    server_name fuwenji.asia www.fuwenji.asia;
    
    # ... 你原本的其他配置 ...

    # ======= 👉 插入以下内容到 server 块内 =======
    # 把发往 https://fuwenji.asia/spider-api/ 的请求，拦截并送给本地 5000 端口
    location /spider-api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # 可选：如果你通过浏览器里的前端页面 AJAX 调用，加上跨域支持 (CORS)
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
    # ===============================================
}
```

**修改保存后，重载 Nginx 生效：**
```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 3. 在你其他的网页中如何发出请求？

现在你的 `https://fuwenji.asia/spider-api/run` 就变成了启动爬虫的大门。
你可以用任何语言（Python / JS / cURL 请求它）。

**cURL 测试：**
```bash
curl -X POST -H "Content-Type: application/json" \
     -d '{"url": "https://tieba.baidu.com/p/123456789"}' \
     https://fuwenji.asia/spider-api/run
```

**在网页的前端 Javascript (Fetch 或 Axios)：**
```javascript
fetch("https://fuwenji.asia/spider-api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://tieba.baidu.com/p/123456789" })
})
.then(response => response.json())
.then(data => console.log(data));
```

这样你就不用折腾新的域名和主机名了，只要在旧项目的环境里外挂一条路由，直接把后端接口透传出来！
