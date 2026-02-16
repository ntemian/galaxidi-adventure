// ============================================================
// INTERACTION — Click handlers, verb handlers, scene navigation
// ============================================================

// ============================================================
// INTERACTION LOGIC
// ============================================================

function changeScene(newScene, skipFade) {
  function doChange() {
    state.scene = newScene;
    const s = scenes[newScene];
    state.charX = s.charStart.x;
    state.charY = s.charStart.y;
    state.charTargetX = s.charStart.x;
    state.charTargetY = s.charStart.y;
    state.charWalking = false;
    invalidateBg();
    AudioSystem.doorCreak();
    AudioSystem.sceneAudio(newScene);
    drawMiniMap();
    showText(getSceneDescription(newScene));
  }
  if (skipFade) { doChange(); return; }
  irisWipeTransition(doChange);
}

function getSceneDescription(sc) {
  const descs = {
    house: 'Το σπίτι στο Γαλαξίδι. Ζεστό φως μπαίνει από το παράθυρο. Μυρίζει καφές...',
    port: 'Το λιμάνι του Γαλαξειδίου. Ψαρόβαρκες κουνιούνται στα κρυστάλλινα νερά. Ένας γέρος ψαράς κάθεται στην άκρη.',
    beach: 'Ένας κρυφός όρμος δυτικά. Τιρκουάζ κύματα χτυπούν στη χρυσή άμμο. Ένα σκοτεινό άνοιγμα στο βράχο...',
    town: 'Η παλιά πλατεία. Ο Άγιος Νικόλαος δεσπόζει πάνω από τα καλντερίμια. Μια γάτα λιάζεται.',
    church: 'Το εσωτερικό του Αγίου Νικολάου. Αρώματα κεριών και λιβανιού. Ψηφιδωτά δάπεδα αστράφτουν.',
    hilltop: 'Ο λόφος πάνω από το Γαλαξίδι! Πανοραμική θέα του κόλπου, αρχαία ερείπια, και αγριολούλουδα.',
    boat: 'Πάνω στην ψαρόβαρκα! Ο άνεμος φυσάει στα πανιά. Δελφίνια παίζουν στα κύματα!',
    cave: state.flags.caveIlluminated
      ? 'Η σπηλιά λάμπει! Νερό στάζει από σταλακτίτες. Κάτι λαμποκοπάει στην εσοχή...'
      : 'Μια σκοτεινή σπηλιά. Ακούς νερό να στάζει αλλά δεν βλέπεις τίποτα...',
  };
  return descs[sc];
}

function handleClick(mx, my) {
  if (state.won || state.fading || state.dialogActive) return;
  const s = scenes[state.scene];
  const hotspots = s.hotspots();
  const hit = hotspots.find(h => mx>=h.x && mx<h.x+h.w && my>=h.y && my<h.y+h.h);

  if (state.verb === 'walk') {
    if (hit) handleWalkTo(hit);
    else if (my >= s.walkBounds.y1 && my <= s.walkBounds.y2 && mx >= s.walkBounds.x1 && mx <= s.walkBounds.x2) {
      state.charTargetX = mx; state.charTargetY = my;
      state.charWalking = true; state.charDir = mx > state.charX ? 1 : -1;
    }
    return;
  }
  if (!hit) { showText("Τίποτα ενδιαφέρον εκεί."); return; }
  switch(state.verb) {
    case 'look': handleLook(hit); break;
    case 'take': handleTake(hit); break;
    case 'use': handleUse(hit); break;
    case 'talk': handleTalk(hit); break;
    case 'open': handleOpen(hit); break;
    case 'close': showText("Δεν χρειάζεται να το κλείσεις αυτό."); break;
    case 'push': showText("Δεν μετακινείται."); break;
    case 'pull': showText("Δεν μπορείς να το τραβήξεις."); break;
  }
}

