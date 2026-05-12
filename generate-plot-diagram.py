#!/usr/bin/env python3
"""Generate Excalidraw plot diagram for Galaxidi Adventure."""
import json
import random

random.seed(42)

def rid():
    return f"{random.randint(100000000, 999999999)}"

def seed():
    return random.randint(100000, 9999999)

elements = []
eid_counter = [0]

def make_id(prefix="el"):
    eid_counter[0] += 1
    return f"{prefix}_{eid_counter[0]}"

def add_rect(x, y, w, h, bg_color, stroke_color="#1e1e1e", group=None, roundness=3):
    eid = make_id("rect")
    el = {
        "type": "rectangle",
        "version": 1,
        "versionNonce": seed(),
        "isDeleted": False,
        "id": eid,
        "fillStyle": "solid",
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "angle": 0,
        "x": x,
        "y": y,
        "strokeColor": stroke_color,
        "backgroundColor": bg_color,
        "width": w,
        "height": h,
        "seed": seed(),
        "groupIds": [group] if group else [],
        "frameId": None,
        "roundness": {"type": roundness},
        "boundElements": [],
        "updated": 1700000000000,
        "link": None,
        "locked": False,
    }
    elements.append(el)
    return eid

def add_text(x, y, text, font_size=16, color="#1e1e1e", align="center", container_id=None, group=None, bold=False, w=None, h=None):
    eid = make_id("text")
    el = {
        "type": "text",
        "version": 1,
        "versionNonce": seed(),
        "isDeleted": False,
        "id": eid,
        "fillStyle": "solid",
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "angle": 0,
        "x": x,
        "y": y,
        "strokeColor": color,
        "backgroundColor": "transparent",
        "width": w or len(text) * font_size * 0.55,
        "height": h or font_size * 1.35 * text.count("\n") + font_size * 1.35,
        "seed": seed(),
        "groupIds": [group] if group else [],
        "frameId": None,
        "roundness": None,
        "boundElements": [],
        "updated": 1700000000000,
        "link": None,
        "locked": False,
        "fontSize": font_size,
        "fontFamily": 1,
        "text": text,
        "rawText": text,
        "textAlign": align,
        "verticalAlign": "middle" if container_id else "top",
        "containerId": container_id,
        "originalText": text,
        "autoResize": True,
        "lineHeight": 1.25,
    }
    elements.append(el)
    return eid

def add_arrow(x1, y1, x2, y2, start_id=None, end_id=None, color="#1e1e1e", width=2):
    eid = make_id("arrow")
    dx = x2 - x1
    dy = y2 - y1
    el = {
        "type": "arrow",
        "version": 1,
        "versionNonce": seed(),
        "isDeleted": False,
        "id": eid,
        "fillStyle": "solid",
        "strokeWidth": width,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "angle": 0,
        "x": x1,
        "y": y1,
        "strokeColor": color,
        "backgroundColor": "transparent",
        "width": abs(dx),
        "height": abs(dy),
        "seed": seed(),
        "groupIds": [],
        "frameId": None,
        "roundness": {"type": 2},
        "boundElements": [],
        "updated": 1700000000000,
        "link": None,
        "locked": False,
        "startBinding": {"elementId": start_id, "focus": 0, "gap": 5} if start_id else None,
        "endBinding": {"elementId": end_id, "focus": 0, "gap": 5} if end_id else None,
        "lastCommittedPoint": None,
        "startArrowhead": None,
        "endArrowhead": "arrow",
        "points": [[0, 0], [dx, dy]],
    }
    elements.append(el)
    return eid

def add_diamond(x, y, w, h, bg_color, stroke_color="#1e1e1e"):
    eid = make_id("diamond")
    el = {
        "type": "diamond",
        "version": 1,
        "versionNonce": seed(),
        "isDeleted": False,
        "id": eid,
        "fillStyle": "solid",
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "angle": 0,
        "x": x,
        "y": y,
        "strokeColor": stroke_color,
        "backgroundColor": bg_color,
        "width": w,
        "height": h,
        "seed": seed(),
        "groupIds": [],
        "frameId": None,
        "roundness": {"type": 2},
        "boundElements": [],
        "updated": 1700000000000,
        "link": None,
        "locked": False,
    }
    elements.append(el)
    return eid

