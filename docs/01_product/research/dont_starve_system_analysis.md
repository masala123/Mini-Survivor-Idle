# วิเคราะห์ระบบเกม Don’t Starve / Don’t Starve Together อย่างละเอียด

> เอกสารนี้จัดทำเพื่อใช้เป็น reference สำหรับศึกษาเกม survival-crafting แบบ Don’t Starve และนำไปประยุกต์ออกแบบเกมแนว survival clone / co-op survival / idle survival / sandbox survival ได้

---

## 1. ภาพรวมเกม

**Don’t Starve** คือเกม survival sandbox ที่เน้นการเอาตัวรอดในโลกสุ่มสร้างแบบ hostile world โดยผู้เล่นเริ่มจากศูนย์ ไม่มี tutorial แบบจับมือ และต้องเรียนรู้จากการทดลอง ล้มเหลว และตายซ้ำ ระบบหลักของเกมประกอบด้วยการหา resource, craft item, ตั้ง base, สำรวจ map, จัดการ hunger/health/sanity, รับมือ day-night cycle, season, monster, boss และ event ต่าง ๆ

**Don’t Starve Together (DST)** คือ standalone multiplayer expansion ที่ขยายแกน survival เดิมไปเป็นระบบ co-op มีการ balance ใหม่ให้รองรับหลายผู้เล่น เพิ่ม content, boss, event, ocean, cave, character rework, skin economy และ live update ต่อเนื่อง

### Design Identity

| แกนออกแบบ | รายละเอียด |
|---|---|
| Survival-first | ทุกระบบกดดันผู้เล่นให้ต้องเตรียมตัวล่วงหน้า |
| Discovery-driven | ผู้เล่นเรียนรู้จากโลก ไม่ใช่จาก tutorial ยาว ๆ |
| Systems overlap | hunger, sanity, temperature, season, monster, resource เชื่อมกันหมด |
| Permadeath pressure | การตายมี consequence สูง ทำให้การตัดสินใจมีน้ำหนัก |
| Dark whimsical tone | โลกดูน่ารักประหลาด แต่ระบบโหดและไม่ปรานี |
| Emergent gameplay | เหตุการณ์หลายอย่างเกิดจากระบบชนกัน เช่น หมาไล่ + กลางคืน + ฝน + ไฟไหม้ base |

---

## 2. Core Gameplay Loop

### Loop หลักแบบสั้น

```text
ตื่น/เริ่มวัน
→ หาอาหารและ resource
→ craft เครื่องมือ/อุปกรณ์
→ สำรวจ map / หา biome / หา set piece
→ กลับ base หรือสร้าง camp ชั่วคราว
→ รับมือกลางคืน / monster / sanity / hunger
→ เตรียมตัวสำหรับ season หรือ threat รอบต่อไป
→ unlock tech เพิ่ม
→ สู้ boss / ลง cave / สำรวจ ocean / endgame content
```

### Loop ตาม phase

| Phase | เป้าหมาย | ความเสี่ยงหลัก | Reward |
|---|---|---|---|
| Early Game วัน 1-10 | หา flint, grass, twigs, food, science machine, base location | มืด, starvation, monster, ไม่รู้ map | survival stability |
| Base Setup | สร้าง fire pit, chest, crock pot, farm, drying rack, alchemy engine | resource shortage, hound wave | food security, crafting tier |
| Seasonal Prep | เตรียม winter/summer/rain/gears/thermal stone/clothing | freezing, overheating, wetness, boss | อยู่รอดระยะยาว |
| Exploration | หา beefalo, pig king, swamp, desert, cave, ruins, lunar/shadow content | หลงทาง, sanity drain, hostile mobs | rare resources, progression unlock |
| Boss/Endgame | สู้ giants, raid boss, ruins, ancient fuelweaver, celestial content | death spiral, team wipe | powerful gear, story progression |

---

## 3. Player State Systems

Don’t Starve ใช้ระบบ status หลัก 3 ตัวเป็นแกน survival ได้แก่ **Health, Hunger, Sanity** และขยายด้วย temperature, wetness, light, inventory, equipment durability

## 3.1 Health

Health คือพลังชีวิต ถ้าหมด = ตาย ระบบ health ไม่ได้เป็นแค่ combat HP แต่ถูกกดดันจาก starvation, freezing, overheating, poison/condition บางแบบ, mob attack, sanity monster และการกินอาหารเน่า

### แหล่งเสีย Health

| สาเหตุ | ตัวอย่าง |
|---|---|
| Combat damage | spider, hound, boss, tentacle |
| Hunger = 0 | HP ลดเรื่อย ๆ |
| Temperature extreme | หนาวจัด/ร้อนจัด |
| Darkness | Charlie โจมตีเมื่ออยู่ในความมืด |
| Bad food | spoiled/monster food บางชนิด |
| Environmental hazard | fire, earthquake, trap, cactus |

