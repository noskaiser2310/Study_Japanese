
import { JapaneseCharacter, OrganizedTableData, VocabularyWord, CharacterScriptType } from './types';

// Raw data structure from the user
const characterLibraryData: Record<string, {kana: string, romaji: string, example?: any, note?: string}[]> = {
  "hiragana": [
    {"kana": "あ", "romaji": "a", "example": {"word": "あさ", "romaji_example": "asa", "meaning_vi": "buổi sáng"}},
    {"kana": "い", "romaji": "i", "example": {"word": "いぬ", "romaji_example": "inu", "meaning_vi": "con chó"}},
    {"kana": "う", "romaji": "u", "example": {"word": "うみ", "romaji_example": "umi", "meaning_vi": "biển"}},
    {"kana": "え", "romaji": "e", "example": {"word": "えき", "romaji_example": "eki", "meaning_vi": "nhà ga"}},
    {"kana": "お", "romaji": "o", "example": {"word": "おちゃ", "romaji_example": "ocha", "meaning_vi": "trà"}},
    {"kana": "か", "romaji": "ka", "example": {"word": "かさ", "romaji_example": "kasa", "meaning_vi": "cái ô"}},
    {"kana": "き", "romaji": "ki", "example": {"word": "きもの", "romaji_example": "kimono", "meaning_vi": "áo Kimono"}},
    {"kana": "く", "romaji": "ku", "example": {"word": "くつ", "romaji_example": "kutsu", "meaning_vi": "giày"}},
    {"kana": "け", "romaji": "ke", "example": {"word": "けしき", "romaji_example": "keshiki", "meaning_vi": "phong cảnh"}},
    {"kana": "こ", "romaji": "ko", "example": {"word": "こども", "romaji_example": "kodomo", "meaning_vi": "trẻ em"}},
    {"kana": "さ", "romaji": "sa", "example": {"word": "さかな", "romaji_example": "sakana", "meaning_vi": "con cá"}},
    {"kana": "し", "romaji": "shi", "example": {"word": "しんぶん", "romaji_example": "shinbun", "meaning_vi": "báo"}},
    {"kana": "す", "romaji": "su", "example": {"word": "すし", "romaji_example": "sushi", "meaning_vi": "món sushi"}},
    {"kana": "せ", "romaji": "se", "example": {"word": "せんせい", "romaji_example": "sensei", "meaning_vi": "giáo viên"}},
    {"kana": "そ", "romaji": "so", "example": {"word": "そら", "romaji_example": "sora", "meaning_vi": "bầu trời"}},
    {"kana": "た", "romaji": "ta", "example": {"word": "たかい", "romaji_example": "takai", "meaning_vi": "cao, đắt"}},
    {"kana": "ち", "romaji": "chi", "example": {"word": "ちいさい", "romaji_example": "chiisai", "meaning_vi": "nhỏ"}},
    {"kana": "つ", "romaji": "tsu", "example": {"word": "つくえ", "romaji_example": "tsukue", "meaning_vi": "cái bàn"}},
    {"kana": "て", "romaji": "te", "example": {"word": "てがみ", "romaji_example": "tegami", "meaning_vi": "bức thư"}},
    {"kana": "と", "romaji": "to", "example": {"word": "とけい", "romaji_example": "tokei", "meaning_vi": "đồng hồ"}},
    {"kana": "な", "romaji": "na", "example": {"word": "なまえ", "romaji_example": "namae", "meaning_vi": "tên"}},
    {"kana": "に", "romaji": "ni", "example": {"word": "にほん", "romaji_example": "nihon", "meaning_vi": "Nhật Bản"}},
    {"kana": "ぬ", "romaji": "nu", "example": {"word": "ぬの", "romaji_example": "nuno", "meaning_vi": "vải"}},
    {"kana": "ね", "romaji": "ne", "example": {"word": "ねこ", "romaji_example": "neko", "meaning_vi": "con mèo"}},
    {"kana": "の", "romaji": "no", "example": {"word": "のりもの", "romaji_example": "norimono", "meaning_vi": "phương tiện di chuyển"}},
    {"kana": "は", "romaji": "ha", "example": {"word": "はな", "romaji_example": "hana", "meaning_vi": "hoa"}},
    {"kana": "ひ", "romaji": "hi", "example": {"word": "ひと", "romaji_example": "hito", "meaning_vi": "người"}},
    {"kana": "ふ", "romaji": "fu", "example": {"word": "ふね", "romaji_example": "fune", "meaning_vi": "thuyền"}},
    {"kana": "へ", "romaji": "he", "example": {"word": "へや", "romaji_example": "heya", "meaning_vi": "căn phòng"}},
    {"kana": "ほ", "romaji": "ho", "example": {"word": "ほん", "romaji_example": "hon", "meaning_vi": "sách"}},
    {"kana": "ま", "romaji": "ma", "example": {"word": "まど", "romaji_example": "mado", "meaning_vi": "cửa sổ"}},
    {"kana": "み", "romaji": "mi", "example": {"word": "みず", "romaji_example": "mizu", "meaning_vi": "nước"}},
    {"kana": "む", "romaji": "mu", "example": {"word": "むし", "romaji_example": "mushi", "meaning_vi": "côn trùng"}},
    {"kana": "め", "romaji": "me", "example": {"word": "めがね", "romaji_example": "megane", "meaning_vi": "kính mắt"}},
    {"kana": "も", "romaji": "mo", "example": {"word": "もも", "romaji_example": "momo", "meaning_vi": "quả đào"}},
    {"kana": "や", "romaji": "ya", "example": {"word": "やま", "romaji_example": "yama", "meaning_vi": "núi"}},
    {"kana": "ゆ", "romaji": "yu", "example": {"word": "ゆき", "romaji_example": "yuki", "meaning_vi": "tuyết"}},
    {"kana": "よ", "romaji": "yo", "example": {"word": "よる", "romaji_example": "yoru", "meaning_vi": "buổi tối"}},
    {"kana": "ら", "romaji": "ra", "example": {"word": "らくだ", "romaji_example": "rakuda", "meaning_vi": "lạc đà"}},
    {"kana": "り", "romaji": "ri", "example": {"word": "りんご", "romaji_example": "ringo", "meaning_vi": "quả táo"}},
    {"kana": "る", "romaji": "ru", "example": {"word": "るす", "romaji_example": "rusu", "meaning_vi": "vắng nhà"}},
    {"kana": "れ", "romaji": "re", "example": {"word": "れきし", "romaji_example": "rekishi", "meaning_vi": "lịch sử"}},
    {"kana": "ろ", "romaji": "ro", "example": {"word": "ろうそく", "romaji_example": "rousoku", "meaning_vi": "cây nến"}},
    {"kana": "わ", "romaji": "wa", "example": {"word": "わたし", "romaji_example": "watashi", "meaning_vi": "tôi"}},
    {"kana": "を", "romaji": "wo", "example": {"word": "ほんをよむ", "romaji_example": "hon o yomu", "meaning_vi": "đọc sách (trợ từ)"}},
    {"kana": "ん", "romaji": "n", "example": {"word": "でんわ", "romaji_example": "denwa", "meaning_vi": "điện thoại"}}
  ],
  "katakana": [
    {"kana": "ア", "romaji": "a", "example": {"word": "アメリカ", "romaji_example": "amerika", "meaning_vi": "nước Mỹ"}},
    {"kana": "イ", "romaji": "i", "example": {"word": "インド", "romaji_example": "indo", "meaning_vi": "Ấn Độ"}},
    {"kana": "ウ", "romaji": "u", "example": {"word": "ウイスキー", "romaji_example": "uisukii", "meaning_vi": "rượu whiskey"}},
    {"kana": "エ", "romaji": "e", "example": {"word": "エアコン", "romaji_example": "eakon", "meaning_vi": "máy điều hòa"}},
    {"kana": "オ", "romaji": "o", "example": {"word": "オレンジ", "romaji_example": "orenji", "meaning_vi": "quả cam"}},
    {"kana": "カ", "romaji": "ka", "example": {"word": "カメラ", "romaji_example": "kamera", "meaning_vi": "máy ảnh"}},
    {"kana": "キ", "romaji": "ki", "example": {"word": "キロ", "romaji_example": "kiro", "meaning_vi": "kilogram, kilomet"}},
    {"kana": "ク", "romaji": "ku", "example": {"word": "クラス", "romaji_example": "kurasu", "meaning_vi": "lớp học"}},
    {"kana": "ケ", "romaji": "ke", "example": {"word": "ケーキ", "romaji_example": "keeki", "meaning_vi": "bánh ngọt"}},
    {"kana": "コ", "romaji": "ko", "example": {"word": "コーヒー", "romaji_example": "koohii", "meaning_vi": "cà phê"}},
    {"kana": "サ", "romaji": "sa", "example": {"word": "サッカー", "romaji_example": "sakkaa", "meaning_vi": "bóng đá"}},
    {"kana": "シ", "romaji": "shi", "example": {"word": "シャツ", "romaji_example": "shatsu", "meaning_vi": "áo sơ mi"}},
    {"kana": "ス", "romaji": "su", "example": {"word": "スープ", "romaji_example": "suupu", "meaning_vi": "súp"}},
    {"kana": "セ", "romaji": "se", "example": {"word": "セーター", "romaji_example": "seetaa", "meaning_vi": "áo len"}},
    {"kana": "ソ", "romaji": "so", "example": {"word": "ソファ", "romaji_example": "sofa", "meaning_vi": "ghế sofa"}},
    {"kana": "タ", "romaji": "ta", "example": {"word": "タクシー", "romaji_example": "takushii", "meaning_vi": "taxi"}},
    {"kana": "チ", "romaji": "chi", "example": {"word": "チーズ", "romaji_example": "chiizu", "meaning_vi": "phô mai"}},
    {"kana": "ツ", "romaji": "tsu", "example": {"word": "ツアー", "romaji_example": "tsuaa", "meaning_vi": "chuyến du lịch"}},
    {"kana": "テ", "romaji": "te", "example": {"word": "テレビ", "romaji_example": "terebi", "meaning_vi": "ti vi"}},
    {"kana": "ト", "romaji": "to", "example": {"word": "トマト", "romaji_example": "tomato", "meaning_vi": "cà chua"}},
    {"kana": "ナ", "romaji": "na", "example": {"word": "ナイフ", "romaji_example": "naifu", "meaning_vi": "con dao"}},
    {"kana": "ニ", "romaji": "ni", "example": {"word": "ニュース", "romaji_example": "nyuusu", "meaning_vi": "tin tức"}},
    {"kana": "ヌ", "romaji": "nu", "example": {"word": "ヌードル", "romaji_example": "nuudoru", "meaning_vi": "mì sợi"}},
    {"kana": "ネ", "romaji": "ne", "example": {"word": "ネクタイ", "romaji_example": "nekutai", "meaning_vi": "cà vạt"}},
    {"kana": "ノ", "romaji": "no", "example": {"word": "ノート", "romaji_example": "nooto", "meaning_vi": "quyển vở"}},
    {"kana": "ハ", "romaji": "ha", "example": {"word": "ハンバーガー", "romaji_example": "hanbaagaa", "meaning_vi": "bánh hamburger"}},
    {"kana": "ヒ", "romaji": "hi", "example": {"word": "ビール", "romaji_example": "biiru", "meaning_vi": "bia"}},
    {"kana": "フ", "romaji": "fu", "example": {"word": "フランス", "romaji_example": "furansu", "meaning_vi": "nước Pháp"}},
    {"kana": "ヘ", "romaji": "he", "example": {"word": "ヘリコプター", "romaji_example": "herikoputaa", "meaning_vi": "máy bay trực thăng"}},
    {"kana": "ホ", "romaji": "ho", "example": {"word": "ホテル", "romaji_example": "hoteru", "meaning_vi": "khách sạn"}},
    {"kana": "マ", "romaji": "ma", "example": {"word": "マイク", "romaji_example": "maiku", "meaning_vi": "micro"}},
    {"kana": "ミ", "romaji": "mi", "example": {"word": "ミルク", "romaji_example": "miruku", "meaning_vi": "sữa"}},
    {"kana": "ム", "romaji": "mu", "example": {"word": "チーム", "romaji_example": "chiimu", "meaning_vi": "đội (team)"}},
    {"kana": "メ", "romaji": "me", "example": {"word": "メール", "romaji_example": "meeru", "meaning_vi": "email"}},
    {"kana": "モ", "romaji": "mo", "example": {"word": "メモ", "romaji_example": "memo", "meaning_vi": "ghi chú"}},
    {"kana": "ヤ", "romaji": "ya", "example": {"word": "タイヤ", "romaji_example": "taiya", "meaning_vi": "lốp xe"}},
    {"kana": "ユ", "romaji": "yu", "example": {"word": "ユーモア", "romaji_example": "yuumoa", "meaning_vi": "hài hước"}},
    {"kana": "ヨ", "romaji": "yo", "example": {"word": "ヨーロッパ", "romaji_example": "yooroppa", "meaning_vi": "châu Âu"}},
    {"kana": "ラ", "romaji": "ra", "example": {"word": "ラジオ", "romaji_example": "rajio", "meaning_vi": "radio"}},
    {"kana": "リ", "romaji": "ri", "example": {"word": "リスト", "romaji_example": "risuto", "meaning_vi": "danh sách"}},
    {"kana": "ル", "romaji": "ru", "example": {"word": "ルール", "romaji_example": "ruuru", "meaning_vi": "luật lệ"}},
    {"kana": "レ", "romaji": "re", "example": {"word": "レストラン", "romaji_example": "resutoran", "meaning_vi": "nhà hàng"}},
    {"kana": "ロ", "romaji": "ro", "example": {"word": "ロボット", "romaji_example": "robotto", "meaning_vi": "robot"}},
    {"kana": "ワ", "romaji": "wa", "example": {"word": "ワイン", "romaji_example": "wain", "meaning_vi": "rượu vang"}},
    {"kana": "ヲ", "romaji": "wo", "example": {"word": "カタカナヲツカウ", "romaji_example": "katakana o tsukau", "meaning_vi": "sử dụng Katakana (trợ từ)"}},
    {"kana": "ン", "romaji": "n", "example": {"word": "パン", "romaji_example": "pan", "meaning_vi": "bánh mì"}}
  ],
  "hiragana_dakuten_handakuten": [
    {"kana": "が", "romaji": "ga", "example": {"word": "がくせい", "romaji_example": "gakusei", "meaning_vi": "học sinh"}},
    {"kana": "ぎ", "romaji": "gi", "example": {"word": "ぎんこう", "romaji_example": "ginkou", "meaning_vi": "ngân hàng"}},
    {"kana": "ぐ", "romaji": "gu", "example": {"word": "ぐあい", "romaji_example": "guai", "meaning_vi": "tình trạng"}},
    {"kana": "げ", "romaji": "ge", "example": {"word": "げんき", "romaji_example": "genki", "meaning_vi": "khỏe mạnh"}},
    {"kana": "ご", "romaji": "go", "example": {"word": "ごはん", "romaji_example": "gohan", "meaning_vi": "cơm"}},
    {"kana": "ざ", "romaji": "za", "example": {"word": "ざっし", "romaji_example": "zasshi", "meaning_vi": "tạp chí"}},
    {"kana": "じ", "romaji": "ji", "example": {"word": "じかん", "romaji_example": "jikan", "meaning_vi": "thời gian"}},
    {"kana": "ず", "romaji": "zu", "example": {"word": "ずいぶん", "romaji_example": "zuibun", "meaning_vi": "khá là"}},
    {"kana": "ぜ", "romaji": "ze", "example": {"word": "かぜ", "romaji_example": "kaze", "meaning_vi": "gió, cảm lạnh"}},
    {"kana": "ぞ", "romaji": "zo", "example": {"word": "かぞく", "romaji_example": "kazoku", "meaning_vi": "gia đình"}},
    {"kana": "だ", "romaji": "da", "example": {"word": "だいがく", "romaji_example": "daigaku", "meaning_vi": "trường đại học"}},
    {"kana": "ぢ", "romaji": "ji", "example": {"word": "はなぢ", "romaji_example": "hanaji", "meaning_vi": "chảy máu cam (ít dùng)"}},
    {"kana": "づ", "romaji": "zu", "example": {"word": "つづく", "romaji_example": "tsuzuku", "meaning_vi": "tiếp tục (trong từ ghép)"}},
    {"kana": "で", "romaji": "de", "example": {"word": "でんわ", "romaji_example": "denwa", "meaning_vi": "điện thoại"}},
    {"kana": "ど", "romaji": "do", "example": {"word": "どこ", "romaji_example": "doko", "meaning_vi": "ở đâu"}},
    {"kana": "ば", "romaji": "ba", "example": {"word": "かばん", "romaji_example": "kaban", "meaning_vi": "cặp sách"}},
    {"kana": "び", "romaji": "bi", "example": {"word": "びょういん", "romaji_example": "byouin", "meaning_vi": "bệnh viện"}},
    {"kana": "ぶ", "romaji": "bu", "example": {"word": "ぶたにく", "romaji_example": "butaniku", "meaning_vi": "thịt lợn"}},
    {"kana": "べ", "romaji": "be", "example": {"word": "べんきょう", "romaji_example": "benkyou", "meaning_vi": "học tập"}},
    {"kana": "ぼ", "romaji": "bo", "example": {"word": "ぼうし", "romaji_example": "boushi", "meaning_vi": "cái mũ"}},
    {"kana": "ぱ", "romaji": "pa", "example": {"word": "ぱん", "romaji_example": "pan", "meaning_vi": "bánh mì (hiragana)"}},
    {"kana": "ぴ", "romaji": "pi", "example": {"word": "えんぴつ", "romaji_example": "enpitsu", "meaning_vi": "bút chì"}},
    {"kana": "ぷ", "romaji": "pu", "example": {"word": "さんぽ", "romaji_example": "sanpo", "meaning_vi": "đi dạo"}},
    {"kana": "ぺ", "romaji": "pe", "example": {"word": "ぺらぺら", "romaji_example": "perapera", "meaning_vi": "lưu loát"}},
    {"kana": "ぽ", "romaji": "po", "example": {"word": "しっぽ", "romaji_example": "shippo", "meaning_vi": "cái đuôi"}}
  ],
  "katakana_dakuten_handakuten": [
    {"kana": "ガ", "romaji": "ga", "example": {"word": "ガス", "romaji_example": "gasu", "meaning_vi": "ga (nhiên liệu)"}},
    {"kana": "ギ", "romaji": "gi", "example": {"word": "ギター", "romaji_example": "gitaa", "meaning_vi": "đàn ghi-ta"}},
    {"kana": "グ", "romaji": "gu", "example": {"word": "グループ", "romaji_example": "guruupu", "meaning_vi": "nhóm"}},
    {"kana": "ゲ", "romaji": "ge", "example": {"word": "ゲーム", "romaji_example": "geemu", "meaning_vi": "trò chơi"}},
    {"kana": "ゴ", "romaji": "go", "example": {"word": "ゴルフ", "romaji_example": "gorufu", "meaning_vi": "gôn"}},
    {"kana": "ザ", "romaji": "za", "example": {"word": "デザイン", "romaji_example": "dezain", "meaning_vi": "thiết kế"}},
    {"kana": "ジ", "romaji": "ji", "example": {"word": "ラジオ", "romaji_example": "rajio", "meaning_vi": "radio (trong từ ghép)"}},
    {"kana": "ズ", "romaji": "zu", "example": {"word": "ズボン", "romaji_example": "zubon", "meaning_vi": "quần dài"}},
    {"kana": "ゼ", "romaji": "ze", "example": {"word": "ゼロ", "romaji_example": "zero", "meaning_vi": "số không"}},
    {"kana": "ゾ", "romaji": "zo", "example": {"word": "ゾーン", "romaji_example": "zoon", "meaning_vi": "khu vực (zone)"}},
    {"kana": "ダ", "romaji": "da", "example": {"word": "ダンス", "romaji_example": "dansu", "meaning_vi": "khiêu vũ"}},
    {"kana": "ヂ", "romaji": "ji", "example": {"word": "ラヂオ", "romaji_example": "rajio", "meaning_vi": "radio (cách viết cũ, hiếm)"}},
    {"kana": "ヅ", "romaji": "zu", "example": {"word": "フレーヅ", "romaji_example": "fureezu", "meaning_vi": "cụm từ (phrase - hiếm)"}},
    {"kana": "デ", "romaji": "de", "example": {"word": "データ", "romaji_example": "deeta", "meaning_vi": "dữ liệu"}},
    {"kana": "ド", "romaji": "do", "example": {"word": "ドア", "romaji_example": "doa", "meaning_vi": "cửa ra vào"}},
    {"kana": "バ", "romaji": "ba", "example": {"word": "バス", "romaji_example": "basu", "meaning_vi": "xe buýt"}},
    {"kana": "ビ", "romaji": "bi", "example": {"word": "ビル", "romaji_example": "biru", "meaning_vi": "tòa nhà"}},
    {"kana": "ブ", "romaji": "bu", "example": {"word": "ブルー", "romaji_example": "buruu", "meaning_vi": "màu xanh dương"}},
    {"kana": "ベ", "romaji": "be", "example": {"word": "ベッド", "romaji_example": "beddo", "meaning_vi": "cái giường"}},
    {"kana": "ボ", "romaji": "bo", "example": {"word": "ボールペン", "romaji_example": "boorupen", "meaning_vi": "bút bi"}},
    {"kana": "パ", "romaji": "pa", "example": {"word": "パーティー", "romaji_example": "paathii", "meaning_vi": "bữa tiệc"}},
    {"kana": "ピ", "romaji": "pi", "example": {"word": "ピアノ", "romaji_example": "piano", "meaning_vi": "đàn piano"}},
    {"kana": "プ", "romaji": "pu", "example": {"word": "プール", "romaji_example": "puuru", "meaning_vi": "bể bơi"}},
    {"kana": "ペ", "romaji": "pe", "example": {"word": "ページ", "romaji_example": "peeji", "meaning_vi": "trang (sách)"}},
    {"kana": "ポ", "romaji": "po", "example": {"word": "ポスト", "romaji_example": "posuto", "meaning_vi": "hòm thư"}}
  ],
  "hiragana_yoon": [
    {"kana": "きゃ", "romaji": "kya", "example": {"word": "きゃく", "romaji_example": "kyaku", "meaning_vi": "khách"}},
    {"kana": "きゅ", "romaji": "kyu", "example": {"word": "きゅうり", "romaji_example": "kyuuri", "meaning_vi": "dưa chuột"}},
    {"kana": "きょ", "romaji": "kyo", "example": {"word": "きょう", "romaji_example": "kyou", "meaning_vi": "hôm nay"}},
    {"kana": "しゃ", "romaji": "sha", "example": {"word": "かいしゃ", "romaji_example": "kaisha", "meaning_vi": "công ty"}},
    {"kana": "しゅ", "romaji": "shu", "example": {"word": "しゅくだい", "romaji_example": "shukudai", "meaning_vi": "bài tập về nhà"}},
    {"kana": "しょ", "romaji": "sho", "example": {"word": "しょくじ", "romaji_example": "shokuji", "meaning_vi": "bữa ăn"}},
    {"kana": "ちゃ", "romaji": "cha", "example": {"word": "おちゃ", "romaji_example": "ocha", "meaning_vi": "trà"}},
    {"kana": "ちゅ", "romaji": "chu", "example": {"word": "ちゅうしゃ", "romaji_example": "chuusha", "meaning_vi": "tiêm, bãi đỗ xe"}},
    {"kana": "ちょ", "romaji": "cho", "example": {"word": "ちょっと", "romaji_example": "chotto", "meaning_vi": "một chút"}},
    {"kana": "にゃ", "romaji": "nya", "example": {"word": "こんにゃく", "romaji_example": "konnyaku", "meaning_vi": "thạch konnyaku"}},
    {"kana": "にゅ", "romaji": "nyu", "example": {"word": "ぎゅうにゅう", "romaji_example": "gyuunyuu", "meaning_vi": "sữa bò"}},
    {"kana": "にょ", "romaji": "nyo", "example": {"word": "にょうぼう", "romaji_example": "nyoubou", "meaning_vi": "vợ (cách nói cũ)"}},
    {"kana": "ひゃ", "romaji": "hya", "example": {"word": "ひゃく", "romaji_example": "hyaku", "meaning_vi": "một trăm"}},
    {"kana": "ひゅ", "romaji": "hyu", "example": {"word": "ひゅーひゅー", "romaji_example": "hyuu hyuu", "meaning_vi": "vù vù (tiếng gió)"}},
    {"kana": "ひょ", "romaji": "hyo", "example": {"word": "ひょう", "romaji_example": "hyou", "meaning_vi": "bảng biểu, báo"}},
    {"kana": "みゃ", "romaji": "mya", "example": {"word": "みゃく", "romaji_example": "myaku", "meaning_vi": "mạch (máu)"}},
    {"kana": "みゅ", "romaji": "myu", "example": {"word": "ミュージカル", "romaji_example": "myuujikaru", "meaning_vi": "nhạc kịch (phiên âm)"}},
    {"kana": "みょ", "romaji": "myo", "example": {"word": "みょうじ", "romaji_example": "myouji", "meaning_vi": "họ (tên)"}},
    {"kana": "りゃ", "romaji": "rya", "example": {"word": "りゃくす", "romaji_example": "ryakusu", "meaning_vi": "viết tắt, lược bỏ"}},
    {"kana": "りゅ", "romaji": "ryu", "example": {"word": "りゅうがくせい", "romaji_example": "ryuugakusei", "meaning_vi": "du học sinh"}},
    {"kana": "りょ", "romaji": "ryo", "example": {"word": "りょこう", "romaji_example": "ryokou", "meaning_vi": "du lịch"}},
    {"kana": "ぎゃ", "romaji": "gya", "example": {"word": "ぎゃく", "romaji_example": "gyaku", "meaning_vi": "ngược lại"}},
    {"kana": "ぎゅ", "romaji": "gyu", "example": {"word": "ぎゅうにく", "romaji_example": "gyuuniku", "meaning_vi": "thịt bò"}},
    {"kana": "ぎょ", "romaji": "gyo", "example": {"word": "きんぎょ", "romaji_example": "kingyo", "meaning_vi": "cá vàng"}},
    {"kana": "じゃ", "romaji": "ja", "example": {"word": "じゃま", "romaji_example": "jama", "meaning_vi": "làm phiền"}},
    {"kana": "じゅ", "romaji": "ju", "example": {"word": "じゅぎょう", "romaji_example": "jugyou", "meaning_vi": "giờ học"}},
    {"kana": "じょ", "romaji": "jo", "example": {"word": "じょせい", "romaji_example": "josei", "meaning_vi": "phụ nữ"}},
    {"kana": "ぢゃ", "romaji": "ja", "example": {"word": "おぢゃる", "romaji_example": "ojaru", "meaning_vi": "đến (cổ ngữ, hiếm)"}},
    {"kana": "ぢゅ", "romaji": "ju", "example": {"word": "かぢゅう", "romaji_example": "kajuu", "meaning_vi": "trong nhà (cách viết cũ, hiếm)"}},
    {"kana": "ぢょ", "romaji": "jo", "example": {"word": "おぢょうさん", "romaji_example": "ojousan", "meaning_vi": "tiểu thư (cách viết cũ, hiếm)"}},
    {"kana": "びゃ", "romaji": "bya", "example": {"word": "さんびゃく", "romaji_example": "sanbyaku", "meaning_vi": "ba trăm"}},
    {"kana": "びゅ", "romaji": "byu", "example": {"word": "インタビュー", "romaji_example": "intabyuu", "meaning_vi": "phỏng vấn (phiên âm)"}},
    {"kana": "びょ", "romaji": "byo", "example": {"word": "びょうき", "romaji_example": "byouki", "meaning_vi": "bệnh tật"}},
    {"kana": "ぴゃ", "romaji": "pya", "example": {"word": "ろっぴゃく", "romaji_example": "roppyaku", "meaning_vi": "sáu trăm"}},
    {"kana": "ぴゅ", "romaji": "pyu", "example": {"word": "コンピューター", "romaji_example": "konpyuutaa", "meaning_vi": "máy tính (phiên âm)"}},
    {"kana": "ぴょ", "romaji": "pyo", "example": {"word": "はっぴょう", "romaji_example": "happyou", "meaning_vi": "phát biểu"}}
  ],
  "katakana_yoon": [
    {"kana": "キャ", "romaji": "kya", "example": {"word": "キャンセル", "romaji_example": "kyanseru", "meaning_vi": "hủy bỏ (cancel)"}},
    {"kana": "キュ", "romaji": "kyu", "example": {"word": "キューバ", "romaji_example": "kyuuba", "meaning_vi": "Cuba"}},
    {"kana": "キョ", "romaji": "kyo", "example": {"word": "キョウト", "romaji_example": "kyouto", "meaning_vi": "Kyoto (tên địa danh)"}},
    {"kana": "シャ", "romaji": "sha", "example": {"word": "シャワー", "romaji_example": "shawaa", "meaning_vi": "vòi hoa sen"}},
    {"kana": "シュ", "romaji": "shu", "example": {"word": "シュークリーム", "romaji_example": "shuukuriimu", "meaning_vi": "bánh su kem"}},
    {"kana": "ショ", "romaji": "sho", "example": {"word": "ショッピング", "romaji_example": "shoppingu", "meaning_vi": "mua sắm"}},
    {"kana": "チャ", "romaji": "cha", "example": {"word": "チャンス", "romaji_example": "chansu", "meaning_vi": "cơ hội"}},
    {"kana": "チュ", "romaji": "chu", "example": {"word": "チューブ", "romaji_example": "chuubu", "meaning_vi": "ống, tuýp"}},
    {"kana": "チョ", "romaji": "cho", "example": {"word": "チョコレート", "romaji_example": "chokoreeto", "meaning_vi": "sô cô la"}},
    {"kana": "ニャ", "romaji": "nya", "example": {"word": "ニャー", "romaji_example": "nyaa", "meaning_vi": "meo (tiếng mèo kêu)"}},
    {"kana": "ニュ", "romaji": "nyu", "example": {"word": "ニューヨーク", "romaji_example": "nyuuyooku", "meaning_vi": "New York"}},
    {"kana": "ニョ", "romaji": "nyo", "example": {"word": "ニョッキ", "romaji_example": "nyokki", "meaning_vi": "gnocchi (món Ý)"}},
    {"kana": "ヒャ", "romaji": "hya", "example": {"word": "ヒャッホー", "romaji_example": "hyahhoo", "meaning_vi": "yahoo! (thán từ)"}},
    {"kana": "ヒュ", "romaji": "hyu", "example": {"word": "ヒューマン", "romaji_example": "hyuuman", "meaning_vi": "con người (human)"}},
    {"kana": "ヒョ", "romaji": "hyo", "example": {"word": "ヒョウ", "romaji_example": "hyou", "meaning_vi": "con báo"}},
    {"kana": "ミャ", "romaji": "mya", "example": {"word": "ミャンマー", "romaji_example": "myanmaa", "meaning_vi": "Myanmar"}},
    {"kana": "ミュ", "romaji": "myu", "example": {"word": "ミュージック", "romaji_example": "myuujikku", "meaning_vi": "âm nhạc"}},
    {"kana": "ミョ", "romaji": "myo", "example": {"word": "ミョウガ", "romaji_example": "myouga", "meaning_vi": "gừng Nhật"}},
    {"kana": "リャ", "romaji": "rya", "example": {"word": "テリア", "romaji_example": "teria", "meaning_vi": "chó sục (terrier)"}},
    {"kana": "リュ", "romaji": "ryu", "example": {"word": "リュックサック", "romaji_example": "ryukkusakku", "meaning_vi": "ba lô"}},
    {"kana": "リョ", "romaji": "ryo", "example": {"word": "キロメートル", "romaji_example": "kiromeetoru", "meaning_vi": "kilomet (trong từ ghép)"}},
    {"kana": "ギャ", "romaji": "gya", "example": {"word": "ギャラリー", "romaji_example": "gyararii", "meaning_vi": "phòng trưng bày"}},
    {"kana": "ギュ", "romaji": "gyu", "example": {"word": "レギュラー", "romaji_example": "regyuraa", "meaning_vi": "thông thường, chính thức (regular)"}},
    {"kana": "ギョ", "romaji": "gyo", "example": {"word": "ギョーザ", "romaji_example": "gyooza", "meaning_vi": "bánh Gyoza (sủi cảo)"}},
    {"kana": "ジャ", "romaji": "ja", "example": {"word": "ジャム", "romaji_example": "jamu", "meaning_vi": "mứt"}},
    {"kana": "ジュ", "romaji": "ju", "example": {"word": "ジュース", "romaji_example": "juusu", "meaning_vi": "nước ép"}},
    {"kana": "ジョ", "romaji": "jo", "example": {"word": "ジョギング", "romaji_example": "jogingu", "meaning_vi": "chạy bộ"}},
    {"kana": "ヂャ", "romaji": "ja", "example": {"word": "ヂャケット", "romaji_example": "jaketto", "meaning_vi": "áo khoác (cách viết cũ, hiếm)"}},
    {"kana": "ヂュ", "romaji": "ju", "example": {"word": "スケヂュール", "romaji_example": "sukejuuru", "meaning_vi": "lịch trình (cách viết cũ, hiếm)"}},
    {"kana": "ヂョ", "romaji": "jo", "example": {"word": "ラヂョ", "romaji_example": "rajo", "meaning_vi": "radio (cách viết rất cũ, hiếm)"}},
    {"kana": "ビャ", "romaji": "bya", "example": {"word": "リビア", "romaji_example": "ribia", "meaning_vi": "Libya (trong tên nước)"}},
    {"kana": "ビュ", "romaji": "byu", "example": {"word": "ビューティー", "romaji_example": "byuutii", "meaning_vi": "vẻ đẹp (beauty)"}},
    {"kana": "ビョ", "romaji": "byo", "example": {"word": "エンビョー", "romaji_example": "enbyoo", "meaning_vi": "đố kỵ (envy - hiếm dùng)"}},
    {"kana": "ピャ", "romaji": "pya", "example": {"word": "ハッピー", "romaji_example": "happii", "meaning_vi": "hạnh phúc (trong từ ghép)"}},
    {"kana": "ピュ", "romaji": "pyu", "example": {"word": "ピューマ", "romaji_example": "pyuuma", "meaning_vi": "báo sư tử (puma)"}},
    {"kana": "ピョ", "romaji": "pyo", "example": {"word": "ピョンピョン", "romaji_example": "pyonpyon", "meaning_vi": "nhảy lò cò"}}
  ],
  "katakana_extended": [
    {"kana": "ヴァ", "romaji": "va", "example": {"word": "ヴァイオリン", "romaji_example": "vaiorin", "meaning_vi": "đàn vi-ô-lông"}},
    {"kana": "ヴィ", "romaji": "vi", "example": {"word": "ヴィラ", "romaji_example": "vira", "meaning_vi": "biệt thự (villa)"}},
    {"kana": "ヴ", "romaji": "vu", "example": {"word": "ヴォーカル", "romaji_example": "vookaru", "meaning_vi": "giọng ca (vocal - ヴ thường được thay bằng ブ)"}},
    {"kana": "ヴェ", "romaji": "ve", "example": {"word": "ヴェネツィア", "romaji_example": "venetsia", "meaning_vi": "Venice"}},
    {"kana": "ヴォ", "romaji": "vo", "example": {"word": "ヴォルテージ", "romaji_example": "voruteeji", "meaning_vi": "điện áp (voltage)"}},
    {"kana": "シェ", "romaji": "she", "example": {"word": "シェフ", "romaji_example": "shefu", "meaning_vi": "đầu bếp (chef)"}},
    {"kana": "ジェ", "romaji": "je", "example": {"word": "ジェットコースター", "romaji_example": "jettokoosutaa", "meaning_vi": "tàu lượn siêu tốc"}},
    {"kana": "チェ", "romaji": "che", "example": {"word": "チェック", "romaji_example": "chekku", "meaning_vi": "kiểm tra (check)"}},
    {"kana": "ティ", "romaji": "ti", "example": {"word": "パーティー", "romaji_example": "paathii", "meaning_vi": "bữa tiệc"}},
    {"kana": "ディ", "romaji": "di", "example": {"word": "ディズニーランド", "romaji_example": "dizuniirando", "meaning_vi": "Disneyland"}},
    {"kana": "トゥ", "romaji": "tu", "example": {"word": "トゥナイト", "romaji_example": "tunaito", "meaning_vi": "tối nay (tonight)"}},
    {"kana": "ドゥ", "romaji": "du", "example": {"word": "デュエット", "romaji_example": "dyuetto", "meaning_vi": "song ca (duet)"}},
    {"kana": "ファ", "romaji": "fa", "example": {"word": "ファン", "romaji_example": "fan", "meaning_vi": "người hâm mộ"}},
    {"kana": "フィ", "romaji": "fi", "example": {"word": "フィルム", "romaji_example": "firumu", "meaning_vi": "phim (ảnh, điện ảnh)"}},
    {"kana": "フェ", "romaji": "fe", "example": {"word": "フェリー", "romaji_example": "ferii", "meaning_vi": "phà"}},
    {"kana": "フォ", "romaji": "fo", "example": {"word": "フォーク", "romaji_example": "fooku", "meaning_vi": "cái nĩa"}},
    {"kana": "フュ", "romaji": "fyu", "example": {"word": "フューチャー", "romaji_example": "fyuuchaa", "meaning_vi": "tương lai (future)"}},
    {"kana": "ウィ", "romaji": "wi", "example": {"word": "ウィスキー", "romaji_example": "wisukii", "meaning_vi": "rượu whiskey"}},
    {"kana": "ウェ", "romaji": "we", "example": {"word": "ウェディング", "romaji_example": "wedingu", "meaning_vi": "đám cưới (wedding)"}},
    {"kana": "ウォ", "romaji": "wo", "example": {"word": "ウォークマン", "romaji_example": "wookuman", "meaning_vi": "máy Walkman"}},
    {"kana": "ツァ", "romaji": "tsa", "example": {"word": "ピッツァ", "romaji_example": "pittsa", "meaning_vi": "bánh pizza"}},
    {"kana": "ツィ", "romaji": "tsi", "example": {"word": "パンツィー", "romaji_example": "pantsii", "meaning_vi": "quần lót (pantsy - hiếm)"}},
    {"kana": "ツェ", "romaji": "tse", "example": {"word": "ツェッペリン", "romaji_example": "tsepperin", "meaning_vi": "khinh khí cầu Zeppelin"}},
    {"kana": "ツォ", "romaji": "tso", "example": {"word": "リゾット", "romaji_example": "rizotto", "meaning_vi": "cơm risotto (trong từ ghép)"}}
  ]
};

