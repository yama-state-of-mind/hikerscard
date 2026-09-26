/* =========================================================
   YAMA TYPE — キャラクター18体（仕様書 v3 実装レシピ版 準拠）
   技法: 面パーツのみ。横向き・S字・関節・動勢・線の翼尾は使わない。
   目: 黒目 r=4 ＋ハイライト r=1.3（常に見える）
       まる目／とろん目（上30%）／たれ目（外側上部）／キリ目（上20%）
   ========================================================= */

const CHARACTERS = {

/* =========================================================
   孤峰 PS＊＊
   ========================================================= */

/* 1 カモシカ｜伏し目＋頬もこ　まる目＋伏し目 */
PSLC: { animal: "カモシカ", item: "地形図", svg: `
  <rect x="58" y="124" width="13" height="24" rx="6" fill="#5A625C"/>
  <rect x="89" y="124" width="13" height="24" rx="6" fill="#5A625C"/>
  <rect x="56" y="142" width="17" height="9" rx="3.5" fill="#2E322E"/>
  <rect x="87" y="142" width="17" height="9" rx="3.5" fill="#2E322E"/>
  <ellipse cx="80" cy="114" rx="34" ry="27" fill="#6E7670"/>
  <ellipse cx="80" cy="124" rx="20" ry="17" fill="#E4E2D8"/>
  <rect x="69" y="84" width="22" height="22" fill="#6E7670"/>
  <path d="M69 56 Q65 44 70 34" stroke="#2E322E" stroke-width="8.5" fill="none" stroke-linecap="round"/>
  <path d="M91 56 Q95 44 90 34" stroke="#2E322E" stroke-width="8.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="54" cy="68" rx="9" ry="12" fill="#5A625C" transform="rotate(-26 54 68)"/>
  <ellipse cx="106" cy="68" rx="9" ry="12" fill="#5A625C" transform="rotate(26 106 68)"/>
  <ellipse cx="80" cy="74" rx="28" ry="29" fill="#7B837C"/>
  <path d="M56 66 Q49 72 53 80 Q49 88 56 92 Q64 94 66 84 Q64 72 56 66 Z" fill="#EFEDE4"/>
  <path d="M104 66 Q111 72 107 80 Q111 88 104 92 Q96 94 94 84 Q96 72 104 66 Z" fill="#EFEDE4"/>
  <ellipse cx="80" cy="88" rx="14" ry="12" fill="#EFEDE4"/>
  <ellipse cx="80" cy="84" rx="4.6" ry="3.4" fill="#2E322E"/>
  <circle cx="69" cy="74" r="4" fill="#1E1A16"/>
  <circle cx="91" cy="74" r="4" fill="#1E1A16"/>
  <circle cx="70.3" cy="72.7" r="1.3" fill="#FFFFFF"/>
  <circle cx="92.3" cy="72.7" r="1.3" fill="#FFFFFF"/>
  <g transform="rotate(-7 80 112)">
    <rect x="61" y="100" width="38" height="26" rx="2.5" fill="#F4F1E6"/>
    <rect x="61" y="100" width="38" height="26" rx="2.5" fill="none" stroke="#BFC4B4" stroke-width="1.6"/>
    <path d="M66 118 Q74 108 82 113 Q90 118 95 108" stroke="#5E7A4E" stroke-width="2.6" fill="none"/>
    <path d="M67 110 Q75 104 84 107" stroke="#C7CDBC" stroke-width="1.8" fill="none"/>
    <circle cx="88" cy="110" r="3.4" fill="#C2452C"/>
  </g>
  <ellipse cx="59" cy="113" rx="9" ry="10" fill="#5A625C"/>
  <ellipse cx="101" cy="113" rx="9" ry="10" fill="#5A625C"/>` },

/* 2 イヌワシ｜岩の上　正面＋横目＋キリ目20% */
PSLA: { animal: "イヌワシ", item: "ピッケル", svg: `
  <path d="M18 152 L36 118 L124 118 L142 152 Z" fill="#8B9096"/>
  <path d="M36 118 L124 118 L130 128 L30 128 Z" fill="#A2A7AC"/>
  <path d="M62 78 Q30 84 18 110 Q12 130 22 142 Q34 126 52 118 Q44 132 48 144
           Q66 130 70 100 Z" fill="#31271E"/>
  <path d="M60 86 Q36 94 28 114 Q40 104 56 100 Z" fill="#4A3A2B"/>
  <path d="M60 100 Q40 110 34 128 Q48 116 62 112 Z" fill="#57472F"/>
  <path d="M98 78 Q130 84 142 110 Q148 130 138 142 Q126 126 108 118 Q116 132 112 144
           Q94 130 90 100 Z" fill="#31271E"/>
  <path d="M100 86 Q124 94 132 114 Q120 104 104 100 Z" fill="#4A3A2B"/>
  <path d="M100 100 Q120 110 126 128 Q112 116 98 112 Z" fill="#57472F"/>
  <g stroke="#E8B846" stroke-width="5" stroke-linecap="round" fill="none">
    <path d="M70 112 V122"/><path d="M70 122 L60 128"/><path d="M70 122 L70 130"/><path d="M70 122 L80 128"/>
    <path d="M90 112 V122"/><path d="M90 122 L80 128"/><path d="M90 122 L90 130"/><path d="M90 122 L100 128"/>
  </g>
  <ellipse cx="80" cy="96" rx="32" ry="30" fill="#6B5340"/>
  <path d="M80 70 Q64 84 66 104 Q80 98 94 104 Q96 84 80 70 Z" fill="#8A6D4E"/>
  <path d="M60 76 Q80 68 100 76 Q98 87 80 89 Q62 87 60 76 Z" fill="#E0A33B"/>
  <circle cx="80" cy="54" r="26" fill="#A98352"/>
  <path d="M54 54 Q80 26 106 54 Q80 42 54 54 Z" fill="#C9A263"/>
  <path d="M73 60 L87 60 Q86 74 80 79 Q75 74 73 60 Z" fill="#E0A33B"/>
  <path d="M77 74 Q80 82 83 74 Z" fill="#8A6A2B"/>
  <circle cx="70" cy="53" r="4" fill="#1E1A16"/>
  <circle cx="92" cy="53" r="4" fill="#1E1A16"/>
  <circle cx="71.3" cy="51.7" r="1.3" fill="#FFFFFF"/>
  <circle cx="93.3" cy="51.7" r="1.3" fill="#FFFFFF"/>
  <path d="M64 49.2 H76" stroke="#A98352" stroke-width="3.6" stroke-linecap="round"/>
  <path d="M86 49.2 H98" stroke="#A98352" stroke-width="3.6" stroke-linecap="round"/>
  <path d="M58 44 Q70 40 78 44" stroke="#7A5F38" stroke-width="4" stroke-linecap="round" fill="none"/>
  <path d="M102 44 Q90 40 82 44" stroke="#7A5F38" stroke-width="4" stroke-linecap="round" fill="none"/>
  <g transform="rotate(6 126 96)">
    <rect x="123" y="52" width="6.5" height="72" rx="3" fill="#5E6266"/>
    <rect x="123" y="52" width="3" height="72" fill="#878C90"/>
    <path d="M108 56 Q120 47 132 51 L132 59 Q122 55 112 63 Z" fill="#9AA0A4"/>
    <path d="M132 51 L146 59 L132 61 Z" fill="#B6BCC0"/>
  </g>` },

/* 3 オコジョ｜首かしげ＋前Cの尾　まる目 */
PSFC: { animal: "オコジョ", item: "使い込んだ水筒", svg: `
  <ellipse cx="64" cy="140" rx="11" ry="7" fill="#E6E3DA"/>
  <ellipse cx="96" cy="140" rx="11" ry="7" fill="#E6E3DA"/>
  <ellipse cx="80" cy="110" rx="28" ry="30" fill="#F4F2EC"/>
  <ellipse cx="80" cy="118" rx="18" ry="19" fill="#FDFCF8"/>
  <g transform="rotate(-8 80 66)">
    <circle cx="61" cy="54" r="9" fill="#E6E3DA"/>
    <circle cx="99" cy="54" r="9" fill="#E6E3DA"/>
    <circle cx="61" cy="54" r="4.6" fill="#E9C9C2"/>
    <circle cx="99" cy="54" r="4.6" fill="#E9C9C2"/>
    <circle cx="80" cy="64" r="24" fill="#F8F6F1"/>
    <ellipse cx="80" cy="76" rx="11" ry="8.5" fill="#FDFCF8"/>
    <ellipse cx="80" cy="72" rx="3.8" ry="2.9" fill="#3A2E28"/>
    <circle cx="68.6" cy="61" r="4" fill="#1E1A16"/>
    <circle cx="90.6" cy="61" r="4" fill="#1E1A16"/>
    <circle cx="69.9" cy="59.7" r="1.3" fill="#FFFFFF"/>
    <circle cx="91.9" cy="59.7" r="1.3" fill="#FFFFFF"/>
  </g>
  <rect x="67" y="96" width="26" height="34" rx="7" fill="#2E5A70"/>
  <rect x="67" y="96" width="16" height="34" rx="7" fill="#4E88A6"/>
  <rect x="71" y="100" width="5" height="26" rx="2.5" fill="#7FB4CE"/>
  <ellipse cx="80" cy="96" rx="13" ry="4" fill="#24485C"/>
  <rect x="73" y="87" width="14" height="10" rx="3" fill="#B8B2A6"/>
  <path d="M72 111 L88 109 L89 117 L73 119 Z" fill="#E8A33B"/>
  <path d="M96 142 Q122 136 122 114 Q122 100 106 98 Q98 98 96 104
           Q108 106 110 116 Q112 128 100 134 Z" fill="#F4F2EC"/>
  <circle cx="100" cy="101" r="8.5" fill="#2E2620"/>
  <ellipse cx="60" cy="114" rx="8.5" ry="9.5" fill="#E6E3DA"/>
  <ellipse cx="100" cy="114" rx="8.5" ry="9.5" fill="#E6E3DA"/>` },

/* 4 ツキノワグマ｜ザック＋三日月＋仁王立ち　キリ目20% */
PSFA: { animal: "ツキノワグマ", item: "大型ザック", svg: `
  <rect x="44" y="122" width="24" height="30" rx="11" fill="#2B2420"/>
  <rect x="92" y="122" width="24" height="30" rx="11" fill="#2B2420"/>
  <ellipse cx="56" cy="147" rx="10" ry="5.5" fill="#5C4E44"/>
  <ellipse cx="104" cy="147" rx="10" ry="5.5" fill="#5C4E44"/>
  <path d="M30 58 Q26 96 32 112 L52 112 Q56 96 52 58 Q44 50 30 58 Z" fill="#D6503A"/>
  <path d="M30 58 Q40 48 52 58 Q52 68 48 72 Q40 66 32 72 Q28 66 30 58 Z" fill="#E8664E"/>
  <rect x="33" y="82" width="17" height="14" rx="4" fill="#B8422C"/>
  <path d="M35 78 Q41 74 48 78" stroke="#A83A24" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M130 58 Q134 96 128 112 L108 112 Q104 96 108 58 Q116 50 130 58 Z" fill="#D6503A"/>
  <path d="M130 58 Q120 48 108 58 Q108 68 112 72 Q120 66 128 72 Q132 66 130 58 Z" fill="#E8664E"/>
  <rect x="110" y="82" width="17" height="14" rx="4" fill="#B8422C"/>
  <path d="M112 78 Q118 74 125 78" stroke="#A83A24" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="80" cy="110" rx="44" ry="38" fill="#39302A"/>
  <rect x="55" y="74" width="11" height="48" rx="5.5" fill="#D6503A"/>
  <rect x="94" y="74" width="11" height="48" rx="5.5" fill="#D6503A"/>
  <rect x="55" y="92" width="11" height="6" fill="#A83A24"/>
  <rect x="94" y="92" width="11" height="6" fill="#A83A24"/>
  <path d="M60 84 Q80 122 100 84 L92 81 Q80 108 68 81 Z" fill="#EDE7D8"/>
  <rect x="56" y="100" width="9" height="9" rx="2" fill="#3E3630"/>
  <rect x="95" y="100" width="9" height="9" rx="2" fill="#3E3630"/>
  <ellipse cx="80" cy="122" rx="30" ry="10" fill="#2B2420"/>
  <ellipse cx="80" cy="113" rx="27" ry="9" fill="#463A32"/>
  <circle cx="48" cy="50" r="15" fill="#2B2420"/>
  <circle cx="112" cy="50" r="15" fill="#2B2420"/>
  <circle cx="48" cy="50" r="7.5" fill="#5C4E44"/>
  <circle cx="112" cy="50" r="7.5" fill="#5C4E44"/>
  <circle cx="80" cy="62" r="31" fill="#453A33"/>
  <ellipse cx="80" cy="77" rx="15" ry="12" fill="#C4B49E"/>
  <ellipse cx="80" cy="72" rx="5" ry="3.8" fill="#1E1815"/>
  <circle cx="68" cy="59" r="4" fill="#1E1A16"/>
  <circle cx="92" cy="59" r="4" fill="#1E1A16"/>
  <circle cx="69.3" cy="57.7" r="1.3" fill="#FFFFFF"/>
  <circle cx="93.3" cy="57.7" r="1.3" fill="#FFFFFF"/>
  <path d="M63 55.6 H73" stroke="#453A33" stroke-width="3" stroke-linecap="round"/>
  <path d="M87 55.6 H97" stroke="#453A33" stroke-width="3" stroke-linecap="round"/>` },

/* =========================================================
   稜線 PG＊＊
   ========================================================= */

/* 5 ライチョウ｜ホイッスルの音　まる目＋肉冠レシピ */
PGLC: { animal: "ライチョウ", item: "首から下げたホイッスル", svg: `
  <ellipse cx="108" cy="112" rx="18" ry="9" fill="#8E7A52" transform="rotate(20 108 112)"/>
  <ellipse cx="80" cy="104" rx="30" ry="29" fill="#B49A66"/>
  <ellipse cx="80" cy="112" rx="20" ry="19" fill="#F4F0E6"/>
  <g fill="#7A6540" opacity=".8">
    <ellipse cx="66" cy="88" rx="5.4" ry="3" transform="rotate(-16 66 88)"/>
    <ellipse cx="82" cy="84" rx="5.4" ry="3"/>
    <ellipse cx="95" cy="92" rx="5.4" ry="3" transform="rotate(16 95 92)"/>
  </g>
  <ellipse cx="55" cy="104" rx="10" ry="16" fill="#A08A5C" transform="rotate(-8 55 104)"/>
  <ellipse cx="105" cy="104" rx="10" ry="16" fill="#A08A5C" transform="rotate(8 105 104)"/>
  <ellipse cx="70" cy="130" rx="9" ry="9" fill="#EFEBE0"/>
  <ellipse cx="90" cy="130" rx="9" ry="9" fill="#EFEBE0"/>
  <g stroke="#A08A5C" stroke-width="3" stroke-linecap="round" fill="none">
    <path d="M70 137 L64 143"/><path d="M70 137 L70 144"/><path d="M70 137 L76 143"/>
    <path d="M90 137 L84 143"/><path d="M90 137 L90 144"/><path d="M90 137 L96 143"/>
  </g>
  <circle cx="80" cy="62" r="27" fill="#C2A972"/>
  <path d="M58 56 Q80 38 102 56 Q80 46 58 56 Z" fill="#7A6540"/>
  <circle cx="69" cy="61" r="5" fill="#1E1A16"/>
  <circle cx="91" cy="61" r="5" fill="#1E1A16"/>
  <circle cx="70.6" cy="59.3" r="1.7" fill="#FFFFFF"/>
  <circle cx="92.6" cy="59.3" r="1.7" fill="#FFFFFF"/>
  <path d="M64 56 A 5 4 0 0 1 74 56 Z" fill="#D8341F"/>
  <path d="M86 56 A 5 4 0 0 1 96 56 Z" fill="#D8341F"/>
  <path d="M75 70 L85 70 L80 78 Z" fill="#4A453A"/>
  <path d="M62 78 Q56 96 78 104" stroke="#D8341F" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M98 78 Q104 96 82 104" stroke="#D8341F" stroke-width="3" fill="none" stroke-linecap="round"/>
  <rect x="78" y="102" width="4" height="5" rx="1.3" fill="#B87A32"/>
  <rect x="74" y="105" width="12" height="17" rx="3" fill="#E0A055"/>
  <rect x="74" y="111" width="12" height="4" fill="#A96C28"/>` },

/* 6 ホシガラス｜星の弧　キリ目20% */
PGLA: { animal: "ホシガラス", item: "肩に掛けたザイル", svg: `
  <ellipse cx="108" cy="122" rx="22" ry="10" fill="#33302B" transform="rotate(16 108 122)"/>
  <ellipse cx="52" cy="106" rx="13" ry="22" fill="#33302B" transform="rotate(-8 52 106)"/>
  <ellipse cx="78" cy="104" rx="35" ry="33" fill="#6A5A4E"/>
  <g fill="#F2EDE3">
    <circle cx="58" cy="104" r="3.2"/><circle cx="63" cy="92" r="3.2"/><circle cx="72" cy="85" r="3.2"/>
    <circle cx="84" cy="85" r="3.2"/><circle cx="93" cy="92" r="3.2"/><circle cx="98" cy="104" r="3.2"/>
    <circle cx="78" cy="100" r="3.2"/>
  </g>
  <ellipse cx="104" cy="106" rx="13" ry="22" fill="#33302B" transform="rotate(8 104 106)"/>
  <g stroke="#C9A26B" stroke-width="4.4" stroke-linecap="round" fill="none">
    <path d="M70 130 V140"/><path d="M70 140 L61 146"/><path d="M70 140 L70 148"/><path d="M70 140 L79 146"/>
    <path d="M90 130 V140"/><path d="M90 140 L81 146"/><path d="M90 140 L90 148"/><path d="M90 140 L99 146"/>
  </g>
  <circle cx="79" cy="60" r="24" fill="#6A5A4E"/>
  <path d="M73 64 L85 64 L79 86 Z" fill="#2E2A25"/>
  <circle cx="68" cy="56" r="4" fill="#1E1A16"/>
  <circle cx="90" cy="56" r="4" fill="#1E1A16"/>
  <circle cx="69.3" cy="54.7" r="1.3" fill="#FFFFFF"/>
  <circle cx="91.3" cy="54.7" r="1.3" fill="#FFFFFF"/>
  <path d="M63 52.6 H73" stroke="#6A5A4E" stroke-width="3" stroke-linecap="round"/>
  <path d="M85 52.6 H95" stroke="#6A5A4E" stroke-width="3" stroke-linecap="round"/>
  <path d="M92 80 L58 120" stroke="#C97A2A" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="54" cy="124" rx="16" ry="12" fill="none" stroke="#E08A33" stroke-width="6"/>
  <ellipse cx="54" cy="124" rx="8" ry="6" fill="none" stroke="#C97A2A" stroke-width="5"/>
  <rect x="48" y="118" width="12" height="13" rx="3" fill="#A8641E"/>` },

/* 7 イワツバメ｜燕尾＋赤十字　まる目 */
PGFC: { animal: "イワツバメ", item: "ファーストエイドポーチ", svg: `
  <path d="M66 116 Q80 112 94 116 Q112 140 118 158 Q80 132 42 158 Q48 140 66 116 Z" fill="#2C3A50"/>
  <path d="M66 92 Q40 86 18 96 Q6 104 4 116 Q24 106 46 110 Q58 102 66 98 Z" fill="#33445E"/>
  <path d="M94 92 Q120 86 142 96 Q154 104 156 116 Q136 106 114 110 Q102 102 94 98 Z" fill="#33445E"/>
  <ellipse cx="80" cy="104" rx="28" ry="28" fill="#3A4A63"/>
  <ellipse cx="80" cy="110" rx="20" ry="21" fill="#FAF8F3"/>
  <rect x="68" y="128" width="7" height="12" rx="3.5" fill="#C9A98A"/>
  <rect x="85" y="128" width="7" height="12" rx="3.5" fill="#C9A98A"/>
  <circle cx="80" cy="60" r="24" fill="#3A4A63"/>
  <path d="M80 74 Q68 80 70 88 Q80 84 90 88 Q92 80 80 74 Z" fill="#FAF8F3"/>
  <path d="M75 64 L85 64 L80 72 Z" fill="#E3B24A"/>
  <circle cx="69" cy="56" r="4" fill="#1E1A16"/>
  <circle cx="91" cy="56" r="4" fill="#1E1A16"/>
  <circle cx="70.3" cy="54.7" r="1.3" fill="#FFFFFF"/>
  <circle cx="92.3" cy="54.7" r="1.3" fill="#FFFFFF"/>
  <ellipse cx="104" cy="74" rx="12" ry="20" fill="#33445E" transform="rotate(24 104 74)"/>
  <path d="M62 88 L92 104" stroke="#8A6A4E" stroke-width="3.6" stroke-linecap="round"/>
  <rect x="84" y="98" width="24" height="19" rx="5" fill="#FAF8F3"/>
  <rect x="84" y="98" width="24" height="5" rx="2" fill="#E4E0D6"/>
  <path d="M96 104 L96 113 M91.5 108.5 L100.5 108.5" stroke="#C2452C" stroke-width="3.4" stroke-linecap="round"/>` },

/* 8 ニホンザル｜乾杯＋頬紅　たれ目＋微笑 */
PGFA: { animal: "ニホンザル", item: "缶ビール", svg: `
  <ellipse cx="112" cy="134" rx="16" ry="7" fill="#A8895F" transform="rotate(-14 112 134)"/>
  <rect x="58" y="130" width="15" height="20" rx="7.5" fill="#8A6E44"/>
  <rect x="87" y="130" width="15" height="20" rx="7.5" fill="#8A6E44"/>
  <ellipse cx="80" cy="112" rx="34" ry="29" fill="#A8895F"/>
  <ellipse cx="78" cy="118" rx="20" ry="19" fill="#CBB184"/>
  <ellipse cx="110" cy="88" rx="11" ry="22" fill="#9A7C50" transform="rotate(24 110 88)"/>
  <ellipse cx="50" cy="116" rx="10" ry="13" fill="#8A6E44" transform="rotate(-18 50 116)"/>
  <circle cx="49" cy="62" r="11" fill="#9A7C50"/>
  <circle cx="111" cy="62" r="11" fill="#9A7C50"/>
  <circle cx="49" cy="62" r="5.5" fill="#EDAEA8"/>
  <circle cx="111" cy="62" r="5.5" fill="#EDAEA8"/>
  <circle cx="80" cy="62" r="32" fill="#A8895F"/>
  <path d="M80 30 Q58 34 51 50 Q68 40 80 40 Q92 40 109 50 Q102 34 80 30 Z" fill="#C2A578"/>
  <path d="M80 42 Q99 44 101 62 Q103 82 80 86 Q57 82 59 62 Q61 44 80 42 Z" fill="#F4A8A2"/>
  <ellipse cx="63" cy="72" rx="5" ry="3.6" fill="#E8756E"/>
  <ellipse cx="97" cy="72" rx="5" ry="3.6" fill="#E8756E"/>
  <circle cx="70.6" cy="63" r="4" fill="#1E1A16"/>
  <circle cx="89.4" cy="63" r="4" fill="#1E1A16"/>
  <circle cx="71.9" cy="61.7" r="1.3" fill="#FFFFFF"/>
  <circle cx="90.7" cy="61.7" r="1.3" fill="#FFFFFF"/>
  <path d="M64 60 Q67.5 57.6 71 59" stroke="#F4A8A2" stroke-width="3.4" stroke-linecap="round" fill="none"/>
  <path d="M96 60 Q92.5 57.6 89 59" stroke="#F4A8A2" stroke-width="3.4" stroke-linecap="round" fill="none"/>
  <ellipse cx="77.4" cy="72" rx="1.5" ry="1.2" fill="#D9857F"/>
  <ellipse cx="82.6" cy="72" rx="1.5" ry="1.2" fill="#D9857F"/>
  <path d="M74 78 Q80 83 86 78" stroke="#CE7A74" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <rect x="106" y="40" width="22" height="32" rx="4" fill="#C9A227"/>
  <rect x="106" y="40" width="11" height="32" rx="4" fill="#E8C95A"/>
  <rect x="106" y="50" width="22" height="9" fill="#F4E2A0"/>
  <ellipse cx="117" cy="40" rx="11" ry="3.6" fill="#D2CEC4"/>
  <ellipse cx="117" cy="40" rx="6" ry="2" fill="#9A968E"/>
  <circle cx="119" cy="39" r="1.8" fill="#7A766E"/>` },

/* =========================================================
   樹林帯 ES＊＊
   ========================================================= */

/* 9 ヤマネ｜毛布尾　とろん目＋微笑 */
ESLC: { animal: "ヤマネ", item: "文庫本", svg: `
  <ellipse cx="66" cy="137" rx="11" ry="9" fill="#A98A60"/>
  <ellipse cx="94" cy="137" rx="11" ry="9" fill="#A98A60"/>
  <ellipse cx="66" cy="139" rx="6" ry="4.4" fill="#C6A87C"/>
  <ellipse cx="94" cy="139" rx="6" ry="4.4" fill="#C6A87C"/>
  <ellipse cx="80" cy="112" rx="26" ry="24" fill="#C0A276"/>
  <rect x="76" y="92" width="8" height="20" fill="#6B563C"/>
  <circle cx="58" cy="64" r="13" fill="#A98A60"/>
  <circle cx="102" cy="64" r="13" fill="#A98A60"/>
  <circle cx="58" cy="64" r="7" fill="#E2C4A8"/>
  <circle cx="102" cy="64" r="7" fill="#E2C4A8"/>
  <circle cx="80" cy="74" r="24" fill="#CDB088"/>
  <path d="M80 52 L83 70 L77 70 Z" fill="#6B563C"/>
  <ellipse cx="80" cy="86" rx="11" ry="8" fill="#F7EFE0"/>
  <ellipse cx="80" cy="81" rx="3.8" ry="2.9" fill="#3A2E20"/>
  <path d="M74 91 Q80 95 86 91" stroke="#A98A60" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <circle cx="69" cy="71" r="5.4" fill="#1E1A16"/>
  <circle cx="91" cy="71" r="5.4" fill="#1E1A16"/>
  <circle cx="70.6" cy="69.2" r="1.7" fill="#FFFFFF"/>
  <circle cx="92.6" cy="69.2" r="1.7" fill="#FFFFFF"/>
  <path d="M52 108 Q56 142 80 144 Q104 142 108 108 Q100 128 80 130 Q60 128 52 108 Z" fill="#A98A60"/>
  <path d="M56 112 Q60 136 80 138 Q100 136 104 112 Q98 126 80 128 Q62 126 56 112 Z" fill="#C6A87C"/>
  <rect x="68" y="98" width="24" height="28" rx="2" fill="#22354A"/>
  <rect x="71" y="98" width="21" height="28" rx="2" fill="#2E4A66"/>
  <rect x="74" y="102" width="15" height="20" rx="1.2" fill="#3E5E80"/>
  <rect x="86" y="98" width="4" height="15" rx="1" fill="#C2452C"/>
  <ellipse cx="64" cy="116" rx="8" ry="9" fill="#A98A60"/>
  <ellipse cx="96" cy="116" rx="8" ry="9" fill="#A98A60"/>` },

/* 10 ムササビ｜凧形膜　まる目 */
ESLA: { animal: "ムササビ", item: "首に巻いた手ぬぐい", svg: `
  <path d="M30 66 Q80 56 130 66 Q136 104 116 134 Q80 142 44 134 Q24 104 30 66 Z" fill="#7A7166"/>
  <path d="M36 72 Q80 63 124 72 Q129 103 112 128 Q80 135 48 128 Q31 103 36 72 Z" fill="#8E8478"/>
  <ellipse cx="34" cy="68" rx="11" ry="9" fill="#6A6157" transform="rotate(-20 34 68)"/>
  <ellipse cx="126" cy="68" rx="11" ry="9" fill="#6A6157" transform="rotate(20 126 68)"/>
  <ellipse cx="46" cy="134" rx="10" ry="7" fill="#6A6157"/>
  <ellipse cx="114" cy="134" rx="10" ry="7" fill="#6A6157"/>
  <ellipse cx="80" cy="106" rx="27" ry="27" fill="#8E8478"/>
  <ellipse cx="80" cy="114" rx="17" ry="16" fill="#F0EAE0"/>
  <circle cx="58" cy="52" r="10" fill="#7A7166"/>
  <circle cx="102" cy="52" r="10" fill="#7A7166"/>
  <circle cx="80" cy="64" r="26" fill="#9A9084"/>
  <ellipse cx="80" cy="76" rx="11" ry="8" fill="#F0EAE0"/>
  <ellipse cx="80" cy="72" rx="3.8" ry="2.9" fill="#2E2A24"/>
  <circle cx="67" cy="61" r="6.4" fill="#1E1A16"/>
  <circle cx="93" cy="61" r="6.4" fill="#1E1A16"/>
  <circle cx="69.2" cy="58.8" r="2" fill="#FFFFFF"/>
  <circle cx="95.2" cy="58.8" r="2" fill="#FFFFFF"/>
  <path d="M64 84 Q68 94 76 98 L84 98 Q92 94 96 84 Q80 92 64 84 Z" fill="#2E4A6E"/>
  <path d="M75 100 L72 122 L80 121 L80 99 Z" fill="#3A5E86"/>
  <path d="M85 100 L88 122 L80 121 L80 99 Z" fill="#26405E"/>
  <g fill="#DCE8F0">
    <circle cx="77" cy="107" r="2"/><circle cx="84" cy="113" r="2"/><circle cx="76" cy="117" r="1.7"/>
    <circle cx="70" cy="90" r="1.7"/><circle cx="90" cy="90" r="1.7"/>
  </g>` },

/* 11 ホンドタヌキ｜座り＋マグ　とろん目＋微笑 */
ESFC: { animal: "ホンドタヌキ", item: "湯気の立つマグカップ", svg: `
  <ellipse cx="118" cy="128" rx="24" ry="11" fill="#8A7259" transform="rotate(-10 118 128)"/>
  <path d="M104 122 Q116 120 128 124 M106 133 Q118 134 130 130" stroke="#5A4632" stroke-width="4"/>
  <ellipse cx="80" cy="130" rx="34" ry="14" fill="#6F5B44"/>
  <ellipse cx="79" cy="108" rx="33" ry="30" fill="#8A7259"/>
  <ellipse cx="79" cy="116" rx="21" ry="19" fill="#CDBCA1"/>
  <ellipse cx="50" cy="132" rx="13" ry="9" fill="#6F5B44" transform="rotate(-10 50 132)"/>
  <ellipse cx="108" cy="132" rx="13" ry="9" fill="#6F5B44" transform="rotate(10 108 132)"/>
  <ellipse cx="50" cy="134" rx="7" ry="4.6" fill="#8A7259" transform="rotate(-10 50 134)"/>
  <ellipse cx="108" cy="134" rx="7" ry="4.6" fill="#8A7259" transform="rotate(10 108 134)"/>
  <circle cx="57" cy="46" r="11" fill="#6F5B44"/>
  <circle cx="101" cy="46" r="11" fill="#6F5B44"/>
  <circle cx="79" cy="64" r="29" fill="#97806A"/>
  <ellipse cx="65" cy="62" rx="12" ry="10" fill="#6A5642" transform="rotate(-16 65 62)"/>
  <ellipse cx="93" cy="62" rx="12" ry="10" fill="#6A5642" transform="rotate(16 93 62)"/>
  <ellipse cx="79" cy="78" rx="12" ry="9" fill="#E4DACB"/>
  <ellipse cx="79" cy="74" rx="4.2" ry="3.2" fill="#2C231B"/>
  <path d="M73 83 Q79 87 85 83" stroke="#A8907A" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <circle cx="66" cy="61" r="5.2" fill="#1E1A16"/>
  <circle cx="92" cy="61" r="5.2" fill="#1E1A16"/>
  <circle cx="67.6" cy="59.3" r="1.7" fill="#FFFFFF"/>
  <circle cx="93.6" cy="59.3" r="1.7" fill="#FFFFFF"/>
  <path d="M72 103 Q68 99 72 95" stroke="#FBFAF6" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <path d="M79 101 Q75 97 79 93" stroke="#FBFAF6" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <path d="M86 103 Q90 99 86 95" stroke="#FBFAF6" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <path d="M91 112 Q102 117 91 122" stroke="#9FC4C0" stroke-width="6" fill="none"/>
  <rect x="67" y="107" width="24" height="22" rx="5" fill="#6FA6A2"/>
  <rect x="67" y="107" width="15" height="22" rx="5" fill="#8FC4C0"/>
  <ellipse cx="79" cy="107" rx="12" ry="3.8" fill="#4E8480"/>
  <ellipse cx="79" cy="106.6" rx="8.6" ry="2.6" fill="#7A5A3C"/>
  <ellipse cx="63" cy="118" rx="9" ry="10" fill="#6F5B44"/>
  <ellipse cx="95" cy="118" rx="9" ry="10" fill="#6F5B44"/>
  <ellipse cx="67" cy="116" rx="5" ry="6" fill="#8A7259" transform="rotate(-14 67 116)"/>
  <ellipse cx="91" cy="116" rx="5" ry="6" fill="#8A7259" transform="rotate(14 91 116)"/>` },

/* 12 ホンドギツネ｜流れる尾＋花びら　たれ目＋微笑 */
ESFA: { animal: "ホンドギツネ", item: "一輪の花", svg: `
  <path d="M94 124 Q128 128 140 104 Q146 92 142 82" stroke="#C4703A" stroke-width="18"
        fill="none" stroke-linecap="round"/>
  <path d="M140 104 Q146 92 142 82" stroke="#F4EDE2" stroke-width="18"
        fill="none" stroke-linecap="round"/>
  <rect x="62" y="132" width="12" height="17" rx="5.5" fill="#A85832"/>
  <rect x="86" y="132" width="12" height="17" rx="5.5" fill="#A85832"/>
  <ellipse cx="78" cy="112" rx="31" ry="29" fill="#C4703A"/>
  <ellipse cx="78" cy="120" rx="19" ry="18" fill="#F4EDE2"/>
  <path d="M55 64 L60 28 L82 52 Z" fill="#C4703A"/>
  <path d="M60 60 L63 38 L76 53 Z" fill="#F0C7B2"/>
  <path d="M103 64 L98 28 L76 52 Z" fill="#C4703A"/>
  <path d="M98 60 L95 38 L82 53 Z" fill="#F0C7B2"/>
  <circle cx="79" cy="64" r="26" fill="#D07F45"/>
  <path d="M79 52 Q64 66 79 88 Q94 66 79 52 Z" fill="#F4EDE2"/>
  <ellipse cx="79" cy="82" rx="4.2" ry="3.1" fill="#2E2118"/>
  <path d="M73 87 Q79 91 85 87" stroke="#C9A78E" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <circle cx="66.6" cy="63" r="4" fill="#1E1A16"/>
  <circle cx="91.4" cy="63" r="4" fill="#1E1A16"/>
  <circle cx="67.9" cy="61.7" r="1.3" fill="#FFFFFF"/>
  <circle cx="92.7" cy="61.7" r="1.3" fill="#FFFFFF"/>
  <path d="M60 60 Q63.5 57.6 67 59" stroke="#D07F45" stroke-width="3.4" stroke-linecap="round" fill="none"/>
  <path d="M98 60 Q94.5 57.6 91 59" stroke="#D07F45" stroke-width="3.4" stroke-linecap="round" fill="none"/>
  <path d="M66 130 Q56 112 46 100" stroke="#6E8B5E" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  <path d="M54 114 Q48 106 52 98" stroke="#6E8B5E" stroke-width="2.8" fill="none" stroke-linecap="round"/>
  <circle cx="40" cy="88" r="6.4" fill="#F2B9CE"/>
  <circle cx="31" cy="94" r="6.4" fill="#F2B9CE"/>
  <circle cx="34" cy="104" r="6.4" fill="#F2B9CE"/>
  <circle cx="45" cy="103" r="6.4" fill="#F2B9CE"/>
  <circle cx="48" cy="93" r="6.4" fill="#F2B9CE"/>
  <circle cx="39.5" cy="96" r="4.6" fill="#E8A33B"/>
  <ellipse cx="118" cy="66" rx="7" ry="4.6" fill="#F2B9CE" transform="rotate(-28 118 66)"/>
  <ellipse cx="134" cy="56" rx="6" ry="4" fill="#F2B9CE" transform="rotate(-18 134 56)"/>
  <ellipse cx="126" cy="44" rx="5" ry="3.4" fill="#F2B9CE" transform="rotate(-34 126 44)"/>
  <ellipse cx="62" cy="122" rx="9" ry="10" fill="#A85832"/>` },

/* =========================================================
   高原 EG＊＊
   ========================================================= */

/* 13 ニホンジカ｜角の旗（フリーズ） */
EGLC: { animal: "ニホンジカ", item: "先導用の小旗", svg: `
  <rect x="58" y="128" width="12" height="20" rx="5.5" fill="#8A6238"/>
  <rect x="90" y="128" width="12" height="20" rx="5.5" fill="#8A6238"/>
  <ellipse cx="80" cy="112" rx="34" ry="30" fill="#A5764A"/>
  <circle cx="60" cy="106" r="3" fill="#EFE3D0"/>
  <circle cx="74" cy="100" r="3" fill="#EFE3D0"/>
  <circle cx="96" cy="104" r="3" fill="#EFE3D0"/>
  <circle cx="102" cy="116" r="3" fill="#EFE3D0"/>
  <ellipse cx="80" cy="122" rx="20" ry="17" fill="#EFE3D0"/>
  <ellipse cx="52" cy="118" rx="10" ry="11" fill="#8A6238" transform="rotate(-24 52 118)"/>
  <path d="M63 58 Q50 40 54 20" stroke="#8A6A45" stroke-width="5.4" fill="none" stroke-linecap="round"/>
  <path d="M56 34 Q44 28 38 18" stroke="#8A6A45" stroke-width="4.6" fill="none" stroke-linecap="round"/>
  <path d="M97 58 Q110 40 106 20" stroke="#8A6A45" stroke-width="5.4" fill="none" stroke-linecap="round"/>
  <path d="M104 34 Q116 28 122 18" stroke="#8A6A45" stroke-width="4.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="57" cy="66" rx="9.5" ry="13" fill="#8A6238" transform="rotate(-30 57 66)"/>
  <ellipse cx="103" cy="66" rx="9.5" ry="13" fill="#8A6238" transform="rotate(30 103 66)"/>
  <ellipse cx="80" cy="72" rx="25" ry="26" fill="#B4855A"/>
  <ellipse cx="80" cy="87" rx="13" ry="11" fill="#EFE3D0"/>
  <ellipse cx="80" cy="83" rx="4.4" ry="3.3" fill="#3A2A1C"/>
  <circle cx="69" cy="70" r="5.2" fill="#1E1A16"/>
  <circle cx="91" cy="70" r="5.2" fill="#1E1A16"/>
  <circle cx="70.6" cy="68.3" r="1.7" fill="#FFFFFF"/>
  <circle cx="92.6" cy="68.3" r="1.7" fill="#FFFFFF"/>
  <path d="M74 92 Q80 97 86 92" stroke="#C4A88A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <rect x="106" y="52" width="5.5" height="86" rx="2.7" fill="#9A7C4E"/>
  <rect x="106" y="52" width="2.4" height="86" fill="#B89A68"/>
  <path d="M111 56 L142 68 L111 80 Z" fill="#C2452C"/>
  <path d="M111 56 L142 68 L111 68 Z" fill="#D85F44"/>
  <ellipse cx="108" cy="112" rx="10" ry="11" fill="#8A6238" transform="rotate(18 108 112)"/>` },

/* 14 ヤマセミ｜ウインク（フリーズ） */
EGLA: { animal: "ヤマセミ", item: "三脚カメラ", svg: `
  <path d="M102 114 Q128 118 140 132 Q120 132 104 126 Z" fill="#3A3A38"/>
  <ellipse cx="78" cy="104" rx="34" ry="32" fill="#3A3A38"/>
  <ellipse cx="77" cy="114" rx="22" ry="21" fill="#F7F5F0"/>
  <g fill="#F7F5F0">
    <rect x="54" y="88" width="8" height="4.6" rx="2.3" transform="rotate(-12 54 88)"/>
    <rect x="70" y="84" width="8" height="4.6" rx="2.3"/>
    <rect x="90" y="90" width="8" height="4.6" rx="2.3" transform="rotate(12 90 90)"/>
    <rect x="50" y="104" width="8" height="4.6" rx="2.3" transform="rotate(-6 50 104)"/>
    <rect x="98" y="106" width="8" height="4.6" rx="2.3" transform="rotate(6 98 106)"/>
  </g>
  <ellipse cx="48" cy="106" rx="13" ry="22" fill="#4A4A46" transform="rotate(-8 48 106)"/>
  <path d="M62 48 Q54 28 66 20 Q70 36 74 44 Z" fill="#3A3A38"/>
  <path d="M72 44 Q72 20 82 14 Q80 32 86 44 Z" fill="#3A3A38"/>
  <path d="M84 44 Q92 24 104 20 Q93 36 95 48 Z" fill="#3A3A38"/>
  <circle cx="78" cy="60" r="25" fill="#3A3A38"/>
  <path d="M58 66 Q64 74 72 76 Q67 68 65 60 Z" fill="#F7F5F0"/>
  <path d="M98 66 Q92 74 84 76 Q89 68 91 60 Z" fill="#F7F5F0"/>
  <path d="M66 80 Q78 74 90 80 Q88 90 78 92 Q68 90 66 80 Z" fill="#E4C79A"/>
  <path d="M72 66 L85 66 Q83 78 78 82 Q74 78 72 66 Z" fill="#5B5B57"/>
  <circle cx="67" cy="55" r="5" fill="#1E1A16"/>
  <circle cx="91" cy="55" r="5" fill="#1E1A16"/>
  <circle cx="68.6" cy="53.3" r="1.7" fill="#FFFFFF"/>
  <circle cx="92.6" cy="53.3" r="1.7" fill="#FFFFFF"/>
  <g stroke="#D8A63E" stroke-width="3.6" stroke-linecap="round" fill="none">
    <path d="M70 128 V138"/><path d="M70 138 L63 144"/><path d="M70 138 L70 146"/><path d="M70 138 L77 144"/>
    <path d="M88 128 V138"/><path d="M88 138 L81 144"/><path d="M88 138 L88 146"/><path d="M88 138 L95 144"/>
  </g>
  <path d="M62 126 L50 154 M94 126 L106 154 M78 126 L78 154"
        stroke="#A8A296" stroke-width="5" stroke-linecap="round"/>
  <rect x="70" y="120" width="16" height="10" rx="3" fill="#A8A296"/>
  <rect x="60" y="98" width="36" height="24" rx="5" fill="#C9C3B8"/>
  <rect x="84" y="93" width="10" height="6" rx="2" fill="#C9C3B8"/>
  <circle cx="78" cy="110" r="9" fill="#8A857A"/>
  <circle cx="78" cy="110" r="4.6" fill="#4EC0D8"/>
  <circle cx="80" cy="108" r="1.6" fill="#C7EEF6"/>` },

/* 15 ニホンリス｜背負い雫尾　まる目 */
EGFC: { animal: "ニホンリス", item: "みんなに配るどんぐり", svg: `
  <ellipse cx="114" cy="82" rx="27" ry="46" fill="#C79A5A" transform="rotate(16 114 82)"/>
  <ellipse cx="114" cy="86" rx="17" ry="33" fill="#DDB77A" transform="rotate(16 114 86)"/>
  <path d="M104 40 Q120 20 132 34 Q120 36 112 50 Z" fill="#C79A5A"/>
  <ellipse cx="74" cy="110" rx="29" ry="29" fill="#B58445"/>
  <ellipse cx="74" cy="118" rx="18" ry="18" fill="#F2E7D7"/>
  <ellipse cx="60" cy="138" rx="10" ry="7" fill="#9E7038"/>
  <ellipse cx="88" cy="138" rx="10" ry="7" fill="#9E7038"/>
  <path d="M58 54 L54 22 L74 46 Z" fill="#9E7038"/>
  <path d="M62 50 L59 32 L70 46 Z" fill="#D9B98E"/>
  <path d="M90 54 L94 22 L74 46 Z" fill="#9E7038"/>
  <path d="M86 50 L89 32 L78 46 Z" fill="#D9B98E"/>
  <circle cx="74" cy="64" r="25" fill="#BE8F4E"/>
  <ellipse cx="74" cy="78" rx="12" ry="9" fill="#F2E7D7"/>
  <ellipse cx="74" cy="73" rx="4" ry="3" fill="#3A241A"/>
  <circle cx="63" cy="61" r="4.4" fill="#1E1A16"/>
  <circle cx="85" cy="61" r="4.4" fill="#1E1A16"/>
  <circle cx="64.4" cy="59.6" r="1.4" fill="#FFFFFF"/>
  <circle cx="86.4" cy="59.6" r="1.4" fill="#FFFFFF"/>
  <ellipse cx="44" cy="112" rx="10" ry="11" fill="#9E7038" transform="rotate(-22 44 112)"/>
  <ellipse cx="104" cy="112" rx="10" ry="11" fill="#9E7038" transform="rotate(22 104 112)"/>
  <g>
    <ellipse cx="42" cy="104" rx="8" ry="10" fill="#7A5124"/>
    <ellipse cx="40" cy="103" rx="4.2" ry="7" fill="#9E6B33"/>
    <path d="M34 97 Q42 89 50 96 Q42 100 34 97 Z" fill="#4A2F16"/>
    <path d="M42 89 L42 85" stroke="#4A2F16" stroke-width="2.2" stroke-linecap="round"/>
  </g>
  <g>
    <ellipse cx="106" cy="104" rx="8" ry="10" fill="#7A5124"/>
    <ellipse cx="104" cy="103" rx="4.2" ry="7" fill="#9E6B33"/>
    <path d="M98 97 Q106 89 114 96 Q106 100 98 97 Z" fill="#4A2F16"/>
    <path d="M106 89 L106 85" stroke="#4A2F16" stroke-width="2.2" stroke-linecap="round"/>
  </g>` },

/* 16 ノウサギ｜片耳倒し＋開き口＋自撮り　まる目＋上目 */
EGFA: { animal: "ノウサギ", item: "自撮り棒つきスマホ", svg: `
  <g transform="rotate(-8 80 100)">
    <ellipse cx="106" cy="126" rx="11" ry="9" fill="#F2ECE2"/>
    <rect x="60" y="130" width="14" height="20" rx="7" fill="#96866F"/>
    <rect x="86" y="130" width="14" height="20" rx="7" fill="#96866F"/>
    <ellipse cx="80" cy="110" rx="30" ry="28" fill="#AE9C86"/>
    <ellipse cx="80" cy="118" rx="19" ry="17" fill="#F2ECE2"/>
    <ellipse cx="64" cy="42" rx="9" ry="26" fill="#AE9C86" transform="rotate(-10 64 42)"/>
    <ellipse cx="64" cy="44" rx="4.5" ry="19" fill="#D9BFB2" transform="rotate(-10 64 44)"/>
    <ellipse cx="110" cy="62" rx="9" ry="26" fill="#AE9C86" transform="rotate(48 110 62)"/>
    <ellipse cx="110" cy="62" rx="4.5" ry="19" fill="#D9BFB2" transform="rotate(48 110 62)"/>
    <circle cx="80" cy="72" r="26" fill="#BCAB95"/>
    <ellipse cx="80" cy="84" rx="11" ry="8" fill="#F6F1E8"/>
    <ellipse cx="80" cy="79" rx="3.6" ry="2.6" fill="#3A3027"/>
    <ellipse cx="80" cy="89" rx="4.2" ry="4.6" fill="#8A5E58"/>
    <circle cx="68" cy="68" r="4.2" fill="#1E1A16"/>
    <circle cx="92" cy="68" r="4.2" fill="#1E1A16"/>
    <circle cx="69.4" cy="66.6" r="1.4" fill="#FFFFFF"/>
    <circle cx="93.4" cy="66.6" r="1.4" fill="#FFFFFF"/>
    <path d="M60 116 Q46 100 40 82" stroke="#5B5B57" stroke-width="5" stroke-linecap="round" fill="none"/>
    <g transform="rotate(-20 36 66)">
      <rect x="24" y="44" width="25" height="36" rx="5" fill="#6FD8B0"/>
      <rect x="26.5" y="46.5" width="20" height="31" rx="3.5" fill="#8FE4C4"/>
      <rect x="29" y="49" width="11" height="8" rx="2.5" fill="#3E5A52"/>
      <circle cx="33" cy="53" r="2.6" fill="#1E2E2A"/>
      <circle cx="33" cy="53" r="1.2" fill="#7FBFA8"/>
      <circle cx="37.5" cy="53" r="1.3" fill="#2E453F"/>
    </g>
    <ellipse cx="58" cy="114" rx="9" ry="10" fill="#96866F"/>
  </g>` },

};