### Design Note

Health เป็น resource ชั้นสุดท้าย ผู้เล่นส่วนใหญ่ไม่ได้ตายเพราะ combat ตรง ๆ อย่างเดียว แต่ตายจาก chain reaction เช่น หิว → รีบหาอาหารตอนกลางคืน → sanity ต่ำ → เจอ shadow creature → ไม่มีแสง → ตาย

---

## 3.2 Hunger

Hunger ลดลงตามเวลา เป็น timer หลักที่บังคับให้ผู้เล่นต้องหาอาหารตลอดเวลา เมื่อ hunger หมดจะเริ่มลด health

### ระบบอาหาร

| ระบบ | ผลต่อ gameplay |
|---|---|
| Food spoilage | กันการ stockpile อาหารง่ายเกินไป |
| Cooking | เพิ่ม value ของ resource ผ่าน crock pot |
| Monster food | ให้ทางเลือกเสี่ยง มี penalty |
| Drying / preservation | แปลงอาหารเป็นรูปแบบเก็บนานขึ้น |
| Seasonal availability | อาหารบางอย่างหาได้ยากในบางฤดู |

### Food Economy Design

อาหารใน Don’t Starve มี 3 ระดับ:

1. **Emergency food**: berries, carrots, seeds กินแก้ตาย แต่ sustain ไม่ดี
2. **Stable food**: meatballs, pierogi, jerky, farms, honey, eggs
3. **Strategic food**: food ที่ heal/sanity/hunger สูง ใช้ก่อน boss หรือ expedition

---

## 3.3 Sanity

Sanity คือระบบจิตใจที่ทำให้ survival มีมิติ psychological pressure ไม่ใช่แค่กินกับเลือด Sanity ต่ำจะทำให้ shadow creatures โจมตีได้จริง

### แหล่งลด Sanity

| สาเหตุ | ตัวอย่าง |
|---|---|
| Night / dusk | เวลากลางคืนกดดันผู้เล่น |
| Monster proximity | อยู่ใกล้ spider, hound, boss |
| Grave robbing | ขุดหลุมศพ |
| Magic / dark item | ใช้ของ shadow |
| Wetness / environment | ฝนหรือสถานการณ์บางอย่าง |

### แหล่งเพิ่ม Sanity

| วิธี | ตัวอย่าง |
|---|---|
| Flower / nature | เก็บดอกไม้ |
| Clothing | garland, top hat |
| Food | cooked green cap, taffy, jerky |
| Sleep | tent/bed roll |
| Character-specific | perk บางตัว |

### Design Note

Sanity ทำหน้าที่เป็น **risk amplifier**: เมื่อผู้เล่นอยู่ในสถานการณ์แย่ ระบบ sanity จะเพิ่มศัตรูอีกชั้น ทำให้ความผิดพลาดเล็ก ๆ กลายเป็น death spiral

---

## 3.4 Temperature

Temperature เป็นระบบ season survival โดยเฉพาะใน Reign of Giants และ DST ผู้เล่นต้องรับมือ freezing/overheating ผ่าน clothing, thermal stone, fire/endothermic fire, shade, item และ timing

| Condition | สาเหตุ | วิธีแก้ |
|---|---|---|
| Freezing | Winter, กลางคืน, ไม่มี insulation | fire, warm clothes, thermal stone, beard |
| Overheating | Summer, desert, heat source | endothermic fire, summer clothes, chilled thermal stone |

### Design Note

Temperature ทำให้ season ไม่ใช่แค่เปลี่ยน visual แต่เปลี่ยน logistic ทั้งหมดของผู้เล่น เช่น ต้องเตรียมเสื้อ, หิน, fuel, base cooling และ food plan

---

## 3.5 Wetness

Wetness ทำให้ item ลื่น/เสียประสิทธิภาพ, sanity ลด, freezing ง่ายขึ้น และทำให้ combat/exploration ยุ่งยากขึ้น

| ระบบเกี่ยวข้อง | ผล |
|---|---|
| Rain | เพิ่ม wetness |
| Lightning | เสี่ยงไฟไหม้หรือโดนช็อต |
| Umbrella / raincoat | ลด wetness |
| WX-78 | character interaction กับน้ำมีความสำคัญเป็นพิเศษในบางเวอร์ชัน |

---

## 3.6 Light / Darkness

แสงคือ survival requirement พื้นฐานที่สุด กลางคืนถ้าไม่มีแสงจะโดน Charlie โจมตี

### Light Sources

| Type | ตัวอย่าง | บทบาท |
|---|---|---|
| Temporary | torch, campfire | early survival |
| Base light | fire pit, lantern | stable night routine |
| Mobile light | miner hat, lantern | cave/exploration |
| Emergency | fire staff, character item | clutch survival |