const pGroupHandakuten = ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ', 'パ', 'ピ', 'プ', 'ペ', 'ポ'];

function mapRawItemToJapaneseCharacter(
  rawItem: { kana: string; romaji: string; example?: any; note?: string },
  scriptKey: keyof typeof characterLibraryData
): JapaneseCharacter {
  let finalType: JapaneseCharacter['type'];

  switch (scriptKey) {
    case 'hiragana':
      finalType = 'hiragana';
      break;
    case 'katakana':
      finalType = 'katakana';
      break;
    case 'hiragana_dakuten_handakuten':
      finalType = pGroupHandakuten.includes(rawItem.kana) ? 'hiragana-handakuten' : 'hiragana-dakuten';
      break;
    case 'katakana_dakuten_handakuten':
      finalType = pGroupHandakuten.includes(rawItem.kana) ? 'katakana-handakuten' : 'katakana-dakuten';
      break;
    case 'hiragana_yoon':
      finalType = 'hiragana-yoon';
      break;
    case 'katakana_yoon':
      finalType = 'katakana-yoon';
      break;
    case 'katakana_extended':
      finalType = 'katakana-extended';
      break;
    default:
      finalType = 'hiragana'; 
      break;
  }

  return {
    char: rawItem.kana,
    romaji: rawItem.romaji,
    type: finalType,
    example: rawItem.example,
    note: rawItem.note,
  };
}