function handleWalkTo(hit) {
  const transitions = {
    door_out: 'port', to_house: 'house', to_beach: 'beach',
    to_port_b: 'port', to_port_t: 'port', to_town: 'town', exit_cave: 'beach',
    exit_church: 'town', to_town_h: 'town', to_port_boat: 'port', to_hilltop: 'hilltop',
  };
  if (transitions[hit.id]) { changeScene(transitions[hit.id]); return; }
  if (hit.id === 'cave_entrance') {
    if (hasItem('map')) changeScene('cave');
    else showText("Φαίνεται σαν σπηλιά, αλλά είναι επικίνδυνο να μπεις χωρίς να ξέρεις περισσότερα.");
    return;
  }
  // Enter church from town
  if (hit.id === 'church') {
    state.flags.visitedChurch = true;
    changeScene('church');
    return;
  }
  // Enter boat from port (click on fishing boat)
  if (hit.id === 'boat1') {
    state.flags.visitedBoat = true;
    changeScene('boat');
    return;
  }
  const s = scenes[state.scene];
  const tx = Math.max(s.walkBounds.x1, Math.min(s.walkBounds.x2, hit.x+hit.w/2));
  const ty = Math.max(s.walkBounds.y1, Math.min(s.walkBounds.y2, hit.y+hit.h));
  state.charTargetX=tx; state.charTargetY=ty;
  state.charWalking=true; state.charDir = tx>state.charX?1:-1;
}

