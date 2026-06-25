import { TranslationDictionary, Language } from "./types";

export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  icon: string;
}

export const PROBLEM_CATEGORIES: CategoryItem[] = [
  {
    id: "water_supply",
    name: "Water Supply (no water / shortage / timing)",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLvbYSozYY9TKyVPaAM3JQeCC6jl0agjc6FW1Aou4tfWc9yRQEvZcQUdwLp3B1SiQkaXNc7ciJtHwkudPWMMAwqlW3r5g4sJ_KSKGBlQHJR6oRVEy4XTFJA_XqO1d92KB-MxHC-JEkCgV1m23zb86i5oOU1YaW5L7e_sevPnjFUiVgRsgRdXx8qkz9So7BAsJ02Pgtogdpkr8go5gLPZKoDfNkSaCcRrV4kW1zahzZ5JQ8gG6pmmB8flL88",
    icon: "Droplets"
  },
  {
    id: "water_leakage",
    name: "Water Leakage / Pipe Burst",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLvTDP6I5SeosfAEoi6ABIZuoRDrFBhBkM34C3qyrsbrXTRkdoXOJ0nHeZ5qtnJUruV-jezgNBw8ko3X9AcuZErGswh6YgUBDcQa3vFnnYrzmpXafQBYdWA2eEOMx2qj244hUTKixPtYMMz7ZnAkN0NqStgMgjt6_k2pSue3ttjTROE8Os7L93t15Q8aRwIu-zJ31ugcUrMai3N4kUI75gQfPkV_Lli6a5_i7Sxr-6FunyzHCJ-RPu-fw-k",
    icon: "FlameKindling"
  },
  {
    id: "drinking_water",
    name: "Drinking Water Contamination",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLuT5c84Teid-D0Y9B44olnxbto_nneaqAhuCAfdw9zRBK9Rxxjh3Wu60Bp5ae_7p6PX72di0RAxsz4Y-6LD1ogdBLZ7t1mciFTmM_iK8DKbtgxHBh80Wu9sxuh_tvgyHcLSkPBSOl0w6nHhevab3ggi_ZEXSA_jcgke7o1sTZqFJVmIpU83JhG0i5S69bDR-D-8Qy-IpR2Y5COumQ6fheVhNn-i1cPceGE3oLcIhujvjT1OHYayfd6K85I",
    icon: "GlassWater"
  },
  {
    id: "power_cut",
    name: "Power Cut / Electricity Issue",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLuZ1OzqPKbZV480ezqw0LJna1pPcQywBic01biTImfNW4XMyROvP-Unhig6PeLD5HyCYx3d9cuQCbt5zHtDJ5IcZrSK5DGvyf8xcvZ_IYWctV_VNsxEd-QBqrusM1UGbUNWe5DssWs11ftNzSktYp0kbt9ccSpY8H7ETCQHs4qJ6pa0ir-e9g2X9kbx2ok6BJu6xQ9WjrpqfyVriGyNHaKdbE89R3aO60IWT6pPB83QslsjOeC5UG-pbA",
    icon: "Zap"
  },
  {
    id: "street_light",
    name: "Street Light Not Working",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLuBF0nnBNBhfcjdHuqMBAqDKkS3H4rWoUnwheFHNbyIW_9giwwkfPcYDwrjvPTa4yUxDlw3-CA2NIQYKtoJeWWawzzBrTwiPPDnwj1DjVNGlSpDg9tLwCyMcFWCP2Kg2tW337AkyVbadFhbC9R2wb5-_ZfNGkmjXgSMzEbh97cUpgeQDF_Z2yBbiMs6VwK1iz-mMan1BwXA0dLoQ21M1PIMs2On04OwE7j8OUH9alM82g6pbaF1ZDGh1A",
    icon: "Lightbulb"
  },
  {
    id: "road_damage",
    name: "Road Damage / Potholes",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLunkFCtkhgB571YsF2E094WkJlSIwqSgTYTRGLWhfBLAgrR46jdO8EYJWu8jvAa6R7d2xBt5j0CIXBIVLZpD2YxSbVoZ1Nla4Awxw0Yl14UQ16vtqYC2dRJpBJGYWtRQzvvw7rCticPRiNEhmIumqJQoLddsReRW6srzIDoS961sNRCjlxmpVRbk1qaDSvm4aHf3IZ2txnj9d2nJ8srRqjMnLwRD_sIIFC8z16qoWY6ut_WUVZE3eSlwWc",
    icon: "TriangleAlert"
  },
  {
    id: "drainage",
    name: "Drainage / Sewage Overflow",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLtTQrpYTqbrhxE9VFVmFCTCF7JQWxNCjZiUfjCFFzCZylJ_4XLeUy0cpuuW3e_IXGGNA-jq1by3TK2mcIIGnGFH70bzAVVge7bgt1H5y3tKMbC0m0sWRDO_U2Pn8KE35w-dfhRmCeDRBYMKRPNsFhP8vTJ4X_kgnfk4VrA8Q1t1NVnW8LBROoGKzsSLHCRWaUCdkql3vLzKbnLMUplSmZPSlLfxfgh3CJ4ziXBUDtZgwNALWvLo67YQLQ",
    icon: "Waves"
  },
  {
    id: "garbage",
    name: "Garbage / Sanitation",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLuqxcpGiV_ZRAuKhp6Iij9jGmmkizjX19ACkvROkvqZZDuRD67-NFTerFXNk9rFZ9EJFxIj2g3c3vWfBkP0s145JeoItQITgPIV44Ft96ORS5y8P8ku3Ah8WzQB8747aw2mVKYPGHk5hdUFEEbmuvkkjM5jyXlHJVsGqu9zS3cINB3IcZ0CZhsfWknI2C8JRnsF8G1hYTbipkAT0Ydgu5y6W-AYcgFWWLkLNyyv6kRKpgFG3TVLA0frzEc",
    icon: "Trash2"
  },
  {
    id: "stray_animals",
    name: "Stray Dogs / Cattle Menace",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLvXtEYbphFwDQTZaz-HJV2uWUrTK_XH-5GX-IPDOUtz48iPEFRzaHrEJ9HRUgFidRymv-kccFcT1nLXWXXp3xE8Kz2c7toltHy83H1zSKrzNRFJCZQpUQBBkpt4i2UZntZlYGTkbhUo_t5D9K9GSuMlOn91i-mJhNP9htvxtHgB0OEN0mooGQYqdvgMqHXCS1O8T2QuOboPu-q0vsUtoWYv1QfSb5EAGo_5q95T6qIcwW7wHVhYZH_mUOw",
    icon: "PawPrint"
  },
  {
    id: "mosquito",
    name: "Mosquito / Fogging / Health Hazard",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLugJQ5CRCdQ7s2GOI-BDTVfx3kECcqBnksf6fpXCHDKm4whmdqoWRBlAheDXEbFqZ8sY4Bv_0K-lTtuE3Inunv5VMGWRlOGCk7-NMjOa2CESncQ-roqjKWmdsrV5qhB02o_y1dAlk-7RaTnGia135TQXPIwa4G_C6dHxCmyUSwfBygexd1m2QHcLqT6COl_osKmuWLjzSSnE4vs0HnK2rHLaMFtqpNAcxuaM77ruZxZaCBgJhzPb4otSv8",
    icon: "ShieldAlert"
  },
  {
    id: "encroachment",
    name: "Encroachment / Illegal Construction",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLs5TdQsICNXASpoCdOAkTKSA7uAIfLKdeS4KpeKy4b9IgOzDKE17MHXy5HW2Qprx5AxQbYNupo7ZnQOcZfsKd9xJUBfrC3HglzMMKFMK4hcLORAfgsCukRmgMq6JrYOmgTZPPgEMY6cbuFvmy_iakk-37zfUeOaiTxPexgqzxbiB4RbDdUlAAZxV7DRCHfk8s8jO2KQ1aRY8E-FcTAHgVs1qBniNyfrYpRkzNqgkinHwt_3sMEK2nFKKA",
    icon: "Fence"
  },
  {
    id: "fallen_tree",
    name: "Fallen / Dangerous Tree",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLuCH-ur0F3_go7h66dJFlDqSHvlOuFqZjsdRLSgx_U5stXLsDVUMaEwmSLPZlyOPPYXgLi7T4Y27jNvo_tsx6-_Cn2BrcBxtfCbvSGvWiKUVt4rRYSfbz7l_5RTob9jMLbD8H0NejJHJNhNRVnnbwmXALtuWg7CN619gNkTiHkGnpC6HG8rpxFSlqe-mEkAQurHJjkqiQRcQPl6GSjc_VVksxspBLYngwfrkc8rvSxA7aC03g7k2kkxTXw",
    icon: "Trees"
  },
  {
    id: "damaged_property",
    name: "Damaged Public Property",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLtuInBYsNfgapOtsVR6IvzIyKgTK7L2nz9QXg6Y6mGSfXt7jtEU9LftciM8196UNkXXAyBsOG5j7gRzBRCRgIFXFb99i_mRh7B8bwVKBUu6Sdhy1ixLVQ_KmKxDMqw69FSEZgHvbwluBo9W9e2WJnncy8Kddr3H6nFap5bB8-3MPmH2yVrIlUEdHrULCFiPipn8Lt2ajgLZXFy9kysITYHsgcKORo5MU7mQY1Ff0g4kwM1Scbx6pBuCZe4",
    icon: "Hammer"
  },
  {
    id: "solid_waste",
    name: "Solid waste management",
    image: "https://lh3.googleusercontent.com/aida/AP1WRLva5MZTTjst09vajluclWUmuDXhZoMdXo7jGaLirkAdPQr2P6fGG7QZ96pqcmWNnAakIyoSOvt-uQQ6J_FVGsV1MYPTcj09K5XvA_y2KFaPazTh6jvA9iwfJpXxlHj5tLjrJZnXiLZ87DRYGsZPmy7NPiEGQzQm22F9DHniWd2pQrNJvUGMwCs4SkDGu5qUZNzba-T9H8MCbb8hNQGMe8NPGY1ztGH8JcdyHwgXqO0uYqX18MBMIpuxqqc",
    icon: "Wrench"
  }
];