### Design Note

Light ทำหน้าที่เป็น **hard constraint**: ผู้เล่นต้องวางแผนกลับ base หรือพกแสงเสมอ ทำให้ day/night cycle มี consequence จริง

---

## 4. Time System

### Day / Dusk / Night

หนึ่งวันใน Don’t Starve แบ่งเป็น day, dusk, night ความยาวเปลี่ยนตาม season

| ช่วงเวลา | Gameplay Function |
|---|---|
| Day | สำรวจ, gather, fight, build ปลอดภัยสุด |
| Dusk | เริ่มมี sanity drain, mob บางชนิด active |
| Night | ต้องมี light, danger สูง, จำกัดกิจกรรม |

### Design Note

เวลาเป็น soft timer ที่บังคับ rhythm ผู้เล่น: ออกไปเสี่ยงตอนกลางวัน กลับมาจัด inventory/craft/cook ตอนกลางคืน

---

## 5. Season System

Season คือ macro-cycle ที่เปลี่ยนเป้าหมายของผู้เล่นทุกช่วงเวลา

### Base Game / DST Core Seasons

| Season | Threat หลัก | Gameplay Change | Preparation |
|---|---|---|---|
| Autumn | ง่ายสุด เหมาะสำหรับเริ่ม base | resource abundant | ตั้งฐาน เตรียม winter |
| Winter | หนาว, อาหารน้อย, Deerclops | freezing, nights longer | warm clothes, thermal stone, preserved food |
| Spring | ฝน, wetness, frog rain, lightning | sanity/temperature interaction | rain gear, lightning rod |
| Summer | overheating, wildfire, Antlion | base fire risk, heat management | ice flingomatic, endothermic fire, cave refuge |

### Giants / Seasonal Bosses

| Boss | Season | Function |
|---|---|---|
| Deerclops | Winter | base destruction / combat check |
| Moose/Goose | Spring | area threat / resource reward |
| Dragonfly | Summer / desert / raid boss in DST | high-end combat/resource challenge |
| Bearger | Autumn | destruction + resource tool if manipulated |

### Design Note

Season บังคับให้ผู้เล่นเปลี่ยน build และ routine ไม่ให้เกมกลายเป็น farm loop เดิม ๆ หลังตั้ง base สำเร็จ

---

## 6. World Generation

Don’t Starve ใช้ procedural world generation โดยสร้างโลกจาก biome, resource distribution, set pieces, roads, wormholes, cave entrances, landmarks และ boss/resource locations

### Worldgen Components

| Component | บทบาท |
|---|---|
| Biomes | กำหนด resource และ mob identity |
| Roads | ช่วย navigation และ movement speed |
| Set pieces | จุดพิเศษ/กับดัก/รางวัล |
| Wormholes | fast travel แบบมี sanity cost |
| Sinkholes | ทางเข้า cave |
| Resource clusters | สร้างเป้าหมาย exploration |
| World customization | ให้ผู้เล่นปรับ density/season/mob/resource |

### Biome Design

| Biome | Resource เด่น | Threat | Function |
|---|---|---|---|
| Grassland | grass, rabbits, beefalo | hound, beefalo heat | early food/base candidate |
| Forest | trees, spiders, pigs | spider, treeguard | wood + monster resource |
| Rockyland | rocks, gold | tallbird | tech progression |
| Swamp | reeds, tentacles, merms | extremely dangerous | high-risk utility resource |
| Desert | cactus, tumbleweed, volt goat | heat, hound, antlion | summer/endgame prep |
| Mosaic | mixed resource | unstable distribution | exploration filler |
| Marsh | reeds, tentacles | lethal ambush | papyrus/magic tech |

### Design Note

Biome ไม่ได้เป็นแค่พื้นที่สวยงาม แต่เป็น **resource + threat package** แต่ละ biome มีเหตุผลให้ไป และมีเหตุผลให้กลัว

---

## 7. Resource System

Resource ใน Don’t Starve แบ่งตามความถี่, renewal, risk และ tech tier

### Resource Categories

| Category | ตัวอย่าง | Design Function |
|---|---|---|
| Basic renewable | grass, twigs, berries | early survival/crafting |
| Basic finite-ish | flint, rocks, gold | tech gate |
| Combat drops | silk, glands, meat, hound teeth | reward for fighting |
| Seasonal resource | ice, cactus flower | season incentive |
| Rare/endgame | thulecite, nightmare fuel, gems | magic/endgame progression |
| Living resource | beefalo wool, honey, eggs | base economy |

### Renewal Model

| Type | ตัวอย่าง | Balance Effect |
|---|---|---|
| Regrow over time | grass, saplings | sustain base |
| Spawn cycle | rabbits, bees, spiders | predictable farming |
| Risk farming | tentacle spots, monster meat | reward through danger |
| Non-renewable / limited | some set piece loot | exploration value |
| Renewable with setup | farms, bee boxes, pig houses | base investment |

