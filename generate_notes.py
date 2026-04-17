import os
import json

def get_tree(path):
    tree = {"name": os.path.basename(path), "type": "directory", "children": []}
    try:
        entries = os.listdir(path)
    except Exception:
        return tree

    for entry in entries:
        if entry.startswith('.') or entry == '未命名文件夹':
            continue
        full_path = os.path.join(path, entry)
        if os.path.isdir(full_path):
            tree["children"].append(get_tree(full_path))
        elif full_path.endswith('.md') or full_path.endswith('.pdf'):
            tree["children"].append({"name": entry, "type": "file", "path": full_path})
    
    # Sort: directories first, then files
    tree["children"].sort(key=lambda x: (x["type"] != "directory", x["name"]))
    return tree

if __name__ == '__main__':
    tree = get_tree('note')
    with open('notes.json', 'w', encoding='utf-8') as f:
        json.dump(tree, f, ensure_ascii=False, indent=2)
    print("Generated notes.json")