export const VILLAGE_STREETS = [
  "Main Street (Ward 1)",
  "School Lane (Ward 2)",
  "Temple Street (Ward 3)",
  "Market Road (Ward 1)",
  "Bus Stand Area (Ward 4)",
  "Hospital Road (Ward 2)",
  "Panchayat Office Road (Ward 3)",
  "Water Tank Lane (Ward 4)"
];

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appName: "Namma Ooru My Village",
    yourStreetYourVoice: "Your street · your voice",
    taglineTitle: "A problem on your street?",
    taglineHighlight: "Tell us once.",
    taglineDesc: "Report water, road, electricity and other civic problems in My Village — by text, voice note, or photo. No app to install.",
    reportProblemBtn: "Report a problem",
    howItWorksBtn: "How it works",
    commonProblemsTitle: "Common problems people report",
    howItWorksTitle: "How it works",
    howItWorksSubtitle: "NAMMA OORU PROCESS",
    step1Title: "Pick the problem",
    step1Desc: "Water, road, street light and more.",
    step2Title: "Say it your way",
    step2Desc: "Type, record your voice, or attach a photo.",
    step3Title: "We pass it on",
    step3Desc: "It reaches the people who can fix it.",
    reportProblemNowBtn: "Report a problem now",
    adminPortal: "Admin Portal",
    solvedBadge: "Solved",
    homeNav: "Home",
    myIssuesNav: "My Issues",
    profileNav: "Profile",
    logoutBtn: "Sign Out",
    adminDashboardTitle: "Village Municipal Board",
    totalIssues: "Total Reports",
    resolvedIssues: "Resolved",
    pendingIssues: "Pending",
    resolutionRate: "Resolution"
  },
  ta: {
    appName: "நம்ம ஊர் என் கிராமம்",
    yourStreetYourVoice: "உங்கள் தெரு · உங்கள் குரல்",
    taglineTitle: "உங்கள் தெருவில் ஏதேனும் பிரச்சனையா?",
    taglineHighlight: "எங்களிடம் ஒருமுறை கூறுங்கள்.",
    taglineDesc: "நமது கிராமத்தில் குடிநீர், சாலை, மின்சாரம் மற்றும் இதர மக்கள் பிரச்சனைகளை எழுத்து, குரல் பதிவு அல்லது புகைப்படம் மூலம் புகாரளியுங்கள்.",
    reportProblemBtn: "பிரச்சனையைப் புகாரளிக்கவும்",
    howItWorksBtn: "இது எவ்வாறு செயல்படுகிறது",
    commonProblemsTitle: "மக்கள் புகாரளிக்கும் பொதுவான பிரச்சனைகள்",
    howItWorksTitle: "இது எவ்வாறு செயல்படுகிறது",
    howItWorksSubtitle: "நம்ம ஊர் செயல்முறை",
    step1Title: "பிரச்சனையைத் தேர்ந்தெடுக்கவும்",
    step1Desc: "குடிநீர், சாலை, தெருவிளக்கு மற்றும் பல.",
    step2Title: "உங்கள் வழியில் கூறுங்கள்",
    step2Desc: "டைப் செய்யவும், குரலை பதிவு செய்யவும் அல்லது புகைப்படத்தை இணைக்கவும்.",
    step3Title: "நாங்கள் கொண்டு சேர்ப்போம்",
    step3Desc: "அதை சரிசெய்யக்கூடிய அதிகாரிகளை இது சென்றடையும்.",
    reportProblemNowBtn: "இப்போதே புகாரளிக்கவும்",
    adminPortal: "அதிகாரிகள் தளம்",
    solvedBadge: "தீர்க்கப்பட்டது",
    homeNav: "முகப்பு",
    myIssuesNav: "எனது புகார்கள்",
    profileNav: "சுயவிவரம்",
    logoutBtn: "வெளியேறு",
    adminDashboardTitle: "கிராம ஊராட்சி நிர்வாகக் குழு",
    totalIssues: "மொத்த புகார்கள்",
    resolvedIssues: "தீர்க்கப்பட்டவை",
    pendingIssues: "நிலுவையில் உள்ளவை",
    resolutionRate: "தீர்வு விகிதம்"
  }
};