---

## 8. Crafting / Tech Progression

Crafting เป็นระบบแปลง resource ให้กลายเป็น survival capability ผู้เล่นเริ่ม craft ได้แค่ของพื้นฐาน จากนั้นใช้ science/magic stations เพื่อ unlock recipe tier สูงขึ้น

### Crafting Stations

| Station | Role |
|---|---|
| Science Machine | unlock basic tech |
| Alchemy Engine | unlock advanced survival/base gear |
| Prestihatitator | entry magic tech |
| Shadow Manipulator | advanced magic/shadow items |
| Ancient Pseudoscience Station | ruins/endgame crafting |

### Crafting Filters / Categories

| Category | ตัวอย่าง |
|---|---|
| Tools | axe, pickaxe, shovel |
| Light | torch, campfire, lantern |
| Survival | backpack, trap, healing |
| Food | crock pot, drying rack, farm |
| Fight | spear, armor, helmet |
| Structures | chest, wall, fire pit |
| Magic | amulet, staff, nightmare gear |
| Dress | insulation, rain gear, sanity clothes |
| Refine | boards, rope, cut stone |

### Design Note

Tech progression ไม่ได้เป็น linear XP tree แต่เป็น **material-gated unlock**: ผู้เล่นต้องสำรวจ biome เฉพาะหรือสู้ mob เฉพาะเพื่อเปิด recipe สำคัญ

---

## 9. Inventory / Equipment System

Inventory จำกัดช่อง ทำให้ resource management สำคัญมาก

### Key Systems

| System | Function |
|---|---|
| Limited slots | บังคับเลือกว่าจะพกอะไร |
| Stack size | จำกัด stockpile ระหว่างออกสำรวจ |
| Backpack slot | trade-off กับ armor/body equipment |
| Equipment durability | item เสื่อม ทำให้ต้อง craft ซ้ำ |
| Spoilage | food มี timer |
| Containers | chest, backpack, ice box |

### Design Note

Inventory pressure สร้าง decision ตลอดเวลา เช่น จะเก็บ gold หรือ food? จะใส่ backpack หรือ armor? จะเดินต่อหรือกลับ base?

---

## 10. Food / Cooking System

Food system เป็นหนึ่งในระบบ economy ที่ลึกที่สุดของเกม เพราะ item เดียวอาจฟื้น hunger/health/sanity ต่างกัน และมี spoilage ต่างกัน

### Food Pipeline

```text
หา raw food
→ กินสด / cook fire / crock pot / dry / preserve
→ ได้ value ต่างกัน
→ ใช้ใน survival, healing, sanity, boss prep
```

### Crock Pot Design

Crock Pot เป็นระบบ recipe แบบ ingredient tag ไม่ใช่ recipe fixed ตรง ๆ เช่น meat value, veggie value, filler, monster value ทำให้ผู้เล่นทดลองผสมได้

| Food Type | บทบาท |
|---|---|
| Meatballs | cheap hunger solution |
| Pierogi | strong healing food |
| Dragonpie | high value crop food |
| Jerky | long-lasting + sanity/health |
| Taffy | sanity food |
| Monster lasagna | punishment recipe |

### Design Note

Cooking ทำให้ resource ธรรมดามี strategy layer: อาหารไม่ได้แค่เติม hunger แต่เป็น build preparation

---

## 11. Combat System

Combat ของ Don’t Starve ดูเรียบง่าย แต่แกนจริงคือ timing, kiting, armor management, weapon durability, enemy pattern และ risk calculation

### Combat Loop

```text
Observe attack animation
→ Bait enemy attack
→ Step away
→ Counterattack during recovery window
→ Repeat
→ Manage armor/weapon/sanity/position
```

### Combat Variables

| Variable | ผลต่อ combat |
|---|---|
| Weapon damage | time-to-kill |
| Attack speed / animation | kiting rhythm |
| Armor absorption | survival margin |
| Enemy range | spacing requirement |
| Group aggro | crowd danger |
| Sanity aura | long fight pressure |
| Terrain | pathing/escape |

### Enemy Archetypes

| Archetype | ตัวอย่าง | Function |
|---|---|---|
| Basic melee | spider, hound | teach kiting |
| Group swarm | spider group, frogs | punish bad positioning |
| Area hazard | tentacle | map awareness |
| Tank / boss | Deerclops, Bearger | preparation check |
| Sanity enemy | Crawling Horror | sanity consequence |
| Utility mob | Beefalo, pigs, bunnymen | combat + economy interaction |

### Design Note

Combat สำคัญเพราะ resource หลายอย่างอยู่หลัง combat gate เช่น silk, glands, monster meat, hound teeth, boss loot

