/* Imposter pass-the-phone word game. No backend, fully offline.
   Flow: setup -> reveal (pass phone) -> round complete -> next word. */
(function () {
  "use strict";

  /* ---------- Word data ----------
     Each entry: { word, hints[] }. Crewmates see `word`; each imposter gets a
     DIFFERENT hint. Words AND hints can be single words OR short phrases, in
     English or Nepali. Hints loosely point at the answer without giving it away.
     Words are kept fun + recognisable (no need to google them). 6 hints each. */
  const CATEGORIES = {
    "🍛 Nepali Food": [
      { word: "Momo", hints: ["popular", "share", "craving", "weekend", "steamy", "dumpling"] },
      { word: "Dal Bhat", hints: ["everyday", "filling", "home", "energy", "routine", "staple"] },
      { word: "Sel Roti", hints: ["festive", "homemade", "ring", "sweet", "fried", "treat"] },
      { word: "Chiya", hints: ["break", "warm", "morning", "gossip", "milk", "shop"] },
      { word: "Sekuwa", hints: ["evening", "smoky", "grilled", "skewer", "flavor", "outing"] },
      { word: "Chowmein", hints: ["quick", "stall", "noodles", "takeaway", "spicy", "fried"] },
      { word: "Thukpa", hints: ["winter", "soup", "noodles", "hills", "cozy", "warm"] },
      { word: "Gundruk", hints: ["village", "sour", "tangy", "dried", "greens", "earthy"] },
      { word: "Pani Puri", hints: ["roadside", "crunchy", "water", "spicy", "messy", "queue"] },
      { word: "Juju Dhau", hints: ["creamy", "yogurt", "royal", "rich", "dessert", "Bhaktapur"] },
      { word: "Samosa", hints: ["triangle", "fried", "potato", "tea-time", "crispy", "street snack"] },
      { word: "Bara", hints: ["lentil", "fried", "Newari", "round", "savory", "festival food"] },
      { word: "Yomari", hints: ["sweet", "steamed", "Newari", "molasses", "festival", "shaped"] },
      { word: "Chatamari", hints: ["rice crepe", "Newari", "thin", "topping", "savory", "pizza-like"] },
      { word: "Aloo Tama", hints: ["bamboo", "potato", "tangy", "curry", "sour", "monsoon"] },
      { word: "Kwati", hints: ["nine beans", "soup", "festival", "sprouted", "hearty", "monsoon"] },
      { word: "Dhido", hints: ["thick", "millet", "no spoon", "village", "filling", "traditional"] },
      { word: "Sukuti", hints: ["dried meat", "chewy", "spicy", "snack", "tough", "side"] },
      { word: "Lassi", hints: ["yogurt", "sweet", "drink", "cooling", "summer", "blended"] },
      { word: "Jalebi", hints: ["spiral", "sweet", "orange", "syrup", "crispy", "morning treat"] },
    ],
    "📍 Places in Nepal": [
      { word: "Pashupatinath", hints: ["sacred", "temple", "incense", "ancient", "river", "devotion"] },
      { word: "Pokhara", hints: ["scenic", "lake", "getaway", "views", "boats", "holiday"] },
      { word: "Thamel", hints: ["lively", "crowded", "shopping", "nightlife", "maze", "tourists"] },
      { word: "Boudhanath", hints: ["peaceful", "stupa", "circle", "monks", "eyes", "round"] },
      { word: "Everest", hints: ["tallest", "climb", "danger", "famous", "snow", "dream"] },
      { word: "Chitwan", hints: ["jungle", "safari", "green", "rhino", "river", "wild"] },
      { word: "Lumbini", hints: ["birthplace", "calm", "pilgrims", "garden", "peace", "sacred"] },
      { word: "Bhaktapur", hints: ["heritage", "ancient", "pottery", "square", "culture", "old"] },
      { word: "Phewa Lake", hints: ["calm", "boats", "reflection", "sunset", "water", "still"] },
      { word: "Mustang", hints: ["remote", "barren", "windy", "cliffs", "hidden", "rugged"] },
      { word: "Nagarkot", hints: ["sunrise", "hilltop", "viewpoint", "cold", "resort", "mountain view"] },
      { word: "Janakpur", hints: ["temple", "Mithila", "marriage", "Sita", "plains", "sacred city"] },
      { word: "Patan", hints: ["durbar square", "artisans", "Lalitpur", "temples", "metalwork", "old city"] },
      { word: "Swayambhu", hints: ["monkey temple", "hilltop", "stupa", "steps", "eyes", "viewpoint"] },
      { word: "Rara Lake", hints: ["biggest lake", "remote", "blue", "trek", "pristine", "far west"] },
      { word: "Ilam", hints: ["tea gardens", "green", "hills", "east", "misty", "plantation"] },
      { word: "Bandipur", hints: ["hilltop town", "old", "car-free", "Newari", "views", "charming"] },
      { word: "Annapurna", hints: ["trek", "range", "base camp", "peaks", "circuit", "Himalaya"] },
      { word: "Manakamana", hints: ["wish temple", "cable car", "hilltop", "goddess", "pilgrims", "ride up"] },
      { word: "Sarangkot", hints: ["sunrise", "Pokhara", "paragliding", "viewpoint", "hilltop", "clouds"] },
    ],
    "🎉 Festivals": [
      { word: "Dashain", hints: ["family", "biggest", "reunion", "tika", "kites", "feast"] },
      { word: "Tihar", hints: ["lights", "sweets", "siblings", "dogs", "garland", "diyo"] },
      { word: "Holi", hints: ["colors", "water", "spring", "crowd", "playful", "wild"] },
      { word: "Teej", hints: ["women", "fasting", "red", "dance", "songs", "swing"] },
      { word: "Maghe Sankranti", hints: ["winter", "warmth", "yam", "ghee", "ritual", "family"] },
      { word: "Lhosar", hints: ["new year", "mountains", "feast", "dance", "monks", "tradition"] },
      { word: "Buddha Jayanti", hints: ["peace", "monks", "candles", "calm", "wisdom", "serene"] },
      { word: "Saraswati Puja", hints: ["students", "books", "blessing", "spring", "white", "knowledge"] },
      { word: "Indra Jatra", hints: ["Kathmandu", "masked dance", "chariot", "Kumari", "rain god", "crowd"] },
      { word: "Gai Jatra", hints: ["cow", "humor", "remembrance", "satire", "procession", "Newari"] },
      { word: "Janai Purnima", hints: ["sacred thread", "wrist", "full moon", "Kwati", "tie", "blessing"] },
      { word: "Chhath", hints: ["sun god", "river", "fasting", "Terai", "offerings", "dawn"] },
      { word: "Shivaratri", hints: ["Shiva", "night", "Pashupatinath", "sadhus", "fasting", "bonfire"] },
      { word: "Bisket Jatra", hints: ["Bhaktapur", "chariot", "new year", "tug", "pole", "crowd"] },
      { word: "Krishna Janmashtami", hints: ["Krishna", "midnight", "blue god", "fasting", "temple", "birth"] },
      { word: "Christmas", hints: ["December", "tree", "gifts", "Santa", "lights", "carols"] },
    ],
    "🐯 Animals": [
      { word: "Yak", hints: ["highland", "hairy", "cold", "mountain", "sturdy", "horns"] },
      { word: "Rhino", hints: ["horn", "heavy", "armor", "rare", "tough", "grassland"] },
      { word: "Tiger", hints: ["stripes", "wild", "roar", "hunter", "powerful", "feared"] },
      { word: "Buffalo", hints: ["sturdy", "village", "milk", "horns", "calm", "field"] },
      { word: "Monkey", hints: ["clever", "playful", "tail", "tree", "quick", "cheeky"] },
      { word: "Elephant", hints: ["trunk", "huge", "memory", "ears", "strong", "tusk"] },
      { word: "Goat", hints: ["bleat", "village", "horns", "beard", "festive", "hill"] },
      { word: "Rooster", hints: ["dawn", "crow", "comb", "farm", "colorful", "alarm"] },
      { word: "Red Panda", hints: ["shy", "rare", "cute", "bamboo", "tail", "endangered"] },
      { word: "Snow Leopard", hints: ["rare", "mountains", "spotted", "elusive", "Himalaya", "ghost cat"] },
      { word: "Peacock", hints: ["feathers", "dance", "blue", "rain", "colorful", "fan"] },
      { word: "Crocodile", hints: ["river", "jaws", "scaly", "ancient", "snap", "lurking"] },
      { word: "Deer", hints: ["antlers", "forest", "shy", "graceful", "spotted", "prey"] },
      { word: "Bear", hints: ["furry", "honey", "hibernate", "strong", "forest", "cuddly toy"] },
      { word: "Owl", hints: ["night", "wise", "hoot", "big eyes", "silent", "turns head"] },
      { word: "Snake", hints: ["slither", "venom", "scales", "no legs", "hiss", "long"] },
      { word: "Parrot", hints: ["green", "talks", "beak", "mimic", "cage", "colorful"] },
      { word: "Crane", hints: ["bird", "tall", "lifts", "wetland", "long neck", "machine"] },
      { word: "Bat", hints: ["night", "flies", "cave", "blind", "wings", "hangs upside down"] },
    ],
    "🪔 Daily Life": [
      { word: "Dhaka Topi", hints: ["hat", "formal", "pride", "pattern", "cultural", "occasion"] },
      { word: "Khukuri", hints: ["blade", "curved", "brave", "symbol", "soldier", "sheath"] },
      { word: "Load Shedding", hints: ["dark", "power-cut", "schedule", "candle", "backup", "wait"] },
      { word: "Tempo", hints: ["commute", "shared", "three-wheel", "city", "crowded", "electric"] },
      { word: "Rickshaw", hints: ["pedal", "old", "ride", "narrow", "cheap", "slow"] },
      { word: "Prayer Flag", hints: ["colorful", "windy", "rooftop", "blessing", "high", "string"] },
      { word: "Marigold", hints: ["orange", "festive", "garland", "fragrant", "worship", "cheerful"] },
      { word: "Rudraksha", hints: ["beads", "sacred", "worn", "neck", "faith", "natural"] },
      { word: "Singing Bowl", hints: ["ring", "metal", "souvenir", "meditation", "hum", "resonant"] },
      { word: "Pressure Cooker", hints: ["whistle", "fast", "steam", "rice", "lid", "kitchen"] },
      { word: "Thermos", hints: ["hot", "flask", "keeps warm", "tea", "travel", "insulated"] },
      { word: "Mosquito Net", hints: ["bed", "holes", "protection", "night", "summer", "tucked in"] },
      { word: "Sewing Machine", hints: ["stitch", "thread", "tailor", "pedal", "cloth", "needle"] },
      { word: "Ceiling Fan", hints: ["spin", "summer", "blades", "breeze", "switch", "overhead"] },
      { word: "Padlock", hints: ["key", "metal", "secure", "gate", "click", "loop"] },
      { word: "Torch", hints: ["light", "battery", "dark", "handheld", "beam", "power-cut"] },
      { word: "Inverter", hints: ["backup", "battery", "power-cut", "electricity", "store", "switch"] },
      { word: "Gas Cylinder", hints: ["cooking", "heavy", "red", "refill", "stove", "delivery"] },
      { word: "Doormat", hints: ["entrance", "wipe", "feet", "welcome", "dust", "floor"] },
    ],
    "🏏 Sports & Games": [
      { word: "Cricket", hints: ["bat", "ball", "wicket", "national craze", "over", "boundary"] },
      { word: "Kabaddi", hints: ["raid", "hold breath", "tackle", "chant", "team", "mat"] },
      { word: "Dandi Biyo", hints: ["two sticks", "flick", "old game", "rural", "field", "childhood"] },
      { word: "Carrom", hints: ["board", "striker", "flick", "powder", "pocket", "corners"] },
      { word: "Ludo", hints: ["dice", "tokens", "four colors", "board", "luck", "race home"] },
      { word: "Chess", hints: ["king", "strategy", "checkmate", "board", "quiet", "64 squares"] },
      { word: "Kite", hints: ["string", "sky", "Dashain", "dogfight", "windy", "soar"] },
      { word: "Badminton", hints: ["shuttle", "racket", "net", "light", "smash", "backyard"] },
      { word: "Table Tennis", hints: ["paddle", "small ball", "net", "fast", "ping pong", "spin"] },
      { word: "Marbles", hints: ["glass", "aim", "ground", "childhood", "collect", "flick"] },
      { word: "Hide and Seek", hints: ["count", "hide", "seek", "kids", "corners", "found"] },
      { word: "Tug of War", hints: ["rope", "pull", "teams", "strength", "line", "heave"] },
      { word: "Snakes and Ladders", hints: ["dice", "climb", "slide", "board", "luck", "numbers"] },
      { word: "Bagh Chal", hints: ["tiger and goat", "board", "trap", "Nepali", "strategy", "capture"] },
      { word: "Skipping Rope", hints: ["jump", "rope", "count", "exercise", "childhood", "swing"] },
      { word: "Spinning Top", hints: ["lattu", "spin", "string", "wooden", "balance", "twirl"] },
      { word: "Arm Wrestling", hints: ["table", "grip", "strength", "push down", "elbow", "duel"] },
    ],
    "🏠 Around the House": [
      { word: "Chair", hints: ["sit", "legs", "wood", "seat", "desk", "rest"] },
      { word: "Table", hints: ["flat", "eat", "legs", "wood", "dinner", "surface"] },
      { word: "Mirror", hints: ["glass", "look", "face", "wall", "shiny", "reflect"] },
      { word: "Pillow", hints: ["soft", "sleep", "bed", "head", "fluffy", "rest"] },
      { word: "Bucket", hints: ["water", "plastic", "carry", "fill", "handle", "round"] },
      { word: "Clock", hints: ["time", "tick", "wall", "hands", "hour", "round"] },
      { word: "Window", hints: ["glass", "view", "open", "light", "frame", "outside"] },
      { word: "Blanket", hints: ["warm", "bed", "cozy", "winter", "cover", "soft"] },
      { word: "Candle", hints: ["wax", "flame", "light", "melt", "birthday", "glow"] },
      { word: "Umbrella", hints: ["rain", "open", "handle", "cover", "wet", "fold"] },
      { word: "Soap", hints: ["wash", "bubbles", "clean", "slippery", "bath", "foam"] },
      { word: "Towel", hints: ["dry", "soft", "bath", "wipe", "cotton", "hang"] },
      { word: "Broom", hints: ["sweep", "floor", "dust", "bristles", "clean", "corner"] },
      { word: "Comb", hints: ["hair", "teeth", "part", "pocket", "groom", "plastic"] },
      { word: "Scissors", hints: ["cut", "two blades", "paper", "sharp", "snip", "craft"] },
      { word: "Key", hints: ["lock", "metal", "pocket", "open", "answer", "ring"] },
      { word: "Ladder", hints: ["climb", "steps", "reach", "tall", "rungs", "lean"] },
      { word: "Curtain", hints: ["window", "cloth", "privacy", "draw", "stage", "hang"] },
      { word: "Stairs", hints: ["climb", "steps", "up and down", "floors", "railing", "steep"] },
      { word: "Kettle", hints: ["boil", "water", "spout", "tea", "whistle", "electric"] },
      { word: "Fridge", hints: ["cold", "food", "kitchen", "door", "milk", "preserve"] },
      { word: "Switch", hints: ["on off", "light", "flip", "wall", "toggle", "change"] },
    ],
    "🍎 Fruits & Veggies": [
      { word: "Apple", hints: ["red", "crunchy", "tree", "healthy", "juice", "round"] },
      { word: "Mango", hints: ["sweet", "summer", "juicy", "king", "pulp", "yellow"] },
      { word: "Orange", hints: ["round", "juicy", "peel", "citrus", "vitamin", "segments"] },
      { word: "Onion", hints: ["layers", "tears", "cook", "sharp", "round", "smell"] },
      { word: "Potato", hints: ["brown", "fry", "root", "mash", "common", "chips"] },
      { word: "Tomato", hints: ["red", "sauce", "round", "salad", "juicy", "soft"] },
      { word: "Lemon", hints: ["sour", "yellow", "juice", "small", "citrus", "tangy"] },
      { word: "Carrot", hints: ["orange", "crunchy", "root", "rabbit", "healthy", "long"] },
      { word: "Garlic", hints: ["smell", "cloves", "cook", "strong", "white", "flavor"] },
      { word: "Grapes", hints: ["bunch", "small", "sweet", "vine", "round", "juicy"] },
      { word: "Coconut", hints: ["hard", "water", "white", "tree", "shell", "tropical"] },
      { word: "Pineapple", hints: ["spiky", "tropical", "crown", "sweet-sour", "yellow", "juicy"] },
      { word: "Watermelon", hints: ["summer", "green outside", "red inside", "seeds", "big", "refreshing"] },
      { word: "Pomegranate", hints: ["red seeds", "jewels", "juice", "tough skin", "healthy", "burst"] },
      { word: "Guava", hints: ["green", "seeds", "crunchy", "winter", "cheap", "fragrant"] },
      { word: "Papaya", hints: ["orange flesh", "soft", "tropical", "digestion", "seeds", "ripe"] },
      { word: "Pumpkin", hints: ["orange", "big", "curry", "lantern", "seeds", "round"] },
      { word: "Cauliflower", hints: ["white", "florets", "curry", "winter", "vegetable", "head"] },
      { word: "Chili", hints: ["hot", "spicy", "red or green", "tiny", "burn", "pepper"] },
      { word: "Ginger", hints: ["root", "spicy", "tea", "warming", "knobby", "medicine"] },
      { word: "Sugarcane", hints: ["sweet", "stalk", "juice", "chew", "tall", "fields"] },
      { word: "Cucumber", hints: ["green", "cool", "salad", "long", "crunchy", "watery"] },
    ],
    "👷 Jobs & People": [
      { word: "Doctor", hints: ["hospital", "sick", "cure", "coat", "patient", "medicine"] },
      { word: "Teacher", hints: ["school", "lesson", "board", "students", "learn", "exam"] },
      { word: "Driver", hints: ["car", "road", "wheel", "travel", "license", "seat"] },
      { word: "Farmer", hints: ["field", "crops", "soil", "harvest", "village", "plow"] },
      { word: "Police", hints: ["uniform", "law", "safety", "crime", "badge", "whistle"] },
      { word: "Cook", hints: ["kitchen", "food", "recipe", "heat", "taste", "chef"] },
      { word: "Singer", hints: ["voice", "song", "stage", "mic", "fans", "melody"] },
      { word: "Pilot", hints: ["plane", "sky", "fly", "airport", "cockpit", "travel"] },
      { word: "Barber", hints: ["hair", "cut", "scissors", "shave", "chair", "shop"] },
      { word: "Tailor", hints: ["cloth", "sew", "measure", "needle", "stitch", "shop"] },
      { word: "Painter", hints: ["brush", "color", "wall", "art", "paint", "canvas"] },
      { word: "Nurse", hints: ["hospital", "care", "patient", "injection", "kind", "shift"] },
      { word: "Electrician", hints: ["wires", "power", "fix", "shock", "switch", "skilled"] },
      { word: "Carpenter", hints: ["wood", "saw", "furniture", "nails", "build", "hammer"] },
      { word: "Mechanic", hints: ["engine", "grease", "fix", "garage", "tools", "vehicle"] },
      { word: "Journalist", hints: ["news", "report", "write", "questions", "press", "story"] },
      { word: "Photographer", hints: ["camera", "click", "poses", "light", "capture", "album"] },
      { word: "Dentist", hints: ["teeth", "drill", "chair", "clean", "cavity", "smile"] },
      { word: "Soldier", hints: ["uniform", "army", "duty", "border", "brave", "march"] },
      { word: "Postman", hints: ["letters", "deliver", "bag", "address", "door", "mail"] },
      { word: "Shopkeeper", hints: ["counter", "sell", "goods", "price", "customers", "store"] },
      { word: "Porter", hints: ["carry", "load", "trek", "mountains", "heavy", "Sherpa"] },
    ],
    "📱 Phone & Tech": [
      { word: "Mobile", hints: ["call", "screen", "pocket", "apps", "touch", "signal"] },
      { word: "Charger", hints: ["cable", "plug", "battery", "power", "socket", "refill"] },
      { word: "Wifi", hints: ["internet", "signal", "password", "router", "connect", "wireless"] },
      { word: "Selfie", hints: ["front", "pose", "photo", "smile", "camera", "post"] },
      { word: "Password", hints: ["secret", "login", "type", "secure", "hidden", "code"] },
      { word: "Camera", hints: ["photo", "lens", "click", "zoom", "capture", "picture"] },
      { word: "Battery", hints: ["power", "charge", "drain", "percent", "energy", "low"] },
      { word: "Bluetooth", hints: ["wireless", "connect", "pair", "speaker", "share", "near"] },
      { word: "Screenshot", hints: ["capture", "screen", "save", "image", "button", "share"] },
      { word: "Headphone", hints: ["ears", "music", "sound", "wire", "listen", "plug"] },
      { word: "Alarm", hints: ["wake", "ring", "morning", "time", "loud", "snooze"] },
      { word: "Emoji", hints: ["smiley", "chat", "icon", "feeling", "yellow", "message"] },
      { word: "Power Bank", hints: ["portable", "charge", "backup", "battery", "pocket", "travel"] },
      { word: "SIM Card", hints: ["tiny", "number", "network", "slot", "carrier", "mobile"] },
      { word: "Hotspot", hints: ["share", "internet", "tether", "mobile data", "connect", "signal"] },
      { word: "Video Call", hints: ["face", "screen", "talk", "camera", "far apart", "online"] },
      { word: "QR Code", hints: ["scan", "square", "black white", "payment", "menu", "quick"] },
      { word: "Speaker", hints: ["sound", "loud", "music", "box", "bass", "volume"] },
      { word: "Earbuds", hints: ["wireless", "ears", "tiny", "music", "pair", "case"] },
      { word: "Ringtone", hints: ["call", "sound", "melody", "loud", "custom", "alert"] },
      { word: "Wallpaper", hints: ["background", "screen", "picture", "home", "personal", "photo"] },
      { word: "Notification", hints: ["ping", "alert", "badge", "pop up", "unread", "swipe"] },
    ],
    "🌦️ Nature & Weather": [
      { word: "Rain", hints: ["wet", "cloud", "drops", "umbrella", "monsoon", "splash"] },
      { word: "Cloud", hints: ["sky", "white", "float", "fluffy", "rain", "grey"] },
      { word: "River", hints: ["flow", "water", "fish", "bridge", "long", "current"] },
      { word: "Mountain", hints: ["tall", "climb", "snow", "peak", "rock", "high"] },
      { word: "Forest", hints: ["trees", "green", "animals", "dense", "wild", "quiet"] },
      { word: "Sun", hints: ["hot", "bright", "day", "yellow", "sky", "light"] },
      { word: "Moon", hints: ["night", "white", "glow", "sky", "round", "dark"] },
      { word: "Storm", hints: ["wind", "thunder", "scary", "rain", "dark", "loud"] },
      { word: "Rainbow", hints: ["colors", "arch", "sky", "rain", "seven", "pretty"] },
      { word: "Snow", hints: ["white", "cold", "winter", "soft", "melt", "flakes"] },
      { word: "Wind", hints: ["blow", "cool", "unseen", "breeze", "fast", "air"] },
      { word: "Star", hints: ["night", "sky", "twinkle", "far", "bright", "wish"] },
      { word: "Thunder", hints: ["loud", "sky", "rumble", "storm", "boom", "after flash"] },
      { word: "Fog", hints: ["misty", "low", "cloud", "winter morning", "blurry", "thick"] },
      { word: "Waterfall", hints: ["falling", "cliff", "spray", "loud", "scenic", "cascade"] },
      { word: "Volcano", hints: ["lava", "erupt", "mountain", "hot", "ash", "crater"] },
      { word: "Desert", hints: ["sand", "dry", "hot", "camel", "vast", "no water"] },
      { word: "Island", hints: ["water around", "beach", "isolated", "palm", "boat", "land"] },
      { word: "Cave", hints: ["dark", "underground", "bats", "echo", "explore", "hollow"] },
      { word: "Glacier", hints: ["ice", "slow", "mountain", "melt", "river source", "frozen"] },
      { word: "Lightning", hints: ["flash", "bolt", "sky", "fast", "strike", "electric"] },
      { word: "Spring", hints: ["season", "coil", "water source", "bounce", "flowers", "jump"] },
    ],
    "🔀 Two Meanings": [
      { word: "Bank", hints: ["money", "river", "save", "side", "store", "account"] },
      { word: "Mouse", hints: ["computer", "animal", "click", "cheese", "small", "squeak"] },
      { word: "Ring", hints: ["finger", "phone", "circle", "boxing", "gold", "bell"] },
      { word: "Note", hints: ["music", "money", "write", "reminder", "paper", "tone"] },
      { word: "Bridge", hints: ["river", "cross", "connect", "teeth", "game", "span"] },
      { word: "Glass", hints: ["drink", "window", "mirror", "fragile", "clear", "cup"] },
      { word: "Court", hints: ["tennis", "king", "law", "judge", "royal", "game"] },
      { word: "Wave", hints: ["sea", "hand", "hello", "physics", "crowd", "ripple"] },
      { word: "Date", hints: ["calendar", "fruit", "romance", "day", "appointment", "sweet"] },
      { word: "Letter", hints: ["alphabet", "mail", "write", "envelope", "A to Z", "post"] },
      { word: "Train", hints: ["railway", "practice", "coach", "track", "exercise", "journey"] },
      { word: "Rock", hints: ["stone", "music", "hard", "sway", "mountain", "band"] },
      { word: "Match", hints: ["fire", "game", "pair", "cricket", "strike", "same"] },
      { word: "Current", hints: ["electric", "river", "present", "flow", "now", "trend"] },
      { word: "Seal", hints: ["animal", "stamp", "close", "official", "wax", "secure"] },
      { word: "Trunk", hints: ["elephant", "tree", "car", "box", "luggage", "nose"] },
      { word: "Bolt", hints: ["lightning", "lock", "runner", "screw", "fast", "bar"] },
      { word: "Palm", hints: ["hand", "tree", "beach", "read", "coconut", "line"] },
    ],
    "💼 Office & Software": [
      { word: "Excel", hints: ["spreadsheet", "cells", "formula", "rows", "green", "numbers"] },
      { word: "Email", hints: ["inbox", "send", "@", "compose", "reply", "message"] },
      { word: "Zoom", hints: ["video call", "meeting", "mute", "screen share", "online", "camera"] },
      { word: "Printer", hints: ["paper", "ink", "print", "jam", "office", "copies"] },
      { word: "Meeting", hints: ["agenda", "gather", "discuss", "table", "long", "schedule"] },
      { word: "Deadline", hints: ["due", "rush", "pressure", "date", "finish", "stress"] },
      { word: "Spreadsheet", hints: ["rows", "columns", "data", "Excel", "numbers", "grid"] },
      { word: "Presentation", hints: ["slides", "present", "audience", "projector", "speak", "PowerPoint"] },
      { word: "Stapler", hints: ["staple", "paper", "desk", "click", "pin", "metal"] },
      { word: "Whiteboard", hints: ["marker", "write", "wipe", "wall", "brainstorm", "board"] },
      { word: "Coffee Break", hints: ["pause", "rest", "caffeine", "chat", "short", "refresh"] },
      { word: "Salary", hints: ["payday", "money", "monthly", "earn", "bank", "income"] },
      { word: "Resume", hints: ["CV", "apply", "experience", "skills", "one page", "job"] },
      { word: "PDF File", hints: ["document", "read-only", "share", "format", "attach", "open"] },
      { word: "WhatsApp", hints: ["chat", "green", "message", "groups", "calls", "status"] },
      { word: "YouTube", hints: ["videos", "watch", "subscribe", "red", "channel", "play"] },
      { word: "Calculator", hints: ["numbers", "add", "buttons", "math", "total", "compute"] },
      { word: "Photocopy", hints: ["copy", "machine", "paper", "duplicate", "scan", "office"] },
      { word: "Boss", hints: ["manager", "incharge", "cabin", "orders", "approve", "senior"] },
      { word: "Sticky Note", hints: ["yellow", "reminder", "stick", "small", "desk", "post-it"] },
    ],
    "🚌 Everyday Combos": [
      { word: "School Bus", hints: ["yellow", "kids", "morning", "pickup", "wheels", "uniform"] },
      { word: "Ice Cream", hints: ["cold", "sweet", "cone", "summer", "melt", "scoop"] },
      { word: "Traffic Jam", hints: ["stuck", "horns", "slow", "cars", "rush hour", "wait"] },
      { word: "Birthday Party", hints: ["cake", "candles", "gifts", "balloons", "friends", "celebrate"] },
      { word: "Petrol Pump", hints: ["fuel", "fill", "station", "queue", "price", "vehicle"] },
      { word: "Tea Shop", hints: ["chiya", "corner", "gossip", "glass", "snacks", "roadside"] },
      { word: "Swimming Pool", hints: ["water", "dive", "blue", "splash", "summer", "laps"] },
      { word: "Movie Theatre", hints: ["screen", "popcorn", "dark", "tickets", "seats", "film"] },
      { word: "Shopping Mall", hints: ["shops", "escalator", "brands", "crowd", "AC", "food court"] },
      { word: "Fire Truck", hints: ["red", "siren", "hose", "emergency", "ladder", "rescue"] },
      { word: "Post Office", hints: ["letters", "stamps", "parcel", "mail", "counter", "send"] },
      { word: "Zebra Crossing", hints: ["stripes", "road", "cross", "white", "pedestrian", "stop"] },
      { word: "Traffic Light", hints: ["red", "green", "signal", "stop", "junction", "wait"] },
      { word: "Water Bottle", hints: ["drink", "plastic", "cap", "carry", "refill", "thirsty"] },
      { word: "Rain Coat", hints: ["wet", "monsoon", "plastic", "cover", "hood", "dry"] },
      { word: "Window Seat", hints: ["view", "bus", "favorite", "outside", "breeze", "travel"] },
      { word: "Full Moon", hints: ["bright", "night", "round", "festival", "glow", "monthly"] },
      { word: "Frying Pan", hints: ["cook", "oil", "kitchen", "flat", "handle", "fry"] },
      { word: "Living Room", hints: ["sofa", "TV", "family", "guests", "relax", "home"] },
      { word: "Speed Breaker", hints: ["bump", "slow", "road", "jolt", "yellow", "brake"] },
    ],
    "🇳🇵 नेपाली शब्द": [
      { word: "घर", hints: ["परिवार", "ढोका", "छत", "न्यानो", "बस्ने", "आफ्नो"] },
      { word: "पानी", hints: ["तिर्खा", "नदी", "सफा", "पिउने", "चिसो", "जीवन"] },
      { word: "किताब", hints: ["पढ्ने", "ज्ञान", "पाना", "कथा", "अक्षर", "विद्यालय"] },
      { word: "मोबाइल", hints: ["फोन", "म्यासेज", "ब्याट्री", "छुने", "इन्टरनेट", "सेल्फी"] },
      { word: "घडी", hints: ["समय", "घन्टा", "सुई", "बिहान", "हात", "बज्यो"] },
      { word: "झोला", hints: ["बोक्ने", "किनमेल", "काँध", "सामान", "यात्रा", "किताब"] },
      { word: "जुत्ता", hints: ["खुट्टा", "हिँड्ने", "फित्ता", "जोडी", "बाटो", "लगाउने"] },
      { word: "छाता", hints: ["पानी", "ओत", "खोल्ने", "भिज्ने", "बादल", "बोक्ने"] },
      { word: "साइकल", hints: ["चलाउने", "घन्टी", "दुईचक्के", "तेज", "बाटो", "सन्तुलन"] },
      { word: "दूध", hints: ["सेतो", "गाई", "चिया", "पिउने", "बिहान", "बलियो"] },
      { word: "चिया", hints: ["तातो", "चिनी", "बिहान", "कप", "गफ", "ताजा"] },
      { word: "फूल", hints: ["राम्रो", "बास्ना", "बगैंचा", "रंगीन", "माला", "पूजा"] },
      { word: "आकाश", hints: ["निलो", "माथि", "बादल", "फराकिलो", "तारा", "खुला"] },
      { word: "घाम", hints: ["तातो", "उज्यालो", "बिहान", "पहेँलो", "किरण", "दिन"] },
      { word: "रुख", hints: ["हरियो", "हाँगा", "छाया", "फल", "जरा", "अग्लो"] },
      { word: "माछा", hints: ["पानी", "पौडी", "जाल", "पुच्छर", "भिजेको", "नदी"] },
      { word: "चरा", hints: ["उड्ने", "प्वाँख", "गुँड", "चिरबिर", "आकाश", "सानो"] },
      { word: "कलम", hints: ["लेख्ने", "मसी", "हात", "कापी", "विद्यार्थी", "सानो"] },
      { word: "भात", hints: ["खाना", "सेतो", "दाल", "पकाउने", "अन्न", "पेट"] },
      { word: "आगो", hints: ["तातो", "बल्ने", "रातो", "डढ्ने", "धुवाँ", "खतरा"] },
      { word: "बत्ती", hints: ["उज्यालो", "बल्ने", "साँझ", "स्विच", "दियो", "अँध्यारो"] },
      { word: "बाटो", hints: ["हिँड्ने", "लामो", "गाडी", "यात्रा", "दायाँबायाँ", "गन्तव्य"] },
      { word: "हात", hints: ["औंला", "समाउने", "दुई", "नमस्ते", "काम", "नङ"] },
      { word: "मन", hints: ["भावना", "सोच", "माया", "खुसी", "भित्र", "इच्छा"] },
    ],
    "💬 Sayings & Phrases": [
      { word: "Good Morning", hints: ["greeting", "wake", "early", "polite", "sunrise", "hello"] },
      { word: "Thank You", hints: ["grateful", "polite", "gift", "please", "kind", "manners"] },
      { word: "Happy Birthday", hints: ["cake", "candles", "song", "party", "year", "wish"] },
      { word: "Well Done", hints: ["praise", "clap", "success", "proud", "great", "job"] },
      { word: "Good Luck", hints: ["wish", "exam", "hope", "charm", "before", "fingers"] },
      { word: "Take Care", hints: ["goodbye", "health", "safe", "gentle", "leaving", "concern"] },
      { word: "No Problem", hints: ["easy", "fine", "relax", "okay", "sure", "calm"] },
      { word: "Piece of Cake", hints: ["easy", "simple", "breeze", "light", "quick", "effortless"] },
      { word: "Break a Leg", hints: ["theatre", "stage", "luck", "perform", "actor", "show"] },
      { word: "See You", hints: ["later", "bye", "soon", "leaving", "again", "wave"] },
      { word: "Spill the Beans", hints: ["secret", "reveal", "gossip", "tell", "leak", "oops"] },
      { word: "Hit the Sack", hints: ["sleep", "bed", "tired", "night", "rest", "goodnight"] },
      { word: "Under the Weather", hints: ["sick", "unwell", "cold", "tired", "ill", "off"] },
      { word: "Bite the Bullet", hints: ["brave", "endure", "tough", "just do it", "painful", "face it"] },
      { word: "Call it a Day", hints: ["stop", "finish", "enough", "done", "go home", "wrap up"] },
      { word: "Pull Your Leg", hints: ["joke", "tease", "kidding", "fool", "prank", "not serious"] },
      { word: "Out of the Blue", hints: ["sudden", "surprise", "unexpected", "random", "shock", "suddenly"] },
      { word: "On Cloud Nine", hints: ["happy", "joy", "thrilled", "delighted", "floating", "ecstatic"] },
      { word: "Cold Feet", hints: ["nervous", "hesitate", "scared", "back out", "wedding", "doubt"] },
      { word: "Long Time No See", hints: ["greeting", "reunion", "missed", "ages", "hello again", "catch up"] },
    ],
    "🎬 Bollywood Stars": [
      { word: "Shah Rukh Khan", hints: ["King Khan", "romance", "DDLJ", "dimples", "Badshah", "Mumbai"] },
      { word: "Salman Khan", hints: ["Bhai", "Dabangg", "Being Human", "fitness", "Tiger", "bachelor"] },
      { word: "Aamir Khan", hints: ["perfectionist", "Dangal", "3 Idiots", "versatile", "PK", "method"] },
      { word: "Amitabh Bachchan", hints: ["Big B", "legend", "baritone", "KBC", "veteran", "tall"] },
      { word: "Hrithik Roshan", hints: ["Greek god", "dance", "Krrish", "green eyes", "fit", "charming"] },
      { word: "Akshay Kumar", hints: ["Khiladi", "action", "punctual", "comedy", "fit", "patriotic"] },
      { word: "Ranveer Singh", hints: ["energetic", "loud", "Gully Boy", "fashion", "Deepika", "lively"] },
      { word: "Ranbir Kapoor", hints: ["Kapoor", "Barfi", "Rockstar", "charming", "Alia", "family"] },
      { word: "Ajay Devgn", hints: ["intense", "Singham", "action", "calm", "stunts", "Kajol"] },
      { word: "Shahid Kapoor", hints: ["Kabir Singh", "dancer", "intense", "Jab We Met", "charming", "fit"] },
      { word: "Deepika Padukone", hints: ["Padmaavat", "tall", "graceful", "Ranveer", "queen", "actress"] },
      { word: "Priyanka Chopra", hints: ["global", "Miss World", "Quantico", "Nick", "desi girl", "singer"] },
      { word: "Alia Bhatt", hints: ["Gangubai", "young", "talented", "Ranbir", "Student", "star"] },
      { word: "Katrina Kaif", hints: ["beauty", "Sheila", "dance", "Tiger", "graceful", "fitness"] },
      { word: "Kareena Kapoor", hints: ["Bebo", "Poo", "Geet", "Saif", "Kapoor", "diva"] },
      { word: "Madhuri Dixit", hints: ["dhak dhak", "dance", "smile", "classic", "veteran", "graceful"] },
    ],
    "🌟 Famous Nepalis": [
      { word: "Tenzing Norgay", hints: ["Everest", "Sherpa", "1953", "Hillary", "summit", "mountaineer"] },
      { word: "Pasang Lhamu Sherpa", hints: ["Everest", "first woman", "Sherpa", "brave", "pioneer", "mountains"] },
      { word: "Prithvi Narayan Shah", hints: ["king", "unifier", "Gorkha", "founder", "history", "crown"] },
      { word: "Bhanubhakta Acharya", hints: ["poet", "Adikavi", "Ramayana", "language", "literature", "classic"] },
      { word: "Laxmi Prasad Devkota", hints: ["Mahakavi", "Muna Madan", "poet", "genius", "literature", "verses"] },
      { word: "Araniko", hints: ["architect", "artist", "pagoda", "China", "ancient", "builder"] },
      { word: "Narayan Gopal", hints: ["singer", "legend", "voice", "songs", "Swar Samrat", "classic"] },
      { word: "Aruna Lama", hints: ["singer", "nightingale", "melody", "hills", "voice", "classic"] },
      { word: "Rajesh Hamal", hints: ["actor", "Maha Nayak", "films", "hero", "veteran", "popular"] },
      { word: "Anmol KC", hints: ["actor", "young", "heartthrob", "films", "star", "new"] },
      { word: "Hari Bansha Acharya", hints: ["comedian", "MaHa", "humor", "actor", "beloved", "duo"] },
      { word: "Madan Krishna Shrestha", hints: ["comedian", "MaHa", "humor", "actor", "duo", "beloved"] },
      { word: "Sandeep Lamichhane", hints: ["cricket", "leg-spin", "young", "bowler", "talent", "national"] },
      { word: "Paras Khadka", hints: ["cricket", "captain", "allrounder", "leader", "national", "veteran"] },
      { word: "Mahabir Pun", hints: ["internet", "villages", "educator", "innovator", "Magsaysay", "tech"] },
      { word: "Anuradha Koirala", hints: ["Maiti Nepal", "social work", "women", "rescue", "CNN hero", "savior"] },
    ],
  };

  /* ---------- State ---------- */
  const cfg = { imposters: 1, category: "__ALL__", tellCount: 1, impKnows: 1 };
  const DEFAULT_PLAYERS = [
    "Aastha Sapkota", "Shanti Joshi", "Shreya Dahal", "Shreya Tamang",
    "Prastuti Khanal", "Prekshya Aryal", "Yagya Raj Bogati", "Sunil Raj Bogati",
    "Nischal Adhikari", "Irish Shilpakar", "Prashamsa Tamrakar", "Sachin chaudhary",
    "Dilip Adhikari",
  ];
  let players = DEFAULT_PLAYERS.slice(); // active roster (editor + running game)
  let round = null;                      // { word, roles, order }
  let reveal = { idx: 0, shown: false };
  let starterTimer = null;
  let lastImp = null;

  let lobbies = [];      // saved player groups
  let activeId = null;   // lobby being set up / played
  let editingId = null;  // lobby open in the editor (null = new)
  let editorReturn = "mygames";
  let curEmoji = "🎉", curColor = "#6d5df6";

  /* ---------- Persistence ---------- */
  const USED_KEY = "imposter_used_words_v1";
  const LOBBIES_KEY = "imposter_lobbies_v1";
  const STATS_KEY = "imposter_rounds_v1";
  const INTRO_KEY = "imposter_seen_intro_v1";
  const LOBBY_COLORS = ["#6d5df6", "#22c9a0", "#f5b83d", "#ef3b54", "#3b9dff", "#c471f5"];
  const EMOJIS = ["🎉", "🏢", "👥", "🎮", "🔥", "🌟"];

  function loadUsed() {
    try { return JSON.parse(localStorage.getItem(USED_KEY)) || []; } catch (e) { return []; }
  }
  function saveUsed(a) { try { localStorage.setItem(USED_KEY, JSON.stringify(a)); } catch (e) {} }
  let used = loadUsed();

  function uid() { return "L" + Math.random().toString(36).slice(2, 9); }
  function loadLobbies() {
    try { const r = JSON.parse(localStorage.getItem(LOBBIES_KEY)); if (Array.isArray(r) && r.length) return r; } catch (e) {}
    return null;
  }
  function saveLobbies() { try { localStorage.setItem(LOBBIES_KEY, JSON.stringify(lobbies)); } catch (e) {} }
  function seedLobbies() {
    return [
      { id: uid(), name: "Office Crew", emoji: "🏢", color: "#22c9a0",
        players: DEFAULT_PLAYERS.slice(), cfg: { imposters: 3, category: "__ALL__", tellCount: 1, impKnows: 1 } },
      { id: uid(), name: "Friends Night", emoji: "🎉", color: "#6d5df6",
        players: ["Aastha", "Dilip", "Irish", "Nischal", "Prashamsa", "Prekshya"], cfg: { imposters: 1, category: "__ALL__", tellCount: 1, impKnows: 1 } },
    ];
  }
  function roundsPlayed() { try { return parseInt(localStorage.getItem(STATS_KEY) || "0", 10) || 0; } catch (e) { return 0; } }
  function bumpRounds() { try { localStorage.setItem(STATS_KEY, String(roundsPlayed() + 1)); } catch (e) {} }
  function persistCfg() { const l = byId(activeId); if (l) { l.cfg = Object.assign({}, cfg); saveLobbies(); } }

  /* ---------- Helpers ---------- */
  const $ = (id) => document.getElementById(id);
  function byId(id) { return lobbies.find((x) => x.id === id) || null; }
  function playerName(i) { const n = players[i] && players[i].trim(); return n || ("Player " + (i + 1)); }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function hexA(hex, a) {
    const h = hex.replace("#", "");
    return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
  }
  function sortPlayers() {
    players.sort((a, b) => {
      const ta = (a || "").trim().toLowerCase(), tb = (b || "").trim().toLowerCase();
      if (!ta && !tb) return 0; if (!ta) return 1; if (!tb) return -1;
      return ta.localeCompare(tb);
    });
  }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function catLabel(c) { return c === "__ALL__" ? "Random" : c; }

  /* ---------- Navigation ---------- */
  const SCREENS = ["home", "mygames", "stats", "profile", "lobby", "setup", "reveal", "round"];
  const TABS = ["home", "mygames", "stats", "profile"];
  function go(name) {
    SCREENS.forEach((s) => $("screen-" + s).classList.toggle("active", s === name));
    $("tabbar").classList.toggle("show", TABS.indexOf(name) >= 0);
    const sc = $("screen-" + name).querySelector(".scroll");
    if (sc) sc.scrollTop = 0;
  }
  function setTab(tab) {
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === tab));
    if (tab === "home") { renderHome(); go("home"); }
    else if (tab === "mygames") { renderMyGames(); go("mygames"); }
    else if (tab === "stats") { renderStats(); go("stats"); }
    else if (tab === "profile") { renderProfile(); go("profile"); }
  }
  function openSheet(id) { $(id).classList.add("show"); }
  function closeSheet(id) { $(id).classList.remove("show"); }

  /* ---------- Home / lobby lists ---------- */
  function shade(hex, p) {
    const h = hex.replace("#", "");
    const c = (i) => Math.round(Math.min(255, Math.max(0, parseInt(h.slice(i, i + 2), 16) + 255 * p)));
    return `rgb(${c(0)},${c(2)},${c(4)})`;
  }
  // Every lobby card opens Game Setup; the pencil is the explicit edit affordance.
  function lobbyEl(l) {
    const n = l.players.length, im = Math.min(l.cfg.imposters, Math.max(1, Math.floor(n / 2)));
    const el = document.createElement("div");
    el.className = "lobby";
    el.innerHTML =
      `<span class="lobby-av" style="background:linear-gradient(135deg,${shade(l.color, 0.12)},${shade(l.color, -0.14)});color:#fff">${l.emoji || "👥"}</span>` +
      `<span style="min-width:0"><span class="lobby-nm">${escapeHtml(l.name)}</span>` +
      `<span class="lobby-meta"><span>${n} Players</span><span class="imp">${im} Imposter${im > 1 ? "s" : ""}</span></span></span>` +
      `<button class="lobby-edit" aria-label="Edit lobby">✎</button>` +
      `<span class="lobby-go">›</span>`;
    el.querySelector(".lobby-edit").addEventListener("click", (e) => { e.stopPropagation(); openEditor(l.id, "mygames"); });
    el.addEventListener("click", () => openSetup(l.id));
    return el;
  }
  function fillList(container) {
    container.innerHTML = "";
    if (!lobbies.length) { container.innerHTML = `<div class="empty">No lobbies yet. Tap the ＋ tab to create one.</div>`; return; }
    lobbies.forEach((l) => container.appendChild(lobbyEl(l)));
  }
  function renderHome() { fillList($("lobby-list")); }
  function renderMyGames() { fillList($("mygames-list")); }
  function renderStats() {
    const n = roundsPlayed();
    $("stat-rounds").textContent = n;
    $("stat-lobbies").textContent = lobbies.length;
    $("stats-count").textContent = n
      ? `${n} round${n > 1 ? "s" : ""} in. Keep the crew guessing.`
      : "Play a game and your history builds up here.";
  }
  function renderProfile() { $("prof-rounds").textContent = roundsPlayed(); }

  /* ---------- Lobby editor ---------- */
  function openEditor(id, ret) {
    editingId = id; editorReturn = ret || "mygames";
    const l = id ? byId(id) : null;
    players = l ? l.players.slice() : ["", "", "", "", ""];
    $("lobby-heading").textContent = l ? "Edit lobby" : "New lobby";
    $("lobby-name").value = l ? l.name : "";
    $("lobbyDelete").style.display = l ? "" : "none";
    curEmoji = l ? (l.emoji || "🎉") : "🎉";
    curColor = l ? (l.color || "#6d5df6") : "#6d5df6";
    renderEmojiPick();
    renderNames();
    validateLobby();
    go("lobby");
  }
  function renderEmojiPick() {
    const box = $("emoji-pick"); box.innerHTML = "";
    EMOJIS.forEach((e, i) => {
      const b = document.createElement("button"); b.type = "button"; b.textContent = e;
      b.className = "emoji-opt" + (e === curEmoji ? " sel" : "");
      b.addEventListener("click", () => { curEmoji = e; curColor = LOBBY_COLORS[i % LOBBY_COLORS.length]; renderEmojiPick(); });
      box.appendChild(b);
    });
  }
  function validateLobby() {
    const ok = ($("lobby-name").value || "").trim().length > 0;
    $("lobby-save").disabled = !ok;
    $("lobby-name-hint").textContent = ok ? "" : "Give your lobby a name to save it.";
    return ok;
  }
  function saveLobby() {
    if (!validateLobby()) { $("lobby-name").focus(); return; }
    sortPlayers();
    const name = ($("lobby-name").value || "").trim() || "New lobby";
    if (editingId) {
      const l = byId(editingId);
      l.name = name; l.players = players.slice(); l.emoji = curEmoji; l.color = curColor;
    } else {
      const id = uid();
      lobbies.unshift({ id: id, name: name, players: players.slice(), emoji: curEmoji, color: curColor,
        cfg: { imposters: 1, category: "__ALL__", tellCount: 1, impKnows: 1 } });
      editingId = id;
    }
    saveLobbies();
    if (editorReturn === "setup") openSetup(editingId); else setTab("mygames");
  }
  function deleteLobby() {
    if (!editingId) return;
    const l = byId(editingId);
    askConfirm(`Delete "${l ? l.name : "this lobby"}"?`,
      "The lobby and its players will be removed. This can't be undone.", "Delete", () => {
        lobbies = lobbies.filter((x) => x.id !== editingId);
        saveLobbies();
        setTab("mygames");
      });
  }
  let confirmAction = null;
  function askConfirm(title, msg, yesLabel, onYes) {
    $("confirm-title").textContent = title;
    $("confirm-msg").textContent = msg;
    $("confirm-yes").textContent = yesLabel || "Delete";
    confirmAction = onYes;
    $("confirm").classList.add("show");
  }

  function renderNames() {
    const list = $("name-list"); list.innerHTML = "";
    players.forEach((nm, i) => {
      const row = document.createElement("div"); row.className = "name-row";
      const seat = document.createElement("span"); seat.className = "seatnum"; seat.textContent = i + 1;
      const input = document.createElement("input");
      input.className = "name-input"; input.type = "text"; input.value = nm;
      input.placeholder = "Player " + (i + 1); input.maxLength = 18; input.autocomplete = "off";
      input.addEventListener("input", (e) => { players[i] = e.target.value; });
      input.addEventListener("blur", () => { sortPlayers(); renderNames(); });
      row.appendChild(seat); row.appendChild(input);
      if (players.length > 3) {
        const rm = document.createElement("button");
        rm.className = "rm"; rm.type = "button"; rm.textContent = "×"; rm.setAttribute("aria-label", "Remove player");
        rm.addEventListener("click", () => { players.splice(i, 1); renderNames(); });
        row.appendChild(rm);
      }
      list.appendChild(row);
    });
    $("pcount").textContent = players.length;
    $("add-player").disabled = players.length >= 15;
    const st = document.querySelector('.stepper[data-step="players"]');
    if (st) {
      st.querySelector('[data-d="-1"]').disabled = players.length <= 3;
      st.querySelector('[data-d="1"]').disabled = players.length >= 15;
    }
  }
  function addPlayer() {
    if (players.length >= 15) return;
    players.push(""); renderNames();
    const inputs = $("name-list").querySelectorAll(".name-input");
    if (inputs.length) inputs[inputs.length - 1].focus();
  }
  function setPlayerCount(n) {
    n = clamp(n, 3, 15);
    while (players.length < n) players.push("");
    while (players.length > n) {
      const empty = players.map((p, i) => (p && p.trim() ? -1 : i)).filter((i) => i >= 0).pop();
      players.splice(empty != null ? empty : players.length - 1, 1);
    }
    renderNames();
  }

  /* ---------- Game setup ---------- */
  function openSetup(id) {
    activeId = id;
    const l = byId(id); if (!l) return;
    Object.assign(cfg, l.cfg);
    if (cfg.category !== "__ALL__" && !(cfg.category in CATEGORIES)) cfg.category = "__ALL__";
    players = l.players.slice();
    renderSetup();
    go("setup");
  }
  function renderSetup() {
    const l = byId(activeId);
    $("setup-lobby-name").textContent = l ? l.name : "Ready to play";
    $("setup-pcount").textContent = players.length;
    $("deck-word").textContent = catLabel(cfg.category);
    applyCfgToToggles();
    syncSetup();
  }
  function syncSetup() {
    const maxImp = Math.max(1, Math.floor(players.length / 2));
    cfg.imposters = clamp(cfg.imposters, 1, maxImp);
    $("v-imposters").textContent = cfg.imposters;
    const rec = Math.max(1, Math.round(players.length / 5));
    $("imp-help").textContent = `Recommended: ${rec} · max ${maxImp}`;
    $("count-row").style.display = cfg.impKnows ? "" : "none";
    const st = document.querySelector('.stepper[data-step="imposters"]');
    if (st) {
      st.querySelector('[data-d="-1"]').disabled = cfg.imposters <= 1;
      st.querySelector('[data-d="1"]').disabled = cfg.imposters >= maxImp;
    }
    persistCfg();
  }
  function setToggle(id, attr, val) {
    $(id).querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset[attr] === String(val)));
  }
  function applyCfgToToggles() {
    setToggle("knowsToggle", "k", cfg.impKnows);
    setToggle("countToggle", "c", cfg.tellCount);
  }
  function bindToggle(id, attr, set) {
    const wrap = $(id);
    wrap.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        wrap.querySelectorAll("button").forEach((x) => x.classList.remove("on"));
        b.classList.add("on"); set(b.dataset[attr]);
      });
    });
  }
  function bindSteppers() {
    document.querySelectorAll(".stepper").forEach((st) => {
      st.querySelectorAll("button").forEach((b) => {
        b.addEventListener("click", () => {
          const key = st.dataset.step, d = parseInt(b.dataset.d, 10);
          if (key === "players") { setPlayerCount(players.length + d); return; }
          if (key === "imposters") { cfg.imposters = clamp(cfg.imposters + d, 1, Math.max(1, Math.floor(players.length / 2))); syncSetup(); }
        });
      });
    });
  }

  /* ---------- Category picker ---------- */
  function fillCatPicker() {
    const box = $("cat-options"); box.innerHTML = "";
    const opts = [["__ALL__", "🎲 Random (all)"]].concat(Object.keys(CATEGORIES).map((c) => [c, c]));
    opts.forEach(([val, label]) => {
      const b = document.createElement("button"); b.type = "button";
      b.className = "picker-opt" + (val === cfg.category ? " sel" : "");
      b.innerHTML = `<span>${escapeHtml(label)}</span>` + (val === cfg.category ? `<span class="ck">✓</span>` : "");
      b.addEventListener("click", () => {
        cfg.category = val; persistCfg();
        $("deck-word").textContent = catLabel(val);
        closeSheet("catPicker");
      });
      box.appendChild(b);
    });
  }

  /* ---------- Build a round ---------- */
  function buildRound() {
    const pool = cfg.category === "__ALL__"
      ? Object.values(CATEGORIES).flat()
      : CATEGORIES[cfg.category];
    let avail = pool.filter((e) => !used.includes(e.word));
    if (avail.length === 0) {
      const last = used[used.length - 1];
      used = used.filter((w) => !pool.some((e) => e.word === w));
      saveUsed(used);
      avail = pool.filter((e) => e.word !== last);
      if (avail.length === 0) avail = pool.slice();
    }
    const entry = pick(avail);
    used.push(entry.word); saveUsed(used);

    const hints = shuffle(entry.hints.slice());
    const count = players.length;
    let candidates = Array.from({ length: count }, (_, i) => i);
    if (cfg.imposters === 1 && lastImp !== null && count > 2) candidates = candidates.filter((i) => i !== lastImp);
    const chosen = shuffle(candidates).slice(0, cfg.imposters);
    lastImp = cfg.imposters === 1 ? chosen[0] : null;
    const impSet = new Set(chosen);

    const roles = [];
    let hintCursor = 0;
    for (let i = 0; i < count; i++) {
      if (impSet.has(i)) { roles.push({ imposter: true, hint: hints[hintCursor % hints.length] }); hintCursor++; }
      else roles.push({ imposter: false });
    }
    round = { word: entry.word, roles: roles, order: shuffle(Array.from({ length: count }, (_, i) => i)) };
  }

  /* ---------- Reveal ---------- */
  function renderReveal() {
    const i = reveal.idx;
    $("rv-name").textContent = playerName(round.order[i]);
    const prog = $("rv-progress"); prog.innerHTML = "";
    for (let p = 0; p < players.length; p++) {
      const pip = document.createElement("div");
      pip.className = "pip" + (p < i ? " done" : p === i ? " cur" : "");
      prog.appendChild(pip);
    }
    reveal.shown = false; reveal.peeked = false;
    buildRoleContent();
    $("rv-flip").classList.remove("flipped");
    $("rv-badge").style.visibility = "hidden";
    $("rv-next").style.display = "none";
    const nm = $("rv-name"); nm.classList.remove("enter"); void nm.offsetWidth; nm.classList.add("enter");
  }
  function buildRoleContent() {
    const role = round.roles[round.order[reveal.idx]];
    const showAsImposter = role.imposter && cfg.impKnows;
    const tag = $("rv-roletag"), body = $("rv-body"), back = document.querySelector(".flip-back"), badge = $("rv-badge");
    back.classList.toggle("is-imp", showAsImposter);
    back.classList.toggle("is-crew", !showAsImposter);
    if (showAsImposter) {
      tag.textContent = "Imposter"; tag.className = "roletag imp";
      badge.className = "role-badge imp";
      badge.innerHTML = `<svg class="mask"><use href="#ic-mask"/></svg><span><span class="rb-sm">You are the</span>IMPOSTER</span>`;
      const count = cfg.tellCount && cfg.imposters > 1 ? `<div class="imp-count">${cfg.imposters} imposters in play, blend in</div>` : "";
      body.innerHTML =
        `<div class="role-label">Your secret hint</div>` +
        `<div class="theword theword--hint">${escapeHtml(role.hint)}</div>` +
        count +
        `<div class="role-tip">💡 Bluff with your hint. Don't get caught.</div>`;
    } else {
      const word = role.imposter ? role.hint : round.word;
      tag.textContent = "Crewmate"; tag.className = "roletag crew";
      badge.className = "role-badge crew";
      badge.innerHTML = `<svg class="mask"><use href="#ic-mask"/></svg><span><span class="rb-sm">You are a</span>CREWMATE</span>`;
      body.innerHTML =
        `<div class="role-label">The secret word</div>` +
        `<div class="theword">${escapeHtml(word)}</div>` +
        `<div class="role-tip">💡 Give a clue, but not too obvious.</div>`;
    }
  }
  function showRole() {
    if (reveal.shown) return;
    reveal.shown = true;
    $("rv-flip").classList.add("flipped");
    $("rv-badge").style.visibility = "visible";
    if (navigator.vibrate) navigator.vibrate(15);
  }
  function hideRole() {
    if (!reveal.shown) return;
    reveal.shown = false;
    $("rv-flip").classList.remove("flipped");
    $("rv-badge").style.visibility = "hidden";
    if (!reveal.peeked) {
      reveal.peeked = true;
      const next = $("rv-next");
      next.textContent = reveal.idx === players.length - 1 ? "Done →" : "Next player →";
      next.style.display = "";
    }
  }
  function nextReveal() {
    if (reveal.idx < players.length - 1) { reveal.idx++; renderReveal(); }
    else roundComplete();
  }

  /* ---------- Round complete ---------- */
  function roundComplete() {
    $("round-answer").style.display = "none";
    $("rd-reveal").textContent = "Reveal answer";
    go("round");
    rollStarter();
  }
  function rollStarter() {
    if (starterTimer) clearInterval(starterTimer);
    const nameEl = $("rd-starter-name");
    const finalIdx = Math.floor(Math.random() * players.length);
    let ticks = 0; const total = 13;
    nameEl.classList.remove("landed"); nameEl.classList.add("rolling");
    starterTimer = setInterval(() => {
      ticks++;
      if (ticks >= total) {
        clearInterval(starterTimer); starterTimer = null;
        nameEl.textContent = playerName(finalIdx);
        nameEl.classList.remove("rolling"); nameEl.classList.add("landed");
        if (navigator.vibrate) navigator.vibrate(35);
      } else {
        nameEl.textContent = playerName(Math.floor(Math.random() * players.length));
      }
    }, 70);
  }
  function stopStarter() { if (starterTimer) { clearInterval(starterTimer); starterTimer = null; } }
  function renderAnswer() {
    $("rd-word").textContent = round.word;
    const imps = round.roles.map((r, i) => ({ ...r, num: i + 1 })).filter((r) => r.imposter);
    $("rd-imp-title").textContent = imps.length > 1 ? `The ${imps.length} imposters were…` : "The imposter was…";
    const list = $("rd-imps"); list.innerHTML = "";
    imps.forEach((r) => {
      const row = document.createElement("div"); row.className = "imp-row";
      row.innerHTML = `<span class="num">${r.num}</span><span>${escapeHtml(playerName(r.num - 1))}</span><span class="h">hint: ${escapeHtml(r.hint)}</span>`;
      list.appendChild(row);
    });
  }
  function toggleAnswer() {
    const a = $("round-answer"), open = a.style.display !== "none";
    if (open) { a.style.display = "none"; $("rd-reveal").textContent = "Reveal answer"; }
    else { renderAnswer(); a.style.display = ""; $("rd-reveal").textContent = "Hide answer"; }
  }

  function startRound() {
    stopStarter();
    buildRound();
    bumpRounds();
    reveal = { idx: 0, shown: false };
    renderReveal();
    go("reveal");
  }
  function quickPlay() {
    if (!lobbies.length) { openEditor(null, "home"); return; }
    const l = lobbies[0];
    activeId = l.id;
    Object.assign(cfg, l.cfg, { category: "__ALL__" });
    players = l.players.slice();
    startRound();
  }

  /* ---------- Init ---------- */
  function init() {
    const yr = $("year"); if (yr) yr.textContent = String(new Date().getFullYear());
    lobbies = loadLobbies() || seedLobbies();
    saveLobbies();

    fillCatPicker();
    bindSteppers();
    bindToggle("countToggle", "c", (v) => { cfg.tellCount = parseInt(v, 10); persistCfg(); });
    bindToggle("knowsToggle", "k", (v) => { cfg.impKnows = parseInt(v, 10); syncSetup(); });

    const card = $("rv-card");
    card.addEventListener("pointerdown", (e) => { e.preventDefault(); showRole(); });
    card.addEventListener("pointerup", hideRole);
    card.addEventListener("pointerleave", hideRole);
    card.addEventListener("pointercancel", hideRole);
    card.addEventListener("contextmenu", (e) => e.preventDefault());
    $("rv-next").addEventListener("click", (e) => { e.stopPropagation(); nextReveal(); });

    $("startBtn").addEventListener("click", startRound);
    $("quickPlay").addEventListener("click", quickPlay);
    $("seeAll").addEventListener("click", () => setTab("mygames"));
    $("viewGuide").addEventListener("click", () => openSheet("guide"));
    $("newLobbyBtn").addEventListener("click", () => openEditor(null, "mygames"));
    $("setupBack").addEventListener("click", () => setTab("home"));
    $("revealBack").addEventListener("click", () => openSetup(activeId));
    $("roundBack").addEventListener("click", () => setTab("home"));
    $("playersPill").addEventListener("click", () => openEditor(activeId, "setup"));
    $("changeCat").addEventListener("click", () => openSheet("catPicker"));
    $("catClose").addEventListener("click", () => closeSheet("catPicker"));
    $("catPicker").addEventListener("click", (e) => { if (e.target.id === "catPicker") closeSheet("catPicker"); });

    $("lobbyBack").addEventListener("click", () => { if (editorReturn === "setup") openSetup(activeId); else setTab("mygames"); });
    $("lobby-save").addEventListener("click", saveLobby);
    $("lobbyDelete").addEventListener("click", deleteLobby);
    $("add-player").addEventListener("click", addPlayer);

    $("rd-next").addEventListener("click", startRound);
    $("rd-setup").addEventListener("click", () => openSetup(activeId));
    $("rd-reveal").addEventListener("click", toggleAnswer);

    document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => {
      const tab = t.dataset.tab;
      if (tab === "create") openEditor(null, "mygames"); else setTab(tab);
    }));

    $("intro-ok").addEventListener("click", () => { closeSheet("intro"); try { localStorage.setItem(INTRO_KEY, "1"); } catch (e) {} });
    $("guide-ok").addEventListener("click", () => closeSheet("guide"));
    $("guide-close").addEventListener("click", () => closeSheet("guide"));

    // Inline lobby-name validation
    $("lobby-name").addEventListener("input", validateLobby);

    // Confirm dialog
    $("confirm-no").addEventListener("click", () => $("confirm").classList.remove("show"));
    $("confirm").addEventListener("click", (e) => { if (e.target.id === "confirm") $("confirm").classList.remove("show"); });
    $("confirm-yes").addEventListener("click", () => {
      $("confirm").classList.remove("show");
      const a = confirmAction; confirmAction = null; if (a) a();
    });

    // ----- Theme: dark / warm / light -----
    const THEME_META = { dark: "#0b0b14", warm: "#f3ecd9", light: "#eef0f6" };
    function setTheme(t, save) {
      if (!THEME_META[t]) t = "dark";
      document.documentElement.setAttribute("data-theme", t);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", THEME_META[t]);
      document.querySelectorAll("[data-theme-pick]").forEach((s) => s.classList.toggle("sel", s.dataset.themePick === t));
      if (save) { try { localStorage.setItem("imposter_theme", t); } catch (e) {} }
    }
    let savedTheme = null; try { savedTheme = localStorage.getItem("imposter_theme"); } catch (e) {}
    setTheme(["dark", "warm", "light"].indexOf(savedTheme) >= 0 ? savedTheme : "dark", false);
    document.querySelectorAll("[data-theme-pick]").forEach((s) =>
      s.addEventListener("click", () => setTheme(s.dataset.themePick, true)));

    // ----- Hamburger drawer -----
    const openDrawer = () => $("drawer").classList.add("show");
    const closeDrawer = () => $("drawer").classList.remove("show");
    $("menuBtn").addEventListener("click", openDrawer);
    $("drawer-close").addEventListener("click", closeDrawer);
    $("drawer").querySelector("[data-close-drawer]").addEventListener("click", closeDrawer);
    $("drawerNew").addEventListener("click", () => { closeDrawer(); openEditor(null, "mygames"); });
    $("drawerGuide").addEventListener("click", () => { closeDrawer(); openSheet("guide"); });

    // ----- Avatar + profile shortcuts -----
    $("avatarBtn").addEventListener("click", () => setTab("profile"));
    $("profTheme").addEventListener("click", openDrawer);
    $("profGuide").addEventListener("click", () => openSheet("guide"));

    // ----- Escape closes any overlay -----
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      closeDrawer(); closeSheet("guide"); closeSheet("catPicker"); $("confirm").classList.remove("show");
    });

    setTab("home");
    try { if (!localStorage.getItem(INTRO_KEY)) openSheet("intro"); } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", init);
})();