export const JAPANESE_CHARACTERS_DATA: JapaneseCharacter[] = Object.keys(characterLibraryData).reduce(
  (acc: JapaneseCharacter[], key) => {
    const scriptKey = key as keyof typeof characterLibraryData;
    const charsForKey = characterLibraryData[scriptKey].map(rawChar =>
      mapRawItemToJapaneseCharacter(rawChar, scriptKey)
    );
    return acc.concat(charsForKey);
  },
  []
);


function getBaseScriptType(charType: JapaneseCharacter['type']): 'hiragana' | 'katakana' | 'mixed' {
  if (charType.startsWith('hiragana')) return 'hiragana';
  if (charType.startsWith('katakana')) return 'katakana';
  // This function is used for vocabulary word type, 'mixed' if it contains both,
  // or based on the primary characters. For now, let's simplify based on source char.
  return 'hiragana'; // Default, adjust if needed
}

export const VOCABULARY_DATA: VocabularyWord[] = JAPANESE_CHARACTERS_DATA.reduce((acc: VocabularyWord[], charData) => {
  if (charData.example && charData.example.word && charData.example.meaning_vi) {
    // Check for duplicates based on kana word and meaning
    const isDuplicate = acc.some(
      v => v.kana === charData.example!.word && v.translation_vi === charData.example!.meaning_vi
    );
    if (!isDuplicate) {
      acc.push({
        id: `${charData.example.word}-${charData.example.meaning_vi}-${Math.random().toString(36).substring(2, 9)}`,
        kana: charData.example.word,
        romaji: charData.example.romaji_example,
        translation_vi: charData.example.meaning_vi,
        type: getBaseScriptType(charData.type), 
        sourceCharType: charData.type,
      });
    }
  }
  return acc;
}, []);