def add_ellipse(x, y, w, h, bg_color, stroke_color="#1e1e1e"):
    eid = make_id("ellipse")
    el = {
        "type": "ellipse",
        "version": 1,
        "versionNonce": seed(),
        "isDeleted": False,
        "id": eid,
        "fillStyle": "solid",
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "angle": 0,
        "x": x,
        "y": y,
        "strokeColor": stroke_color,
        "backgroundColor": bg_color,
        "width": w,
        "height": h,
        "seed": seed(),
        "groupIds": [],
        "frameId": None,
        "roundness": {"type": 2},
        "boundElements": [],
        "updated": 1700000000000,
        "link": None,
        "locked": False,
    }
    elements.append(el)
    return eid

# ── Layout constants ──
BOX_W = 320
BOX_H = 200
H_GAP = 60
V_GAP = 100
START_X = 80
TITLE_Y = 30
ROW_Y = [180, 180 + BOX_H + V_GAP, 180 + 2*(BOX_H + V_GAP), 180 + 3*(BOX_H + V_GAP)]

# Scene data: (number, greek_title, english, description, key_item, color)
scenes = [
    # Act I — Setup (blue)
    (1, "ΑΦΙΞΗ", "Arrival",
     "Family drives into Galaxidi\nharbor at golden hour.\nFind great-grandfather's\nhouse with blue door.",
     None, "#a5d8ff"),
    (2, "ΤΟ ΣΠΙΤΙ ΤΟΥ ΠΑΠΠΟΥ", "The House",
     "Dark interior frozen since 1903.\nAjax finds locked desk.\nClio finds key in copper pot.\n→ Visvikis's Letter (1887)",
     "📜 Letter + Photo", "#a5d8ff"),
    (3, "Η ΠΑΡΕΑ", "The Friends",
     "Akis (flute) & Stathis (guitar)\nplay sailors' melody.\nLearn of Karkaros cave\nand Visvikis legend.",
     "🎵 Sailors' Melody", "#a5d8ff"),
    # Act II — Investigation (green)
    (4, "ΤΟ ΝΑΥΤΙΚΟ ΜΟΥΣΕΙΟ", "The Museum",
     "Golden Age: 300 ships, 6000 people.\nDecline: refused steamships.\nDiscover αλληλασφάλεια:\n104 captain signatures (1860).",
     "📖 Mutual Insurance", "#b2f2bb"),
    (5, "ΛΙΟΤΡΙΒΙ", "The Olive Press",
     "Athos (lawyer) at old press.\nRead Visvikis's will.\nKey question:\n'What's today's steamship?'",
     "❓ The Question", "#b2f2bb"),
    (6, "Ο ΜΥΛΟΣ", "The Windmill",
     "Panoramic view of gulf.\nGiannis gives brass lantern.\nSee entire quest geography\nfrom hilltop.",
     "🔦 Brass Lantern", "#b2f2bb"),
    (7, "ΤΟ ΣΠΗΛΑΙΟ", "The Cave",
     "Centuries of carved marks.\n'Λ.Β. 1887' on wall.\nSteamship vote: rejected 9–3.\nClio finds GREEN JADE STONE.",
     "💎 Jade Stone", "#b2f2bb"),
    # Act III — Discovery (orange)
    (8, "ΤΟ ΝΕΚΡΟΤΑΦΕΙΟ", "The Graveyard",
     "Captain's gravestones with ships.\nVisvikis grave: 'Η θάλασσα\nθυμάται.' Ghost appears —\npoints to Agios Nikolaos.",
     "👻 The Ghost", "#ffd8a8"),
    (9, "ΑΓΙΟΣ ΝΙΚΟΛΑΟΣ", "The Church",
     "Candlelight, golden icons.\nClio lights candle for captains.\nLoose tile with Λ.Β. mark.\nHidden nautical chart → island.",
     "🗺️ Nautical Map", "#ffd8a8"),
    (10, "ΤΟ ΚΑΡΑΒΙ", "The Boat",
     "Dawn crossing on the Ελπίδα.\nChrysostomos tells the story.\n'The sea changes, and you\nchange with it, or drown.'",
     "⛵ The Ελπίδα", "#ffd8a8"),
    # Act IV — Resolution (red)
    (11, "Ο ΘΗΣΑΥΡΟΣ", "The Treasure",
     "Dig on the islet of Ag. Georgios.\nGold coins, jade necklace,\noriginal 1860 ledger,\nVisvikis's final letter.",
     "💰 The Chest", "#ffc9c9"),
    (12, "Η ΝΕΑ ΕΠΟΧΗ", "The New Era",
     "Town gathering at harbor sunset.\nNtemis's speech. Akis's vision.\n104 new signatures.\nAjax signs last — circle closes.",
     "✍️ 104 Signatures", "#ffc9c9"),
]