/* ---------- 4生息エリアの色 ----------
   目的軸（高山 P / 森 E）× 仲間軸（単独 S / 群れ G）で4分類。
   band  : ページ背景に敷く淡色
   circle: キャラクターの背景円（bandより一段淡い）
   deep  : コードのプレート色（白抜き文字）*/
const GROUPS = {
  PS: { name: "岩稜帯", lead: "高い場所へ、ひとりで", axis: "ピークハント × ソロ",
        band: "#E3EBF0", circle: "#E3EDF3", deep: "#3E5C6E" },
  PG: { name: "稜線",   lead: "尾根づたいに、仲間と", axis: "ピークハント × グループ",
        band: "#F3E6E1", circle: "#F5E7E1", deep: "#B5533A" },
  ES: { name: "樹林帯", lead: "静かな森を、ひとりで", axis: "エンジョイ × ソロ",
        band: "#E2ECE4", circle: "#E1EDE5", deep: "#4E7A57" },
  EG: { name: "高原",   lead: "開けた場所で、仲間と", axis: "エンジョイ × グループ",
        band: "#F4EBDB", circle: "#F6EDDC", deep: "#A5761F" },
};

/* コードから生息エリアを引く（PSLC → PS） */
function groupOf(code) {
  return GROUPS[code.slice(0, 2)] || GROUPS.PS;
}