// Helper to find a character by its kana representation from a list
function findCharacter(charList: JapaneseCharacter[], kana: string): JapaneseCharacter | null {
  return charList.find(c => c.char === kana) || null;
}


// Define organized table data structures
const hiraganaChars = JAPANESE_CHARACTERS_DATA.filter(c => c.type === 'hiragana');
export const organizedHiraganaBasic: OrganizedTableData = {
  title: 'Bảng Chữ Cái Hiragana Chính (五十音図)',
  icon: 'fas fa-language',
  columnHeaders: ['A', 'I', 'U', 'E', 'O'],
  rows: [
    { rowHeader: 'Nguyên Âm', rowSubHeader: 'あ行', cells: [findCharacter(hiraganaChars, 'あ'), findCharacter(hiraganaChars, 'い'), findCharacter(hiraganaChars, 'う'), findCharacter(hiraganaChars, 'え'), findCharacter(hiraganaChars, 'お')] },
    { rowHeader: 'K', rowSubHeader: 'か行', cells: [findCharacter(hiraganaChars, 'か'), findCharacter(hiraganaChars, 'き'), findCharacter(hiraganaChars, 'く'), findCharacter(hiraganaChars, 'け'), findCharacter(hiraganaChars, 'こ')] },
    { rowHeader: 'S', rowSubHeader: 'さ行', cells: [findCharacter(hiraganaChars, 'さ'), findCharacter(hiraganaChars, 'し'), findCharacter(hiraganaChars, 'す'), findCharacter(hiraganaChars, 'せ'), findCharacter(hiraganaChars, 'そ')] },
    { rowHeader: 'T', rowSubHeader: 'た行', cells: [findCharacter(hiraganaChars, 'た'), findCharacter(hiraganaChars, 'ち'), findCharacter(hiraganaChars, 'つ'), findCharacter(hiraganaChars, 'て'), findCharacter(hiraganaChars, 'と')] },
    { rowHeader: 'N', rowSubHeader: 'な行', cells: [findCharacter(hiraganaChars, 'な'), findCharacter(hiraganaChars, 'に'), findCharacter(hiraganaChars, 'ぬ'), findCharacter(hiraganaChars, 'ね'), findCharacter(hiraganaChars, 'の')] },
    { rowHeader: 'H', rowSubHeader: 'は行', cells: [findCharacter(hiraganaChars, 'は'), findCharacter(hiraganaChars, 'ひ'), findCharacter(hiraganaChars, 'ふ'), findCharacter(hiraganaChars, 'へ'), findCharacter(hiraganaChars, 'ほ')] },
    { rowHeader: 'M', rowSubHeader: 'ま行', cells: [findCharacter(hiraganaChars, 'ま'), findCharacter(hiraganaChars, 'み'), findCharacter(hiraganaChars, 'む'), findCharacter(hiraganaChars, 'め'), findCharacter(hiraganaChars, 'も')] },
    { rowHeader: 'Y', rowSubHeader: 'や行', cells: [findCharacter(hiraganaChars, 'や'), null, findCharacter(hiraganaChars, 'ゆ'), null, findCharacter(hiraganaChars, 'よ')] },
    { rowHeader: 'R', rowSubHeader: 'ら行', cells: [findCharacter(hiraganaChars, 'ら'), findCharacter(hiraganaChars, 'り'), findCharacter(hiraganaChars, 'る'), findCharacter(hiraganaChars, 'れ'), findCharacter(hiraganaChars, 'ろ')] },
    { rowHeader: 'W', rowSubHeader: 'わ行', cells: [findCharacter(hiraganaChars, 'わ'), null, null, null, findCharacter(hiraganaChars, 'を')] },
  ],
  footerChar: findCharacter(hiraganaChars, 'ん'),
};

