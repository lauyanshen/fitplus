"use client";
import { FormEvent, useEffect, useState } from "react";
import { requestFitAI } from "@/lib/fit-ai-client";
import { fitAsset } from "@/lib/fit-assets";
import {
  Activity,
  Apple,
  Bot,
  Camera,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CirclePlus,
  Download,
  Droplets,
  Dumbbell,
  Flame,
  HeartPulse,
  LayoutDashboard,
  LoaderCircle,
  MessageCircle,
  MoreHorizontal,
  Search,
  Settings,
  Smile,
  Sparkles,
  Trophy,
  Target,
  Trash2,
  Utensils,
  Zap,
  X,
} from "lucide-react";
type Profile = {
  name: string;
  age: number;
  sex: "female" | "male";
  height: number;
  weight: number;
  goalWeight: number;
  goal: "lose" | "maintain" | "gain";
  activity: "low" | "moderate" | "high";
  schoolDay: "school" | "tuition" | "screen";
  teenFocus: "energy" | "sugar" | "movement";
};
type Language = "en" | "ms" | "zh";
type AssistantUsage = { date: string; count: number };
const words: Record<Language, Record<string, string>> = {
  en: {
    Overview: "Overview",
    Meals: "Meals",
    Exercise: "Exercise",
    Progress: "Progress",
    Assistant: "Assistant",
    Settings: "Settings",
    hello: "Hello",
    tracker: "Daily health tracker",
    language: "Language",
    listFood: "List each food",
    aiSearch: "AI calorie search",
    estimateEach: "Estimate each food",
    photoMeal: "Take or upload a food photo",
    photoMealHelp: "Use a clear photo from above. The photo is sent to AI only when you tap Analyse photo; it is not saved in your meal history.",
    choosePhoto: "Choose food photo",
    analyzePhoto: "Analyse photo",
    changePhoto: "Change photo",
    photoEstimateNote: "Photo estimates are approximate. Check the detected foods and portions before adding them.",
    removePhoto: "Remove photo",
    orTypeFoods: "or type foods",
    exerciseAuto: "Calculated automatically from duration, activity intensity and your saved weight.",
    foodHint:
      "Add portions when you know them. Fit+ will estimate every line separately.",
    sugarToday: "Today’s estimated sugar",
    total: "Total",
    addedSugar: "Added/free sugar",
    remaining: "remains within today’s guide.",
    sugarExceeded: "You have reached or exceeded today’s added-sugar guide.",
    combined: "Estimated combined total",
    addAll: "Add all to today",
    recorded: "Meals recorded",
    noMeals: "No meals recorded for this date.",
    askDay: "Assistant",
    powered: "Your personal AI coach",
    askPlaceholder: "Ask Fit+ a health or fitness question",
    answerUses: "Your answer will use today’s meals, exercise, BMI and goal.",
    eatNext: "What should I eat next?",
    workout: "Suggest today’s workout",
    onTrack: "Am I on track today?",
    smallChoices: "Small choices today become lasting progress.", teenMode: "Teen mode", teenModeNote: "Built for school days, real Malaysian food choices and healthy routines — not appearance targets.", schoolDay: "School-day lifestyle", schoolSchool: "School + co-curriculars", schoolTuition: "School + tuition", schoolScreen: "More screen time", teenFocus: "Your focus", focusEnergy: "Steady energy", focusSugar: "Sugar-smart choices", focusMovement: "Move more comfortably", dailyMissions: "Daily Health Missions", missionNote: "Three small wins for a stronger, steadier day.", missionWater: "Bring water into your day", missionSugar: "Try one lower-sugar swap", missionMove: "Move for 20 minutes", missionDone: "Done", sugarDetective: "Sugar Detective", sugarDetectiveBody: "Milo ais, teh tarik, bubble tea or canned drinks can quietly add sugar. Check the estimate in Meals, then try water, unsweetened tea or a smaller serving.", sugarTodayTeaspoons: "estimated today", sugarDetectiveNote: "Estimates help you notice patterns. They are not a diagnosis.", teaspoons: "teaspoons", healthierSwap: "Try this swap", malayFoodGuide: "Malaysian food guide", viewGuide: "View in Meals", streakKind: "Streaks track consistency, not body size.", AIHealthNote: "Education and habit guidance only — not medical advice or diabetes diagnosis.",
    howToUse: "How to use Fit+", guideTitle: "Four simple steps for a healthier day", guideBody: "Tap any step to begin. Fit+ saves each activity and refreshes the guide every day.", guideProgress: "daily steps completed", stepMealTitle: "Record a meal", stepMealBody: "Describe your food and let AI estimate it.", stepMoveTitle: "Add movement", stepMoveBody: "Record your activity and duration.", stepCheckTitle: "Check your wellbeing", stepCheckBody: "Choose your mood and energy level.", stepAskTitle: "Ask the assistant", stepAskBody: "Get guidance using today’s records.", healthNotice: "Your health status", healthHealthy: "Your result is within the healthy range. Keep building balanced, repeatable habits.", healthHigher: "This result is above the healthy range. Focus on gradual habits and consider professional guidance.", healthLower: "This result is below the healthy range. Prioritise nourishing meals and review it with a professional.", bmiAgeNotice: "For children and teenagers, this is a BMI-for-age screening result—not a diagnosis. Review growth with a parent and healthcare professional.", adultBmiNotice: "BMI is a screening measure, not a diagnosis. Health also depends on many other factors.", viewProgress: "View details",
    aiCoach: "AI health coach", deeperInsights: "Deeper insights and a plan that adapts to your real day.", normalDaily: "Normal · 10/day", plusDaily: "Plus+ active · 50/day", openPlus: "Open Plus+", comparePlans: "Compare plans",
    premium: "PREMIUM", goodMorning: "Good morning, let’s make today count.", healthierChoices: "A healthier, stronger you is built by today’s small choices. Your assistant will keep the plan simple.", askAssistant: "Ask Assistant", getMealIdeas: "Get meal ideas",
    planToday: "Your plan for today", stepsComplete: "of 3 steps complete. Real progress.", momentum: "momentum",
    mealLogged: "Meal logged", logFirstMeal: "Log your first meal", nutritionUpdated: "Nutrition updated for today.", nutritionGuidance: "Get nutrition and sugar guidance.", viewMeals: "View meals", logMeal: "Log meal",
    activeMinutes: "active minutes", moveBody: "Move your body", movementComplete: "Movement goal completed.", movementCounts: "Any movement counts — even 10 minutes.", viewActivity: "View activity", addExercise: "Add exercise",
    wellbeingDone: "Wellbeing checked in", wellbeingCheck: "Check in with your wellbeing", logMoodEnergy: "Log your mood and energy.", update: "Update", logMood: "Log mood",
    feelingToday: "How are you feeling today?", checkinHelp: "A quick check-in helps your assistant give advice that matches your day.", mood: "Mood", energy: "Energy", low: "Low", okay: "Okay", great: "Great",
    currentStreak: "Current streak", day: "day", days: "days", startToday: "Start today. Consistency builds momentum.", todayGlance: "Today at a glance", live: "Live", Sugar: "Sugar", Water: "Water", logged: "logged", glasses: "glasses", checkIn: "Check in",
    thisWeek: "This week", fiveDays: "Show up on five days. Consistency beats perfection.", smarterGuidance: "Guidance for your real day", useDailyContext: "Ask questions using today’s meals, movement, mood and goals.", chatPlus: "Ask Assistant",
    recordExercise: "Record exercise", briskWalk: "Brisk walk", homeStrength: "Home strength", cycling: "Cycling", activity: "Activity", durationMinutes: "Duration (minutes)", kcalBurned: "Estimated kcal burned", exerciseEstimate: "Fitness watches may provide a more personal estimate. Exercise calories are approximate.", activitiesRecorded: "Activities recorded", noExercise: "No exercise recorded for this date.", minutes: "minutes",
    daysMeals: "Days with meals", weeklyActivity: "Weekly activity", goalConsistency: "Goal consistency", last7Days: "Last 7 days", barsCalories: "Bars show calories recorded. Missing days appear blank.",
    profileGoals: "Profile and goals", Name: "Name", Age: "Age", sexEstimate: "Sex used for health estimates", Female: "Female", Male: "Male", heightCm: "Height (cm)", currentWeight: "Current weight (kg)", goalWeight: "Goal weight (kg)", Goal: "Goal", loseWeight: "Lose weight", maintainWeight: "Maintain weight", gainWeight: "Gain weight", Activity: "Activity", mostlySitting: "Mostly sitting", weeklyExercise: "Some weekly exercise", veryActive: "Very active", youthGoal: "Goal: Support healthy growth and build sustainable habits.", yourRecords: "Your records", backupAdvice: "Download a backup before clearing browser data or changing devices.", exportBackup: "Export backup", deleteData: "Delete all data", deleteConfirm: "Delete every Fit+ record on this device? This cannot be undone.",
    paymentRequired: "Payment required for Plus+", paymentCost: "Plus+ costs RM14.90 per month. It only unlocks after a successful, verified payment.", paymentsUnavailable: "Payments are not available yet.", paymentNote: "Fit+’s owner still needs to connect Stripe checkout. You have not been charged, and your Normal plan remains active.", continueNormal: "Continue with Normal — Free",
    coachCompanion: "Coach Companion", currentPlan: "Current plan", normalAssistant: "Normal Assistant", Free: "Free", bestValue: "BEST VALUE", perMonth: "/month", annualPrice: "Or RM149/year · save RM29.80", normalBenefits: "10 health questions per day|Short answers up to about 100 words|Uses today’s health records|Standard AI model", plusBenefits: "50 health questions per day|Longer answers up to about 350 words|More capable premium AI model|Response speed varies with demand", upgradePlus: "Upgrade to Plus+ · RM14.90/month", checkoutPending: "Payment required. Checkout is not connected yet.", premiumCoach: "Premium AI health coach", freeCoach: "Free AI health coach", questionsLeft: "Questions remaining today", generalGuidance: "General guidance only. Seek professional care for medical symptoms, eating disorders, pregnancy, medicines or treatment.",
    childTeen: "Child or teen", olderAdult: "Older adult", adult: "Adult", youthGuidance: "Children and teens grow at different rates. Fit+ tracks balanced meals and activity, but does not set weight-loss or calorie-deficit targets. Review growth with a parent or healthcare professional.", olderGuidance: "Prioritise regular meals, protein, hydration, balance and strength. Weight changes should be gradual, especially with medical conditions or unplanned weight loss.", adultGuidance: "Use repeatable meal and activity habits. Daily energy needs are estimates and should be adjusted using your longer-term progress.",
    notifications: "Notifications", routineComplete: "Today’s routine is complete", routineCompleteNote: "Great work—you logged a meal, reached your activity target and completed your wellbeing check-in.", routinePending: "Your routine is not finished yet", routinePendingNote: "Complete the remaining steps before the day ends.", remainingSteps: "steps remaining", aiAllowance: "AI allowance", questionsRemain: "questions remaining today", allowanceLow: "Your AI allowance is running low.", allowanceOut: "Your AI allowance is used up", freeAllowanceOut: "You have used all 10 free questions today. Upgrade to Plus+ for a larger daily allowance.", plusAllowanceOut: "You have used all Plus+ questions for today. The daily allowance resets tomorrow, or choose Buy more to view payment options.", finishRoutine: "Finish routine", openAssistant: "Open Assistant", upgradeNow: "Upgrade to Plus+", buyMore: "Buy more questions", allCaughtUp: "You’re all caught up.",
  },
  ms: {
    Overview: "Ringkasan",
    Meals: "Makanan",
    Exercise: "Senaman",
    Progress: "Kemajuan",
    Assistant: "Pembantu",
    Settings: "Tetapan",
    hello: "Hai",
    tracker: "Penjejak kesihatan harian",
    language: "Bahasa",
    listFood: "Senaraikan setiap makanan",
    aiSearch: "Carian kalori AI",
    estimateEach: "Anggar setiap makanan",
    photoMeal: "Ambil atau muat naik foto makanan",
    photoMealHelp: "Gunakan foto yang jelas dari atas. Foto dihantar kepada AI hanya apabila anda menekan Analisis foto; foto tidak disimpan dalam sejarah makanan.",
    choosePhoto: "Pilih foto makanan",
    analyzePhoto: "Analisis foto",
    changePhoto: "Tukar foto",
    photoEstimateNote: "Anggaran foto adalah anggaran sahaja. Semak makanan dan saiz hidangan sebelum menambahnya.",
    removePhoto: "Buang foto",
    orTypeFoods: "atau taip makanan",
    exerciseAuto: "Dikira secara automatik berdasarkan tempoh, intensiti aktiviti dan berat yang disimpan.",
    foodHint:
      "Nyatakan saiz hidangan jika diketahui. Fit+ akan menganggar setiap baris secara berasingan.",
    sugarToday: "Anggaran gula hari ini",
    total: "Jumlah",
    addedSugar: "Gula tambahan/bebas",
    remaining: "lagi dalam panduan hari ini.",
    sugarExceeded:
      "Anda telah mencapai atau melebihi panduan gula tambahan hari ini.",
    combined: "Jumlah anggaran keseluruhan",
    addAll: "Tambah semua ke hari ini",
    recorded: "Makanan direkodkan",
    noMeals: "Tiada makanan direkodkan untuk tarikh ini.",
    askDay: "Pembantu",
    powered: "Jurulatih AI peribadi anda",
    askPlaceholder: "Tanya Fit+ soalan kesihatan atau kecergasan",
    answerUses:
      "Jawapan menggunakan makanan, senaman, BMI dan matlamat hari ini.",
    eatNext: "Apa patut saya makan seterusnya?",
    workout: "Cadangkan senaman hari ini",
    onTrack: "Adakah saya mengikut sasaran hari ini?",
    smallChoices: "Pilihan kecil hari ini membawa kemajuan yang berkekalan.", teenMode: "Mod remaja", teenModeNote: "Direka untuk hari persekolahan, pilihan makanan Malaysia dan rutin sihat — bukan sasaran rupa badan.", schoolDay: "Gaya hidup hari sekolah", schoolSchool: "Sekolah + kokurikulum", schoolTuition: "Sekolah + tuisyen", schoolScreen: "Lebih banyak masa skrin", teenFocus: "Fokus anda", focusEnergy: "Tenaga stabil", focusSugar: "Pilihan kurang gula", focusMovement: "Bergerak dengan selesa", dailyMissions: "Misi Kesihatan Harian", missionNote: "Tiga kemenangan kecil untuk hari yang lebih kuat dan stabil.", missionWater: "Minum air sepanjang hari", missionSugar: "Cuba satu pertukaran rendah gula", missionMove: "Bergerak selama 20 minit", missionDone: "Selesai", sugarDetective: "Detektif Gula", sugarDetectiveBody: "Milo ais, teh tarik, bubble tea atau minuman dalam tin boleh menambah gula tanpa disedari. Semak anggaran dalam Makanan, kemudian cuba air kosong, teh tanpa gula atau hidangan lebih kecil.", sugarTodayTeaspoons: "anggaran hari ini", sugarDetectiveNote: "Anggaran membantu anda melihat corak. Ini bukan diagnosis.", teaspoons: "sudu teh", healthierSwap: "Cuba pertukaran ini", malayFoodGuide: "Panduan makanan Malaysia", viewGuide: "Lihat dalam Makanan", streakKind: "Rentetan menjejak konsistensi, bukan saiz badan.", AIHealthNote: "Panduan pendidikan dan tabiat sahaja — bukan nasihat perubatan atau diagnosis.",
    howToUse: "Cara menggunakan Fit+", guideTitle: "Empat langkah mudah untuk hari lebih sihat", guideBody: "Tekan mana-mana langkah untuk bermula. Fit+ menyimpan aktiviti dan memperbaharui panduan setiap hari.", guideProgress: "langkah harian selesai", stepMealTitle: "Rekod makanan", stepMealBody: "Terangkan makanan dan biarkan AI membuat anggaran.", stepMoveTitle: "Tambah pergerakan", stepMoveBody: "Rekod aktiviti dan tempohnya.", stepCheckTitle: "Semak kesejahteraan", stepCheckBody: "Pilih emosi dan tahap tenaga anda.", stepAskTitle: "Tanya pembantu", stepAskBody: "Dapatkan panduan berdasarkan rekod hari ini.", healthNotice: "Status kesihatan anda", healthHealthy: "Keputusan anda berada dalam julat sihat. Teruskan tabiat seimbang yang boleh diamalkan.", healthHigher: "Keputusan ini melebihi julat sihat. Fokus pada tabiat beransur-ansur dan pertimbangkan panduan profesional.", healthLower: "Keputusan ini di bawah julat sihat. Utamakan makanan berkhasiat dan semak dengan profesional.", bmiAgeNotice: "Bagi kanak-kanak dan remaja, ini ialah saringan BMI-mengikut-umur, bukan diagnosis. Semak tumbesaran bersama ibu bapa dan profesional kesihatan.", adultBmiNotice: "BMI ialah ukuran saringan, bukan diagnosis. Kesihatan juga bergantung pada banyak faktor lain.", viewProgress: "Lihat butiran",
    aiCoach: "Jurulatih kesihatan AI", deeperInsights: "Panduan lebih mendalam dan pelan yang menyesuaikan diri dengan hari anda.", normalDaily: "Normal · 10/hari", plusDaily: "Plus+ aktif · 50/hari", openPlus: "Buka Plus+", comparePlans: "Bandingkan pelan",
    premium: "PREMIUM", goodMorning: "Selamat pagi, mari jadikan hari ini bermakna.", healthierChoices: "Diri yang lebih sihat dan kuat dibina melalui pilihan kecil hari ini. Pembantu anda memudahkan pelan harian.", askAssistant: "Tanya Pembantu", getMealIdeas: "Dapatkan idea makanan",
    planToday: "Pelan anda hari ini", stepsComplete: "daripada 3 langkah selesai. Kemajuan sebenar.", momentum: "momentum",
    mealLogged: "Makanan direkodkan", logFirstMeal: "Rekod makanan pertama", nutritionUpdated: "Pemakanan hari ini dikemas kini.", nutritionGuidance: "Dapatkan panduan pemakanan dan gula.", viewMeals: "Lihat makanan", logMeal: "Rekod makanan",
    activeMinutes: "minit aktif", moveBody: "Gerakkan badan anda", movementComplete: "Sasaran pergerakan selesai.", movementCounts: "Setiap pergerakan dikira — walaupun 10 minit.", viewActivity: "Lihat aktiviti", addExercise: "Tambah senaman",
    wellbeingDone: "Kesejahteraan telah disemak", wellbeingCheck: "Semak keadaan diri anda", logMoodEnergy: "Rekod emosi dan tenaga anda.", update: "Kemas kini", logMood: "Rekod emosi",
    feelingToday: "Bagaimana perasaan anda hari ini?", checkinHelp: "Semakan ringkas membantu pembantu memberi nasihat yang sesuai dengan hari anda.", mood: "Emosi", energy: "Tenaga", low: "Rendah", okay: "Sederhana", great: "Baik",
    currentStreak: "Rentetan semasa", day: "hari", days: "hari", startToday: "Mulakan hari ini. Konsistensi membina momentum.", todayGlance: "Ringkasan hari ini", live: "Langsung", Sugar: "Gula", Water: "Air", logged: "direkod", glasses: "gelas", checkIn: "Daftar masuk",
    thisWeek: "Minggu ini", fiveDays: "Aktif selama lima hari. Konsistensi lebih penting daripada kesempurnaan.", smarterGuidance: "Panduan untuk hari sebenar anda", useDailyContext: "Tanya soalan berdasarkan makanan, pergerakan, emosi dan matlamat hari ini.", chatPlus: "Tanya Pembantu",
    recordExercise: "Rekod senaman", briskWalk: "Berjalan pantas", homeStrength: "Latihan kekuatan di rumah", cycling: "Berbasikal", activity: "Aktiviti", durationMinutes: "Tempoh (minit)", kcalBurned: "Anggaran kcal dibakar", exerciseEstimate: "Jam kecergasan mungkin memberi anggaran yang lebih peribadi. Kalori senaman hanyalah anggaran.", activitiesRecorded: "Aktiviti direkodkan", noExercise: "Tiada senaman direkodkan untuk tarikh ini.", minutes: "minit",
    daysMeals: "Hari dengan rekod makanan", weeklyActivity: "Aktiviti mingguan", goalConsistency: "Konsistensi matlamat", last7Days: "7 hari terakhir", barsCalories: "Bar menunjukkan kalori yang direkodkan. Hari tanpa rekod dibiarkan kosong.",
    profileGoals: "Profil dan matlamat", Name: "Nama", Age: "Umur", sexEstimate: "Jantina untuk anggaran kesihatan", Female: "Perempuan", Male: "Lelaki", heightCm: "Tinggi (cm)", currentWeight: "Berat semasa (kg)", goalWeight: "Berat sasaran (kg)", Goal: "Matlamat", loseWeight: "Turunkan berat", maintainWeight: "Kekalkan berat", gainWeight: "Tambah berat", Activity: "Aktiviti", mostlySitting: "Kebanyakannya duduk", weeklyExercise: "Bersenam beberapa kali seminggu", veryActive: "Sangat aktif", youthGoal: "Matlamat: Menyokong tumbesaran sihat dan membina tabiat berkekalan.", yourRecords: "Rekod anda", backupAdvice: "Muat turun sandaran sebelum memadam data pelayar atau menukar peranti.", exportBackup: "Eksport sandaran", deleteData: "Padam semua data", deleteConfirm: "Padam semua rekod Fit+ pada peranti ini? Tindakan ini tidak boleh dibuat asal.",
    paymentRequired: "Bayaran diperlukan untuk Plus+", paymentCost: "Plus+ berharga RM14.90 sebulan dan hanya dibuka selepas bayaran berjaya disahkan.", paymentsUnavailable: "Pembayaran belum tersedia.", paymentNote: "Pemilik Fit+ masih perlu menyambungkan pembayaran Stripe. Anda belum dicaj dan pelan Normal kekal aktif.", continueNormal: "Teruskan dengan Normal — Percuma",
    coachCompanion: "Teman Kesihatan", currentPlan: "Pelan semasa", normalAssistant: "Pembantu Normal", Free: "Percuma", bestValue: "NILAI TERBAIK", perMonth: "/bulan", annualPrice: "Atau RM149/tahun · jimat RM29.80", normalBenefits: "10 soalan kesihatan sehari|Jawapan ringkas sehingga kira-kira 100 patah perkataan|Menggunakan rekod kesihatan hari ini|Model AI standard", plusBenefits: "50 soalan kesihatan sehari|Jawapan lebih panjang sehingga kira-kira 350 patah perkataan|Model AI premium yang lebih berkeupayaan|Kelajuan respons bergantung pada permintaan", upgradePlus: "Naik taraf ke Plus+ · RM14.90/bulan", checkoutPending: "Bayaran diperlukan. Pembayaran belum disambungkan.", premiumCoach: "Jurulatih kesihatan AI premium", freeCoach: "Jurulatih kesihatan AI percuma", questionsLeft: "Baki soalan hari ini", generalGuidance: "Panduan umum sahaja. Dapatkan rawatan profesional untuk gejala perubatan, gangguan pemakanan, kehamilan, ubat-ubatan atau rawatan.",
    childTeen: "Kanak-kanak atau remaja", olderAdult: "Warga emas", adult: "Dewasa", youthGuidance: "Kanak-kanak dan remaja membesar pada kadar yang berbeza. Fit+ menjejak pemakanan seimbang dan aktiviti tetapi tidak menetapkan sasaran penurunan berat atau defisit kalori. Semak tumbesaran bersama ibu bapa atau profesional kesihatan.", olderGuidance: "Utamakan waktu makan teratur, protein, hidrasi, keseimbangan dan kekuatan. Perubahan berat hendaklah beransur-ansur, terutama jika ada keadaan perubatan atau penurunan berat tanpa dirancang.", adultGuidance: "Amalkan tabiat pemakanan dan aktiviti yang boleh dikekalkan. Keperluan tenaga harian hanyalah anggaran dan perlu diselaraskan berdasarkan kemajuan jangka panjang.",
    notifications: "Pemberitahuan", routineComplete: "Rutin hari ini telah selesai", routineCompleteNote: "Syabas—anda telah merekod makanan, mencapai sasaran aktiviti dan melengkapkan semakan kesejahteraan.", routinePending: "Rutin anda belum selesai", routinePendingNote: "Lengkapkan langkah yang tinggal sebelum hari berakhir.", remainingSteps: "langkah lagi", aiAllowance: "Had penggunaan AI", questionsRemain: "soalan berbaki hari ini", allowanceLow: "Baki penggunaan AI anda semakin rendah.", allowanceOut: "Had penggunaan AI telah habis", freeAllowanceOut: "Anda telah menggunakan semua 10 soalan percuma hari ini. Naik taraf ke Plus+ untuk had harian yang lebih besar.", plusAllowanceOut: "Anda telah menggunakan semua soalan Plus+ hari ini. Had harian akan ditetapkan semula esok, atau pilih Beli lagi untuk melihat pilihan pembayaran.", finishRoutine: "Selesaikan rutin", openAssistant: "Buka Pembantu", upgradeNow: "Naik taraf ke Plus+", buyMore: "Beli lebih banyak soalan", allCaughtUp: "Semua sudah selesai.",
  },
  zh: {
    Overview: "总览",
    Meals: "饮食",
    Exercise: "运动",
    Progress: "进度",
    Assistant: "助手",
    Settings: "设置",
    hello: "你好",
    tracker: "每日健康记录",
    language: "语言",
    listFood: "逐项输入食物",
    aiSearch: "AI卡路里查询",
    estimateEach: "估算每项食物",
    photoMeal: "拍摄或上传食物照片",
    photoMealHelp: "请使用清晰的俯拍照片。只有点击分析照片后，照片才会发送给AI；照片不会保存在饮食记录中。",
    choosePhoto: "选择食物照片",
    analyzePhoto: "分析照片",
    changePhoto: "更换照片",
    photoEstimateNote: "照片分析仅为估算。添加前请检查识别出的食物和分量。",
    removePhoto: "移除照片",
    orTypeFoods: "或输入食物",
    exerciseAuto: "根据时长、活动强度和已保存的体重自动计算。",
    foodHint: "若知道份量请一并填写。Fit+会逐行分别估算。",
    sugarToday: "今日糖分估算",
    total: "总糖",
    addedSugar: "添加糖／游离糖",
    remaining: "仍在今日建议范围内。",
    sugarExceeded: "您已达到或超过今日添加糖建议量。",
    combined: "合计估算",
    addAll: "全部加入今日记录",
    recorded: "已记录的食物",
    noMeals: "此日期尚未记录食物。",
    askDay: "助手",
    powered: "你的个人AI健康教练",
    askPlaceholder: "向Fit+询问健康或健身问题",
    answerUses: "回答将参考今日饮食、运动、BMI和目标。",
    eatNext: "我下一餐应该吃什么？",
    workout: "建议今天的运动",
    onTrack: "我今天有达到目标吗？",
    smallChoices: "今天的小选择，会累积成持久的进步。", teenMode: "青少年模式", teenModeNote: "为上学日、马来西亚常见食物和健康习惯而设计，不以外貌或体型为目标。", schoolDay: "上学日生活方式", schoolSchool: "学校＋课外活动", schoolTuition: "学校＋补习", schoolScreen: "屏幕时间较多", teenFocus: "你的重点", focusEnergy: "稳定能量", focusSugar: "聪明选择糖分", focusMovement: "轻松多活动", dailyMissions: "每日健康任务", missionNote: "用三个小行动，让今天更有能量、更稳定。", missionWater: "在一天中补充水分", missionSugar: "尝试一次低糖替换", missionMove: "活动20分钟", missionDone: "完成", sugarDetective: "糖分侦探", sugarDetectiveBody: "Milo、拉茶、珍珠奶茶或罐装饮料可能在不知不觉中增加糖分。你可以在饮食页查看估算，再试试白开水、无糖茶或较小份量。", sugarTodayTeaspoons: "今日估算", sugarDetectiveNote: "估算帮助你发现习惯，不是医疗诊断。", teaspoons: "茶匙", healthierSwap: "试试这个替换", malayFoodGuide: "马来西亚食物指南", viewGuide: "在饮食中查看", streakKind: "连续记录代表坚持，不代表体型。", AIHealthNote: "仅用于健康教育和习惯指导，不是医疗建议或糖尿病诊断。",
    howToUse: "如何使用Fit+", guideTitle: "每天四个简单健康步骤", guideBody: "点击任何步骤即可开始。Fit+会保存活动，并在每天自动更新指南。", guideProgress: "项每日步骤已完成", stepMealTitle: "记录饮食", stepMealBody: "描述食物，让AI为你估算。", stepMoveTitle: "添加活动", stepMoveBody: "记录运动项目和时长。", stepCheckTitle: "身心签到", stepCheckBody: "选择你的心情与精力。", stepAskTitle: "询问助手", stepAskBody: "根据今天的记录获得建议。", healthNotice: "你的健康状态", healthHealthy: "你的结果在健康范围内。继续培养均衡、可持续的习惯。", healthHigher: "此结果高于健康范围。请专注于循序渐进的习惯，并考虑寻求专业建议。", healthLower: "此结果低于健康范围。请优先摄取有营养的饮食，并咨询专业人士。", bmiAgeNotice: "儿童和青少年的结果属于年龄别BMI筛查，并非诊断。请与家长及医疗专业人员一起评估成长情况。", adultBmiNotice: "BMI只是筛查指标，并非诊断。健康还会受到许多其他因素影响。", viewProgress: "查看详情",
    aiCoach: "AI健康教练", deeperInsights: "提供更深入的建议，并根据你的实际情况调整计划。", normalDaily: "普通版 · 每日10次", plusDaily: "Plus+已启用 · 每日50次", openPlus: "打开Plus+", comparePlans: "比较方案",
    premium: "高级版", goodMorning: "早安，让今天过得更有意义。", healthierChoices: "更健康、更强壮的你，来自每天的小选择。健康助手会让计划保持简单。", askAssistant: "询问助手", getMealIdeas: "获取饮食建议",
    planToday: "今日计划", stepsComplete: "项已完成，共3项。继续进步。", momentum: "进度",
    mealLogged: "已记录饮食", logFirstMeal: "记录第一餐", nutritionUpdated: "今日营养数据已更新。", nutritionGuidance: "获取营养与糖分建议。", viewMeals: "查看饮食", logMeal: "记录饮食",
    activeMinutes: "活动分钟", moveBody: "活动身体", movementComplete: "活动目标已完成。", movementCounts: "任何活动都有帮助，即使只有10分钟。", viewActivity: "查看活动", addExercise: "添加运动",
    wellbeingDone: "已完成身心签到", wellbeingCheck: "记录你的身心状态", logMoodEnergy: "记录心情和精力。", update: "更新", logMood: "记录心情",
    feelingToday: "你今天感觉怎么样？", checkinHelp: "简单签到可帮助健康助手提供更符合你当天情况的建议。", mood: "心情", energy: "精力", low: "低落", okay: "一般", great: "很好",
    currentStreak: "连续记录", day: "天", days: "天", startToday: "从今天开始，坚持会带来进步。", todayGlance: "今日概览", live: "实时", Sugar: "糖分", Water: "饮水", logged: "已记录", glasses: "杯", checkIn: "签到",
    thisWeek: "本周", fiveDays: "一周完成五天。坚持比完美更重要。", smarterGuidance: "适合你日常生活的建议", useDailyContext: "根据今日饮食、运动、心情和目标提出问题。", chatPlus: "询问助手",
    recordExercise: "记录运动", briskWalk: "快走", homeStrength: "居家力量训练", cycling: "骑脚踏车", activity: "活动", durationMinutes: "时长（分钟）", kcalBurned: "预计消耗（kcal）", exerciseEstimate: "运动手表可能提供更个人化的估算。运动热量仅供参考。", activitiesRecorded: "已记录的运动", noExercise: "此日期尚未记录运动。", minutes: "分钟",
    daysMeals: "有饮食记录的天数", weeklyActivity: "每周活动", goalConsistency: "目标达成情况", last7Days: "最近7天", barsCalories: "柱状图显示已记录的卡路里；没有记录的日期会留空。",
    profileGoals: "个人资料与目标", Name: "姓名", Age: "年龄", sexEstimate: "用于健康估算的性别", Female: "女性", Male: "男性", heightCm: "身高（cm）", currentWeight: "当前体重（kg）", goalWeight: "目标体重（kg）", Goal: "目标", loseWeight: "减重", maintainWeight: "维持体重", gainWeight: "增重", Activity: "活动量", mostlySitting: "大部分时间久坐", weeklyExercise: "每周有一些运动", veryActive: "非常活跃", youthGoal: "目标：支持健康成长并建立可持续的习惯。", yourRecords: "你的记录", backupAdvice: "清除浏览器数据或更换设备前，请先下载备份。", exportBackup: "导出备份", deleteData: "删除所有数据", deleteConfirm: "确定删除此设备上的所有Fit+记录吗？此操作无法撤销。",
    paymentRequired: "使用Plus+需要付款", paymentCost: "Plus+每月RM14.90，只有在付款成功并经过验证后才会启用。", paymentsUnavailable: "目前暂未开放付款。", paymentNote: "Fit+拥有者仍需连接Stripe付款。你尚未被扣款，普通版仍然有效。", continueNormal: "继续使用普通版 — 免费",
    coachCompanion: "健康伙伴", currentPlan: "当前方案", normalAssistant: "普通助手", Free: "免费", bestValue: "最超值", perMonth: "/月", annualPrice: "或每年RM149 · 节省RM29.80", normalBenefits: "每日10个健康问题|简短回答，约100字以内|使用今日健康记录|标准AI模型", plusBenefits: "每日50个健康问题|较长回答，约350字以内|更强大的高级AI模型|回应速度会随需求而变化", upgradePlus: "升级Plus+ · 每月RM14.90", checkoutPending: "需要付款。目前尚未连接结账功能。", premiumCoach: "高级AI健康教练", freeCoach: "免费AI健康教练", questionsLeft: "今日剩余问题", generalGuidance: "仅提供一般建议。如涉及疾病症状、饮食失调、怀孕、药物或治疗，请寻求专业医疗协助。",
    childTeen: "儿童或青少年", olderAdult: "年长者", adult: "成年人", youthGuidance: "儿童和青少年的成长速度各不相同。Fit+可记录均衡饮食和活动，但不会设定减重或热量赤字目标。请与家长或医疗专业人员一起评估成长情况。", olderGuidance: "优先保持规律饮食、蛋白质摄取、补水、平衡与力量训练。体重变化应循序渐进，特别是有疾病或非计划性体重下降时。", adultGuidance: "建立可持续的饮食与活动习惯。每日能量需求仅为估算，应根据长期进展作出调整。",
    notifications: "通知", routineComplete: "今日例行任务已完成", routineCompleteNote: "做得好！你已记录饮食、达到活动目标，并完成身心签到。", routinePending: "今日任务尚未完成", routinePendingNote: "请在今天结束前完成剩余步骤。", remainingSteps: "项尚未完成", aiAllowance: "AI使用额度", questionsRemain: "个问题可在今天使用", allowanceLow: "你的AI使用额度即将用完。", allowanceOut: "AI使用额度已用完", freeAllowanceOut: "你今天的10个免费问题已经用完。升级至Plus+可获得更多每日问题额度。", plusAllowanceOut: "你今天的Plus+问题额度已经用完。额度会在明天重置，也可选择购买更多查看付款选项。", finishRoutine: "完成例行任务", openAssistant: "打开助手", upgradeNow: "升级至Plus+", buyMore: "购买更多问题", allCaughtUp: "目前没有其他通知。",
  },
};
const tr = (language: Language, key: string) => words[language][key] || key;
const whoBmiAge = {
  male: [
    [5, 13.031, 16.645, 18.259],
    [6, 13.04, 16.761, 18.52],
    [7, 13.148, 17.047, 19.017],
    [8, 13.302, 17.437, 19.675],
    [9, 13.491, 17.908, 20.468],
    [10, 13.735, 18.48, 21.4],
    [11, 14.056, 19.163, 22.452],
    [12, 14.453, 19.946, 23.581],
    [13, 14.935, 20.829, 24.757],
    [14, 15.475, 21.77, 25.918],
    [15, 16.011, 22.685, 26.969],
    [16, 16.505, 23.525, 27.875],
    [17, 16.933, 24.269, 28.63],
    [18, 17.284, 24.911, 29.243],
    [19, 17.554, 25.449, 29.716],
  ],
  female: [
    [5, 12.748, 16.87, 18.858],
    [6, 12.7, 17.011, 19.224],
    [7, 12.735, 17.289, 19.789],
    [8, 12.884, 17.73, 20.561],
    [9, 13.14, 18.326, 21.513],
    [10, 13.47, 19.032, 22.57],
    [11, 13.885, 19.859, 23.725],
    [12, 14.391, 20.806, 24.967],
    [13, 14.936, 21.8, 26.207],
    [14, 15.448, 22.731, 27.321],
    [15, 15.871, 23.514, 28.224],
    [16, 16.172, 24.101, 28.873],
    [17, 16.354, 24.503, 29.283],
    [18, 16.448, 24.769, 29.52],
    [19, 16.497, 24.965, 29.67],
  ],
} as const;
function childBmiCategory(age: number, sex: "female" | "male", bmi: number) {
  if (age < 5) return "Child growth assessment needed";
  const rows = whoBmiAge[sex],
    bounded = Math.max(5, Math.min(19, age));
  const lower = rows.reduce(
      (best, row) => (row[0] <= bounded ? row : best),
      rows[0],
    ),
    upper = rows.find((row) => row[0] >= bounded) || rows[rows.length - 1];
  const ratio =
    upper[0] === lower[0] ? 0 : (bounded - lower[0]) / (upper[0] - lower[0]);
  const at = (index: 1 | 2 | 3) =>
    lower[index] + (upper[index] - lower[index]) * ratio;
  return bmi < at(1)
    ? "Thinness (BMI-for-age)"
    : bmi < at(2)
      ? "Healthy BMI-for-age"
      : bmi < at(3)
        ? "Overweight (BMI-for-age)"
        : "Obesity (BMI-for-age)";
}
type Meal = {
  id: string;
  date: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  totalSugar?: number;
  addedSugar?: number;
  foodGroups?: string[];
  balance?: "balanced" | "partly balanced" | "less balanced";
  frequency?: "often" | "sometimes" | "limit";
  balanceNote?: string;
  confidence: string;
};
type Exercise = {
  id: string;
  date: string;
  name: string;
  minutes: number;
  calories: number;
};
type Store = {
  profile: Profile;
  meals: Meal[];
  exercises: Exercise[];
  water: Record<string, number>;
  checkIns?: Record<string, { mood: "low" | "okay" | "great"; energy: number }>;
  started: boolean;
};
type FoodEstimate = Omit<Meal, "id" | "date"> & {
  totalSugar: number;
  addedSugar: number;
  foodGroups: string[];
  balance: "balanced" | "partly balanced" | "less balanced";
  frequency: "often" | "sometimes" | "limit";
  balanceNote: string;
  note: string;
};
function estimateExerciseCalories(activity: string, minutes: number, weight: number) {
  const value = activity.toLowerCase();
  const met = value.includes("run") || value.includes("jog")
    ? 8
    : value.includes("cycl") || value.includes("bike") || value.includes("basikal")
      ? 6.8
      : value.includes("swim") || value.includes("renang")
        ? 6
        : value.includes("strength") || value.includes("weight") || value.includes("kekuatan")
          ? 4
          : value.includes("walk") || value.includes("jalan")
            ? 3.5
            : value.includes("yoga") || value.includes("stretch")
              ? 2.5
              : 4;
  return Math.max(0, Math.round((met * 3.5 * Math.max(weight, 1) * Math.max(minutes, 0)) / 200));
}
async function prepareFoodPhoto(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("The photo could not be read."));
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("The photo could not be opened."));
    element.src = source;
  });
  const max = 1280;
  const scale = Math.min(1, max / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.78);
}
function dayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
const today = () => dayKey(new Date());
function currentStreak(store: Store) {
  const activeDays = new Set([
    ...store.meals.map((item) => item.date),
    ...store.exercises.map((item) => item.date),
    ...Object.entries(store.water)
      .filter(([, glasses]) => glasses > 0)
      .map(([date]) => date),
  ]);
  const cursor = new Date();
  if (!activeDays.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (activeDays.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
function activeDaysThisWeek(store: Store) {
  const activeDays = new Set([
    ...store.meals.map((item) => item.date),
    ...store.exercises.map((item) => item.date),
    ...Object.entries(store.water)
      .filter(([, glasses]) => glasses > 0)
      .map(([date]) => date),
  ]);
  const now = new Date();
  const start = new Date(now);
  const weekday = (now.getDay() + 6) % 7;
  start.setDate(now.getDate() - weekday);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return activeDays.has(dayKey(day));
  });
}
const initial: Store = {
  profile: {
    name: "",
    age: 16,
    sex: "female",
    height: 165,
    weight: 65,
    goalWeight: 60,
    goal: "maintain",
    activity: "moderate",
    schoolDay: "school",
    teenFocus: "energy",
  },
  meals: [],
  exercises: [],
  water: {},
  checkIns: {},
  started: false,
};
const nav = [
  { n: "Overview", i: LayoutDashboard },
  { n: "Meals", i: Utensils },
  { n: "Exercise", i: Dumbbell },
  { n: "Progress", i: Activity },
  { n: "Assistant", i: Bot },
  { n: "Settings", i: Settings },
];
function agePlan(p: Profile) {
  const youth = p.age < 20,
    older = p.age >= 65;
  if (youth)
    return {
      band: "Child or teen",
      category: "BMI-for-age needed",
      goalLabel: "Support healthy growth",
      guidance:
        "Children and teens grow at different rates. Fit+ tracks balanced meals and activity, but does not set weight-loss or calorie-deficit targets. Review growth with a parent or healthcare professional.",
      activityTarget: 60,
      showCalories: false,
    };
  if (older)
    return {
      band: "Older adult",
      category: null,
      goalLabel:
        p.goal === "lose"
          ? "Gentle weight change"
          : p.goal === "gain"
            ? "Strength and nourishment"
            : "Maintain strength",
      guidance:
        "Prioritise regular meals, protein, hydration, balance and strength. Weight changes should be gradual, especially with medical conditions or unplanned weight loss.",
      activityTarget: 30,
      showCalories: true,
    };
  return {
    band: "Adult",
    category: null,
    goalLabel:
      p.goal === "lose"
        ? "Gradual weight loss"
        : p.goal === "gain"
          ? "Steady weight gain"
          : "Maintain weight",
    guidance:
      "Use repeatable meal and activity habits. Daily energy needs are estimates and should be adjusted using your longer-term progress.",
    activityTarget: 30,
    showCalories: true,
  };
}
export default function Home() {
  const [store, setStore] = useState<Store>(initial),
    [ready, setReady] = useState(false),
    [active, setActive] = useState("Overview"),
    [date, setDate] = useState(today()),
    [language, setLanguage] = useState<Language>("en");
  const [assistantUsage, setAssistantUsage] = useState<AssistantUsage>({ date: today(), count: 0 });
  const [foodQuery, setFoodQuery] = useState(""),
    [foodLoading, setFoodLoading] = useState(false),
    [foodError, setFoodError] = useState(""),
    [estimates, setEstimates] = useState<FoodEstimate[]>([]),
    [foodPhoto, setFoodPhoto] = useState(""),
    [photoLoading, setPhotoLoading] = useState(false);
  const [exerciseName, setExerciseName] = useState(""),
    [minutes, setMinutes] = useState(30),
    [burned, setBurned] = useState(150);
  const [question, setQuestion] = useState(""),
    [reply, setReply] = useState(""),
    [chatLoading, setChatLoading] = useState(false),
    [chatError, setChatError] = useState("");
  useEffect(() => {
    try {
      const x = localStorage.getItem("fitplus-v2");
      // Restore the device-local profile after the client mounts.
      if (x) {
        const saved = JSON.parse(x) as Store;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStore({ ...initial, ...saved, profile: { ...initial.profile, ...(saved.profile || {}) }, checkIns: saved.checkIns || {} });
      }
      const savedLanguage = localStorage.getItem("fitplus-language");
      if (
        savedLanguage === "en" ||
        savedLanguage === "ms" ||
        savedLanguage === "zh"
      )
        setLanguage(savedLanguage);
      localStorage.removeItem("fitplus-assistant-plan");
      const savedUsage = localStorage.getItem("fitplus-assistant-usage");
      if (savedUsage) {
        const usage = JSON.parse(savedUsage) as AssistantUsage;
        setAssistantUsage(usage.date === today() ? usage : { date: today(), count: 0 });
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem("fitplus-v2", JSON.stringify(store));
  }, [store, ready]);
  useEffect(() => {
    if (ready) {
      localStorage.setItem("fitplus-language", language);
      window.dispatchEvent(new CustomEvent("fitplus-language-change", { detail: language }));
      document.documentElement.lang = language === "zh" ? "zh-CN" : language === "ms" ? "ms" : "en";
    }
  }, [language, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem("fitplus-assistant-usage", JSON.stringify(assistantUsage));
  }, [assistantUsage, ready]);
  useEffect(() => {
    let currentDay = today();
    const startNewDay = () => {
      const nextDay = today();
      if (nextDay === currentDay) return;
      setDate((selectedDate) =>
        selectedDate === currentDay ? nextDay : selectedDate,
      );
      setAssistantUsage({ date: nextDay, count: 0 });
      setReply("");
      setChatError("");
      setEstimates([]);
      setFoodError("");
      currentDay = nextDay;
    };
    const interval = window.setInterval(startNewDay, 30_000);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") startNewDay();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);
  const p = store.profile,
    plan = agePlan(p),
    dayMeals = store.meals.filter((m) => m.date === date),
    dayExercises = store.exercises.filter((e) => e.date === date);
  const bmi = p.weight / (p.height / 100) ** 2,
    adultCategory =
      bmi < 18.5
        ? "Underweight"
        : bmi < 23
          ? "Healthy weight"
          : bmi < 27.5
            ? "Overweight"
            : "Obesity",
    category =
      p.age < 20
        ? childBmiCategory(p.age, p.sex, bmi)
        : p.age >= 65
          ? `${adultCategory} · Age 65+`
          : adultCategory;
  const bmr =
      p.sex === "male"
        ? 10 * p.weight + 6.25 * p.height - 5 * p.age + 5
        : 10 * p.weight + 6.25 * p.height - 5 * p.age - 161,
    factor = { low: 1.2, moderate: 1.45, high: 1.65 }[p.activity],
    maintenance = Math.round(bmr * factor),
    adjustment =
      p.age < 20
        ? 0
        : p.age >= 65
          ? p.goal === "lose"
            ? -250
            : p.goal === "gain"
              ? 200
              : 0
          : p.goal === "lose"
            ? -400
            : p.goal === "gain"
              ? 300
              : 0,
    target = plan.showCalories ? maintenance + adjustment : 0;
  const consumed = dayMeals.reduce((s, m) => s + m.calories, 0),
    exerciseCals = dayExercises.reduce((s, e) => s + e.calories, 0),
    activeMinutes = dayExercises.reduce((s, e) => s + e.minutes, 0),
    remaining = target - consumed + exerciseCals,
    macros = dayMeals.reduce(
      (a, m) => ({
        protein: a.protein + m.protein,
        carbs: a.carbs + m.carbs,
        fat: a.fat + m.fat,
      }),
      { protein: 0, carbs: 0, fat: 0 },
    ),
    totalSugar = dayMeals.reduce((s, m) => s + Number(m.totalSugar || 0), 0),
    addedSugar = dayMeals.reduce((s, m) => s + Number(m.addedSugar || 0), 0),
    sugarLimit = p.age < 2 ? 0 : p.age < 19 ? 25 : p.sex === "female" ? 25 : 36;
  const waterToday = store.water[date] || 0,
    checkInToday = store.checkIns?.[date],
    activityTarget = p.age < 20 ? 60 : 30,
    dailyScore = Math.round(
      (dayMeals.length ? 25 : 0) +
        Math.min(30, (activeMinutes / activityTarget) * 30) +
        Math.min(20, (waterToday / 8) * 20) +
        (dayMeals.length && addedSugar <= sugarLimit ? 15 : 0) +
        (checkInToday ? 10 : 0),
    ),
    streak = currentStreak(store),
    weekActivity = activeDaysThisWeek(store);
  useEffect(() => {
    if (exerciseName.trim() && minutes > 0)
      setBurned(estimateExerciseCalories(exerciseName, minutes, p.weight));
  }, [exerciseName, minutes, p.weight]);
  const updateProfile = (key: keyof Profile, value: string | number) =>
    setStore((s) => {
      const profile = { ...s.profile, [key]: value };
      if (key === "age" && Number(value) < 20) {
        profile.goal = "maintain";
        profile.goalWeight = profile.weight;
      }
      return { ...s, profile };
    });
  async function estimateFood(e: FormEvent) {
    e.preventDefault();
    if (!foodQuery.trim()) return;
    setFoodLoading(true);
    setFoodError("");
    setEstimates([]);
    try {
      const r = await requestFitAI({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "calories", food: foodQuery, language }),
        }),
        d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not estimate these foods.");
      if (!Array.isArray(d.result?.items) || d.result.items.length === 0)
        throw new Error("No food estimates were returned. Please try again.");
      setEstimates(d.result.items);
    } catch (e) {
      setFoodError(
        e instanceof Error ? e.message : "Could not estimate these foods.",
      );
    } finally {
      setFoodLoading(false);
    }
  }
  async function selectFoodPhoto(file?: File) {
    if (!file) return;
    setFoodError("");
    try {
      setFoodPhoto(await prepareFoodPhoto(file));
      setEstimates([]);
    } catch (error) {
      setFoodError(error instanceof Error ? error.message : "The photo could not be prepared.");
    }
  }
  async function estimateFoodPhoto() {
    if (!foodPhoto) return;
    setPhotoLoading(true);
    setFoodError("");
    setEstimates([]);
    try {
      const response = await requestFitAI({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "food_photo", image: foodPhoto, language }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not analyse this food photo.");
      if (!Array.isArray(data.result?.items) || data.result.items.length === 0)
        throw new Error("No foods were detected. Try a clearer photo from above.");
      setEstimates(data.result.items);
    } catch (error) {
      setFoodError(error instanceof Error ? error.message : "Could not analyse this food photo.");
    } finally {
      setPhotoLoading(false);
    }
  }
  function addFoods() {
    if (!estimates.length) return;
    setStore((s) => ({
      ...s,
      meals: [
        ...s.meals,
        ...estimates.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
          date,
        })),
      ],
    }));
    setEstimates([]);
    setFoodQuery("");
    setFoodPhoto("");
  }
  function addExercise(e: FormEvent) {
    e.preventDefault();
    if (!exerciseName.trim() || minutes <= 0 || burned < 0) return;
    setStore((s) => ({
      ...s,
      exercises: [
        ...s.exercises,
        {
          id: crypto.randomUUID(),
          date,
          name: exerciseName.trim(),
          minutes,
          calories: burned,
        },
      ],
    }));
    setExerciseName("");
  }
  async function askAI(e: FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    const dailyLimit = 10;
    const usage = assistantUsage.date === today() ? assistantUsage.count : 0;
    if (usage >= dailyLimit) {
      setChatError("You have used today’s 10 questions. Your allowance resets tomorrow.");
      return;
    }
    setChatLoading(true);
    setChatError("");
    try {
      const r = await requestFitAI({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: "assistant",
            question,
            language,
            context: {
              profile: p,
              bmi: Number(bmi.toFixed(1)),
              category,
              date,
              target,
              consumed,
              exerciseCals,
              activeMinutes,
              remaining,
              meals: dayMeals.map(({ name, portion, calories }) => ({
                name,
                portion,
                calories,
              })),
              exercises: dayExercises.map(({ name, minutes, calories }) => ({
                name,
                minutes,
                calories,
              })),
              checkIn: checkInToday || null,
            },
          }),
        }),
        d = await r.json();
      if (!r.ok) throw new Error(d.error || "Plus+ is unavailable.");
      setReply(d.result.answer);
      setAssistantUsage((current) => ({ date: today(), count: (current.date === today() ? current.count : 0) + 1 }));
      setQuestion("");
    } catch (e) {
      setChatError(
        e instanceof Error ? e.message : "Plus+ is unavailable.",
      );
    } finally {
      setChatLoading(false);
    }
  }
  function exportData() {
    const b = new Blob([JSON.stringify(store, null, 2)], {
        type: "application/json",
      }),
      a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = `fitplus-backup-${today()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  if (!ready)
    return (
      <main className="grid min-h-screen place-items-center bg-[#f4f7f5]">
        <LoaderCircle className="animate-spin text-[#153f2d]" />
      </main>
    );
  if (!store.started)
    return (
      <Onboarding
        profile={p}
        update={updateProfile}
        finish={() => setStore((s) => ({ ...s, started: true }))}
        language={language}
        setLanguage={setLanguage}
      />
    );
  return (
    <main className="min-h-screen bg-[#f7faf8] pb-[calc(5.25rem+env(safe-area-inset-bottom))] text-[#11231b] lg:pb-0">
      <Header name={p.name} language={language} setLanguage={setLanguage} />
      <div className="mx-auto grid max-w-[1480px] gap-5 px-3 py-4 sm:px-4 sm:py-5 lg:grid-cols-[210px_1fr] lg:gap-6 lg:px-7">
        <aside className="hidden lg:flex lg:min-h-[calc(100vh-118px)] lg:flex-col lg:justify-between">
          <nav className="space-y-1.5">
            {nav.map(({ n, i: Icon }) => (
              <button
                key={n}
                onClick={() => setActive(n)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${active === n ? "bg-[#176044] text-white shadow-[0_10px_24px_rgba(21,63,45,.18)]" : "text-[#53675d] hover:bg-white hover:text-[#153f2d]"}`}
              >
                <Icon size={18} />
                {tr(language, n)}
              </button>
            ))}
          </nav>
          <div className="overflow-hidden rounded-[24px] border border-[#d7e7df] bg-[#eaf6f0] p-5 text-[#153f2d] shadow-lg shadow-[#123d2b]/5">
            <div className="flex items-center gap-2 text-[#176044]"><Bot size={19} /><strong>{tr(language,"normalAssistant")}</strong></div>
            <p className="mt-3 text-lg font-extrabold leading-tight">{tr(language,"aiCoach")}</p>
            <p className="mt-2 text-xs leading-5 text-[#557166]">{tr(language,"useDailyContext")}</p>
            <div className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#176044]">{tr(language,"normalDaily")}</div>
            <button onClick={() => setActive("Assistant")} className="mt-4 w-full rounded-xl bg-[#176044] px-3 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#0f4c35]">{tr(language,"askAssistant")}</button>
          </div>
        </aside>
        <section className="min-w-0 space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-[27px] font-extrabold tracking-[-.03em] sm:text-[32px]">
                {active === "Overview"
                  ? `${tr(language, "hello")}${p.name ? `, ${p.name}` : ""}`
                  : tr(language, active)}
              </h1>
              {active === "Overview" && <p className="mt-1 text-sm font-medium text-[#708078]">{tr(language,"smallChoices")}</p>}
            </div>
            <label className="flex w-full items-center gap-2 rounded-xl border border-[#dce5df] bg-white px-3 py-2.5 text-sm font-semibold sm:w-auto sm:py-2">
              <CalendarDays size={17} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="min-w-0 flex-1 bg-transparent outline-none sm:flex-none"
              />
            </label>
          </div>
          {active === "Overview" && (
            <CoachOverview
              bmi={bmi}
              category={category}
              consumed={consumed}
              target={target}
              exerciseCals={exerciseCals}
              activeMinutes={activeMinutes}
              macros={macros}
              addedSugar={addedSugar}
              totalSugar={totalSugar}
              sugarLimit={sugarLimit}
              dailyScore={dailyScore}
              streak={streak}
              weekActivity={weekActivity}
              checkIn={checkInToday}
              setCheckIn={(value) =>
                setStore((s) => ({
                  ...s,
                  checkIns: { ...s.checkIns, [date]: value },
                }))
              }
              mealLogged={dayMeals.length > 0}
              weight={p.weight}
              goalWeight={p.goalWeight}
              water={waterToday}
              addWater={() =>
                setStore((s) => ({
                  ...s,
                  water: {
                    ...s.water,
                    [date]: Math.min(12, (s.water[date] || 0) + 1),
                  },
                }))
              }
              go={setActive}
              language={language}
              teen={p.age < 20}
              schoolDay={p.schoolDay}
              teenFocus={p.teenFocus}
              assistantUsed={assistantUsage.date === date && assistantUsage.count > 0}
            />
          )}{" "}
          {active === "Meals" && (
            <Meals
              query={foodQuery}
              setQuery={setFoodQuery}
              submit={estimateFood}
              loading={foodLoading}
              photo={foodPhoto}
              photoLoading={photoLoading}
              selectPhoto={selectFoodPhoto}
              analyzePhoto={estimateFoodPhoto}
              clearPhoto={() => { setFoodPhoto(""); setEstimates([]); }}
              error={foodError}
              estimates={estimates}
              add={addFoods}
              meals={dayMeals}
              totalSugar={totalSugar}
              addedSugar={addedSugar}
              sugarLimit={sugarLimit}
              language={language}
              remove={(id) =>
                setStore((s) => ({
                  ...s,
                  meals: s.meals.filter((m) => m.id !== id),
                }))
              }
            />
          )}{" "}
          {active === "Exercise" && (
            <ExerciseView
              name={exerciseName}
              setName={setExerciseName}
              minutes={minutes}
              setMinutes={setMinutes}
              burned={burned}
              setBurned={setBurned}
              weight={p.weight}
              submit={addExercise}
              exercises={dayExercises}
              language={language}
              remove={(id) =>
                setStore((s) => ({
                  ...s,
                  exercises: s.exercises.filter((e) => e.id !== id),
                }))
              }
            />
          )}{" "}
          {active === "Progress" && <Progress store={store} target={target} language={language} />}{" "}
          {active === "Assistant" && (
            <Assistant
              question={question}
              setQuestion={setQuestion}
              submit={askAI}
              loading={chatLoading}
              error={chatError}
              reply={reply}
              quick={setQuestion}
              language={language}
            />
          )}{" "}
          {active === "Settings" && (
            <SettingsView
              profile={p}
              update={updateProfile}
              exportData={exportData}
              reset={() => {
                if (
                  confirm(
                    tr(language,"deleteConfirm"),
                  )
                ) {
                  localStorage.removeItem("fitplus-v2");
                  setStore(initial);
                }
              }}
              language={language}
            />
          )}
        </section>
      </div>
      <MobileNav active={active} set={setActive} language={language} />
    </main>
  );
}
function Header({
  name,
  language,
  setLanguage,
}: {
  name: string;
  language: Language;
  setLanguage: (language: Language) => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#e2ebe6] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-2 px-3 py-3 sm:px-5 sm:py-3.5 lg:px-7">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#153f2d] text-white shadow-lg shadow-[#153f2d]/15">
            <HeartPulse size={23} />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-black tracking-[.02em] sm:text-xl">
              FIT<span className="text-[#4fb879]">+</span>
            </p>
            <p className="hidden text-xs font-medium text-[#66756d] sm:block">{tr(language,"coachCompanion")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <label className="sr-only" htmlFor="fit-language">
            {tr(language, "language")}
          </label>
          <select
            id="fit-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="max-w-[116px] rounded-xl border border-[#dce5df] bg-white px-2 py-2 text-sm font-bold text-[#17412e] sm:max-w-none sm:px-3"
          >
            <option value="en">English</option>
            <option value="ms">Bahasa Melayu</option>
            <option value="zh">中文</option>
          </select>
          <div className="hidden h-10 w-10 place-items-center rounded-full bg-[#d9eee3] text-sm font-bold text-[#17412e] min-[390px]:grid">
            {(name || "F").slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
function Onboarding({
  profile,
  update,
  finish,
  language,
  setLanguage,
}: {
  profile: Profile;
  update: (k: keyof Profile, v: string | number) => void;
  finish: () => void;
  language: Language;
  setLanguage: (language: Language) => void;
}) {
  const youth = profile.age < 20;
  return (
    <main className="min-h-screen bg-[#153f2d] p-5 text-white">
      <div className="mx-auto max-w-2xl py-10">
        <div className="mb-5 flex justify-end">
          <select
            aria-label={tr(language, "language")}
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-[#17412e]"
          >
            <option value="en">English</option>
            <option value="ms">Bahasa Melayu</option>
            <option value="zh">中文</option>
          </select>
        </div>
        <div className="mb-8 flex items-center gap-3">
          <HeartPulse />
          <span className="text-2xl font-extrabold">
            Fit<span className="text-[#f2c45f]">+</span>
          </span>
        </div>
        <div className="rounded-[32px] bg-white p-6 text-[#15221c] shadow-2xl sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-[#e06438]">
            Welcome
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">
            A healthier day, one small win at a time
          </h1>
          <p className="mt-2 text-base leading-7 text-[#637169]">
            Get a personal daily target, fast food estimates and one clear next
            action—without complicated tracking.
          </p>
          {youth && <div className="mt-5 rounded-2xl border border-[#cfe6d8] bg-[#eaf8f0] p-4 text-sm leading-6 text-[#24583f]"><p className="font-extrabold">{tr(language, "teenMode")}</p><p className="mt-1">{tr(language, "teenModeNote")}</p></div>}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              [Target, "Personal", "Goals that adapt to your age"],
              [Zap, "Quick", "Log your day in under a minute"],
              [HeartPulse, "Private", "Your records stay on this device"],
            ].map(([Icon, title, detail]) => (
              <div key={String(title)} className="rounded-2xl bg-[#f4f7f5] p-4">
                <Icon className="text-[#e06438]" size={20} />
                <p className="mt-2 text-sm font-extrabold">{String(title)}</p>
                <p className="mt-1 text-xs leading-5 text-[#6d7972]">{String(detail)}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              value={profile.name}
              on={(v) => update("name", v)}
            />
            <Num label="Age" value={profile.age} on={(v) => update("age", v)} />
            <Select
              label="Sex used for health estimates"
              value={profile.sex}
              on={(v) => update("sex", v)}
              options={[
                ["female", "Female"],
                ["male", "Male"],
              ]}
            />
            <Num
              label="Height (cm)"
              value={profile.height}
              on={(v) => update("height", v)}
            />
            <Num
              label="Current weight (kg)"
              value={profile.weight}
              on={(v) => update("weight", v)}
            />
            {youth ? (
              <div className="sm:col-span-2 rounded-2xl bg-[#fff7e6] p-4 text-sm leading-6 text-[#716743]">
                <strong>Healthy growth mode:</strong> Fit+ will not create an
                adult BMI category, goal weight or calorie deficit for anyone
                under 20.
              </div>
            ) : (
              <>
                <Num
                  label="Goal weight (kg)"
                  value={profile.goalWeight}
                  on={(v) => update("goalWeight", v)}
                />
                <Select
                  label="Goal"
                  value={profile.goal}
                  on={(v) => update("goal", v)}
                  options={[
                    ["lose", "Lose weight"],
                    ["maintain", "Maintain weight"],
                    ["gain", "Gain weight"],
                  ]}
                />
              </>
            )}
            <Select
              label="Activity level"
              value={profile.activity}
              on={(v) => update("activity", v)}
              options={[
                ["low", "Mostly sitting"],
                ["moderate", "Some weekly exercise"],
                ["high", "Very active"],
              ]}
            />
            {youth && <>
              <Select
                label={tr(language, "schoolDay")}
                value={profile.schoolDay}
                on={(v) => update("schoolDay", v)}
                options={[["school", tr(language, "schoolSchool")], ["tuition", tr(language, "schoolTuition")], ["screen", tr(language, "schoolScreen")]]}
              />
              <Select
                label={tr(language, "teenFocus")}
                value={profile.teenFocus}
                on={(v) => update("teenFocus", v)}
                options={[["energy", tr(language, "focusEnergy")], ["sugar", tr(language, "focusSugar")], ["movement", tr(language, "focusMovement")]]}
              />
            </>}
          </div>
          <button
            onClick={finish}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#153f2d] px-5 py-4 font-bold text-white"
          >
            Start using Fit+ <ChevronRight size={19} />
          </button>
          <p className="mt-4 text-center text-xs leading-5 text-[#758078]">
            General estimates only, not medical diagnosis or treatment.
          </p>
        </div>
      </div>
    </main>
  );
}
function QuickStartGuide({ mealLogged, activeMinutes, checkIn, assistantUsed, go, language }: { mealLogged: boolean; activeMinutes: number; checkIn?: { mood: "low" | "okay" | "great"; energy: number }; assistantUsed: boolean; go: (s: string) => void; language: Language }) {
  const steps = [
    { icon: Apple, title: tr(language, "stepMealTitle"), body: tr(language, "stepMealBody"), done: mealLogged, action: () => go("Meals") },
    { icon: Dumbbell, title: tr(language, "stepMoveTitle"), body: tr(language, "stepMoveBody"), done: activeMinutes > 0, action: () => go("Exercise") },
    { icon: Smile, title: tr(language, "stepCheckTitle"), body: tr(language, "stepCheckBody"), done: !!checkIn, action: () => document.getElementById("wellbeing-checkin")?.scrollIntoView({ behavior: "smooth" }) },
    { icon: Bot, title: tr(language, "stepAskTitle"), body: tr(language, "stepAskBody"), done: assistantUsed, action: () => go("Assistant") },
  ];
  const complete = steps.filter((step) => step.done).length;
  return <article className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#0c3d2b] via-[#176044] to-[#24845a] p-5 text-white shadow-[0_20px_50px_rgba(18,72,49,.22)] sm:p-7">
    <div className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-white/10" />
    <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-[#8de0af]/10" />
    <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-xs font-black uppercase tracking-[.18em] text-[#aee5c5]">{tr(language,"howToUse")}</p><h2 className="mt-2 max-w-2xl text-2xl font-black tracking-[-.03em] sm:text-3xl">{tr(language,"guideTitle")}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#d6ebe0]">{tr(language,"guideBody")}</p></div>
      <div className="min-w-[150px] rounded-2xl bg-white/10 p-3 backdrop-blur"><div className="flex items-end justify-between"><strong className="text-2xl">{complete}/4</strong><span className="text-xs text-[#d6ebe0]">{tr(language,"guideProgress")}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#ffd267] transition-all" style={{ width: `${complete * 25}%` }} /></div></div>
    </div>
    <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{steps.map((step,index)=><button key={step.title} onClick={step.action} className={`group rounded-2xl border p-4 text-left transition hover:-translate-y-1 hover:bg-white/15 ${step.done ? "border-[#8de0af]/50 bg-[#8de0af]/15" : "border-white/15 bg-white/[.08]"}`}><div className="flex items-center justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${step.done ? "bg-[#bcebcf] text-[#13563b]" : "bg-white/15 text-white"}`}><step.icon size={20}/></span><span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-black ${step.done ? "bg-[#bcebcf] text-[#13563b]" : "bg-white/10 text-white"}`}>{step.done?<CheckCircle2 size={16}/>:index+1}</span></div><p className="mt-4 font-black">{step.title}</p><p className="mt-1 text-xs leading-5 text-[#d6ebe0]">{step.body}</p></button>)}</div>
  </article>;
}

function HealthStatusNotice({ bmi, category, teen, go, language }: { bmi: number; category: string; teen: boolean; go: (s: string) => void; language: Language }) {
  const lower = category.toLowerCase();
  const isHealthy = lower.includes("healthy");
  const isHigher = lower.includes("overweight") || lower.includes("obes");
  const tone = isHealthy ? "border-[#bfe4cf] bg-[#ecfbf2] text-[#174b35]" : isHigher ? "border-[#f1d4a4] bg-[#fff7e6] text-[#70491d]" : "border-[#cddff1] bg-[#f0f7ff] text-[#244c70]";
  const iconTone = isHealthy ? "bg-[#197c4a] text-white" : isHigher ? "bg-[#f2b84f] text-[#5c3a12]" : "bg-[#6c9bc5] text-white";
  return <article className={`flex flex-col gap-4 rounded-[26px] border p-5 shadow-[0_12px_32px_rgba(30,65,48,.05)] sm:flex-row sm:items-center sm:p-6 ${tone}`}>
    <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${iconTone}`}><HeartPulse size={27}/></div>
    <div className="min-w-0 flex-1"><p className="text-xs font-black uppercase tracking-[.14em] opacity-70">{tr(language,"healthNotice")}</p><div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1"><h2 className="text-2xl font-black">{category}</h2><span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-black">BMI {bmi.toFixed(1)}</span></div><p className="mt-2 text-sm leading-6 opacity-90">{tr(language,isHealthy?"healthHealthy":isHigher?"healthHigher":"healthLower")}</p><p className="mt-1 text-xs leading-5 opacity-70">{tr(language,teen?"bmiAgeNotice":"adultBmiNotice")}</p></div>
    <button onClick={()=>go("Progress")} className="shrink-0 rounded-xl bg-white px-4 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5">{tr(language,"viewProgress")}</button>
  </article>;
}

function TeenMissionBoard({ addedSugar, sugarLimit, activeMinutes, water, addWater, go, language, schoolDay, teenFocus, totalSugar, mealLogged }: { addedSugar: number; sugarLimit: number; activeMinutes: number; water: number; addWater: () => void; go: (s: string) => void; language: Language; schoolDay: Profile["schoolDay"]; teenFocus: Profile["teenFocus"]; totalSugar: number; mealLogged: boolean }) {
  const missions = [
    { icon: Droplets, title: tr(language, "missionWater"), detail: `${water}/8 ${tr(language, "glasses")}`, done: water >= 5, action: addWater },
    { icon: Sparkles, title: tr(language, "missionSugar"), detail: `${Math.round(addedSugar)}g ${tr(language, "addedSugar").toLowerCase()}`, done: mealLogged && addedSugar <= sugarLimit, action: () => go("Meals") },
    { icon: Dumbbell, title: tr(language, "missionMove"), detail: `${activeMinutes}/20 ${tr(language, "minutes")}`, done: activeMinutes >= 20, action: () => go("Exercise") },
  ];
  const complete = missions.filter((m) => m.done).length;
  const drink = totalSugar > 0 ? "Milo ais / teh tarik" : "Milo, teh tarik, bubble tea or canned drinks";
  return <article className="overflow-hidden rounded-[28px] border border-[#bfe4cf] bg-[#ecfbf2] p-5 shadow-[0_14px_40px_rgba(24,72,51,.07)] sm:p-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2 text-sm font-black uppercase tracking-[.12em] text-[#177147]"><Target size={17}/>{tr(language, "dailyMissions")}</div><h2 className="mt-2 text-2xl font-black text-[#123d2b]">{complete}/3 {tr(language, "missionDone")}</h2><p className="mt-1 text-sm text-[#557365]">{tr(language, "missionNote")}</p></div><div className="rounded-2xl bg-white/80 px-4 py-3 text-right"><p className="text-xs font-bold text-[#6c7f73]">{tr(language, "schoolDay")}</p><p className="mt-1 text-sm font-black text-[#174b35]">{tr(language, schoolDay === "school" ? "schoolSchool" : schoolDay === "tuition" ? "schoolTuition" : "schoolScreen")}</p><p className="mt-1 text-xs text-[#6c7f73]">{tr(language, teenFocus === "energy" ? "focusEnergy" : teenFocus === "sugar" ? "focusSugar" : "focusMovement")}</p></div></div>
    <div className="mt-5 grid gap-3 md:grid-cols-3">{missions.map((m, i) => <button key={m.title} onClick={m.action} className={`rounded-2xl p-4 text-left transition hover:-translate-y-0.5 ${m.done ? "bg-[#197c4a] text-white" : "bg-white text-[#173d2c] shadow-sm"}`}><div className="flex items-center justify-between"><m.icon size={20}/><span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-black ${m.done ? "bg-white/20" : "bg-[#e3f2e8] text-[#197c4a]"}`}>{m.done ? <CheckCircle2 size={16}/> : i + 1}</span></div><p className="mt-5 text-sm font-black">{m.title}</p><p className={`mt-1 text-xs ${m.done ? "text-white/80" : "text-[#718078]"}`}>{m.done ? tr(language, "missionDone") : m.detail}</p></button>)}</div>
    <div className="mt-4 rounded-2xl border border-[#f0d9a5] bg-[#fff8e8] p-4"><div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#d26c33]"><Sparkles size={18}/></div><div><p className="font-black text-[#634520]">{tr(language, "sugarDetective")}</p><p className="mt-1 text-sm leading-6 text-[#735f42]">{tr(language, "sugarDetectiveBody")}</p><p className="mt-1 text-xs font-bold text-[#956b35]">{Math.round(totalSugar / 4)} {tr(language, "teaspoons")} {tr(language, "sugarTodayTeaspoons")} · {tr(language, "sugarDetectiveNote")}</p></div></div></div>
  </article>;
}

function CoachOverview(props: Parameters<typeof Overview>[0] & { language: Language; teen: boolean; schoolDay: Profile["schoolDay"]; teenFocus: Profile["teenFocus"]; totalSugar: number; assistantUsed: boolean }) {
  const { bmi, category, addedSugar, totalSugar, sugarLimit, dailyScore, streak, weekActivity, checkIn, setCheckIn, mealLogged, activeMinutes, water, addWater, go, target, language, teen, schoolDay, teenFocus, assistantUsed } = props;
  const activityTarget = target === 0 ? 60 : 30;
  const completed = [mealLogged, activeMinutes >= activityTarget, !!checkIn].filter(Boolean).length;
  const items = [
    { title: tr(language,mealLogged ? "mealLogged" : "logFirstMeal"), detail: tr(language,mealLogged ? "nutritionUpdated" : "nutritionGuidance"), action: tr(language,mealLogged ? "viewMeals" : "logMeal"), target: "Meals", image: fitAsset("/assets/fitplus/meal-bowl.webp"), done: mealLogged },
    { title: activeMinutes ? `${activeMinutes} ${tr(language,"activeMinutes")}` : tr(language,"moveBody"), detail: tr(language,activeMinutes >= activityTarget ? "movementComplete" : "movementCounts"), action: tr(language,activeMinutes ? "viewActivity" : "addExercise"), target: "Exercise", image: fitAsset("/assets/fitplus/running-shoes.webp"), done: activeMinutes >= activityTarget },
    { title: tr(language,checkIn ? "wellbeingDone" : "wellbeingCheck"), detail: checkIn ? `${tr(language,"mood")}: ${tr(language,checkIn.mood)}, ${tr(language,"energy")}: ${checkIn.energy}/5.` : tr(language,"logMoodEnergy"), action: tr(language,checkIn ? "update" : "logMood"), target: "checkin", image: fitAsset("/assets/fitplus/wellbeing-plant.webp"), done: !!checkIn },
  ];
  return <div className="space-y-4">
    <QuickStartGuide mealLogged={mealLogged} activeMinutes={activeMinutes} checkIn={checkIn} assistantUsed={assistantUsed} go={go} language={language} />
    <HealthStatusNotice bmi={bmi} category={category} teen={teen} go={go} language={language} />
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.62fr)_minmax(300px,.78fr)]">
    <div className="space-y-4">
      {teen && <TeenMissionBoard addedSugar={addedSugar} sugarLimit={sugarLimit} activeMinutes={activeMinutes} water={water} addWater={addWater} go={go} language={language} schoolDay={schoolDay} teenFocus={teenFocus} totalSugar={totalSugar} mealLogged={mealLogged} />}
      <article className="relative min-h-[244px] overflow-hidden rounded-[22px] border border-[#dce9e2] bg-[#eaf8f0] shadow-[0_14px_40px_rgba(24,72,51,.07)] sm:rounded-[26px]">
        <img src={fitAsset("/assets/fitplus/plus-coach.webp")} alt="Fit+ AI wellness coach" className="absolute inset-y-0 left-0 hidden h-full w-[46%] object-cover object-left sm:block" />
        <div className="relative ml-auto w-full p-5 sm:w-[58%] sm:p-7">
          <div className="flex items-center justify-between gap-2"><div className="flex min-w-0 flex-wrap items-center gap-2 text-sm font-extrabold text-[#19613f]"><Bot size={18}/> {tr(language,"normalAssistant")}</div><button aria-label="More coach actions" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/65 text-[#416354]"><MoreHorizontal size={20}/></button></div>
          <h2 className="mt-5 text-[1.35rem] font-black tracking-[-.02em] sm:text-2xl">{tr(language,"goodMorning")}</h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-[#4e675b]">{tr(language,"healthierChoices")}</p>
          <div className="mt-5 flex flex-wrap gap-2"><button onClick={()=>go("Assistant")} className="rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-[#174b35] shadow-sm transition hover:-translate-y-0.5"><MessageCircle className="mr-1.5 inline" size={16}/>{tr(language,"askAssistant")}</button><button onClick={()=>go("Meals")} className="rounded-xl bg-white/80 px-4 py-2.5 text-sm font-bold text-[#174b35] hover:bg-white">{tr(language,"getMealIdeas")}</button></div>
        </div>
      </article>
      <article className="rounded-[22px] border border-[#e0e9e4] bg-white p-4 shadow-[0_12px_35px_rgba(27,69,50,.05)] sm:rounded-[26px] sm:p-6">
        <div className="flex items-center justify-between gap-4 border-b border-[#edf1ef] pb-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#ddf3e6] text-[#177147]"><CalendarDays size={19}/></div><div><h2 className="text-xl font-extrabold">{tr(language,"planToday")}</h2><p className="text-sm text-[#75827c]">{completed} {tr(language,"stepsComplete")}</p></div></div><span className="hidden rounded-full bg-[#eef6f2] px-3 py-1.5 text-xs font-extrabold text-[#176044] sm:inline">{dailyScore}% {tr(language,"momentum")}</span></div>
        {items.map((item,index)=><button key={item.title} onClick={()=>item.target==="checkin"?document.getElementById("wellbeing-checkin")?.scrollIntoView({behavior:"smooth"}):go(item.target)} className="grid w-full grid-cols-[34px_minmax(0,1fr)_48px] items-center gap-2 border-b border-[#eef2f0] py-4 text-left last:border-0 sm:grid-cols-[38px_1fr_auto] sm:gap-3"><div className={`grid h-8 w-8 place-items-center rounded-full text-sm font-black ${item.done?"bg-[#1b7a4b] text-white":"bg-[#e4f2ea] text-[#176044]"}`}>{item.done?<CheckCircle2 size={17}/>:index+1}</div><div className="min-w-0"><p className="font-extrabold">{item.title}</p><p className="mt-0.5 text-xs leading-5 text-[#75817b]">{item.detail}</p></div><div className="flex items-center gap-2"><span className="hidden rounded-xl border border-[#d9e5df] px-3 py-2 text-xs font-extrabold text-[#174b35] hover:bg-[#eff7f3] sm:block">{item.action} <ChevronRight className="inline" size={14}/></span><img src={item.image} alt="" className="h-12 w-12 rounded-xl object-cover sm:h-14 sm:w-16"/></div></button>)}
      </article>
      <article id="wellbeing-checkin" className="rounded-[26px] border border-[#e0e9e4] bg-white p-5 shadow-[0_12px_35px_rgba(27,69,50,.05)] sm:p-6">
        <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#ddf3e6] text-[#177147]"><Smile size={20}/></div><div><h2 className="text-lg font-extrabold">{tr(language,"feelingToday")}</h2><p className="text-xs text-[#75817b]">{tr(language,"checkinHelp")}</p></div></div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2"><div><p className="text-xs font-extrabold text-[#56685f]">{tr(language,"mood")}</p><div className="mt-2 grid grid-cols-3 gap-2">{(["low","okay","great"] as const).map(value=><button key={value} onClick={()=>setCheckIn({mood:value,energy:checkIn?.energy||3})} aria-pressed={checkIn?.mood===value} className={`rounded-xl py-2.5 text-sm font-bold ${checkIn?.mood===value?"bg-[#197c4a] text-white shadow-md":"bg-[#f0f5f2] text-[#53675d]"}`}>{tr(language,value)}</button>)}</div></div><div><p className="text-xs font-extrabold text-[#56685f]">{tr(language,"energy")}</p><div className="mt-2 grid grid-cols-5 gap-2">{[1,2,3,4,5].map(value=><button key={value} onClick={()=>setCheckIn({mood:checkIn?.mood||"okay",energy:value})} aria-label={`${tr(language,"energy")} ${value}/5`} aria-pressed={checkIn?.energy===value} className={`rounded-xl py-2.5 text-sm font-black ${checkIn?.energy===value?"bg-[#197c4a] text-white shadow-md":"bg-[#fff4dc] text-[#9a6129]"}`}>{value}</button>)}</div></div></div>
      </article>
    </div>
    <aside className="space-y-4">
      <article className="rounded-[24px] border border-[#f0dfc9] bg-[#fff8ed] p-5"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#ee6338]"><Flame size={27}/></div><div><p className="text-xs font-bold text-[#7c7062]">{tr(language,"currentStreak")}</p><p className="text-3xl font-black">{streak} {tr(language,streak===1?"day":"days")}</p></div></div><p className="mt-3 text-sm text-[#776d61]">{tr(language,"startToday")}</p></article>
      <article className="rounded-[24px] border border-[#e0e9e4] bg-white p-5 shadow-[0_12px_35px_rgba(27,69,50,.05)]"><div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">{tr(language,"todayGlance")}</h2><span className="text-xs font-bold text-[#177147]">{tr(language,"live")}</span></div><div className="mt-4 space-y-4">{[
        [Utensils,tr(language,"Meals"),`${mealLogged?1:0} ${tr(language,"logged")}`,mealLogged?55:0,()=>go("Meals")],[Flame,tr(language,"Sugar"),`${Math.round(addedSugar)} / ${sugarLimit} g`,Math.min(100,addedSugar/sugarLimit*100),()=>go("Meals")],[Dumbbell,tr(language,"Exercise"),`${activeMinutes} / ${activityTarget} min`,Math.min(100,activeMinutes/activityTarget*100),()=>go("Exercise")],[Droplets,tr(language,"Water"),`${water} / 8 ${tr(language,"glasses")}`,Math.min(100,water/8*100),addWater],
      ].map(([Icon,label,value,progress,onClick])=><button key={String(label)} onClick={onClick as ()=>void} className="grid w-full grid-cols-[22px_70px_1fr_auto] items-center gap-2 text-left"><Icon size={18} className="text-[#14724a]"/><span className="text-sm font-bold">{String(label)}</span><span className="h-2 overflow-hidden rounded-full bg-[#edf2ef]"><span className="block h-full rounded-full bg-[#45aa76]" style={{width:`${Number(progress)}%`}}/></span><span className="min-w-[58px] text-right text-xs font-bold text-[#51645a]">{String(value)}</span></button>)}</div><div className="mt-5 grid grid-cols-2 gap-2 border-t border-[#edf1ef] pt-4"><button onClick={()=>setCheckIn({mood:checkIn?.mood||"great",energy:checkIn?.energy||4})} className="rounded-xl bg-[#ebf7f0] px-3 py-2.5 text-xs font-extrabold text-[#176044]">{tr(language,"mood")} · {checkIn?tr(language,checkIn.mood):tr(language,"checkIn")}</button><button onClick={()=>go("Progress")} className="rounded-xl bg-[#ebf7f0] px-3 py-2.5 text-xs font-extrabold text-[#176044]">BMI · {bmi.toFixed(1)}</button></div></article>
      <article className="rounded-[24px] border border-[#dfe8e3] bg-[#f1f8f4] p-5"><div className="flex items-center justify-between"><h2 className="text-base font-extrabold">{tr(language,"thisWeek")}</h2><span className="text-sm font-black text-[#176044]">{weekActivity.filter(Boolean).length}/5 {tr(language,"days")}</span></div><div className="mt-4 grid grid-cols-7 gap-1">{["M","T","W","T","F","S","S"].map((label,index)=><div key={`${label}-${index}`} className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${weekActivity[index]?"bg-[#197c4a] text-white":"border border-[#d4e0da] bg-white text-[#7e8b84]"}`}>{weekActivity[index]?<CheckCircle2 size={15}/>:label}</div>)}</div><div className="mt-4 h-2 overflow-hidden rounded-full bg-[#dfe9e4]"><div className="h-full rounded-full bg-[#197c4a]" style={{width:`${Math.min(100,weekActivity.filter(Boolean).length/5*100)}%`}}/></div><p className="mt-3 text-xs leading-5 text-[#66776e]">{tr(language,"fiveDays")}</p></article>
      <article className="rounded-[24px] border border-[#d7e7df] bg-[#eaf6f0] p-5 text-[#153f2d] shadow-lg shadow-[#153f2d]/5"><div className="flex items-center gap-2 text-[#176044]"><Bot size={18}/><strong>{tr(language,"normalAssistant")}</strong></div><h2 className="mt-3 text-xl font-black leading-tight">{tr(language,"smarterGuidance")}</h2><p className="mt-2 text-xs leading-5 text-[#557166]">{tr(language,"useDailyContext")}</p><button onClick={()=>go("Assistant")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#176044] px-4 py-3 text-sm font-black text-white">{tr(language,"chatPlus")} <ChevronRight size={16}/></button></article>
    </aside>
    </div>
  </div>;
}

function Overview({
  bmi,
  category,
  consumed,
  target,
  exerciseCals,
  activeMinutes,
  macros,
  addedSugar,
  sugarLimit,
  dailyScore,
  streak,
  weekActivity,
  checkIn,
  setCheckIn,
  mealLogged,
  weight,
  goalWeight,
  water,
  addWater,
  go,
}: {
  bmi: number;
  category: string;
  consumed: number;
  target: number;
  exerciseCals: number;
  activeMinutes: number;
  macros: { protein: number; carbs: number; fat: number };
  addedSugar: number;
  sugarLimit: number;
  dailyScore: number;
  streak: number;
  weekActivity: boolean[];
  checkIn?: { mood: "low" | "okay" | "great"; energy: number };
  setCheckIn: (value: { mood: "low" | "okay" | "great"; energy: number }) => void;
  mealLogged: boolean;
  weight: number;
  goalWeight: number;
  water: number;
  addWater: () => void;
  go: (s: string) => void;
}) {
  const youth = target === 0,
    older = category.includes("65+"),
    activityTarget = youth ? 60 : 30;
  const ageGoal = youth
    ? "Healthy growth"
    : older
      ? "Strength and steady habits"
      : "Personal weight goal";
  const nextAction = !mealLogged
    ? { label: "Log your first meal", detail: "Get nutrition and sugar guidance", target: "Meals" }
    : activeMinutes < activityTarget
      ? { label: `Move for ${activityTarget - activeMinutes} more min`, detail: "Complete today’s activity goal", target: "Exercise" }
      : water < 8
        ? { label: "Add a glass of water", detail: `${8 - water} glasses to today’s goal`, target: "water" }
        : { label: "Review your day", detail: "Ask Fit+ for a personal check-in", target: "Assistant" };
  const guidance = youth
    ? "For children and teens, adult BMI categories and calorie-deficit goals are not appropriate. Focus on balanced meals, sleep and active play; review growth with a parent or healthcare professional."
    : older
      ? "Use gentle changes and prioritise protein, hydration, balance and strength. Discuss unplanned weight loss or major changes with a healthcare professional."
      : "Aim for gradual, repeatable progress. Energy needs are estimates, so adjust using your longer-term trend.";
  return (
    <>
      <article className="overflow-hidden rounded-[28px] border border-[#dfe7e2] bg-white">
        <div className="grid gap-0 lg:grid-cols-[.72fr_1.28fr]">
          <div className="bg-[#fff7e6] p-6 md:p-7">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-[.14em] text-[#b64f2d]">Today’s momentum</p>
              <Trophy size={20} className="text-[#d8663e]" />
            </div>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-5xl font-extrabold text-[#153f2d]">{dailyScore}</span>
              <span className="mb-2 text-sm font-bold text-[#6e755f]">/ 100</span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-[#e06438] transition-all" style={{ width: `${dailyScore}%` }} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[#666b58]">
              {dailyScore >= 80 ? "Excellent consistency today." : dailyScore >= 50 ? "Good start—one more action will lift your day." : "Start small. One healthy action is enough to build momentum."}
            </p>
          </div>
          <div className="p-6 md:p-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#587064]">
                  <CheckCircle2 size={17} className="text-[#3c8c67]" /> Next best action
                </div>
                <h2 className="mt-2 text-2xl font-extrabold">{nextAction.label}</h2>
                <p className="mt-1 text-sm text-[#68766e]">{nextAction.detail}</p>
              </div>
              <button
                onClick={() => nextAction.target === "water" ? addWater() : go(nextAction.target)}
                className="shrink-0 rounded-2xl bg-[#153f2d] px-5 py-3 font-bold text-white shadow-lg shadow-[#153f2d]/10 hover:bg-[#20533d]"
              >
                Do it now
              </button>
            </div>
            <div className="mt-5 flex items-center gap-2 border-t border-[#e6ece8] pt-4 text-sm text-[#64736a]">
              <Flame size={17} className="text-[#e06438]" />
              <strong className="text-[#203c2d]">{streak} day{streak === 1 ? "" : "s"}</strong> current streak
            </div>
          </div>
        </div>
      </article>
      <article className="rounded-[28px] border border-[#dfe7e2] bg-white p-6 md:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#587064]">
              <Trophy size={17} className="text-[#e06438]" /> This week’s quest
            </div>
            <h2 className="mt-1 text-xl font-extrabold">Show up on 5 days</h2>
            <p className="mt-1 text-sm text-[#68766e]">Any meal, movement or water log counts. Consistency beats perfection.</p>
          </div>
          <div className="rounded-2xl bg-[#fff7e6] px-5 py-3 text-center">
            <span className="text-2xl font-extrabold text-[#d85f35]">{weekActivity.filter(Boolean).length}</span>
            <span className="text-sm font-bold text-[#786b4b]"> / 5 days</span>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-7 gap-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((label, index) => (
            <div key={`${label}-${index}`} className="text-center">
              <div className={`mx-auto grid h-9 w-9 place-items-center rounded-full text-sm font-extrabold ${weekActivity[index] ? "bg-[#3c8c67] text-white" : "bg-[#edf2ef] text-[#87928c]"}`}>
                {weekActivity[index] ? <CheckCircle2 size={17} /> : label}
              </div>
            </div>
          ))}
        </div>
      </article>
      <article className="rounded-[28px] border border-[#dfe7e2] bg-white p-6 md:p-7">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#e3efe8] text-[#246044]">
            <Smile size={22} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">How do you feel today?</h2>
            <p className="mt-1 text-sm text-[#68766e]">A five-second check-in helps Fit+ give advice that matches your day.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold text-[#52655a]">Mood</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {([["low", "Low"], ["okay", "Okay"], ["great", "Great"]] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCheckIn({ mood: value, energy: checkIn?.energy || 3 })}
                  aria-pressed={checkIn?.mood === value}
                  className={`rounded-xl px-3 py-3 text-sm font-bold transition ${checkIn?.mood === value ? "bg-[#153f2d] text-white" : "bg-[#f1f5f2] text-[#52655a] hover:bg-[#e3efe8]"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-[#52655a]">Energy</p>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCheckIn({ mood: checkIn?.mood || "okay", energy: value })}
                  aria-label={`Energy level ${value} of 5`}
                  aria-pressed={checkIn?.energy === value}
                  className={`rounded-xl py-3 text-sm font-extrabold transition ${checkIn?.energy === value ? "bg-[#e06438] text-white" : "bg-[#fff7e6] text-[#9b572f] hover:bg-[#f7e5bf]"}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>
        {checkIn && (
          <p className="mt-4 rounded-xl bg-[#f4f7f5] px-4 py-3 text-sm font-semibold text-[#52655a]">
            Check-in saved. Your assistant will use this when you ask about today.
          </p>
        )}
      </article>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <article className="rounded-[28px] bg-[#163f2e] p-6 text-white md:p-7">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm text-[#b9d8c8]">
                <Sparkles size={16} /> Age-aware snapshot
              </div>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-extrabold">
                  {bmi.toFixed(1)}
                </span>
                <span className="mb-2 text-sm text-[#b9d8c8]">
                  {youth ? "BMI-for-age" : "BMI"}
                </span>
              </div>
              <span className="mt-3 inline-flex rounded-full bg-[#f0c868] px-3 py-1 text-sm font-bold text-[#3e3213]">
                {category}
              </span>
            </div>
            <div className="w-full rounded-2xl bg-white/10 p-4 sm:max-w-xs">
              <p className="text-sm text-[#c7dcd1]">{ageGoal}</p>
              <p className="mt-1 text-2xl font-extrabold">
                {youth
                  ? "Build healthy routines"
                  : `${weight} → ${goalWeight} kg`}
              </p>
              <div className="mt-4 h-2 rounded-full bg-white/15">
                <div className="h-full w-1/3 rounded-full bg-[#f0c868]" />
              </div>
            </div>
          </div>
        </article>
        <article className="rounded-[28px] border border-[#dfe7e2] bg-white p-6">
          <div className="flex items-center gap-3">
            <Target className="text-[#e06438]" />
            <div>
              <p className="text-sm text-[#6b7971]">Age-appropriate focus</p>
              <p className="text-2xl font-extrabold">
                {youth
                  ? "Grow well"
                  : older
                    ? "Stay strong"
                    : "Progress gradually"}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-[#53635a]">{guidance}</p>
        </article>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={Apple}
          label={youth ? "Food energy logged" : "Calories eaten"}
          value={consumed}
          unit={youth ? "kcal recorded" : `/ ${target} kcal`}
          progress={youth ? 0 : (consumed / target) * 100}
          tone="coral"
        />
        <Metric
          icon={Flame}
          label="Added sugar"
          value={addedSugar}
          unit={`/ ${sugarLimit}g guide`}
          progress={sugarLimit ? (addedSugar / sugarLimit) * 100 : 100}
          tone="amber"
        />
        <Metric
          icon={Flame}
          label="Activity burned"
          value={exerciseCals}
          unit="kcal estimate"
          progress={(exerciseCals / 300) * 100}
          tone="amber"
        />
        <Metric
          icon={Dumbbell}
          label="Active minutes"
          value={activeMinutes}
          unit={`/ ${activityTarget} min`}
          progress={(activeMinutes / activityTarget) * 100}
          tone="green"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[28px] border border-[#dfe7e2] bg-white p-6">
          <h2 className="text-xl font-extrabold">Today’s nutrition</h2>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              ["Protein", macros.protein],
              ["Carbs", macros.carbs],
              ["Fat", macros.fat],
            ].map(([a, b]) => (
              <div
                key={String(a)}
                className="rounded-2xl bg-[#f4f7f5] p-3 text-center"
              >
                <p className="text-xs text-[#738078]">{a}</p>
                <p className="mt-1 text-lg font-extrabold">
                  {Math.round(Number(b))}g
                </p>
              </div>
            ))}
          </div>
          <div
            className={`mt-4 rounded-xl p-3 text-sm font-semibold ${addedSugar >= sugarLimit ? "bg-red-50 text-red-700" : addedSugar >= sugarLimit * 0.8 ? "bg-amber-50 text-amber-800" : "bg-[#e3efe8] text-[#24583f]"}`}
          >
            {addedSugar >= sugarLimit
              ? `Estimated added sugar has reached the ${sugarLimit}g daily guide.`
              : `About ${Math.max(0, Math.round(sugarLimit - addedSugar))}g remains within today’s added-sugar guide.`}
          </div>
          <button
            onClick={() => go("Meals")}
            className="mt-5 flex items-center gap-1 text-sm font-bold text-[#17412e]"
          >
            Add a meal <ChevronRight size={16} />
          </button>
        </article>
        <article className="rounded-[28px] bg-[#e3efe8] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#587064]">Water</p>
              <h2 className="text-xl font-extrabold">{water} of 8 glasses</h2>
            </div>
            <button
              onClick={addWater}
              className="grid h-11 w-11 place-items-center rounded-xl bg-[#153f2d] text-white"
            >
              <CirclePlus />
            </button>
          </div>
          <div className="mt-6 grid grid-cols-8 gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={`h-12 rounded-xl ${i < water ? "bg-[#3c8c67]" : "bg-white/70"}`}
              />
            ))}
          </div>
        </article>
      </div>
    </>
  );
}
function Meals({
  query,
  setQuery,
  submit,
  loading,
  photo,
  photoLoading,
  selectPhoto,
  analyzePhoto,
  clearPhoto,
  error,
  estimates,
  add,
  meals,
  totalSugar,
  addedSugar,
  sugarLimit,
  language,
  remove,
}: {
  query: string;
  setQuery: (s: string) => void;
  submit: (e: FormEvent) => void;
  loading: boolean;
  photo: string;
  photoLoading: boolean;
  selectPhoto: (file?: File) => void;
  analyzePhoto: () => void;
  clearPhoto: () => void;
  error: string;
  estimates: FoodEstimate[];
  add: () => void;
  meals: Meal[];
  totalSugar: number;
  addedSugar: number;
  sugarLimit: number;
  language: Language;
  remove: (id: string) => void;
}) {
  const total = estimates.reduce((sum, item) => sum + item.calories, 0);
  return (
    <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
      <article className="rounded-[28px] border border-[#dfe7e2] bg-white p-6">
        <div
          className={`mb-5 rounded-2xl p-4 ${addedSugar >= sugarLimit ? "bg-red-50" : "bg-[#e3efe8]"}`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold">{tr(language, "sugarToday")}</p>
              <p className="mt-1 text-xs text-[#65756c]">
                {tr(language, "total")} {Math.round(totalSugar)}g ·{" "}
                {tr(language, "addedSugar")} {Math.round(addedSugar)}g
              </p>
            </div>
            <p
              className={`text-xl font-extrabold ${addedSugar >= sugarLimit ? "text-red-700" : "text-[#17412e]"}`}
            >
              {Math.round(addedSugar)} / {sugarLimit}g
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
            <div
              className={`h-full rounded-full ${addedSugar >= sugarLimit ? "bg-red-500" : "bg-[#3c8c67]"}`}
              style={{
                width: `${Math.min(100, sugarLimit ? (addedSugar / sugarLimit) * 100 : 100)}%`,
              }}
            />
          </div>
          <p
            className={`mt-2 text-xs font-semibold ${addedSugar >= sugarLimit ? "text-red-700" : "text-[#536b5d]"}`}
          >
            {addedSugar >= sugarLimit
              ? tr(language, "sugarExceeded")
              : `${Math.max(0, Math.round(sugarLimit - addedSugar))}g ${tr(language, "remaining")}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#ffede6] text-[#df693e]">
            <Sparkles />
          </div>
          <div>
            <p className="text-sm text-[#718078]">{tr(language, "aiSearch")}</p>
            <h2 className="text-xl font-extrabold">
              {tr(language, "listFood")}
            </h2>
          </div>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#cfe0d6] bg-gradient-to-br from-[#edf8f1] to-[#f8fbf9] p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#176044] text-white">
              <Camera size={21} />
            </div>
            <div>
              <h3 className="font-extrabold">{tr(language, "photoMeal")}</h3>
              <p className="mt-1 text-xs leading-5 text-[#627168]">{tr(language, "photoMealHelp")}</p>
            </div>
          </div>
          {photo ? (
            <div className="mt-4">
              <img src={photo} alt="Food selected for AI estimation" className="h-52 w-full rounded-2xl object-cover" />
              <p className="mt-2 text-xs leading-5 text-[#627168]">{tr(language, "photoEstimateNote")}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="cursor-pointer rounded-xl border border-[#b8d0c1] bg-white px-3 py-3 text-center text-sm font-bold text-[#24583f]">
                  {tr(language, "changePhoto")}
                  <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(event) => selectPhoto(event.target.files?.[0])} />
                </label>
                <button type="button" disabled={photoLoading} onClick={analyzePhoto} className="flex items-center justify-center gap-2 rounded-xl bg-[#176044] px-3 py-3 text-sm font-bold text-white disabled:opacity-50">
                  {photoLoading ? <LoaderCircle className="animate-spin" size={18} /> : <Sparkles size={18} />}
                  {tr(language, "analyzePhoto")}
                </button>
              </div>
              <button type="button" onClick={clearPhoto} className="mt-2 w-full text-xs font-bold text-[#6b766f] hover:text-red-700">{tr(language, "removePhoto")}</button>
            </div>
          ) : (
            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#176044] px-4 py-3 font-bold text-white shadow-sm">
              <Camera size={19} /> {tr(language, "choosePhoto")}
              <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(event) => selectPhoto(event.target.files?.[0])} />
            </label>
          )}
        </div>
        <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[#87938c]"><span className="h-px flex-1 bg-[#dfe7e2]" />{tr(language, "orTypeFoods")}<span className="h-px flex-1 bg-[#dfe7e2]" /></div>
        <form onSubmit={submit} className="mt-5">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              "Enter one food per line, for example:\nCurry rice\nMiso soup\n6 pieces sushi\nRamen"
            }
            rows={5}
            className="w-full resize-none rounded-2xl border border-[#dce5df] bg-[#f7faf8] p-4 text-base outline-none"
          />
          <p className="mt-2 text-xs leading-5 text-[#718078]">
            {tr(language, "foodHint")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2" aria-label="Quick food examples">
            {["Nasi lemak", "Chicken rice", "Roti canai", "Mixed rice", "Oatmeal + banana"].map((food) => (
              <button
                key={food}
                type="button"
                onClick={() => setQuery(query ? `${query}\n${food}` : food)}
                className="rounded-full border border-[#dce5df] bg-white px-3 py-1.5 text-xs font-bold text-[#476052] hover:border-[#3c8c67]"
              >
                + {food}
              </button>
            ))}
          </div>
          <button
            disabled={loading || !query.trim()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#153f2d] px-4 py-3 font-bold text-white disabled:opacity-50"
          >
            {loading ? (
              <LoaderCircle className="animate-spin" size={19} />
            ) : (
              <Search size={19} />
            )}{" "}
            {tr(language, "estimateEach")}
          </button>
        </form>
        {error && <ErrorBox text={error} />}{" "}
        {estimates.length > 0 && (
          <div className="mt-5 overflow-hidden rounded-2xl bg-[#fff7e6]">
            <div className="flex items-center justify-between gap-4 border-b border-[#eadbb7] px-5 py-4">
              <div>
                <p className="font-extrabold">
                  {estimates.length} food{estimates.length === 1 ? "" : "s"}
                </p>
                <p className="text-xs text-[#756f5c]">
                  {tr(language, "combined")}
                </p>
              </div>
              <p className="text-2xl font-extrabold text-[#d55e33]">
                {Math.round(total)} <span className="text-xs">kcal</span>
              </p>
            </div>
            <div className="divide-y divide-[#eadbb7]">
              {estimates.map((item, index) => (
                <div key={`${item.name}-${index}`} className="p-5">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-extrabold">{item.name}</p>
                      <p className="text-sm text-[#736a50]">{item.portion}</p>
                    </div>
                    <p className="whitespace-nowrap text-xl font-extrabold text-[#d55e33]">
                      {Math.round(item.calories)}{" "}
                      <span className="text-xs">kcal</span>
                    </p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm sm:grid-cols-5">
                    <span>P {item.protein}g</span>
                    <span>C {item.carbs}g</span>
                    <span>F {item.fat}g</span>
                    <span>Total sugar {item.totalSugar}g</span>
                    <span>Added {item.addedSugar}g</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.balance === "balanced" ? "bg-green-100 text-green-800" : item.balance === "partly balanced" ? "bg-amber-100 text-amber-800" : "bg-orange-100 text-orange-800"}`}
                    >
                      {item.balance}
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#53635a]">
                      Best {item.frequency}
                    </span>
                    {item.foodGroups.map((group) => (
                      <span
                        key={group}
                        className="rounded-full bg-white/70 px-2.5 py-1 text-xs text-[#675e46]"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-5 text-[#5f604f]">
                    {item.balanceNote}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-[#756f5c]">
                    {item.note} · Confidence: {item.confidence}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={add}
              className="m-4 mt-0 w-[calc(100%-2rem)] rounded-xl bg-[#e06438] px-4 py-3 font-bold text-white"
            >
              {tr(language, "addAll")} · {Math.round(total)} kcal
            </button>
          </div>
        )}
      </article>
      <Log title={tr(language, "recorded")} empty={tr(language, "noMeals")}>
        {meals.map((m) => (
          <LogRow
            key={m.id}
            icon={Apple}
            title={m.name}
            detail={`${m.portion} · ${m.protein}g protein · ${Math.round(Number(m.addedSugar || 0))}g added sugar`}
            value={`${m.calories} kcal`}
            remove={() => remove(m.id)}
          />
        ))}
      </Log>
    </div>
  );
}
function ExerciseView({
  name,
  setName,
  minutes,
  setMinutes,
  burned,
  setBurned,
  weight,
  submit,
  exercises,
  language,
  remove,
}: {
  name: string;
  setName: (s: string) => void;
  minutes: number;
  setMinutes: (n: number) => void;
  burned: number;
  setBurned: (n: number) => void;
  weight: number;
  submit: (e: FormEvent) => void;
  exercises: Exercise[];
  language: Language;
  remove: (id: string) => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
      <article className="rounded-[28px] border border-[#dfe7e2] bg-white p-6">
        <h2 className="text-xl font-extrabold">{tr(language,"recordExercise")}</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
          {[
            [tr(language,"briskWalk"), 20, 90],
            [tr(language,"homeStrength"), 15, 80],
            [tr(language,"cycling"), 30, 180],
          ].map(([label, duration, calories]) => (
            <button
              key={String(label)}
              type="button"
              onClick={() => {
                setName(String(label));
                setMinutes(Number(duration));
                setBurned(Number(calories));
              }}
              className="flex items-center justify-between rounded-xl bg-[#f4f7f5] px-4 py-3 text-left text-sm font-bold hover:bg-[#e3efe8]"
            >
              <span>{String(label)}</span>
              <span className="text-xs font-semibold text-[#718078]">{Number(duration)} min</span>
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <Input
            label={tr(language,"activity")}
            value={name}
            on={setName}
            placeholder={tr(language,"briskWalk")}
          />
          <div className="grid grid-cols-2 gap-3">
            <Num label={tr(language,"durationMinutes")} value={minutes} on={setMinutes} />
            <Num label={tr(language,"kcalBurned")} value={burned} on={setBurned} readOnly />
          </div>
          <button className="w-full rounded-xl bg-[#153f2d] px-4 py-3 font-bold text-white">
            {tr(language,"addExercise")}
          </button>
        </form>
        <div className="mt-5 rounded-2xl bg-[#e3efe8] p-4 text-sm leading-6 text-[#52685c]">
          <strong className="text-[#24583f]">{burned} kcal</strong> · {tr(language,"exerciseAuto")} ({minutes} min · {weight} kg) {tr(language,"exerciseEstimate")}
        </div>
      </article>
      <Log
        title={tr(language,"activitiesRecorded")}
        empty={tr(language,"noExercise")}
      >
        {exercises.map((e) => (
          <LogRow
            key={e.id}
            icon={Dumbbell}
            title={e.name}
            detail={`${e.minutes} ${tr(language,"minutes")}`}
            value={`${e.calories} kcal`}
            remove={() => remove(e.id)}
          />
        ))}
      </Log>
    </div>
  );
}
function Assistant({
  question,
  setQuestion,
  submit,
  loading,
  error,
  reply,
  quick,
  language,
}: {
  question: string;
  setQuestion: (s: string) => void;
  submit: (e: FormEvent) => void;
  loading: boolean;
  error: string;
  reply: string;
  quick: (s: string) => void;
  language: Language;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <article className="rounded-[32px] bg-[#fff7e6] p-6 md:p-9">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f2c45f]">
              <Bot size={28} />
            </div>
            <div>
              <p className="text-sm text-[#756b4c]">{tr(language,"freeCoach")}</p>
              <h2 className="text-2xl font-extrabold">{tr(language,"normalAssistant")}</h2>
            </div>
          </div>
        </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          tr(language, "eatNext"),
          tr(language, "workout"),
          tr(language, "onTrack"),
        ].map((q) => (
          <button
            key={q}
            onClick={() => quick(q)}
            className="rounded-full border border-[#dcc78e] bg-white/70 px-4 py-2 text-sm font-semibold"
          >
            {q}
          </button>
        ))}
      </div>
      {reply ? (
        <div className="mt-6 whitespace-pre-wrap rounded-2xl bg-white p-5 text-base leading-7 text-[#444c47]">
          {reply}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-[#d8c697] p-8 text-center text-sm text-[#7a7055]">
          {tr(language, "answerUses")}
        </div>
      )}
      {error && <ErrorBox text={error} />}
      <form onSubmit={submit} className="mt-5 flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={tr(language, "askPlaceholder")}
          className="min-w-0 flex-1 rounded-xl border border-[#dfcb94] bg-white px-4 py-3 text-base outline-none"
        />
        <button
          disabled={loading || !question.trim()}
          aria-label={tr(language,"askPlaceholder")}
          className="grid w-14 place-items-center rounded-xl bg-[#153f2d] text-white disabled:opacity-50"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <ChevronRight />
          )}
        </button>
      </form>
      <p className="mt-4 text-xs leading-5 text-[#7e7459]">
        {tr(language,"generalGuidance")}
      </p>
      </article>
    </div>
  );
}
function Progress({ store, target, language }: { store: Store; target: number; language: Language }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    // Keep weekly records aligned with the local calendar.\n    const date = dayKey(d);
    return {
      date,
      label: d.toLocaleDateString(language === "zh" ? "zh-CN" : language === "ms" ? "ms-MY" : "en", { weekday: "short" }),
      cal: store.meals
        .filter((m) => m.date === date)
        .reduce((s, m) => s + m.calories, 0),
      min: store.exercises
        .filter((e) => e.date === date)
        .reduce((s, e) => s + e.minutes, 0),
    };
  });
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          icon={CalendarDays}
          label={tr(language,"daysMeals")}
          value={days.filter((d) => d.cal > 0).length}
          unit={`/ 7 ${tr(language,"days")}`}
          progress={(days.filter((d) => d.cal > 0).length / 7) * 100}
          tone="green"
        />
        <Metric
          icon={Dumbbell}
          label={tr(language,"weeklyActivity")}
          value={days.reduce((s, d) => s + d.min, 0)}
          unit={tr(language,"minutes")}
          progress={(days.reduce((s, d) => s + d.min, 0) / 150) * 100}
          tone="amber"
        />
        <Metric
          icon={Target}
          label={tr(language,"goalConsistency")}
          value={days.filter((d) => d.cal > 0 && d.cal <= target * 1.1).length}
          unit={tr(language,"days")}
          progress={
            (days.filter((d) => d.cal > 0 && d.cal <= target * 1.1).length /
              7) *
            100
          }
          tone="coral"
        />
      </div>
      <article className="rounded-[28px] border border-[#dfe7e2] bg-white p-6">
        <h2 className="text-xl font-extrabold">{tr(language,"last7Days")}</h2>
        <div className="mt-8 flex h-56 items-end gap-3">
          {days.map((d) => (
            <div
              key={d.date}
              className="flex h-full flex-1 flex-col justify-end gap-2"
            >
              <p className="text-center text-xs font-semibold text-[#6c7972]">
                {d.cal || "–"}
              </p>
              <div
                className="min-h-1 rounded-t-xl bg-[#2b694d]"
                style={{
                  height: `${Math.min(100, (d.cal / Math.max(target, 1)) * 100)}%`,
                }}
              />
              <p className="text-center text-xs text-[#75827a]">{d.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs text-[#75827a]">
          {tr(language,"barsCalories")}
        </p>
      </article>
    </>
  );
}
function SettingsView({
  profile,
  update,
  exportData,
  reset,
  language,
}: {
  profile: Profile;
  update: (k: keyof Profile, v: string | number) => void;
  exportData: () => void;
  reset: () => void;
  language: Language;
}) {
  const youth = profile.age < 20;
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_.65fr]">
      <article className="rounded-[28px] border border-[#dfe7e2] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-extrabold">{tr(language,"profileGoals")}</h2>
          <span className="rounded-full bg-[#fff3d4] px-3 py-1 text-sm font-bold text-[#745416]">
            {tr(language, youth ? "childTeen" : profile.age >= 65 ? "olderAdult" : "adult")}
          </span>
        </div>
        <p className="mt-2 text-sm leading-6 text-[#627168]">{tr(language, youth ? "youthGuidance" : profile.age >= 65 ? "olderGuidance" : "adultGuidance")}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input
            label={tr(language,"Name")}
            value={profile.name}
            on={(v) => update("name", v)}
          />
          <Num label={tr(language,"Age")} value={profile.age} on={(v) => update("age", v)} />
          <Select
            label={tr(language,"sexEstimate")}
            value={profile.sex}
            on={(v) => update("sex", v)}
            options={[
              ["female", tr(language,"Female")],
              ["male", tr(language,"Male")],
            ]}
          />
          <Num
            label={tr(language,"heightCm")}
            value={profile.height}
            on={(v) => update("height", v)}
          />
          <Num
            label={tr(language,"currentWeight")}
            value={profile.weight}
            on={(v) => update("weight", v)}
          />
          {youth ? (
            <div className="sm:col-span-2 rounded-2xl bg-[#fff7e6] p-4 text-sm font-semibold text-[#716743]">
              {tr(language,"youthGoal")}
            </div>
          ) : (
            <>
              <Num
                label={tr(language,"goalWeight")}
                value={profile.goalWeight}
                on={(v) => update("goalWeight", v)}
              />
              <Select
                label={tr(language,"Goal")}
                value={profile.goal}
                on={(v) => update("goal", v)}
                options={[
                  ["lose", tr(language,"loseWeight")],
                  ["maintain", tr(language,"maintainWeight")],
                  ["gain", tr(language,"gainWeight")],
                ]}
              />
            </>
          )}
          <Select
            label={tr(language,"Activity")}
            value={profile.activity}
            on={(v) => update("activity", v)}
            options={[
              ["low", tr(language,"mostlySitting")],
              ["moderate", tr(language,"weeklyExercise")],
              ["high", tr(language,"veryActive")],
            ]}
          />
          {youth && <>
            <Select label={tr(language, "schoolDay")} value={profile.schoolDay} on={(v) => update("schoolDay", v)} options={[["school", tr(language, "schoolSchool")], ["tuition", tr(language, "schoolTuition")], ["screen", tr(language, "schoolScreen")]]} />
            <Select label={tr(language, "teenFocus")} value={profile.teenFocus} on={(v) => update("teenFocus", v)} options={[["energy", tr(language, "focusEnergy")], ["sugar", tr(language, "focusSugar")], ["movement", tr(language, "focusMovement")]]} />
          </>}
        </div>
      </article>
      <article className="rounded-[28px] bg-[#e3efe8] p-6">
        <h2 className="text-xl font-extrabold">{tr(language,"yourRecords")}</h2>
        <p className="mt-2 text-sm leading-6 text-[#5e7167]">
          {tr(language,"backupAdvice")}
        </p>
        <button
          onClick={exportData}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#153f2d] px-4 py-3 font-bold text-white"
        >
          <Download size={18} /> {tr(language,"exportBackup")}
        </button>
        <button
          onClick={reset}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-3 font-bold text-red-700"
        >
          <Trash2 size={18} /> {tr(language,"deleteData")}
        </button>
      </article>
    </div>
  );
}
function Log({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: React.ReactNode;
}) {
  const has = Array.isArray(children) ? children.length > 0 : !!children;
  return (
    <article className="rounded-[28px] border border-[#dfe7e2] bg-white p-6">
      <h2 className="text-xl font-extrabold">{title}</h2>
      <div className="mt-5 space-y-3">
        {has ? (
          children
        ) : (
          <div className="rounded-2xl bg-[#f6f8f7] p-8 text-center text-sm text-[#738078]">
            {empty}
          </div>
        )}
      </div>
    </article>
  );
}
function LogRow({
  icon: Icon,
  title,
  detail,
  value,
  remove,
}: {
  icon: typeof Apple;
  title: string;
  detail: string;
  value: string;
  remove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#f6f8f7] p-3">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#2b694d]">
        <Icon size={19} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{title}</p>
        <p className="text-xs text-[#738078]">{detail}</p>
      </div>
      <p className="text-sm font-bold">{value}</p>
      <button
        onClick={remove}
        aria-label={`Remove ${title}`}
        className="text-[#94a098] hover:text-red-600"
      >
        <X size={17} />
      </button>
    </div>
  );
}
function Metric({
  icon: Icon,
  label,
  value,
  unit,
  progress,
  tone,
}: {
  icon: typeof Apple;
  label: string;
  value: number;
  unit: string;
  progress: number;
  tone: "coral" | "amber" | "green";
}) {
  const c = {
    coral: ["bg-[#ffede6] text-[#dc6236]", "bg-[#e96e42]"],
    amber: ["bg-[#fff3d4] text-[#a56d00]", "bg-[#e9b548]"],
    green: ["bg-[#e2f0e8] text-[#1f5f40]", "bg-[#2b694d]"],
  }[tone];
  return (
    <article className="rounded-[24px] border border-[#dfe7e2] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#6f7d75]">{label}</p>
          <p className="mt-1 text-2xl font-extrabold">
            {Math.round(value)}{" "}
            <span className="text-sm text-[#7e8983]">{unit}</span>
          </p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${c[0]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-5 h-2 rounded-full bg-[#edf1ef]">
        <div
          className={`h-full rounded-full ${c[1]}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </article>
  );
}
function Input({
  label,
  value,
  on,
  placeholder,
}: {
  label: string;
  value: string;
  on: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="text-sm font-semibold text-[#53635a]">
      {label}
      <input
        value={value}
        onChange={(e) => on(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-[#dce5df] bg-white px-3 py-3 text-base text-[#15221c] outline-none"
      />
    </label>
  );
}
function Num({
  label,
  value,
  on,
  readOnly = false,
}: {
  label: string;
  value: number;
  on: (v: number) => void;
  readOnly?: boolean;
}) {
  return (
    <label className="text-sm font-semibold text-[#53635a]">
      {label}
      <input
        type="text"
        inputMode="decimal"
        value={value}
        readOnly={readOnly}
        onFocus={(e) => { if (!readOnly) e.currentTarget.select(); }}
        onChange={(e) => {
          let clean = e.target.value.replace(/[^0-9.]/g, "");
          const dot = clean.indexOf(".");
          if (dot >= 0) clean = clean.slice(0, dot + 1) + clean.slice(dot + 1).replace(/\./g, "");
          clean = clean.replace(/^0+(?=\d)/, "");
          e.currentTarget.value = clean;
          on(clean === "" ? 0 : Number(clean));
        }}
        className={`mt-1.5 w-full rounded-xl border border-[#dce5df] px-3 py-3 text-base text-[#15221c] outline-none ${readOnly ? "bg-[#edf4f0] font-bold text-[#24583f]" : "bg-white"}`}
      />
    </label>
  );
}
function Select({
  label,
  value,
  on,
  options,
}: {
  label: string;
  value: string;
  on: (v: string) => void;
  options: string[][];
}) {
  return (
    <label className="text-sm font-semibold text-[#53635a]">
      {label}
      <select
        value={value}
        onChange={(e) => on(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-[#dce5df] bg-white px-3 py-3 text-base text-[#15221c] outline-none"
      >
        {options.map((o) => (
          <option value={o[0]} key={o[0]}>
            {o[1]}
          </option>
        ))}
      </select>
    </label>
  );
}
function ErrorBox({ text }: { text: string }) {
  return (
    <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{text}</p>
  );
}
function MobileNav({
  active,
  set,
  language,
}: {
  active: string;
  set: (s: string) => void;
  language: Language;
}) {
  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-[#dce6e0] bg-white/95 px-1 pb-[calc(.4rem+env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-8px_24px_rgba(20,63,44,.08)] backdrop-blur lg:hidden">
      {nav.map(({ n, i: Icon }) => (
        <button
          key={n}
          onClick={() => set(n)}
          aria-current={active === n ? "page" : undefined}
          className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-0.5 py-2 text-[10px] font-semibold min-[390px]:text-[11px] ${active === n ? "bg-[#eaf4ef] text-[#17412e]" : "text-[#7a877f]"}`}
        >
          <Icon size={19} />
          <span className="max-w-full truncate">{n === "Assistant" ? "AI" : tr(language, n)}</span>
        </button>
      ))}
    </nav>
  );
}
