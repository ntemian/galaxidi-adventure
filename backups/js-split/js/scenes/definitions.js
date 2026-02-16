// ============================================================
// SCENE DEFINITIONS — Scene data, walkBounds, hotspots
// ============================================================

// --- SCENES ---
const scenes = {
  house: {
    name: "The Galaxidi House",
    walkBounds: { x1:60, x2:580, y1:230, y2:300 },
    charStart: { x:300, y:265 },
    hotspots: () => [
      { id:'window_h', x:340, y:20, w:130, h:120, label:'Παράθυρο' },
      { id:'drawer', x:140, y:215, w:160, h:45, label:'Συρτάρι' },
      { id:'kitchen_table', x:150, y:160, w:200, h:55, label:'Τραπέζι Κουζίνας' },
      { id:'lantern_spot', x:280, y:20, w:60, h:60, label:'Φανάρι' },
      { id:'fridge', x:480, y:50, w:70, h:160, label:'Ψυγείο' },
      { id:'door_out', x:10, y:60, w:80, h:180, label:'Εξώπορτα' },
      { id:'painting', x:220, y:40, w:70, h:55, label:'Πίνακας' },
      { id:'bookshelf', x:555, y:30, w:80, h:200, label:'Βιβλιοθήκη' },
    ],
  },
  port: {
    name: "The Port of Galaxidi",
    walkBounds: { x1:30, x2:610, y1:240, y2:300 },
    charStart: { x:100, y:270 },
    hotspots: () => [
      { id:'sea', x:0, y:0, w:640, h:130, label:'Η Θάλασσα' },
      { id:'boat1', x:80, y:140, w:120, h:70, label:'Ψαρόβαρκα "Ελπίδα"' },
      { id:'boat2', x:360, y:130, w:130, h:80, label:'Ιστιοφόρο "Ανεμώνη"' },
      { id:'fisherman', x:510, y:170, w:55, h:70, label:'Γέρος Ψαράς' },
      { id:'bollard', x:260, y:220, w:30, h:20, label:'Δέστρα' },
      { id:'to_house', x:0, y:230, w:35, h:90, label:'Προς Σπίτι' },
      { id:'to_beach', x:605, y:230, w:35, h:90, label:'Προς Παραλία' },
      { id:'to_town', x:230, y:215, w:180, h:45, label:'Σκαλιά Παλιάς Πόλης' },
    ],
  },
  beach: {
    name: "The Cove",
    walkBounds: { x1:50, x2:500, y1:255, y2:300 },
    charStart: { x:100, y:275 },
    hotspots: () => [
      { id:'waves', x:0, y:0, w:640, h:160, label:'Τα Κύματα' },
      { id:'rocks', x:440, y:170, w:120, h:60, label:'Βράχια' },
      { id:'shell_spot', x:270, y:240, w:35, h:20, label:'Κάτι Λαμπερό στην Άμμο' },
      { id:'driftwood', x:100, y:225, w:90, h:20, label:'Θαλασσόξυλο' },
      { id:'cave_entrance', x:530, y:180, w:90, h:80, label:'Σκοτεινή Σπηλιά' },
      { id:'to_port_b', x:0, y:230, w:35, h:90, label:'Πίσω στο Λιμάνι' },
    ],
  },
  town: {
    name: "The Old Town Square",
    walkBounds: { x1:40, x2:600, y1:240, y2:300 },
    charStart: { x:320, y:270 },
    hotspots: () => [
      { id:'church', x:210, y:10, w:220, h:190, label:'Εκκλησία Αγ. Νικολάου' },
      { id:'old_chest', x:60, y:195, w:85, h:45, label:'Πέτρινο Σεντούκι' },
      { id:'fountain', x:470, y:175, w:70, h:55, label:'Συντριβάνι' },
      { id:'cat', x:370, y:220, w:30, h:22, label:'Πορτοκαλί Γάτα' },
      { id:'to_port_t', x:0, y:230, w:35, h:90, label:'Πίσω στο Λιμάνι' },
      { id:'bougainvillea', x:100, y:80, w:50, h:80, label:'Βουκαμβίλια' },
      { id:'to_hilltop', x:605, y:180, w:35, h:90, label:'Μονοπάτι Λόφου' },
    ],
  },
  cave: {
    name: "The Sea Cave",
    walkBounds: { x1:60, x2:540, y1:250, y2:300 },
    charStart: { x:480, y:275 },
    hotspots: () => [
      { id:'cave_wall', x:0, y:0, w:640, h:160, label:'Τοίχοι Σπηλιάς' },
      { id:'pool', x:40, y:220, w:140, h:45, label:'Παλιρροϊκή Λίμνη' },
      { id:'treasure_spot', x:240, y:190, w:100, h:55, label:'Εσοχή στο Βράχο' },
      { id:'stalactites', x:280, y:10, w:120, h:60, label:'Σταλακτίτες' },
      { id:'exit_cave', x:550, y:210, w:90, h:90, label:'Έξοδος Σπηλιάς' },
    ],
  },
  church: {
    name: "Church Interior",
    walkBounds: { x1:60, x2:580, y1:250, y2:300 },
    charStart: { x:320, y:275 },
    hotspots: () => [
      { id:'altar', x:260, y:40, w:120, h:100, label:'Ιερό Βήμα' },
      { id:'icons', x:80, y:30, w:100, h:120, label:'Εικόνες Αγίων' },
      { id:'candles', x:450, y:100, w:80, h:80, label:'Κεριά' },
      { id:'mosaic_floor', x:200, y:200, w:240, h:50, label:'Ψηφιδωτό Δάπεδο' },
      { id:'monk', x:520, y:170, w:50, h:70, label:'Παπα-Νικόλας' },
      { id:'exit_church', x:280, y:240, w:80, h:80, label:'Έξοδος' },
    ],
  },
  hilltop: {
    name: "The Hilltop",
    walkBounds: { x1:40, x2:600, y1:255, y2:300 },
    charStart: { x:100, y:275 },
    hotspots: () => [
      { id:'panorama', x:0, y:0, w:640, h:120, label:'Πανοραμική Θέα' },
      { id:'ruins', x:380, y:140, w:120, h:80, label:'Αρχαία Ερείπια' },
      { id:'wildflowers', x:100, y:210, w:100, h:40, label:'Αγριολούλουδα' },
      { id:'telescope', x:250, y:160, w:40, h:60, label:'Παλιό Τηλεσκόπιο' },
      { id:'to_town_h', x:0, y:240, w:35, h:80, label:'Κάτω στην Πόλη' },
    ],
  },
  boat: {
    name: "On the Boat",
    walkBounds: { x1:80, x2:560, y1:240, y2:290 },
    charStart: { x:300, y:265 },
    hotspots: () => [
      { id:'horizon_b', x:0, y:0, w:640, h:100, label:'Ο Ορίζοντας' },
      { id:'wheel', x:450, y:140, w:70, h:70, label:'Τιμόνι' },
      { id:'nets', x:80, y:180, w:100, h:50, label:'Δίχτυα Ψαρέματος' },
      { id:'dolphins', x:500, y:80, w:100, h:60, label:'Δελφίνια!' },
      { id:'to_port_boat', x:550, y:240, w:90, h:80, label:'Πίσω στο Λιμάνι' },
    ],
  },
};