const hiraganaDakutenHandakutenChars = JAPANESE_CHARACTERS_DATA.filter(c => c.type === 'hiragana-dakuten' || c.type === 'hiragana-handakuten');
export const organizedHiraganaDakutenHandakuten: OrganizedTableData = {
  title: 'Bảng Hiragana Biến Âm (濁音・半濁音)',
  icon: 'fas fa-feather-alt',
  columnHeaders: ['A', 'I', 'U', 'E', 'O'],
  rows: [
    { rowHeader: 'G', rowSubHeader: 'が行', cells: [findCharacter(hiraganaDakutenHandakutenChars, 'が'), findCharacter(hiraganaDakutenHandakutenChars, 'ぎ'), findCharacter(hiraganaDakutenHandakutenChars, 'ぐ'), findCharacter(hiraganaDakutenHandakutenChars, 'げ'), findCharacter(hiraganaDakutenHandakutenChars, 'ご')] },
    { rowHeader: 'Z', rowSubHeader: 'ざ行', cells: [findCharacter(hiraganaDakutenHandakutenChars, 'ざ'), findCharacter(hiraganaDakutenHandakutenChars, 'じ'), findCharacter(hiraganaDakutenHandakutenChars, 'ず'), findCharacter(hiraganaDakutenHandakutenChars, 'ぜ'), findCharacter(hiraganaDakutenHandakutenChars, 'ぞ')] },
    { rowHeader: 'D', rowSubHeader: 'だ行', cells: [findCharacter(hiraganaDakutenHandakutenChars, 'だ'), findCharacter(hiraganaDakutenHandakutenChars, 'ぢ'), findCharacter(hiraganaDakutenHandakutenChars, 'づ'), findCharacter(hiraganaDakutenHandakutenChars, 'で'), findCharacter(hiraganaDakutenHandakutenChars, 'ど')] },
    { rowHeader: 'B', rowSubHeader: 'ば行', cells: [findCharacter(hiraganaDakutenHandakutenChars, 'ば'), findCharacter(hiraganaDakutenHandakutenChars, 'び'), findCharacter(hiraganaDakutenHandakutenChars, 'ぶ'), findCharacter(hiraganaDakutenHandakutenChars, 'べ'), findCharacter(hiraganaDakutenHandakutenChars, 'ぼ')] },
    { rowHeader: 'P', rowSubHeader: 'ぱ行', cells: [findCharacter(hiraganaDakutenHandakutenChars, 'ぱ'), findCharacter(hiraganaDakutenHandakutenChars, 'ぴ'), findCharacter(hiraganaDakutenHandakutenChars, 'ぷ'), findCharacter(hiraganaDakutenHandakutenChars, 'ぺ'), findCharacter(hiraganaDakutenHandakutenChars, 'ぽ')] },
  ],
};

const hiraganaYoonChars = JAPANESE_CHARACTERS_DATA.filter(c => c.type === 'hiragana-yoon');
export const organizedHiraganaYoon: OrganizedTableData = {
  title: 'Bảng Hiragana Âm Ghép (拗音)',
  icon: 'fas fa-link',
  columnHeaders: ['YA', 'YU', 'YO'],
  rows: [
    { rowHeader: 'K', rowSubHeader: 'きゃ行', cells: [findCharacter(hiraganaYoonChars, 'きゃ'), findCharacter(hiraganaYoonChars, 'きゅ'), findCharacter(hiraganaYoonChars, 'きょ')] },
    { rowHeader: 'Sh', rowSubHeader: 'しゃ行', cells: [findCharacter(hiraganaYoonChars, 'しゃ'), findCharacter(hiraganaYoonChars, 'しゅ'), findCharacter(hiraganaYoonChars, 'しょ')] },
    { rowHeader: 'Ch', rowSubHeader: 'ちゃ行', cells: [findCharacter(hiraganaYoonChars, 'ちゃ'), findCharacter(hiraganaYoonChars, 'ちゅ'), findCharacter(hiraganaYoonChars, 'ちょ')] },
    { rowHeader: 'N', rowSubHeader: 'にゃ行', cells: [findCharacter(hiraganaYoonChars, 'にゃ'), findCharacter(hiraganaYoonChars, 'にゅ'), findCharacter(hiraganaYoonChars, 'にょ')] },
    { rowHeader: 'H', rowSubHeader: 'ひゃ行', cells: [findCharacter(hiraganaYoonChars, 'ひゃ'), findCharacter(hiraganaYoonChars, 'ひゅ'), findCharacter(hiraganaYoonChars, 'ひょ')] },
    { rowHeader: 'M', rowSubHeader: 'みゃ行', cells: [findCharacter(hiraganaYoonChars, 'みゃ'), findCharacter(hiraganaYoonChars, 'みゅ'), findCharacter(hiraganaYoonChars, 'みょ')] },
    { rowHeader: 'R', rowSubHeader: 'りゃ行', cells: [findCharacter(hiraganaYoonChars, 'りゃ'), findCharacter(hiraganaYoonChars, 'りゅ'), findCharacter(hiraganaYoonChars, 'りょ')] },
    { rowHeader: 'G', rowSubHeader: 'ぎゃ行', cells: [findCharacter(hiraganaYoonChars, 'ぎゃ'), findCharacter(hiraganaYoonChars, 'ぎゅ'), findCharacter(hiraganaYoonChars, 'ぎょ')] },
    { rowHeader: 'J', rowSubHeader: 'じゃ行', cells: [findCharacter(hiraganaYoonChars, 'じゃ'), findCharacter(hiraganaYoonChars, 'じゅ'), findCharacter(hiraganaYoonChars, 'じょ')] },
    { rowHeader: 'J (d)', rowSubHeader: 'ぢゃ行', cells: [findCharacter(hiraganaYoonChars, 'ぢゃ'), findCharacter(hiraganaYoonChars, 'ぢゅ'), findCharacter(hiraganaYoonChars, 'ぢょ')] },
    { rowHeader: 'B', rowSubHeader: 'びゃ行', cells: [findCharacter(hiraganaYoonChars, 'びゃ'), findCharacter(hiraganaYoonChars, 'びゅ'), findCharacter(hiraganaYoonChars, 'びょ')] },
    { rowHeader: 'P', rowSubHeader: 'ぴゃ行', cells: [findCharacter(hiraganaYoonChars, 'ぴゃ'), findCharacter(hiraganaYoonChars, 'ぴゅ'), findCharacter(hiraganaYoonChars, 'ぴょ')] },
  ],
};