# ── Title ──
title_w = 4 * BOX_W + 3 * H_GAP
add_rect(START_X, TITLE_Y, title_w, 100, "#343a40", "#343a40")
add_text(START_X + title_w/2 - 280, TITLE_Y + 10,
         "Η ΘΑΛΑΣΣΑ ΘΥΜΑΤΑΙ — The Sea Remembers\nΤο Μυστήριο του Γαλαξειδίου — Plot Map",
         font_size=28, color="#ffffff", w=560, h=78)

# ── Act labels ──
act_labels = [
    ("ACT I — SETUP", "#228be6", ROW_Y[0] - 35),
    ("ACT II — INVESTIGATION", "#2f9e44", ROW_Y[1] - 35),
    ("ACT III — DISCOVERY", "#e8590c", ROW_Y[2] - 35),
    ("ACT IV — RESOLUTION", "#c92a2a", ROW_Y[3] - 35),
]
for label, color, y in act_labels:
    add_text(START_X, y, label, font_size=14, color=color)

# ── Scene boxes ──
box_ids = []
for i, (num, gr_title, en_title, desc, item, color) in enumerate(scenes):
    row = i // 4
    col = i % 4
    x = START_X + col * (BOX_W + H_GAP)
    y = ROW_Y[row]

    # Main box
    gid = make_id("group")
    box_id = add_rect(x, y, BOX_W, BOX_H, color, group=gid)
    box_ids.append(box_id)

    # Scene number badge
    badge_size = 36
    add_ellipse(x - 12, y - 12, badge_size, badge_size, "#343a40", "#343a40")
    add_text(x - 5, y - 7, str(num), font_size=18, color="#ffffff", w=22, h=22)

    # Title (Greek)
    add_text(x + 10, y + 10, gr_title, font_size=18, color="#1e1e1e", align="left", w=BOX_W - 20, group=gid)

    # Subtitle (English)
    add_text(x + 10, y + 35, en_title, font_size=12, color="#495057", align="left", w=BOX_W - 20, group=gid)

    # Description
    add_text(x + 10, y + 58, desc, font_size=12, color="#343a40", align="left", w=BOX_W - 20, h=100, group=gid)

    # Key item badge (bottom of box)
    if item:
        add_text(x + 10, y + BOX_H - 28, item, font_size=13, color="#862e9c", align="left", w=BOX_W - 20, group=gid)

# ── Arrows between scenes ──
for i in range(len(scenes) - 1):
    src_row = i // 4
    src_col = i % 4
    dst_row = (i + 1) // 4
    dst_col = (i + 1) % 4

    sx = START_X + src_col * (BOX_W + H_GAP)
    sy = ROW_Y[src_row]
    dx = START_X + dst_col * (BOX_W + H_GAP)
    dy = ROW_Y[dst_row]

    if src_row == dst_row:
        # Horizontal arrow (right side of src → left side of dst)
        ax1 = sx + BOX_W
        ay1 = sy + BOX_H / 2
        ax2 = dx
        ay2 = dy + BOX_H / 2
        add_arrow(ax1 + 5, ay1, ax2 - 5, ay2,
                  start_id=box_ids[i], end_id=box_ids[i+1],
                  color="#868e96", width=2)
    else:
        # Vertical arrow (bottom of last in row → top of first in next row)
        ax1 = sx + BOX_W / 2
        ay1 = sy + BOX_H
        ax2 = dx + BOX_W / 2
        ay2 = dy
        add_arrow(ax1, ay1 + 5, ax2, ay2 - 5,
                  start_id=box_ids[i], end_id=box_ids[i+1],
                  color="#868e96", width=3)

# ── Epilogue ──
epi_y = ROW_Y[3] + BOX_H + 80
epi_x = START_X + 1 * (BOX_W + H_GAP)
epi_w = 2 * BOX_W + H_GAP