---

## 12. Mob AI / Ecology System

Mob ใน Don’t Starve ไม่ได้เป็นแค่ศัตรู แต่เป็น ecosystem ที่ผู้เล่น exploit ได้

### AI Behaviors

| Behavior | ตัวอย่าง |
|---|---|
| Passive grazing | beefalo |
| Territorial attack | tallbird, tentacle |
| Group aggro | spider, bee, pig |
| Time-based behavior | spider ออกจาก nest ตอนเย็น/กลางคืน |
| Faction hostility | pig vs spider, merm vs pig |
| Transform/evolve | spider den tier, werepig |
| Follow/assist | pig followers, bunnymen |

### Ecology Interaction

| Interaction | Design Value |
|---|---|
| Pig vs Spider | ให้ผู้เล่น kite mobs ให้ตีกันเอง |
| Beefalo vs Hounds | ใช้ herd เป็น defense |
| Tentacle vs Merms | swamp เป็น auto-farm แต่เสี่ยง |
| Treeguard | ลงโทษการตัดไม้หนักเกินไป |

### Design Note

ระบบ ecology ทำให้โลกดู “มีชีวิต” และสร้าง emergent solution ผู้เล่นไม่จำเป็นต้องสู้เองเสมอไป สามารถ manipulate AI ได้

---

## 13. Base Building System

Base คือ hub สำหรับเก็บ resource, cook, craft, preserve, prep และ recover

### Core Base Structures

| Structure | Function |
|---|---|
| Fire Pit | safe night center |
| Science/Alchemy | crafting progression |
| Crock Pot | food efficiency |
| Ice Box | food preservation |
| Chest | storage |
| Drying Rack | long-term food |
| Farm Plot | renewable food |
| Bee Box | honey economy |
| Bird Cage | egg/meat conversion |
| Lightning Rod | anti-lightning fire safety |
| Ice Flingomatic | anti-wildfire summer defense |

### Base Location Criteria

| Criteria | เหตุผล |
|---|---|
| ใกล้ resource หลาย biome | ลด travel time |
| ใกล้ beefalo/pigs แต่ไม่ชิดเกินไป | defense + resource |
| ใกล้ wormhole/road | mobility |
| ไม่ใกล้ monster nest เกินไป | safety |
| มีพื้นที่วาง structure | expansion |
| มี access ไป cave/desert/swamp | mid-game progression |

### Design Note

Base ไม่ใช่แค่บ้าน แต่เป็น **logistics optimizer** ของเกมทั้งระบบ

---

## 14. Exploration System

Exploration ถูกผลักด้วย resource scarcity, map uncertainty, landmark reward และ progression gate

### Exploration Incentives

| Incentive | ตัวอย่าง |
|---|---|
| Tech resource | gold, gears, reeds |
| Food source | beefalo, rabbits, cactus |
| Combat resource | spider nests, hound mounds |
| Boss/resource location | dragonfly desert, lunar island |
| Mobility | wormholes, roads |
| Endgame | cave, ruins, archives |

### Exploration Risks

| Risk | ตัวอย่าง |
|---|---|
| Darkness | กลับไม่ทันกลางคืน |
| Hunger | อาหารหมดระหว่างทาง |
| Sanity | monster/night/cave |
| Inventory full | ต้องทิ้งของ |
| Unknown enemies | swamp/tallbird/hounds |
| Weather/season | winter/summer travel danger |

---

## 15. Caves / Ruins System

Caves เป็น world layer แยกที่มี map generation, resources, mobs และ hazards ของตัวเอง ส่วน ruins เป็น endgame dungeon layer ที่มี ancient tech และ high-risk reward

### Cave Functions

| Function | รายละเอียด |
|---|---|
| Alternative survival space | หลบ summer heat/wildfire ได้ดี |
| Unique resources | light bulbs, mushrooms, rocks, gems |
| Higher danger | darkness, depth worms, earthquakes |
| Endgame path | ruins, ancient crafting, bosses |

### Ruins Design

| Element | Function |
|---|---|
| Nightmare cycle | สร้าง periodic danger |
| Ancient statues | gem/thulecite source |
| Clockworks | combat challenge/gears |
| Pseudoscience station | ancient crafting |
| Ancient Guardian | boss/resource gate |

---

## 16. Ocean / Sailing System ใน DST

DST เพิ่ม ocean exploration ทำให้ map ไม่ได้จำกัดแค่ landmass

### Ocean Systems

| System | Function |
|---|---|
| Boat platform | mobile base / transport |
| Sail / steering | movement control |
| Ocean fishing | food/resource path |
| Sea stacks / hazards | navigation challenge |
| Lunar island | major progression location |
| Waterlogged biome | special resource |

### Design Note