const katakanaChars = JAPANESE_CHARACTERS_DATA.filter(c => c.type === 'katakana');
export const organizedKatakanaBasic: OrganizedTableData = {
  title: 'Bảng Chữ Cái Katakana Chính (五十音図)',
  icon: 'fas fa-bold',
  columnHeaders: ['A', 'I', 'U', 'E', 'O'],
  rows: [
    { rowHeader: 'Nguyên Âm', rowSubHeader: 'ア行', cells: [findCharacter(katakanaChars, 'ア'), findCharacter(katakanaChars, 'イ'), findCharacter(katakanaChars, 'ウ'), findCharacter(katakanaChars, 'エ'), findCharacter(katakanaChars, 'オ')] },
    { rowHeader: 'K', rowSubHeader: 'カ行', cells: [findCharacter(katakanaChars, 'カ'), findCharacter(katakanaChars, 'キ'), findCharacter(katakanaChars, 'ク'), findCharacter(katakanaChars, 'ケ'), findCharacter(katakanaChars, 'コ')] },
    { rowHeader: 'S', rowSubHeader: 'サ行', cells: [findCharacter(katakanaChars, 'サ'), findCharacter(katakanaChars, 'シ'), findCharacter(katakanaChars, 'ス'), findCharacter(katakanaChars, 'セ'), findCharacter(katakanaChars, 'ソ')] },
    { rowHeader: 'T', rowSubHeader: 'タ行', cells: [findCharacter(katakanaChars, 'タ'), findCharacter(katakanaChars, 'チ'), findCharacter(katakanaChars, 'ツ'), findCharacter(katakanaChars, 'テ'), findCharacter(katakanaChars, 'ト')] },
    { rowHeader: 'N', rowSubHeader: 'ナ行', cells: [findCharacter(katakanaChars, 'ナ'), findCharacter(katakanaChars, 'ニ'), findCharacter(katakanaChars, 'ヌ'), findCharacter(katakanaChars, 'ネ'), findCharacter(katakanaChars, 'ノ')] },
    { rowHeader: 'H', rowSubHeader: 'ハ行', cells: [findCharacter(katakanaChars, 'ハ'), findCharacter(katakanaChars, 'ヒ'), findCharacter(katakanaChars, 'フ'), findCharacter(katakanaChars, 'ヘ'), findCharacter(katakanaChars, 'ホ')] },
    { rowHeader: 'M', rowSubHeader: 'マ行', cells: [findCharacter(katakanaChars, 'マ'), findCharacter(katakanaChars, 'ミ'), findCharacter(katakanaChars, 'ム'), findCharacter(katakanaChars, 'メ'), findCharacter(katakanaChars, 'モ')] },
    { rowHeader: 'Y', rowSubHeader: 'ヤ行', cells: [findCharacter(katakanaChars, 'ヤ'), null, findCharacter(katakanaChars, 'ユ'), null, findCharacter(katakanaChars, 'ヨ')] },
    { rowHeader: 'R', rowSubHeader: 'ラ行', cells: [findCharacter(katakanaChars, 'ラ'), findCharacter(katakanaChars, 'リ'), findCharacter(katakanaChars, 'ル'), findCharacter(katakanaChars, 'レ'), findCharacter(katakanaChars, 'ロ')] },
    { rowHeader: 'W', rowSubHeader: 'ワ行', cells: [findCharacter(katakanaChars, 'ワ'), null, null, null, findCharacter(katakanaChars, 'ヲ')] },
  ],
  footerChar: findCharacter(katakanaChars, 'ン'),
};

const katakanaDakutenHandakutenChars = JAPANESE_CHARACTERS_DATA.filter(c => c.type === 'katakana-dakuten' || c.type === 'katakana-handakuten');
export const organizedKatakanaDakutenHandakuten: OrganizedTableData = {
  title: 'Bảng Katakana Biến Âm (濁音・半濁音)',
  icon: 'fas fa-feather',
  columnHeaders: ['A', 'I', 'U', 'E', 'O'],
  rows: [
    { rowHeader: 'G', rowSubHeader: 'ガ行', cells: [findCharacter(katakanaDakutenHandakutenChars, 'ガ'), findCharacter(katakanaDakutenHandakutenChars, 'ギ'), findCharacter(katakanaDakutenHandakutenChars, 'グ'), findCharacter(katakanaDakutenHandakutenChars, 'ゲ'), findCharacter(katakanaDakutenHandakutenChars, 'ゴ')] },
    { rowHeader: 'Z', rowSubHeader: 'ザ行', cells: [findCharacter(katakanaDakutenHandakutenChars, 'ザ'), findCharacter(katakanaDakutenHandakutenChars, 'ジ'), findCharacter(katakanaDakutenHandakutenChars, 'ズ'), findCharacter(katakanaDakutenHandakutenChars, 'ゼ'), findCharacter(katakanaDakutenHandakutenChars, 'ゾ')] },
    { rowHeader: 'D', rowSubHeader: 'ダ行', cells: [findCharacter(katakanaDakutenHandakutenChars, 'ダ'), findCharacter(katakanaDakutenHandakutenChars, 'ヂ'), findCharacter(katakanaDakutenHandakutenChars, 'ヅ'), findCharacter(katakanaDakutenHandakutenChars, 'デ'), findCharacter(katakanaDakutenHandakutenChars, 'ド')] },
    { rowHeader: 'B', rowSubHeader: 'バ行', cells: [findCharacter(katakanaDakutenHandakutenChars, 'バ'), findCharacter(katakanaDakutenHandakutenChars, 'ビ'), findCharacter(katakanaDakutenHandakutenChars, 'ブ'), findCharacter(katakanaDakutenHandakutenChars, 'ベ'), findCharacter(katakanaDakutenHandakutenChars, 'ボ')] },
    { rowHeader: 'P', rowSubHeader: 'パ行', cells: [findCharacter(katakanaDakutenHandakutenChars, 'パ'), findCharacter(katakanaDakutenHandakutenChars, 'ピ'), findCharacter(katakanaDakutenHandakutenChars, 'プ'), findCharacter(katakanaDakutenHandakutenChars, 'ペ'), findCharacter(katakanaDakutenHandakutenChars, 'ポ')] },
  ],
};

const katakanaYoonChars = JAPANESE_CHARACTERS_DATA.filter(c => c.type === 'katakana-yoon');
export const organizedKatakanaYoon: OrganizedTableData = {
  title: 'Bảng Katakana Âm Ghép (拗音)',
  icon: 'fas fa-project-diagram',
  columnHeaders: ['YA', 'YU', 'YO'],
  rows: [
    { rowHeader: 'K', rowSubHeader: 'キャ行', cells: [findCharacter(katakanaYoonChars, 'キャ'), findCharacter(katakanaYoonChars, 'キュ'), findCharacter(katakanaYoonChars, 'キョ')] },
    { rowHeader: 'Sh', rowSubHeader: 'シャ行', cells: [findCharacter(katakanaYoonChars, 'シャ'), findCharacter(katakanaYoonChars, 'シュ'), findCharacter(katakanaYoonChars, 'ショ')] },
    { rowHeader: 'Ch', rowSubHeader: 'チャ行', cells: [findCharacter(katakanaYoonChars, 'チャ'), findCharacter(katakanaYoonChars, 'チュ'), findCharacter(katakanaYoonChars, 'チョ')] },
    { rowHeader: 'N', rowSubHeader: 'ニャ行', cells: [findCharacter(katakanaYoonChars, 'ニャ'), findCharacter(katakanaYoonChars, 'ニュ'), findCharacter(katakanaYoonChars, 'ニョ')] },
    { rowHeader: 'H', rowSubHeader: 'ヒャ行', cells: [findCharacter(katakanaYoonChars, 'ヒャ'), findCharacter(katakanaYoonChars, 'ヒュ'), findCharacter(katakanaYoonChars, 'ヒョ')] },
    { rowHeader: 'M', rowSubHeader: 'ミャ行', cells: [findCharacter(katakanaYoonChars, 'ミャ'), findCharacter(katakanaYoonChars, 'ミュ'), findCharacter(katakanaYoonChars, 'ミョ')] },
    { rowHeader: 'R', rowSubHeader: 'リャ行', cells: [findCharacter(katakanaYoonChars, 'リャ'), findCharacter(katakanaYoonChars, 'リュ'), findCharacter(katakanaYoonChars, 'リョ')] },
    { rowHeader: 'G', rowSubHeader: 'ギャ行', cells: [findCharacter(katakanaYoonChars, 'ギャ'), findCharacter(katakanaYoonChars, 'ギュ'), findCharacter(katakanaYoonChars, 'ギョ')] },
    { rowHeader: 'J', rowSubHeader: 'ジャ行', cells: [findCharacter(katakanaYoonChars, 'ジャ'), findCharacter(katakanaYoonChars, 'ジュ'), findCharacter(katakanaYoonChars, 'ジョ')] },
    { rowHeader: 'J (d)', rowSubHeader: 'ヂャ行', cells: [findCharacter(katakanaYoonChars, 'ヂャ'), findCharacter(katakanaYoonChars, 'ヂュ'), findCharacter(katakanaYoonChars, 'ヂョ')] },
    { rowHeader: 'B', rowSubHeader: 'ビャ行', cells: [findCharacter(katakanaYoonChars, 'ビャ'), findCharacter(katakanaYoonChars, 'ビュ'), findCharacter(katakanaYoonChars, 'ビョ')] },
    { rowHeader: 'P', rowSubHeader: 'ピャ行', cells: [findCharacter(katakanaYoonChars, 'ピャ'), findCharacter(katakanaYoonChars, 'ピュ'), findCharacter(katakanaYoonChars, 'ピョ')] },
  ],
};
// Thêm vào types.ts
export interface KanjiCharacter {
  kanji: string;
  readings: {
    kunyomi?: string[];  // Cách đọc Nhật Bản
    onyomi?: string[];   // Cách đọc Trung Hoa
  };
  romaji: string[];
  meaning_vi: string;
  examples?: {
    word: string;
    reading: string;
    romaji: string;
    meaning_vi: string;
  }[];
  level?: string; // N5, N4, etc.
}

