import json
import os
import re

articles = []
with open('articles.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

# The directories added are:
dirs = [
    "6788471044_【推演战报】next war_Korea 荫新第一次高规之旅",
    "6829253490_【兵棋学院】next war korea 战略突袭小攻略",
    "6967128825_【推演战报】ocs korea 剧本7长津湖荫新第一次推，如",
    "7487460366_【推演战报】朝鲜战争 ocs korea全剧本",
    "7917127587_【推演战报】第七舰队 想定9封锁立本",
    "8171190688_[推演战报] the blitzkrieg legend 全剧本"
]

base_dir = "文章"

# extract the first image and some text
for d in dirs:
    path = os.path.join(base_dir, d)
    md_files = [f for f in os.listdir(path) if f.endswith('.md')]
    if not md_files:
        continue
    md_file = md_files[0]
    md_path = os.path.join(path, md_file)
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # find image
    # ![图片](images/img_0001.jpg)
    img_match = re.search(r'!\[.*?\]\((.*?)\)', content)
    first_image = "https://picsum.photos/seed/wargame/760/420"
    if img_match:
        img_path = img_match.group(1)
        first_image = f"文章/{d}/{img_path}"
    
    # generate title
    title = md_file.replace('.md', '')
    
    tags = []
    if "next war" in title.lower():
        tags.append("Next War")
    if "ocs" in title.lower():
        tags.append("OCS")
    if "推演战报" in title:
        tags.append("战报")
    if "兵棋" in title:
        tags.append("兵棋")
        
    date = "2020-09-19" # default, could parse from content if needed
    
    articles.insert(0, {
        "title": title,
        "cover": first_image,
        "md": f"文章/{d}/{md_file}",
        "docx": None,
        "date": date,
        "tags": tags,
        "summary": "硬核兵棋推演记录。"
    })

with open('articles.json', 'w', encoding='utf-8') as f:
    json.dump(articles, f, indent=2, ensure_ascii=False)