function characterSVG(code, cls, noBadge) {
  const c = CHARACTERS[code];
  if (!c) return "";
  const bg = groupOf(code).circle;
  const badge = noBadge ? "" : `<circle cx="80" cy="80" r="76" fill="${bg}"/>`;
  const label = noBadge ? `aria-hidden="true"` : `role="img" aria-label="${c.animal}"`;
  return `<svg viewBox="0 0 160 160" class="${cls || "char"}" ${label}>${badge}${c.svg}</svg>`;
}

const SECRET_CHARACTERS = {

/* 17 ヤマコウモリ｜逆さま（フリーズ＋足の丸2個） */
bat: { animal: "ヤマコウモリ（夜行）", item: "ヘッドランプ", bg: "#2B3A4A", svg: `
  <circle cx="122" cy="34" r="12" fill="#F4E6B8" opacity=".9"/>
  <circle cx="116" cy="30" r="10" fill="#2B3A4A"/>
  <g fill="#FFFFFF" opacity=".5">
    <circle cx="28" cy="28" r="1.8"/><circle cx="48" cy="16" r="1.3"/><circle cx="18" cy="56" r="1.5"/>
    <circle cx="142" cy="70" r="1.5"/><circle cx="34" cy="92" r="1.3"/><circle cx="146" cy="44" r="1.2"/>
  </g>
  <path d="M14 16 H146" stroke="#4A5A66" stroke-width="7" stroke-linecap="round"/>
  <circle cx="72" cy="18" r="6" fill="#3E3440"/>
  <circle cx="88" cy="18" r="6" fill="#3E3440"/>
  <path d="M66 34 Q40 30 20 44 Q8 54 8 70 Q24 58 42 60 Q34 72 34 86
           Q54 76 66 58 Z" fill="#4A3E48"/>
  <path d="M66 40 Q44 40 26 50 M66 50 Q48 56 40 70" stroke="#6A5C68" stroke-width="2.4" fill="none"/>
  <path d="M94 34 Q120 30 140 44 Q152 54 152 70 Q136 58 118 60 Q126 72 126 86
           Q106 76 94 58 Z" fill="#4A3E48"/>
  <path d="M94 40 Q116 40 134 50 M94 50 Q112 56 120 70" stroke="#6A5C68" stroke-width="2.4" fill="none"/>
  <ellipse cx="80" cy="56" rx="22" ry="25" fill="#5C4E5A"/>
  <ellipse cx="80" cy="50" rx="13" ry="16" fill="#7A6A76"/>
  <path d="M58 118 Q52 142 68 134 Q66 122 70 112 Z" fill="#5C4E5A"/>
  <path d="M102 118 Q108 142 92 134 Q94 122 90 112 Z" fill="#5C4E5A"/>
  <path d="M60 118 Q58 132 64 128 Q62 122 64 116 Z" fill="#8A7684"/>
  <path d="M100 118 Q102 132 96 128 Q98 122 96 116 Z" fill="#8A7684"/>
  <circle cx="80" cy="98" r="25" fill="#6A5A66"/>
  <ellipse cx="80" cy="86" rx="12" ry="9" fill="#8A7684"/>
  <ellipse cx="80" cy="90" rx="4" ry="3" fill="#2A2028"/>
  <circle cx="69" cy="101" r="4.8" fill="#E0A33B"/>
  <circle cx="91" cy="101" r="4.8" fill="#E0A33B"/>
  <circle cx="69" cy="101" r="2.6" fill="#14100E"/>
  <circle cx="91" cy="101" r="2.6" fill="#14100E"/>
  <circle cx="70.4" cy="99.4" r="1.3" fill="#FFFFFF"/>
  <circle cx="92.4" cy="99.4" r="1.3" fill="#FFFFFF"/>
  <path d="M63 105.4 H75" stroke="#6A5A66" stroke-width="3" stroke-linecap="round"/>
  <path d="M85 105.4 H97" stroke="#6A5A66" stroke-width="3" stroke-linecap="round"/>
  <path d="M56 112 Q80 124 104 112 L102 105 Q80 116 58 105 Z" fill="#3E4A52"/>
  <rect x="69" y="114" width="22" height="15" rx="4" fill="#4E6B7A"/>
  <circle cx="80" cy="121.5" r="5.2" fill="#FFE9A8"/>
  <path d="M80 127 L44 160 L116 160 Z" fill="#FFE9A8" opacity=".2"/>` },

/* 18 ライチョウ冬毛｜雪埋まり　まる目＋肉冠レシピ（5と同一） */
ptarmigan: { animal: "ライチョウ（冬毛）", item: "首から下げたホイッスル", bg: "#9FBACC", svg: `
  <g fill="#FFFFFF" opacity=".75">
    <circle cx="26" cy="34" r="3"/><circle cx="48" cy="20" r="2.2"/><circle cx="134" cy="30" r="2.6"/>
    <circle cx="118" cy="16" r="2"/><circle cx="20" cy="72" r="2.2"/><circle cx="142" cy="66" r="2.6"/>
  </g>
  <ellipse cx="110" cy="110" rx="18" ry="9" fill="#E4EBF0" transform="rotate(20 110 110)"/>
  <circle cx="80" cy="101" r="33" fill="#FDFEFE"/>
  <ellipse cx="80" cy="108" rx="21" ry="20" fill="#FFFFFF"/>
  <g fill="none" stroke="#C6D2DA" stroke-width="2.6" stroke-linecap="round">
    <path d="M58 96 Q64 100 70 96"/><path d="M74 96 Q80 100 86 96"/><path d="M90 96 Q96 100 102 96"/>
    <path d="M66 108 Q72 112 78 108"/><path d="M82 108 Q88 112 94 108"/>
    <path d="M58 120 Q64 124 70 120"/><path d="M74 120 Q80 124 86 120"/><path d="M90 120 Q96 124 102 120"/>
  </g>
  <ellipse cx="54" cy="102" rx="11" ry="17" fill="#F0F5F8" transform="rotate(-8 54 102)"/>
  <ellipse cx="106" cy="102" rx="11" ry="17" fill="#F0F5F8" transform="rotate(8 106 102)"/>
  <ellipse cx="70" cy="128" rx="10" ry="10" fill="#F2F7FA"/>
  <ellipse cx="90" cy="128" rx="10" ry="10" fill="#F2F7FA"/>
  <circle cx="80" cy="58" r="27" fill="#FFFFFF"/>
  <circle cx="69" cy="57" r="5" fill="#1E1A16"/>
  <circle cx="91" cy="57" r="5" fill="#1E1A16"/>
  <circle cx="70.6" cy="55.3" r="1.7" fill="#FFFFFF"/>
  <circle cx="92.6" cy="55.3" r="1.7" fill="#FFFFFF"/>
  <path d="M64 52 A 5 4 0 0 1 74 52 Z" fill="#D8341F"/>
  <path d="M86 52 A 5 4 0 0 1 96 52 Z" fill="#D8341F"/>
  <path d="M75 66 L85 66 L80 74 Z" fill="#4A453A"/>
  <path d="M62 74 Q56 92 78 100" stroke="#D8341F" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M98 74 Q104 92 82 100" stroke="#D8341F" stroke-width="3" fill="none" stroke-linecap="round"/>
  <rect x="78" y="98" width="4" height="5" rx="1.3" fill="#B87A32"/>
  <rect x="74" y="101" width="12" height="17" rx="3" fill="#E0A055"/>
  <rect x="74" y="107" width="12" height="4" fill="#A96C28"/>
  <path d="M0 128 Q30 116 62 122 Q96 128 128 118 Q148 112 160 118 L160 160 L0 160 Z" fill="#EDF4F8"/>
  <path d="M0 138 Q40 130 78 136 Q118 142 160 132 L160 160 L0 160 Z" fill="#FBFDFE"/>
  <g fill="#FFFFFF" opacity=".9">
    <circle cx="34" cy="146" r="2.4"/><circle cx="124" cy="150" r="2.2"/><circle cx="60" cy="152" r="2"/>
  </g>` },

};