// Dữ liệu kanji mới
const kanjiLibraryData: KanjiCharacter[] = [
  // Số đếm cơ bản (Numbers)
  {
    kanji: "一",
    readings: { kunyomi: ["ひと"], onyomi: ["いち"] },
    romaji: ["hito", "ichi"],
    meaning_vi: "một, nhất",
    examples: [
      { word: "一つ", reading: "ひとつ", romaji: "hitotsu", meaning_vi: "một cái" },
      { word: "一人", reading: "ひとり", romaji: "hitori", meaning_vi: "một người" },
      { word: "一日", reading: "ついたち", romaji: "tsuitachi", meaning_vi: "ngày mồng một" },
      { word: "一月", reading: "いちがつ", romaji: "ichigatsu", meaning_vi: "tháng một" }
    ],
    level: "N5"
  },
  {
    kanji: "二",
    readings: { kunyomi: ["ふた"], onyomi: ["に"] },
    romaji: ["futa", "ni"],
    meaning_vi: "hai, nhị",
    examples: [
      { word: "二つ", reading: "ふたつ", romaji: "futatsu", meaning_vi: "hai cái" },
      { word: "二人", reading: "ふたり", romaji: "futari", meaning_vi: "hai người" },
      { word: "二日", reading: "ふつか", romaji: "futsuka", meaning_vi: "ngày mồng hai" },
      { word: "二月", reading: "にがつ", romaji: "nigatsu", meaning_vi: "tháng hai" }
    ],
    level: "N5"
  },
  {
    kanji: "三",
    readings: { kunyomi: ["みっ"], onyomi: ["さん"] },
    romaji: ["mit", "san"],
    meaning_vi: "ba, tam",
    examples: [
      { word: "三つ", reading: "みっつ", romaji: "mittsu", meaning_vi: "ba cái" },
      { word: "三人", reading: "さんにん", romaji: "sannin", meaning_vi: "ba người" },
      { word: "三日", reading: "みっか", romaji: "mikka", meaning_vi: "ngày mồng ba" },
      { word: "三月", reading: "さんがつ", romaji: "sangatsu", meaning_vi: "tháng ba" },
      { word: "三百", reading: "さんびゃく", romaji: "sanbyaku", meaning_vi: "ba trăm" },
      { word: "三千円", reading: "さんぜんえん", romaji: "sanzen'en", meaning_vi: "ba nghìn yên" }
    ],
    level: "N5"
  },
  {
    kanji: "四",
    readings: { kunyomi: ["よっ", "よん"], onyomi: ["し"] },
    romaji: ["yot", "yon", "shi"],
    meaning_vi: "bốn, tứ",
    examples: [
      { word: "四つ", reading: "よっつ", romaji: "yottsu", meaning_vi: "bốn cái" },
      { word: "四日", reading: "よっか", romaji: "yokka", meaning_vi: "ngày mồng bốn" },
      { word: "四月", reading: "しがつ", romaji: "shigatsu", meaning_vi: "tháng tư" },
      { word: "四時", reading: "よじ", romaji: "yoji", meaning_vi: "bốn giờ" }
    ],
    level: "N5"
  },
  {
    kanji: "五",
    readings: { kunyomi: ["いつ"], onyomi: ["ご"] },
    romaji: ["itsu", "go"],
    meaning_vi: "năm, ngũ",
    examples: [
      { word: "五つ", reading: "いつつ", romaji: "itsutsu", meaning_vi: "năm cái" },
      { word: "五日", reading: "いつか", romaji: "itsuka", meaning_vi: "ngày mồng năm" },
      { word: "五月", reading: "ごがつ", romaji: "gogatsu", meaning_vi: "tháng năm" }
    ],
    level: "N5"
  },
  {
    kanji: "六",
    readings: { kunyomi: ["むっ"], onyomi: ["ろく"] },
    romaji: ["mut", "roku"],
    meaning_vi: "sáu, lục",
    examples: [
      { word: "六つ", reading: "むっつ", romaji: "muttsu", meaning_vi: "sáu cái" },
      { word: "六日", reading: "むいか", romaji: "muika", meaning_vi: "ngày mồng sáu" },
      { word: "六月", reading: "ろくがつ", romaji: "rokugatsu", meaning_vi: "tháng sáu" },
      { word: "六百", reading: "ろっぴゃく", romaji: "roppyaku", meaning_vi: "sáu trăm" }
    ],
    level: "N5"
  },
  {
    kanji: "七",
    readings: { kunyomi: ["なな"], onyomi: ["しち"] },
    romaji: ["nana", "shichi"],
    meaning_vi: "bảy, thất",
    examples: [
      { word: "七つ", reading: "ななつ", romaji: "nanatsu", meaning_vi: "bảy cái" },
      { word: "七日", reading: "なのか", romaji: "nanoka", meaning_vi: "ngày mồng bảy" },
      { word: "七月", reading: "しちがつ", romaji: "shichigatsu", meaning_vi: "tháng bảy" }
    ],
    level: "N5"
  },
  {
    kanji: "八",
    readings: { kunyomi: ["やっ"], onyomi: ["はち"] },
    romaji: ["yat", "hachi"],
    meaning_vi: "tám, bát",
    examples: [
      { word: "八つ", reading: "やっつ", romaji: "yattsu", meaning_vi: "tám cái" },
      { word: "八日", reading: "ようか", romaji: "youka", meaning_vi: "ngày mồng tám" },
      { word: "八月", reading: "はちがつ", romaji: "hachigatsu", meaning_vi: "tháng tám" }
    ],
    level: "N5"
  },
  {
    kanji: "九",
    readings: { kunyomi: ["ここの"], onyomi: ["きゅう", "く"] },
    romaji: ["kokono", "kyuu", "ku"],
    meaning_vi: "chín, cửu",
    examples: [
      { word: "九つ", reading: "ここのつ", romaji: "kokonotsu", meaning_vi: "chín cái" },
      { word: "九日", reading: "ここのか", romaji: "kokonoka", meaning_vi: "ngày mồng chín" },
      { word: "九月", reading: "くがつ", romaji: "kugatsu", meaning_vi: "tháng chín" }
    ],
    level: "N5"
  },
  {
    kanji: "十",
    readings: { kunyomi: ["とお"], onyomi: ["じゅう"] },
    romaji: ["too", "juu"],
    meaning_vi: "mười, thập",
    examples: [
      { word: "十", reading: "とお", romaji: "too", meaning_vi: "mười" },
      { word: "十日", reading: "とおか", romaji: "tooka", meaning_vi: "ngày mười" },
      { word: "十月", reading: "じゅうがつ", romaji: "juugatsu", meaning_vi: "tháng mười" },
      { word: "十歳", reading: "じゅっさい", romaji: "jussai", meaning_vi: "mười tuổi" }
    ],
    level: "N5"
  },

  // Số lớn (Large Numbers)
  {
    kanji: "百",
    readings: { onyomi: ["ひゃく"] },
    romaji: ["hyaku"],
    meaning_vi: "trăm",
    examples: [
      { word: "百", reading: "ひゃく", romaji: "hyaku", meaning_vi: "một trăm" },
      { word: "百円", reading: "ひゃくえん", romaji: "hyakuen", meaning_vi: "một trăm yên" },
      { word: "百万", reading: "ひゃくまん", romaji: "hyakuman", meaning_vi: "một triệu" }
    ],
    level: "N5"
  },
  {
    kanji: "千",
    readings: { onyomi: ["せん"] },
    romaji: ["sen"],
    meaning_vi: "nghìn",
    examples: [
      { word: "千", reading: "せん", romaji: "sen", meaning_vi: "một nghìn" },
      { word: "千円", reading: "せんえん", romaji: "sen'en", meaning_vi: "một nghìn yên" },
      { word: "一千万", reading: "いっせんまん", romaji: "issenman", meaning_vi: "mười triệu" }
    ],
    level: "N5"
  },
  {
    kanji: "万",
    readings: { onyomi: ["まん"] },
    romaji: ["man"],
    meaning_vi: "vạn, mười nghìn",
    examples: [
      { word: "一万円", reading: "いちまんえん", romaji: "ichiman'en", meaning_vi: "mười nghìn yên" }
    ],
    level: "N5"
  },

  // Con người và danh tính (People & Identity)
  {
    kanji: "私",
    readings: { kunyomi: ["わたし"] },
    romaji: ["watashi"],
    meaning_vi: "tôi",
    examples: [
      { word: "私", reading: "わたし", romaji: "watashi", meaning_vi: "tôi" }
    ],
    level: "N5"
  },
  {
    kanji: "人",
    readings: { kunyomi: ["ひと"], onyomi: ["じん", "にん"] },
    romaji: ["hito", "jin", "nin"],
    meaning_vi: "người, nhân",
    examples: [
      { word: "人", reading: "ひと", romaji: "hito", meaning_vi: "người" },
      { word: "日本人", reading: "にほんじん", romaji: "nihonjin", meaning_vi: "người Nhật" }
    ],
    level: "N5"
  },

  // Giáo dục (Education)
  {
    kanji: "大",
    readings: { kunyomi: ["おお"], onyomi: ["だい"] },
    romaji: ["oo", "dai"],
    meaning_vi: "lớn, đại",
    examples: [
      { word: "大学", reading: "だいがく", romaji: "daigaku", meaning_vi: "đại học" },
      { word: "大学生", reading: "だいがくせい", romaji: "daigakusei", meaning_vi: "sinh viên đại học" }
    ],
    level: "N5"
  },
  {
    kanji: "学",
    readings: { onyomi: ["がく"] },
    romaji: ["gaku"],
    meaning_vi: "học, học tập",
    examples: [
      { word: "学生", reading: "がくせい", romaji: "gakusei", meaning_vi: "học sinh, sinh viên" },
      { word: "留学生", reading: "りゅうがくせい", romaji: "ryuugakusei", meaning_vi: "du học sinh" },
      { word: "学校", reading: "がっこう", romaji: "gakkou", meaning_vi: "trường học" }
    ],
    level: "N5"
  },
  {
    kanji: "生",
    readings: { kunyomi: ["い"], onyomi: ["せい"] },
    romaji: ["i", "sei"],
    meaning_vi: "sinh, sống",
    examples: [
      { word: "先生", reading: "せんせい", romaji: "sensei", meaning_vi: "giáo viên" }
    ],
    level: "N5"
  },
  {
    kanji: "先",
    readings: { onyomi: ["せん"] },
    romaji: ["sen"],
    meaning_vi: "trước, tiên",
    examples: [
      { word: "先生", reading: "せんせい", romaji: "sensei", meaning_vi: "giáo viên" }
    ],
    level: "N5"
  },
  {
    kanji: "校",
    readings: { onyomi: ["こう"] },
    romaji: ["kou"],
    meaning_vi: "trường",
    examples: [
      { word: "学校", reading: "がっこう", romaji: "gakkou", meaning_vi: "trường học" }
    ],
    level: "N5"
  },

  // Thời gian và ngày tháng (Time & Dates)
  {
    kanji: "日",
    readings: { kunyomi: ["ひ", "か"], onyomi: ["にち"] },
    romaji: ["hi", "ka", "nichi"],
    meaning_vi: "ngày, mặt trời",
    examples: [
      { word: "日", reading: "ひ", romaji: "hi", meaning_vi: "ngày" },
      { word: "日本", reading: "にほん", romaji: "nihon", meaning_vi: "Nhật Bản" },
      { word: "休日", reading: "きゅうじつ", romaji: "kyuujitsu", meaning_vi: "ngày nghỉ" },
      { word: "誕生日", reading: "たんじょうび", romaji: "tanjoubi", meaning_vi: "sinh nhật" },
      { word: "15日", reading: "じゅうごにち", romaji: "juugonichi", meaning_vi: "ngày 15" }
    ],
    level: "N5"
  },
  {
    kanji: "本",
    readings: { kunyomi: ["もと"], onyomi: ["ほん"] },
    romaji: ["moto", "hon"],
    meaning_vi: "sách, gốc, bản",
    examples: [
      { word: "本", reading: "ほん", romaji: "hon", meaning_vi: "sách" },
      { word: "日本", reading: "にほん", romaji: "nihon", meaning_vi: "Nhật Bản" }
    ],
    level: "N5"
  },
  {
    kanji: "月",
    readings: { kunyomi: ["つき"], onyomi: ["がつ", "げつ"] },
    romaji: ["tsuki", "gatsu", "getsu"],
    meaning_vi: "tháng, mặt trăng",
    examples: [
      { word: "月", reading: "がつ", romaji: "gatsu", meaning_vi: "tháng" },
      { word: "月曜日", reading: "げつようび", romaji: "getsuyoubi", meaning_vi: "thứ hai" }
    ],
    level: "N5"
  },
  {
    kanji: "時",
    readings: { kunyomi: ["とき"], onyomi: ["じ"] },
    romaji: ["toki", "ji"],
    meaning_vi: "thời gian, giờ",
    examples: [
      { word: "時", reading: "じ", romaji: "ji", meaning_vi: "giờ" }
    ],
    level: "N5"
  },
  {
    kanji: "分",
    readings: { kunyomi: ["わ"], onyomi: ["ふん", "ぶん"] },
    romaji: ["wa", "fun", "bun"],
    meaning_vi: "phút, phần",
    examples: [
      { word: "分", reading: "ふん", romaji: "fun", meaning_vi: "phút" }
    ],
    level: "N5"
  },

  // Các ngày trong tuần (Days of Week)
  {
    kanji: "火",
    readings: { kunyomi: ["ひ"], onyomi: ["か"] },
    romaji: ["hi", "ka"],
    meaning_vi: "lửa, hỏa",
    examples: [
      { word: "火曜日", reading: "かようび", romaji: "kayoubi", meaning_vi: "thứ ba" }
    ],
    level: "N5"
  },
  {
    kanji: "水",
    readings: { kunyomi: ["みず"], onyomi: ["すい"] },
    romaji: ["mizu", "sui"],
    meaning_vi: "nước, thủy",
    examples: [
      { word: "水曜日", reading: "すいようび", romaji: "suiyoubi", meaning_vi: "thứ tư" }
    ],
    level: "N5"
  },
  {
    kanji: "木",
    readings: { kunyomi: ["き"], onyomi: ["もく"] },
    romaji: ["ki", "moku"],
    meaning_vi: "cây, gỗ, mộc",
    examples: [
      { word: "木曜日", reading: "もくようび", romaji: "mokuyoubi", meaning_vi: "thứ năm" }
    ],
    level: "N5"
  },
  {
    kanji: "金",
    readings: { kunyomi: ["きん"], onyomi: ["きん"] },
    romaji: ["kin"],
    meaning_vi: "vàng, kim",
    examples: [
      { word: "金曜日", reading: "きんようび", romaji: "kin'youbi", meaning_vi: "thứ sáu" }
    ],
    level: "N5"
  },
  {
    kanji: "土",
    readings: { kunyomi: ["つち"], onyomi: ["ど"] },
    romaji: ["tsuchi", "do"],
    meaning_vi: "đất, thổ",
    examples: [
      { word: "土曜日", reading: "どようび", romaji: "doyoubi", meaning_vi: "thứ bảy" }
    ],
    level: "N5"
  },

  // Các từ khác
  {
    kanji: "語",
    readings: { onyomi: ["ご"] },
    romaji: ["go"],
    meaning_vi: "ngôn ngữ, từ ngữ",
    examples: [
      { word: "語", reading: "ご", romaji: "go", meaning_vi: "ngôn ngữ" },
      { word: "日本語", reading: "にほんご", romaji: "nihongo", meaning_vi: "tiếng Nhật" }
    ],
    level: "N5"
  },
  {
    kanji: "才",
    readings: { onyomi: ["さい"] },
    romaji: ["sai"],
    meaning_vi: "tuổi, tài",
    examples: [
      { word: "才", reading: "さい", romaji: "sai", meaning_vi: "tuổi" }
    ],
    level: "N5"
  },
  {
    kanji: "留",
    readings: { onyomi: ["りゅう"] },
    romaji: ["ryuu"],
    meaning_vi: "lưu, ở lại",
    examples: [
      { word: "留学生", reading: "りゅうがくせい", romaji: "ryuugakusei", meaning_vi: "du học sinh" }
    ],
    level: "N5"
  },
  {
    kanji: "休",
    readings: { kunyomi: ["やす"], onyomi: ["きゅう"] },
    romaji: ["yasu", "kyuu"],
    meaning_vi: "nghỉ ngơi",
    examples: [
      { word: "休日", reading: "きゅうじつ", romaji: "kyuujitsu", meaning_vi: "ngày nghỉ" }
    ],
    level: "N5"
  },
  {
    kanji: "誕",
    readings: { onyomi: ["たん"] },
    romaji: ["tan"],
    meaning_vi: "sinh",
    examples: [
      { word: "誕生日", reading: "たんじょうび", romaji: "tanjoubi", meaning_vi: "sinh nhật" }
    ],
    level: "N5"
  },
  {
    kanji: "生",
    readings: { kunyomi: ["う", "い"], onyomi: ["せい", "しょう"] },
    romaji: ["u", "i", "sei", "shou"],
    meaning_vi: "sinh, sống",
    examples: [
      { word: "誕生日", reading: "たんじょうび", romaji: "tanjoubi", meaning_vi: "sinh nhật" }
    ],
    level: "N5"
  },
  {
    kanji: "円",
    readings: { onyomi: ["えん"] },
    romaji: ["en"],
    meaning_vi: "yên (tiền tệ), tròn",
    examples: [
      { word: "百円", reading: "ひゃくえん", romaji: "hyakuen", meaning_vi: "một trăm yên" },
      { word: "千円", reading: "せんえん", romaji: "sen'en", meaning_vi: "một nghìn yên" }
    ],
    level: "N5"
  },
  {
    kanji: "曜",
    readings: { onyomi: ["よう"] },
    romaji: ["you"],
    meaning_vi: "ngày trong tuần",
    examples: [
      { word: "月曜日", reading: "げつようび", romaji: "getsuyoubi", meaning_vi: "thứ hai" },
      { word: "火曜日", reading: "かようび", romaji: "kayoubi", meaning_vi: "thứ ba" },
      { word: "水曜日", reading: "すいようび", romaji: "suiyoubi", meaning_vi: "thứ tư" },
      { word: "木曜日", reading: "もくようび", romaji: "mokuyoubi", meaning_vi: "thứ năm" },
      { word: "金曜日", reading: "きんようび", romaji: "kin'youbi", meaning_vi: "thứ sáu" },
      { word: "土曜日", reading: "どようび", romaji: "doyoubi", meaning_vi: "thứ bảy" },
      { word: "日曜日", reading: "にちようび", romaji: "nichiyoubi", meaning_vi: "chủ nhật" }
    ],
    level: "N5"
  }
];