function handleLook(hit) {
  const looks = {
    window_h: "Από το παράθυρο: το λιμάνι του Γαλαξειδίου λάμπει στον ήλιο. Ιστιοφόρα κουνιούνται απαλά. Τέλεια μέρα για περιπέτεια!",
    kitchen_table: "Το παλιό ξύλινο τραπέζι της κουζίνας. Φρούτα, πιάτα, το φλιτζάνι του πρωινού καφέ. Αυτό το τραπέζι έχει δει γενιές οικογενειακά γεύματα.",
    drawer: state.flags.drawerOpen ? (state.flags.letterTaken ? "Ένα άδειο συρτάρι." : "Υπάρχει ένα κιτρινισμένο γράμμα μέσα! Φαίνεται πολύ παλιό.") : "Ένα ξύλινο συρτάρι κάτω από το τραπέζι. Μπορεί να κρύβει κάτι μέσα.",
    lantern_spot: state.flags.lanternTaken ? "Ένα άδειο ράφι." : "Ένα παλιό φανάρι λαδιού στο ράφι. Φαίνεται ότι έχει ακόμα καύσιμο.",
    fridge: "Το αξιόπιστο ψυγείο. Ο Αίαντας πάντα πρώτα εκεί κοιτάει για σνακ.",
    door_out: "Η εξώπορτα. Φως μπαίνει από τις χαραμάδες. Το λιμάνι είναι ακριβώς έξω.",
    painting: "Ένας μικρός ελαιογραφία του λιμανιού του Γαλαξειδίου από τα 1800. Πλοία με ψηλά κατάρτια γεμίζουν το λιμάνι.",
    bookshelf: "Παλιά βιβλία για ναυτική ιστορία και ελληνική μυθολογία. Μερικά είναι στα γαλλικά — από το κοσμοπολίτικο παρελθόν.",
    sea: "Ο Κορινθιακός κόλπος. Βαθύ μπλε, κρυστάλλινο. Τα βουνά της Πελοποννήσου υψώνονται απέναντι.",
    boat1: 'Μια μπλε ψαρόβαρκα με το όνομα «Ελπίδα». Δίχτυα και σημαδούρες στοιβαγμένα μέσα.',
    boat2: 'Ένα κομψό λευκό ιστιοφόρο, η «Ανεμώνη». Φρεσκοβαμμένη γάστρα.',
    fisherman: "Ένας γέρος ψαράς με γραμμένο πρόσωπο, λευκό μούσι και καλά μάτια. Ψαρεύει εδώ από πάντα.",
    bollard: "Μια σκουριασμένη σιδερένια δέστρα. Ένα χοντρό σχοινί δένει την ψαρόβαρκα.",
    to_house: "Ο δρόμος πίσω στο σπίτι.", to_beach: "Ένα βραχώδες μονοπάτι δυτικά κατά μήκος της ακτής.",
    to_town: "Πέτρινα σκαλιά ανεβαίνουν στην παλιά πόλη.", to_port_b: "Ο δρόμος πίσω στο λιμάνι.", to_port_t: "Σκαλιά κάτω στο λιμάνι.",
    waves: "Πανέμορφα τιρκουάζ κύματα. Η Κλειώ θα μπορούσε να παίζει εδώ για ώρες. Ο Αίαντας βλέπει ψαράκια στα ρηχά.",
    rocks: "Μεγάλοι λείοι βράχοι σμιλεμένοι από χιλιετίες κυμάτων. Καβούρια τρέχουν στις σχισμές.",
    shell_spot: state.flags.shellTaken ? "Μόνο άμμος και βότσαλα." : "Κάτι λαμπερό πιάνει το φως στην άμμο! Ο Αίαντας το βλέπει πρώτος.",
    driftwood: "Ασπρισμένο θαλασσόξυλο, λείο σαν κόκαλο. Κυλιέται στα κύματα εδώ και χρόνια.",
    cave_entrance: "Ένα σκοτεινό άνοιγμα στο βράχο — μια θαλασσινή σπηλιά! Συναρπαστικό... και μυστηριώδες.",
    church: "Η εκκλησία του Αγίου Νικολάου, προστάτη των ναυτικών. Πανέμορφη πέτρινη αρχιτεκτονική αιώνων. Η καμπάνα λάμπει στον ήλιο.",
    old_chest: state.flags.chestOpen ? (state.flags.mapTaken ? "Ένα άδειο πέτρινο σεντούκι, ανοιχτό." : "Το σεντούκι είναι ανοιχτό! Ένα τυλιγμένο χαρτί μέσα — μοιάζει με χάρτη!") : "Ένα αρχαίο πέτρινο σεντούκι με μια περίεργη κλειδαριά σε σχήμα κοχυλιού. Είναι εδώ από πάντα.",
    fountain: "Ένα πέτρινο συντριβάνι με φρέσκο νερό βουνού. Ο ήχος είναι χαλαρωτικός.",
    cat: "Μια παχουλή πορτοκαλί γάτα με φωτεινά πράσινα μάτια. Παρακολουθεί την πλατεία με τεμπέλικη αυθεντία.",
    bougainvillea: "Πανέμορφη μοβ βουκαμβίλια σκαρφαλώνει στον παλιό πέτρινο τοίχο. Ηλεκτρικό χρώμα.",
    cave_wall: state.flags.caveIlluminated ? "Αρχαίοι βραχώδεις τοίχοι γυαλισμένοι από το νερό. Φλέβες ορυκτών σπινθηρίζουν στο φως — χαλαζίας, ίσως και χρυσός." : "Πολύ σκοτεινά για να δεις τους τοίχους.",
    pool: state.flags.caveIlluminated ? "Μια κρυστάλλινη παλιρροϊκή λίμνη που λάμπει με αιθέριο μπλε φως. Μικρά ψαράκια και θαλάσσιες ανεμώνες ζουν μέσα. Η Κλειώ μαγεύεται!" : "Ακούς νερό να χτυπάει αλλά δεν βλέπεις.",
    treasure_spot: state.flags.caveIlluminated ? (state.flags.treasureFound ? "Το ανοιχτό σεντούκι θησαυρού του Καπετάν Γαλαξειδιώτη! Χρυσά νομίσματα, μια αρχαία πυξίδα, και ένα οικογενειακό γράμμα." : "Μια εσοχή λαξευμένη στο βράχο... σίγουρα υπάρχει κάτι εκεί μέσα. Μήπως είναι... σεντούκι θησαυρού;!") : "Πολύ σκοτεινά για να δεις μέσα στην εσοχή.",
    stalactites: state.flags.caveIlluminated ? "Μυτεροί σταλακτίτες κρέμονται από το ταβάνι, σχηματισμένοι σταγόνα-σταγόνα σε χιλιάδες χρόνια. 'Αυτό είναι σαν τον Άρχοντα των Δαχτυλιδιών!' λέει ο Αίαντας." : "Ακούς νερό να στάζει από ψηλά.",
    exit_cave: "Φωτεινό φως ημέρας από την είσοδο της σπηλιάς. Η παραλία είναι ακριβώς έξω.",
    // Church
    altar: "Ένα πανέμορφο ξύλινο τέμπλο με χρυσά αναθήματα. Δύο κεριά καίνε στα πλαϊνά. Ένας σταυρός λάμπει στην κορυφή.",
    icons: "Βυζαντινές εικόνες αγίων με χρυσά φωτοστέφανα. Πρόσωπα γεμάτα ιστορία και πίστη.",
    candles: state.flags.litCandle ? "Η κηρόστρα γεμάτη αναμμένα κεριά. Ζεστό φως πλημμυρίζει τη γωνία." : "Μια κηρόστρα με μερικά αναμμένα κεριά. Θα μπορούσαμε ν' ανάψουμε κι εμείς.",
    mosaic_floor: "Ψηφιδωτό δάπεδο με θαλασσινά μοτίβα — ψάρια, κοχύλια, κύματα. Αρχαία τέχνη κάτω από τα πόδια.",
    monk: "Ο Παπα-Νικόλας. Ηλικιωμένος ιερέας με ευγενικό βλέμμα και μακριά γκρίζα γενειάδα.",
    exit_church: "Η πόρτα προς την πλατεία. Φως μπαίνει από έξω.",
    // Hilltop
    panorama: "Εκπληκτική θέα! Ολόκληρο το Γαλαξίδι απλώνεται κάτω — το λιμάνι, οι εκκλησίες, τα σπίτια. Απέναντι ο Κορινθιακός κόλπος με τα βουνά της Πελοποννήσου.",
    ruins: "Αρχαίοι κίονες — πιθανότατα ναός της Αθηνάς ή του Ποσειδώνα. 'Πόσο παλιά είναι αυτά;' ρωτάει η Κλειώ. 'Χιλιάδες χρόνια,' απαντάει ο Ντέμης.",
    wildflowers: "Αγριολούλουδα παντού! Παπαρούνες, μαργαρίτες, λεβάντα. 'Μυρίζει υπέροχα!' λέει η Κλειώ.",
    telescope: "Ένα παλιό μπρούτζινο τηλεσκόπιο. Κάποιος το άφησε εδώ για τους επισκέπτες. Δείχνει προς τη θάλασσα.",
    to_town_h: "Ένα πέτρινο μονοπάτι κατεβαίνει πίσω στην πόλη.",
    to_hilltop: "Ένα στενό μονοπάτι ανεβαίνει στον λόφο. Φαίνεται ωραία η θέα!",
    // Boat
    horizon_b: "Ατελείωτη θάλασσα ως τον ορίζοντα. Βουνά γαλαζωπά στο βάθος. 'Αυτό είναι ελευθερία!' λέει ο Αίαντας.",
    wheel: "Ξύλινο τιμόνι με οκτώ ακτίνες. Ο Αίαντας πιάνει τις λαβές: 'Είμαι ο καπετάνιος τώρα!'",
    nets: "Ψαρόδιχτα μαζεμένα στο κατάστρωμα. Μυρίζουν θάλασσα. Μικρά κοχύλια έχουν πιαστεί στο δίχτυ.",
    dolphins: "Δελφίνια! Πηδάνε μέσα κι έξω από τα κύματα. 'Μπαμπά κοίτα!' ουρλιάζει η Κλειώ. Ο Αίαντας τα μετράει — τουλάχιστον τρία!",
    to_port_boat: "Η βάρκα πλησιάζει πίσω στο λιμάνι.",
  };
  showText(looks[hit.id] || `Κοιτάς: ${hit.label}.`);
}