epi_id = add_rect(epi_x, epi_y, epi_w, 160, "#d0bfff", "#5f3dc4")
add_text(epi_x + epi_w/2 - 60, epi_y + 10,
         "ΕΠΙΛΟΓΟΣ", font_size=24, color="#5f3dc4", w=120, h=30)
add_text(epi_x + 20, epi_y + 45,
         "Η θάλασσα θυμάται. Κι εμείς τώρα, αλλάζουμε μαζί της.\n"
         "The sea remembers. And we, now, change with it.\n\n"
         "104 signatures. Then and now. — Κράτα την αλληλεγγύη. Άλλαξε το πλοίο.",
         font_size=14, color="#343a40", align="center", w=epi_w - 40, h=100)

# Arrow from scene 12 to epilogue
s12_x = START_X + 3 * (BOX_W + H_GAP)
add_arrow(s12_x + BOX_W/2, ROW_Y[3] + BOX_H + 5,
          epi_x + epi_w/2, epi_y - 5,
          start_id=box_ids[11], end_id=epi_id,
          color="#5f3dc4", width=3)

# ── Key Items Legend ──
legend_x = START_X + title_w + 40
legend_y = TITLE_Y
add_rect(legend_x, legend_y, 240, 320, "#f8f9fa", "#dee2e6")
add_text(legend_x + 20, legend_y + 10, "KEY ITEMS", font_size=16, color="#343a40", w=200)

items_text = (
    "📜 Visvikis's Letter (1887)\n"
    "🎵 Sailors' Melody\n"
    "📖 Mutual Insurance Pact\n"
    "❓ 'What's today's steamship?'\n"
    "🔦 Brass Lantern\n"
    "💎 Jade Green Stone\n"
    "👻 Ghost of Visvikis\n"
    "🗺️ Nautical Chart\n"
    "⛵ The Ελπίδα\n"
    "💰 Treasure Chest\n"
    "✍️ 104 New Signatures"
)
add_text(legend_x + 15, legend_y + 40, items_text, font_size=13, color="#495057", align="left", w=210, h=270)

# ── Character Arc boxes ──
char_y = epi_y + 220
char_w = (title_w - 2 * H_GAP) / 3

chars = [
    ("NTEMIS — The Father", "Arrives to settle inheritance.\nBecomes bridge between\npast and future.\nDelivers the vision that\nhonors both worlds.", "#e7f5ff"),
    ("AJAX — The Son", "Acts before thinking.\nLearns: being the best\nmakes you vulnerable to\nrefusing change.\nSigns the 104th signature.", "#ebfbee"),
    ("CLIO — The Daughter", "Emotional compass.\nSees what others can't.\nUnlocks every puzzle.\nWrites 'ΕΛΠΙΔΑ' (Hope)\nin her notebook.", "#fff4e6"),
]

add_text(START_X, char_y - 30, "CHARACTER ARCS", font_size=16, color="#343a40")

for ci, (name, arc, color) in enumerate(chars):
    cx = START_X + ci * (char_w + H_GAP)
    cid = add_rect(cx, char_y, char_w, 150, color)
    add_text(cx + 15, char_y + 8, name, font_size=15, color="#1e1e1e", align="left", w=char_w - 30)
    add_text(cx + 15, char_y + 32, arc, font_size=12, color="#495057", align="left", w=char_w - 30, h=110)

# ── Theme banner at the very bottom ──
theme_y = char_y + 200
theme_w = title_w
add_rect(START_X, theme_y, theme_w, 70, "#343a40", "#343a40")
add_text(START_X + 30, theme_y + 8,
         "THEME: Κράτα την αλληλεγγύη. Άλλαξε το πλοίο.\n"
         "Hold onto solidarity. Change the ship.",
         font_size=20, color="#ffffff", w=theme_w - 60, h=50)

# ── Build Excalidraw file ──
excalidraw = {
    "type": "excalidraw",
    "version": 2,
    "source": "https://excalidraw.com",
    "elements": elements,
    "appState": {
        "gridSize": None,
        "viewBackgroundColor": "#ffffff",
    },
    "files": {},
}

output_path = "/Users/ntemis/games/galaxidi-adventure/plot-diagram.excalidraw"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(excalidraw, f, ensure_ascii=False, indent=2)

print(f"Generated {len(elements)} elements → {output_path}")