// Tạo bảng tổ chức cho kanji
export const organizedKanjiBasicNumbers: OrganizedTableData = {
  title: 'Bảng Kanji Số Đếm Cơ Bản (基本数字)',
  icon: 'fas fa-calculator',
  columnHeaders: ['Kanji', 'Kunyomi', 'Onyomi', 'Nghĩa'],
  rows: kanjiLibraryData.filter(k => ['一','二','三','四','五','六','七','八','九','十'].includes(k.kanji)).map(kanji => ({
    rowHeader: kanji.kanji,
    cells: [
      { char: kanji.kanji, romaji: kanji.romaji.join('/'), type: 'kanji' as any },
      { char: kanji.readings.kunyomi?.join('・') || '-', romaji: '', type: 'reading' as any },
      { char: kanji.readings.onyomi?.join('・') || '-', romaji: '', type: 'reading' as any },
      { char: kanji.meaning_vi, romaji: '', type: 'meaning' as any }
    ]
  }))
};

export const organizedKanjiTime: OrganizedTableData = {
  title: 'Bảng Kanji Thời Gian & Ngày Tháng (時間・日付)',
  icon: 'fas fa-clock',
  columnHeaders: ['Kanji', 'Kunyomi', 'Onyomi', 'Nghĩa'],
  rows: kanjiLibraryData.filter(k => ['日','月','時','分','年','曜'].includes(k.kanji)).map(kanji => ({
    rowHeader: kanji.kanji,
    cells: [
      { char: kanji.kanji, romaji: kanji.romaji.join('/'), type: 'kanji' as any },
      { char: kanji.readings.kunyomi?.join('・') || '-', romaji: '', type: 'reading' as any },
      { char: kanji.readings.onyomi?.join('・') || '-', romaji: '', type: 'reading' as any },
      { char: kanji.meaning_vi, romaji: '', type: 'meaning' as any }
    ]
  }))
};

export const organizedKanjiPeople: OrganizedTableData = {
  title: 'Bảng Kanji Con Người & Giáo Dục (人・教育)',
  icon: 'fas fa-user-graduate',
  columnHeaders: ['Kanji', 'Kunyomi', 'Onyomi', 'Nghĩa'],
  rows: kanjiLibraryData.filter(k => ['私','人','大','学','生','先','校'].includes(k.kanji)).map(kanji => ({
    rowHeader: kanji.kanji,
    cells: [
      { char: kanji.kanji, romaji: kanji.romaji.join('/'), type: 'kanji' as any },
      { char: kanji.readings.kunyomi?.join('・') || '-', romaji: '', type: 'reading' as any },
      { char: kanji.readings.onyomi?.join('・') || '-', romaji: '', type: 'reading' as any },
      { char: kanji.meaning_vi, romaji: '', type: 'meaning' as any }
    ]
  }))
};

// Export dữ liệu kanji
export const KANJI_CHARACTERS_DATA: KanjiCharacter[] = kanjiLibraryData;

const katakanaExtendedChars = JAPANESE_CHARACTERS_DATA.filter(c => c.type === 'katakana-extended');
const extendedRows: OrganizedTableData['rows'] = [];
const itemsPerRowExtended = 5; 
for (let i = 0; i < katakanaExtendedChars.length; i += itemsPerRowExtended) {
    const chunk = katakanaExtendedChars.slice(i, i + itemsPerRowExtended);
    const cells = Array(itemsPerRowExtended).fill(null);
    chunk.forEach((char, index) => cells[index] = char);
    extendedRows.push({
        rowHeader: `Âm ${i / itemsPerRowExtended + 1}`, 
        cells: cells
    });
}

export const organizedKatakanaExtendedTable: OrganizedTableData = {
  title: 'Bảng Katakana Âm Mở Rộng (拡張カタカナ)',
  icon: 'fas fa-expand-arrows-alt',
  columnHeaders: katakanaExtendedChars.length > 0 ? Array.from({length: Math.min(itemsPerRowExtended, katakanaExtendedChars.length)}, (_, i) => `Col ${i+1}`) : [],
  rows: extendedRows,
};