function handleOpen(hit) {
  switch(hit.id) {
    case 'drawer':
      if (!state.flags.drawerOpen) {
        state.flags.drawerOpen = true; invalidateBg();
        AudioSystem.drawerOpen();
        showText("Ο Αίαντας ανοίγει το συρτάρι με ένα τρίξιμο! Υπάρχει κάτι μέσα — ένα παλιό κιτρινισμένο γράμμα!");
        return;
      }
      showText("Το συρτάρι είναι ήδη ανοιχτό.");
      return;
    case 'old_chest':
      if (!state.flags.chestOpen) {
        if (hasItem('shell')) {
          state.flags.chestOpen = true; removeItem('shell'); invalidateBg();
          AudioSystem.chestUnlock();
          showText("Η Κλειώ βάζει το χρυσό κοχύλι στην κλειδαριά. ΚΛΙΚ! Το αρχαίο σεντούκι ανοίγει!");
          return;
        }
        showText("Το σεντούκι έχει μια κλειδαριά σε σχήμα κοχυλιού. Χρειάζεσαι κάτι που να ταιριάζει.");
        return;
      }
      showText("Το σεντούκι είναι ήδη ανοιχτό.");
      return;
    case 'door_out': changeScene('port'); return;
    case 'fridge':
      AudioSystem.drawerOpen();
      showText("Ο Αίαντας ανοίγει το ψυγείο. 'Φέτα, ελιές και πορτοκαλάδα!' Η Κλειώ αρπάζει ένα χυμό. Καύσιμα περιπέτειας!");
      return;
  }
  showText("Δεν μπορείς να το ανοίξεις αυτό.");
}

