import os
import re

dirs = [
    "6788471044_【推演战报】next war_Korea 荫新第一次高规之旅",
    "6829253490_【兵棋学院】next war korea 战略突袭小攻略",
    "6967128825_【推演战报】ocs korea 剧本7长津湖荫新第一次推，如",
    "7487460366_【推演战报】朝鲜战争 ocs korea全剧本",
    "7917127587_【推演战报】第七舰队 想定9封锁立本",
    "8171190688_[推演战报] the blitzkrieg legend 全剧本"
]

base_dir = "文章"

for d in dirs:
    path = os.path.join(base_dir, d)
    md_files = [f for f in os.listdir(path) if f.endswith('.md')]
    if not md_files:
        continue
    md_file = md_files[0]
    md_path = os.path.join(path, md_file)
    
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # replace images/... with 文章/d/images/...
    # handle cases where path starts with images/
    def replace_img(match):
        img_path = match.group(1)
        if img_path.startswith("images/"):
            return f"![图片](文章/{d}/{img_path})"
        return match.group(0)
    
    new_content = re.sub(r'!\[.*?\]\((.*?)\)', replace_img, content)
    
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
