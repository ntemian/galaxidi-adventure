// ============================================================
// CONFIG — Constants, canvas dimensions, color palette
// ============================================================

const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const textOverlay = document.getElementById('text-overlay');
const hoverLabel = document.getElementById('hover-label');
const inventoryPanel = document.getElementById('inventory-panel');
const W = 640, H = 320;

// --- EXTENDED PALETTE (Monkey Island NIGHT style — dark, moody) ---
const C = {
  // Sky — NIGHT (deep dark blues like MI)
  SKY_TOP: '#050818', SKY_MID: '#0A1430', SKY_LOW: '#152040', SKY_HORIZON: '#1A3050',
  // Sea — DARK NIGHT water
  SEA_DEEP: '#040C20', SEA_MID: '#081830', SEA_LIGHT: '#0C2444', SEA_FOAM: '#2A5577',
  SEA_HIGHLIGHT: '#4488AA',
  // Sand — night muted
  SAND_DARK: '#5A4830', SAND_MID: '#6A5838', SAND_LIGHT: '#7A6848', SAND_WET: '#4A3828',
  // Stone — darker night
  STONE_DARK: '#2A2218', STONE_MID: '#3A3228', STONE_LIGHT: '#4A4238', STONE_BRIGHT: '#5A5248',
  // Wood — dark night wood
  WOOD_DARK: '#1A1008', WOOD_MID: '#2A1A10', WOOD_LIGHT: '#3A2A18', WOOD_BRIGHT: '#4A3A28',
  // Foliage — dark night
  LEAF_DARK: '#0A1A0A', LEAF_MID: '#122812', LEAF_LIGHT: '#1A3A1A', LEAF_BRIGHT: '#224422',
  // Building — night, dark with warm window glow
  WALL_CREAM: '#3A3428', WALL_SHADOW: '#2A2418', WALL_WHITE: '#4A4438',
  ROOF_RED: '#3A1810', ROOF_DARK: '#2A1008', ROOF_TILE: '#4A2018',
  // Cave
  CAVE_DARK: '#0A0808', CAVE_MID: '#2A2018', CAVE_LIGHT: '#4A3828', CAVE_WARM: '#5A4830',
  // Misc
  GOLD: '#DDAA33', GOLD_BRIGHT: '#FFCC44', GOLD_DARK: '#AA7711',
  BLACK: '#000000', WHITE: '#FFFFFF',
  RED: '#CC3333', BLUE: '#3366BB', GREEN: '#33AA44',
  YELLOW: '#FFDD44', ORANGE: '#DD8833', CYAN: '#55BBCC',
  SKIN: '#DDAA88', SKIN_SHADOW: '#BB8866',
  WATER_GLOW: '#4499BB',
};

// --- DITHERING CACHE ---
const rgbCache = {};