function handleTake(hit) {
  switch(hit.id) {
    case 'drawer':
      if (state.flags.drawerOpen && !state.flags.letterTaken) {
        state.flags.letterTaken = true; addItem('letter'); invalidateBg();
        showText("Η Κλειώ παίρνει προσεκτικά το γράμμα. Το χαρτί είναι εύθραυστο, γραμμένο με πανέμορφη παλιά καλλιγραφία.");
        return;
      }
      break;
    case 'lantern_spot':
      if (!state.flags.lanternTaken) {
        state.flags.lanternTaken = true; addItem('lantern'); invalidateBg();
        showText("Ο Αίαντας αρπάζει το φανάρι. 'Είναι πιο βαρύ απ' ό,τι φαίνεται!' Έχει ακόμα λάδι μέσα.");
        return;
      }
      break;
    case 'shell_spot':
      if (!state.flags.shellTaken) {
        state.flags.shellTaken = true; addItem('shell'); invalidateBg();
        showText("Ο Αίαντας μαζεύει το χρυσό κοχύλι. 'Κοίτα, μοιάζει με κλειδί!' Η Κλειώ το κρατάει στο φως — λάμπει υπέροχα.");
        return;
      }
      break;
    case 'old_chest':
      if (state.flags.chestOpen && !state.flags.mapTaken) {
        state.flags.mapTaken = true; addItem('map'); invalidateBg();
        showText("Ο Ντέμης ξετυλίγει προσεκτικά τον χάρτη. Είναι χειροποίητος — με την ακτογραμμή του Γαλαξειδίου! Ένα κόκκινο Χ δείχνει μια σπηλιά δυτικά!");
        return;
      }
      break;
    case 'treasure_spot':
      if (state.flags.caveIlluminated && !state.flags.treasureFound) {
        state.flags.treasureFound = true; invalidateBg();
        AudioSystem.treasureFanfare();
        showText("Ο ΘΗΣΑΥΡΟΣ! Η οικογένεια ανοίγει το σεντούκι μαζί. Χρυσά νομίσματα, μια πυξίδα, και ένα γράμμα: 'Ο αληθινός θησαυρός είναι η οικογένεια που τον αναζητά μαζί.'");
        setTimeout(() => { state.won = true; document.getElementById('win-screen').style.display='flex'; }, 5000);
        return;
      }
      break;
    case 'fisherman': showText("Δεν μπορείς να σηκώσεις έναν ψαρά! Δοκίμασε να του μιλήσεις."); return;
    case 'cat': showText("Η γάτα σφυρίζει και τρέχει πίσω από το συντριβάνι. Η Κλειώ γελάει: 'Δεν μπορούμε να πάρουμε γάτα, μπαμπά!'"); return;
    case 'driftwood': showText("Είναι πολύ μουσκεμένο για να χρησιμεύσει. Άσ' το για τα καβούρια."); return;
    case 'rocks': showText("Οι βράχοι είναι πάρα πολύ βαρείς."); return;
  }
  showText("Δεν μπορείς να το πάρεις αυτό.");
}

