# Bilibili API deploy notes

The portfolio reads Bilibili data from:

```text
/api/bilibili/summary
```

Current account:

```bash
export BILIBILI_NAME=三只阿基
export BILIBILI_MID=480295330
```

The frontend falls back to:

```text
/bilibili-summary.json
```

if the live Bilibili request is rate-limited. Bilibili may return `-799` or temporary 4xx errors when requests are too frequent, so the production server should cache the response for 5-10 minutes.

Returned JSON shape:

```json
{
  "name": "三只阿基",
  "mid": "480295330",
  "profileUrl": "https://space.bilibili.com/480295330",
  "fans": 125,
  "likes": 2655,
  "latest": [
    {
      "title": "Latest video title",
      "url": "https://www.bilibili.com/video/...",
      "date": "2026-07-02"
    }
  ],
  "updatedAt": "2026-07-02T13:08:00.000Z"
}
```