Ocean ขยาย exploration loop จากการเดินเป็น vehicle/base management และเพิ่ม risk เรื่อง resource, durability, navigation, enemy และ isolation

---

## 17. Character System

Character แต่ละตัวมี perk และ downside ทำให้ playstyle เปลี่ยนอย่างชัดเจน

### Character Design Pattern

| Pattern | ตัวอย่างเชิงระบบ |
|---|---|
| Strong stat but penalty | hunger drain สูง, sanity drain สูง |
| Unique item | lighter, battle helm, portable crock pot |
| Unique companion | Abigail |
| Resource conversion | WX-78 circuits/gears style progression |
| Role specialization | fighter, cook, builder, support |
| Risk twist | fire, monster affinity, diet restriction |

### Why It Works

ตัวละครไม่ได้เป็นแค่ skin แต่เปลี่ยน priority ทั้งเกม เช่น character ที่สู้เก่งจะหา monster resource ง่ายขึ้น ส่วน character ที่ cook เก่งจะทำ food economy ดีขึ้น

---

## 18. Progression Model

Don’t Starve ไม่มี level progression แบบ RPG ทั่วไป แต่ใช้ survival capability progression

### Progression Layers

| Layer | Example |
|---|---|
| Knowledge progression | ผู้เล่นจำ recipe, mob pattern, season timing |
| Resource progression | basic → refined → rare → endgame |
| Tech progression | science → alchemy → magic → ancient |
| Base progression | camp → stable base → seasonal base → megabase |
| World progression | surface → caves → ruins → lunar/shadow |
| Combat progression | hounds → giants → raid bosses |

### Design Note

Progression ที่แท้จริงส่วนใหญ่คือ **player mastery** ไม่ใช่ตัวเลขใน character sheet

---

## 19. Threat Scheduling

เกมใช้ scheduled threats เพื่อกันไม่ให้ผู้เล่น idle สบายเกินไป

| Threat | Timing | Purpose |
|---|---|---|
| Night | ทุกวัน | force light planning |
| Hunger drain | ตลอดเวลา | force food loop |
| Hound waves | เป็นรอบ | combat/base defense check |
| Season change | macro cycle | long-term prep check |
| Seasonal boss | season-specific | base/combat test |
| Spoilage | item timer | anti-hoarding |
| Sanity monster | conditional | punish mental neglect |
| Wildfire | summer | base infrastructure check |

### Design Note

Threat scheduling คือ heartbeat ของเกม ถ้าไม่มี threat เป็นรอบ เกมจะกลายเป็น sandbox farming ง่ายเกินไป

---

## 20. Death / Failure System

### Single-player

Death มักมี consequence สูงมาก ทำให้การเอาตัวรอดมีความหมาย การ revive ต้องใช้ item หรือ world object บางอย่าง

### DST

DST มี ghost system, revive item, portal, endless/survival mode ทำให้ multiplayer forgiving กว่า แต่ยังมี penalty และ team pressure

### Death Spiral

ตัวอย่าง death spiral:

```text
อาหารหมด
→ ออกหาของตอนเย็น
→ กลางคืน sanity ลด
→ ไม่มี torch สำรอง
→ โดน hound wave
→ armor แตก
→ shadow creature โจมตี
→ ตาย
```

### Design Note

เกมออกแบบให้ความผิดพลาดเล็ก ๆ สะสมจนเกิด catastrophic failure ได้ แต่ผู้เล่นมักรู้สึกว่า “ครั้งหน้าจะเตรียมดีกว่านี้”

---

## 21. Multiplayer System ใน DST

DST เปลี่ยน balance หลายอย่างเพื่อรองรับ co-op

### Multiplayer Design Changes

| Area | การเปลี่ยน |
|---|---|
| Boss HP | สูงขึ้น/เหมาะกับหลายคน |
| Revive | ghost/revive mechanics |
| Roles | character synergy |
| Resource pressure | หลายคนกิน resource มากขึ้น |
| Base scale | ใหญ่ขึ้นและ specialized มากขึ้น |
| Social coordination | แบ่งงาน gather/cook/fight/explore |

### Role Examples

| Role | หน้าที่ |
|---|---|
| Gatherer | เก็บ resource พื้นฐาน |
| Cook/Farmer | ดูแล food economy |
| Fighter | farm monster/boss |
| Explorer | map, ruins, ocean |
| Builder | base layout, infrastructure |
| Support | healing, sanity, revive |

### Design Note

Co-op เพิ่มพลังผู้เล่น แต่ก็เพิ่ม consumption rate ทำให้ balance ต้องชดเชยด้วย boss, resource demand และ coordination cost

---

## 22. Economy & Balancing

Don’t Starve balance ด้วย scarcity, decay, danger, travel time, durability และ season timing

### Economy Controls