function handleUse(hit) {
  const sel = state.selectedInvItem;
  if (!sel) {
    showText("Πρώτα κάνε κλικ σε ένα αντικείμενο στο inventάρι σου, μετά κλικ εκεί που θες να το χρησιμοποιήσεις.");
    return;
  }
  if (sel==='shell' && hit.id==='old_chest' && !state.flags.chestOpen) {
    state.flags.chestOpen=true; removeItem('shell'); invalidateBg();
    AudioSystem.chestUnlock();
    showText("Η Κλειώ βάζει το χρυσό κοχύλι στην κλειδαριά. ΚΛΙΚ! Το αρχαίο σεντούκι ανοίγει με τρίξιμο!");
    return;
  }
  if (sel==='lantern' && (hit.id==='cave_wall'||hit.id==='pool'||hit.id==='treasure_spot'||hit.id==='stalactites') && !state.flags.caveIlluminated) {
    state.flags.caveIlluminated=true; invalidateBg();
    AudioSystem.sceneAudio('cave');
    showText("Ο Ντέμης ανάβει το φανάρι! Χρυσό φως πλημμυρίζει τη σπηλιά. Οι τοίχοι σπινθηρίζουν, και στην εσοχή... ένα σεντούκι θησαυρού!");
    return;
  }
  if (sel==='compass' && hit.id==='cave_entrance') {
    showText("Η βελόνα της πυξίδας στρέφεται τρελά προς τη σπηλιά! Σίγουρα υπάρχει κάτι ξεχωριστό εκεί μέσα.");
    return;
  }
  if (sel==='map' && hit.id==='cave_entrance') {
    showText("Το Χ στον χάρτη ταιριάζει ακριβώς με αυτή τη σπηλιά! Πάμε μέσα!");
    changeScene('cave');
    return;
  }
  if (sel==='letter' && hit.id==='fisherman') {
    showText("Ο ψαράς διαβάζει το γράμμα με γουρλωμένα μάτια. 'Καπετάν Γαλαξειδιώτης! Ξέρω αυτόν τον θρύλο. Πάρε την πυξίδα μου — δείχνει πάντα στους δυτικούς βράχους...'");
    state.flags.talkedFisherman=true;
    if (!state.flags.compassTaken) { state.flags.compassTaken=true; addItem('compass'); }
    invalidateBg();
    return;
  }
  showText(`Δεν μπορείς να χρησιμοποιήσεις ${ITEM_NAMES[sel]} εκεί.`);
}