/* ---------- 生息エリアのアイコン（タブ用） ---------- */
const AREA_ICONS = {
  PS: '<path d="M6 46 L20 20 L30 34 L40 10 L54 46 Z"/><path d="M40 10 L46 22 L34 26 Z" fill="#fff" opacity=".45"/>',
  PG: '<path d="M4 44 L18 26 L28 36 L40 18 L56 44 Z" opacity=".32"/><path d="M4 44 Q18 30 30 38 Q42 24 56 40" stroke-width="4.4" fill="none" stroke-linecap="round" stroke="currentColor"/>',
  ES: '<path d="M16 44 L24 44 L20 20 Z"/><path d="M12 34 L28 34 L20 14 Z"/><path d="M34 46 L42 46 L38 24 Z" opacity=".55"/><path d="M30 38 L46 38 L38 18 Z" opacity=".55"/>',
  EG: '<path d="M4 42 Q16 34 30 38 Q44 42 56 34 L56 48 L4 48 Z"/><circle cx="44" cy="16" r="7" opacity=".45"/>',
};

/* エリアのアイコンSVGを返す */
function areaIcon(key) {
  const g = GROUPS[key];
  if (!g || !AREA_ICONS[key]) return "";
  return `<svg class="gtab-icon" viewBox="0 0 60 56" fill="${g.deep}" color="${g.deep}"
               role="img" aria-label="${g.name}">${AREA_ICONS[key]}</svg>`;
}

/* シークレットのSVGを組み立てる（背景の情景を円で切り抜く） */
function secretSVG(id, cls) {
  const c = SECRET_CHARACTERS[id];
  if (!c) return "";
  const clip = "sec-clip-" + id;
  return `<svg viewBox="0 0 160 160" class="${cls || "char"}" role="img" aria-label="${c.animal}">
    <defs><clipPath id="${clip}"><circle cx="80" cy="80" r="76"/></clipPath></defs>
    <circle cx="80" cy="80" r="76" fill="${c.bg}"/>
    <g clip-path="url(#${clip})">${c.svg}</g>
  </svg>`;
}