| Control | ผล |
|---|---|
| Limited inventory | ลดการขน resource ทีละมาก ๆ |
| Spoilage | จำกัด food stockpile |
| Durability | สร้าง resource sink |
| Mob risk | resource ดีต้องเสี่ยง |
| Season | เปลี่ยน supply/demand |
| World distance | resource มี travel cost |
| Craft station | gate recipe |
| Boss loot | gate high-tier item |

### Resource Sink Examples

| Sink | Resource ที่กิน |
|---|---|
| Tools | flint, twigs, grass |
| Armor/Weapon | logs, rope, pig skin, rocks |
| Food prep | fuel, crop, meat, filler |
| Base expansion | boards, cut stone, gold |
| Season prep | silk, beefalo wool, ice, gears |
| Combat prep | healing food, armor, weapon durability |

---

## 23. UI / UX Design

UI ของ Don’t Starve สื่อสาร survival pressure ผ่าน meter และ visual/audio cue มากกว่าคำอธิบายยาว ๆ

### UI Elements

| UI | Function |
|---|---|
| Health/Hunger/Sanity meters | แสดง survival state |
| Clock | day/dusk/night + season timing |
| Inventory bar | quick access + pressure |
| Crafting menu | recipe discovery/progression |
| Map | exploration memory |
| Item tooltip | durability/spoilage/info |
| Screen effects | freezing, overheating, low sanity |

### UX Principle

เกมให้ข้อมูลพอประมาณ แต่ไม่อธิบายทุกอย่าง ผู้เล่นต้องทดลองเอง เช่น recipe crock pot, enemy kiting, season prep

---

## 24. Audio / Visual Feedback

### Visual Style

| Element | Effect |
|---|---|
| 2D paper-cut character in 3D world | identity ชัดและประหยัด production |
| Hand-drawn dark whimsical art | cute + creepy พร้อมกัน |
| Strong silhouettes | mob/readability ดี |
| Animation timing | telegraph combat pattern |
| Color/lighting | บอก mood และ danger |

### Audio Design

| Audio | Function |
|---|---|
| Hound warning | แจ้ง threat ก่อนมาถึง |
| Sanity ambience | เพิ่ม psychological pressure |
| Night sound | กดดันให้หา light |
| Boss cue | event warning |
| Craft/gather SFX | feedback loop |

---

## 25. Modding / Live Content

DST มีชุมชน mod ขนาดใหญ่และได้รับ update ต่อเนื่อง ระบบ mod ช่วยยืดอายุเกมอย่างมาก

### Mod Types

| Type | Example |
|---|---|
| QoL | minimap, geometric placement |
| Content | new characters, mobs, items |
| Balance | stack size, tuning |
| Server admin | commands, voting, moderation |
| UI | HUD, tooltips |

### Design Note

เกม survival sandbox ได้ประโยชน์มากจาก mod เพราะผู้เล่นแต่ละกลุ่มต้องการ friction level ต่างกัน

---

## 26. Lessons สำหรับทำ Don’t Starve Clone

### สิ่งที่ควรเลียนแบบ

| Feature | เหตุผล |
|---|---|
| 3-stat survival core | เข้าใจง่ายแต่ลึก |
| Day/night hard constraint | สร้าง rhythm ดีมาก |
| Season macro cycle | ทำให้ long-term planning สำคัญ |
| Biome = resource + danger package | worldgen มีความหมาย |
| Food spoilage + cooking | economy ลึกโดยไม่ต้องใช้ตัวเลขเยอะ |
| Character perk/downside | replayability สูง |
| Emergent mob ecology | โลกดูมีชีวิต |
| Threat scheduling | กันเกมนิ่งเกินไป |

### สิ่งที่ต้องระวังถ้าทำ clone

| Risk | วิธีแก้ |
|---|---|
| โหดเกิน ผู้เล่นใหม่หลุด | มี relaxed mode / optional tutorial / early grace period |
| ระบบเยอะเกิน | เปิดทีละ layer ตามวันหรือ biome |
| Resource grind | ให้ recipe ใช้ resource หลาย path ได้ |
| Multiplayer resource แย่งกัน | scaling resource / role economy |
| Base ถูกทำลายแล้ว rage quit | warning ชัด, counterplay ชัด |
| Crafting menu ซับซ้อน | filter, search, pin recipe |

---

## 27. System Blueprint สำหรับ Clone

### Minimum Viable Survival Core

```text
Player Stats:
- Health
- Hunger
- Sanity / Morale
- Temperature optional after MVP

World:
- Procedural biome map
- Day/night cycle
- Basic weather
- Resource nodes
- Hostile mobs

Crafting:
- Tools
- Light
- Food station
- Storage
- Weapon/armor

Threats:
- Night darkness damage
- Hunger starvation
- Periodic enemy wave
- Seasonal hazard
```

### Recommended MVP Scope