function handleTalk(hit) {
  switch(hit.id) {
    case 'fisherman':
      if (!state.flags.talkedFisherman) {
        if (hasItem('letter')) {
          // Dialog choices!
          showText("Ο ψαράς κοιτάει το γράμμα σας...");
          showDialog([
            { text: "Ξέρετε κάτι για τον Καπετάν Γαλαξειδιώτη;", callback: () => {
              showText("'Ο Καπετάν Γαλαξειδιώτης! Ήταν θρύλος! Πάρε την πυξίδα μου — δείχνει πάντα στους δυτικούς βράχους.'");
              state.flags.talkedFisherman=true;
              if (!state.flags.compassTaken) { state.flags.compassTaken=true; addItem('compass'); }
              invalidateBg();
            }},
            { text: "Μπορείτε να μας πάτε μια βόλτα με τη βάρκα;", callback: () => {
              showText("'Μόλις τελειώσετε την εξερεύνηση, ελάτε! Η Ελπίδα σας περιμένει στο λιμάνι!'");
              state.flags.talkedFisherman=true;
              if (!state.flags.compassTaken) { state.flags.compassTaken=true; addItem('compass'); }
              invalidateBg();
            }},
            { text: "Τι ψαρεύετε σήμερα;", callback: () => {
              showText("'Τσιπούρες και μπαρμπούνια! Αλλά μου φάνηκε πολύ πιο ενδιαφέρον αυτό το γράμμα... Πάρε, κράτα αυτή την πυξίδα!'");
              state.flags.talkedFisherman=true;
              if (!state.flags.compassTaken) { state.flags.compassTaken=true; addItem('compass'); }
              invalidateBg();
            }},
          ]);
        } else {
          showDialog([
            { text: "Καλημέρα! Ψάχνουμε για θησαυρό!", callback: () => {
              showText("'Χαχα! Θησαυρό; Αν βρείτε κάτι ενδιαφέρον στο χωριό, φέρτε μου το! Ξέρω κάθε πέτρα εδώ.'");
            }},
            { text: "Τι κάνετε εδώ κάθε μέρα;", callback: () => {
              showText("'Ψαρεύω εδώ 50 χρόνια, παιδί μου. Η θάλασσα μου τα λέει όλα.'");
            }},
          ]);
        }
      } else {
        showDialog([
          { text: "Πού είναι η σπηλιά;", callback: () => {
            showText("'Δυτικά, μετά την παραλία. Πάρτε φως — είναι σκοτεινά σαν μαύρη νύχτα!'");
          }},
          { text: "Θα ξαναέρθουμε!", callback: () => {
            showText("'Καλό κυνήγι, οικογένεια! Ο θησαυρός περιμένει τους γενναίους!'");
          }},
        ]);
      }
      return;
    case 'cat':
      AudioSystem.catMeow();
      showDialog([
        { text: "Γατούλα, ξέρεις πού είναι ο θησαυρός;", callback: () => {
          showText("'Μιααου!' Η γάτα γυρίζει αδιάφορα. 'Μπαμπά, η γάτα δεν βοηθάει καθόλου!' λέει η Κλειώ.");
        }},
        { text: "Μπαμπά, μπορούμε να την πάρουμε σπίτι;", callback: () => {
          showText("'Ανήκει εδώ, Κλειώ. Είναι η φύλακας της πλατείας.' Η γάτα γουργουρίζει σαν να συμφωνεί.");
        }},
      ]);
      return;
    case 'painting':
      showText("Ο Ντέμης λέει στα παιδιά: 'Αυτό ζωγραφίστηκε όταν το Γαλαξίδι ήταν μεγάλη ναυτική πόλη. Βλέπετε τα ψηλά κατάρτια; Εκατοντάδες πλοία ξεκινούσαν από εδώ.'");
      return;
    case 'boat1':
      showText("'Ωχόι!' φωνάζει ο Αίαντας στην άδεια βάρκα. Κανείς δεν απαντάει. Τα δίχτυα μυρίζουν αλάτι και περιπέτεια.");
      return;
    // New scenes
    case 'monk':
      if (!state.flags.talkedMonk) {
        showDialog([
          { text: "Παππούλη, τι ξέρετε για τον Καπετάν Γαλαξειδιώτη;", callback: () => {
            showText("'Ο Γαλαξειδιώτης ήταν άνθρωπος του Θεού. Ο θησαυρός του δεν ήταν χρυσός — ήταν η αγάπη για την οικογένειά του. Αλλά ναι, είχε και χρυσό.'");
            state.flags.talkedMonk = true;
          }},
          { text: "Τι σημαίνουν οι εικόνες;", callback: () => {
            showText("'Ο Άγιος Νικόλαος, ο προστάτης μας. Κάθε ναυτικό ταξίδι ξεκινούσε με προσευχή εδώ. Η θάλασσα σέβεται τους ευλαβείς.'");
            state.flags.talkedMonk = true;
          }},
          { text: "Μπορούμε ν' ανάψουμε ένα κερί;", callback: () => {
            showText("'Φυσικά, παιδί μου. Κάθε κερί φέρνει φως στον κόσμο.' Η Κλειώ ανάβει ένα κεράκι προσεκτικά.");
            state.flags.litCandle = true; state.flags.talkedMonk = true;
            invalidateBg();
          }},
        ]);
      } else {
        showText("'Ο Θεός να σας ευλογεί, παιδιά μου. Να προσέχετε στη σπηλιά!'");
      }
      return;
    default: showText("Δεν υπάρχει κανείς εκεί για να μιλήσεις."); return;
  }
}

// ============================================================
// GAME LOOP
// ============================================================