| Milestone | Systems |
|---|---|
| MVP 1 | movement, gather, inventory, hunger, day/night, torch/campfire |
| MVP 2 | crafting, tools, resource respawn, basic mobs, combat |
| MVP 3 | base structures, cooking, spoilage, storage |
| MVP 4 | biomes, worldgen, map, exploration rewards |
| MVP 5 | sanity/morale, hound waves, boss prototype |
| MVP 6 | season, temperature, weather, advanced crafting |
| MVP 7 | co-op/networking, scaling, revive, roles |

---

## 28. Suggested Data Tables

### Item Table

| Field | Type | Example |
|---|---|---|
| ItemID | string | cut_grass |
| DisplayName | text | Cut Grass |
| Category | enum | Resource |
| StackSize | int | 40 |
| SpoilTime | float | -1 |
| Durability | float | -1 |
| Tags | array | grass, burnable |
| Pickupable | bool | true |

### Recipe Table

| Field | Type | Example |
|---|---|---|
| RecipeID | string | torch |
| OutputItem | ItemID | torch |
| OutputCount | int | 1 |
| Ingredients | array | grass:2, twigs:2 |
| StationRequired | enum | None |
| TechTier | int | 0 |
| Category | enum | Light |

### Mob Table

| Field | Type | Example |
|---|---|---|
| MobID | string | spider |
| Health | float | 100 |
| Damage | float | 20 |
| AttackRange | float | 150 |
| AggroRange | float | 600 |
| MoveSpeed | float | 300 |
| Faction | enum | Monster |
| Drops | array | monster_meat, silk, gland |
| ActiveTime | enum | DuskNight |

### Season Table

| Field | Type | Example |
|---|---|---|
| SeasonID | string | winter |
| DurationDays | int | 15 |
| DayLengthMod | float | 0.75 |
| NightLengthMod | float | 1.25 |
| TemperatureRange | vector2 | -20 to 5 |
| FoodSpawnMod | float | 0.5 |
| BossSpawn | MobID | deerclops |

---

## 29. Practical Clone Design Formula

ถ้าต้องสรุป Don’t Starve เป็นสูตรออกแบบ:

```text
Survival Pressure
= Time Pressure
+ Resource Scarcity
+ Environmental Hazard
+ Inventory Constraint
+ Enemy Threat
+ Knowledge Gap
```

และความสนุกเกิดจาก:

```text
Fun
= Preparation → Risk → Crisis → Recovery → Mastery
```

ผู้เล่นสนุกเพราะทุกครั้งที่ตาย เขาเข้าใจมากขึ้นว่าครั้งหน้าต้องเตรียมอะไร

---

## 30. Key Takeaways

1. Don’t Starve แข็งแรงเพราะทุกระบบเชื่อมกัน ไม่ใช่ระบบเยอะเฉย ๆ
2. Hunger คือ timer หลัก, sanity คือ risk amplifier, health คือ failure buffer
3. Day/night ทำให้ gameplay มีจังหวะรายวัน
4. Season ทำให้ gameplay มีจังหวะระยะยาว
5. Biome ต้องมีทั้ง reward และ danger
6. Crafting ที่ดีควรเปลี่ยน resource เป็น survival capability
7. Combat ที่ดีไม่จำเป็นต้องซับซ้อน แต่ต้องอ่าน animation และฝึก mastery ได้
8. Food spoilage และ durability คือ resource sink ที่สำคัญ
9. Base คือ logistics hub ไม่ใช่แค่ decoration
10. ความยากต้อง fair: ผู้เล่นควรรู้สึกว่า “ตายเพราะเตรียมไม่ดี” มากกว่า “เกมโกง”

---

## 31. Sources / References

- Klei Entertainment — Don’t Starve Together official page: https://www.klei.com/games/dont-starve-together
- Steam Store — Don’t Starve official key features: https://store.steampowered.com/app/219740/Dont_Starve/
- Klei Forums — Don’t Starve Together game updates: https://forums.kleientertainment.com/game-updates/dst/
- Don’t Starve Wiki.gg — Seasons: https://dontstarve.wiki.gg/wiki/Seasons
- Don’t Starve Wiki.gg — Crafting: https://dontstarve.wiki.gg/wiki/Crafting
- Don’t Starve Wiki.gg — Crafting/DST: https://dontstarve.wiki.gg/wiki/Crafting/DST
- Don’t Starve Wiki.gg — Caves: https://dontstarve.wiki.gg/wiki/Caves
- Don’t Starve Wiki.gg — Farming: https://dontstarve.wiki.gg/wiki/Farming
- Don’t Starve Wiki.gg — Items: https://dontstarve.wiki.gg/wiki/Items
- Don’t Starve Wiki.gg — World Customization/DST: https://dontstarve.wiki.gg/wiki/World_Customization/Don%27t_Starve_Together

