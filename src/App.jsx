import { useState, useEffect, useRef, useCallback } from "react";

// ── API Config ────────────────────────────────────────────────────────────────
const RESOURCE_ID = "053cea08-09bc-40ec-8f7a-156f0677aff3";

const plateCache = {};

async function fetchCarByPlate(plate) {
  const key = plate.replace(/\D/g, "");
  if (key in plateCache) return plateCache[key];
  try {
    const res = await fetch(
      `https://data.gov.il/api/3/action/datastore_search` +
        `?resource_id=${RESOURCE_ID}` +
        `&filters={"mispar_rechev":"${key}"}`
    );
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!data?.result?.records?.length) { plateCache[key] = null; return null; }
    const car = data.result.records[0];
    const result = {
      manufacturer: (car.tozeret_nm || "").trim(),
      model:        (car.kinuy_mishari || "").trim(),
      year:         car.shnat_yitzur || "",
      color:        (car.tzeva_rechev || "").trim(),
      engineCC:     car.nefah_manoa || "",
      seats:        car.mispar_moshavim || "",
      bodyType:     (car.degem_nm || "").trim(),
      fuelType:     (car.sug_delek_nm || "").trim(),
      country:      (car.tozeret_cd_nm || "").trim(),
    };
    plateCache[key] = result;
    return result;
  } catch { return null; }
}

// ── Translations ──────────────────────────────────────────────────────────────
const T = {
  he: {
    dir: "rtl", appName: "עלות הרכב", monthlyTotal: "עלות חודשית", dailyCost: "עלות יומית",
    fuel: "דלק", maintenance: "תחזוקה", fixed: "הוצאות קבועות",
    addExpense: "הוסף הוצאה", chooseType: "בחר סוג הוצאה",
    amount: "סכום (₪)", liters: "ליטרים (אופציונלי)", pricePerLiter: "מחיר לליטר (₪)",
    totalFuel: "סה״כ דלק",
    maintenanceDesc: "תיאור התחזוקה", maintenanceDescPlaceholder: "לדוגמה: החלפת שמן + פילטר",
    maintenanceDescRequired: "יש להזין תיאור", add: "הוסף", cancel: "ביטול",
    settings: "הגדרות", defaultFuelPrice: "מחיר דלק ברירת מחדל", save: "שמור",
    currency: "₪", noExpenses: "אין הוצאות החודש", addFirst: "לחץ + להוספת הוצאה",
    recentEntries: "הוצאות אחרונות", confirmDelete: "למחוק הוצאה זו?", yes: "כן, מחק", no: "ביטול",
    lang: "عربي", exportPDF: "ייצוא PDF", perDay: "ליום",
    welcome: "ברוכים הבאים", welcomeSub: "בואו נגדיר את הרכב שלך",
    carNumber: "מספר רכב", carNumberPlaceholder: "12-345-67",
    carModel: "דגם הרכב", carModelPlaceholder: "לדוגמה: Toyota Corolla 2019",
    letsGo: "בוא נתחיל", carNumberRequired: "יש להזין מספר רכב",
    carModelRequired: "יש להזין דגם רכב", changeVehicle: "שנה רכב",
    confirmChangeVehicle: "שינוי הרכב ימחק את כל הנתונים. להמשיך?",
    lookupTitle: "חיפוש אוטומטי",
    lookupPlaceholder: "הזן לוחית רישוי / أدخل رقم اللوحة",
    fetchBtn: "שלוף פרטים",
    fetching: "מחפש…",
    foundTitle: "נמצא ✓",
    useData: "השתמש בנתונים",
    notFound: "לא נמצאו נתונים — הזן ידנית למטה",
    orManual: "— או הזן ידנית —",
    odometer: "קריאת מד מרחק (ק״מ)",
    odometerPlaceholder: "לדוגמה: 85000",
    odometerOptional: "אופציונלי",
    km: "ק״מ",
    // PDF labels (Hebrew)
    pdfTitle: "דוח תחזוקה",
    pdfTotalMaint: "עלות תחזוקה כוללת",
    pdfTotalAll: "סה״כ הוצאות",
    pdfRecords: "רשומות תחזוקה",
    pdfHistory: "היסטוריית תחזוקה",
    pdfNoRecords: "לא נמצאו רשומות תחזוקה.",
    pdfNum: "מס׳",
    pdfDate: "תאריך",
    pdfDesc: "תיאור",
    pdfTotal: "סה״כ עלות תחזוקה",
    pdfPage: "דוח עלות רכב",
    // Car detail labels
    color: "צבע", engineCC: "נפח מנוע (סמ״ק)", seats: "מספר מושבים",
    bodyType: "סוג גוף", fuelType: "סוג דלק", country: "מדינת ייצור",
    // Maintenance & Fuel estimation
    maintStatus: "סטטוס תחזוקה", maintOk: "תקין", maintDue: "נדרשת תחזוקה", maintOverdue: "תחזוקה באיחור",
    nextService: "טיפול הבא בק״מ", lastService: "טיפול אחרון",
    maintAlert: "🚗 הגיע זמן לטיפול!", maintQuestion: "האם בוצע טיפול כעת?",
    maintLogged: "טיפול נרשם!", fuelEstTitle: "הערכת עלות דלק",
    fuelEfficiency: "צריכת דלק", fuelEfficient: "חסכנית (16 ק״מ/ל׳)",
    fuelAverage: "ממוצעת (12 ק״מ/ל׳)", fuelHigh: "גבוהה (8 ק״מ/ל׳)",
    monthlyFuel: "עלות חודשית משוערת", yearlyFuel: "עלות שנתית משוערת",
    avgMonthlyKm: "ק״מ חודשי ממוצע", noOdoData: "הוסף קריאת מד מרחק לחישוב",
    serviceInterval: "כל 10,000 ק״מ",
  },
  ar: {
    dir: "rtl", appName: "تكلفة سيارتي", monthlyTotal: "التكلفة الشهرية", dailyCost: "التكلفة اليومية",
    fuel: "وقود", maintenance: "صيانة", fixed: "مصاريف ثابتة",
    addExpense: "أضف مصروف", chooseType: "اختر نوع المصروف",
    amount: "المبلغ (₪)", liters: "لترات (اختياري)", pricePerLiter: "سعر اللتر (₪)",
    totalFuel: "إجمالي الوقود",
    maintenanceDesc: "وصف الصيانة", maintenanceDescPlaceholder: "مثال: تغيير زيت + فلتر",
    maintenanceDescRequired: "يرجى إدخال وصف الصيانة", add: "أضف", cancel: "إلغاء",
    settings: "الإعدادات", defaultFuelPrice: "السعر الافتراضي للوقود", save: "حفظ",
    currency: "₪", noExpenses: "لا مصاريف هذا الشهر", addFirst: "اضغط + لإضافة مصروف",
    recentEntries: "آخر المصاريف", confirmDelete: "حذف هذا المصروف؟", yes: "نعم، احذف", no: "إلغاء",
    lang: "עברית", exportPDF: "تصدير PDF", perDay: "يوميًا",
    welcome: "أهلاً وسهلاً", welcomeSub: "لنضبط بيانات سيارتك أولاً",
    carNumber: "رقم السيارة", carNumberPlaceholder: "12-345-67",
    carModel: "موديل السيارة", carModelPlaceholder: "مثال: Toyota Corolla 2019",
    letsGo: "هيّا نبدأ", carNumberRequired: "يرجى إدخال رقم السيارة",
    carModelRequired: "يرجى إدخال موديل السيارة", changeVehicle: "تغيير السيارة",
    confirmChangeVehicle: "تغيير السيارة سيمسح جميع البيانات. هل تريد المتابعة؟",
    lookupTitle: "بحث تلقائي",
    lookupPlaceholder: "أدخل رقم اللوحة / הזן לוחית רישוי",
    fetchBtn: "جلب البيانات",
    fetching: "جاري البحث…",
    foundTitle: "تم العثور ✓",
    useData: "استخدم هذه البيانات",
    notFound: "لم يُعثر على بيانات — أدخل يدويًا أدناه",
    orManual: "— أو أدخل يدويًا —",
    odometer: "قراءة عداد المسافات (كم)",
    odometerPlaceholder: "مثال: 85000",
    odometerOptional: "اختياري",
    km: "كم",
    // PDF labels (Hebrew - PDF always in Hebrew)
    pdfTitle: "דוח תחזוקה",
    pdfTotalMaint: "עלות תחזוקה כוללת",
    pdfTotalAll: "סה״כ הוצאות",
    pdfRecords: "רשומות תחזוקה",
    pdfHistory: "היסטוריית תחזוקה",
    pdfNoRecords: "לא נמצאו רשומות תחזוקה.",
    pdfNum: "#",
    pdfDate: "תאריך",
    pdfDesc: "תיאור",
    pdfTotal: "סה״כ עלות תחזוקה",
    pdfPage: "דוח עלות רכב",
    // Car detail labels
    color: "اللون", engineCC: "حجم المحرك (سم³)", seats: "عدد المقاعد",
    bodyType: "نوع الهيكل", fuelType: "نوع الوقود", country: "بلد الصنع",
    // Maintenance & Fuel estimation
    maintStatus: "حالة الصيانة", maintOk: "ممتاز", maintDue: "صيانة مستحقة", maintOverdue: "صيانة متأخرة",
    nextService: "الخدمة التالية (كم)", lastService: "آخر خدمة",
    maintAlert: "🚗 حان وقت الصيانة!", maintQuestion: "هل تمت الصيانة الآن؟",
    maintLogged: "تم تسجيل الصيانة!", fuelEstTitle: "تقدير تكلفة الوقود",
    fuelEfficiency: "استهلاك الوقود", fuelEfficient: "اقتصادي (16 كم/ل)",
    fuelAverage: "متوسط (12 كم/ل)", fuelHigh: "مرتفع (8 كم/ل)",
    monthlyFuel: "تكلفة شهرية تقديرية", yearlyFuel: "تكلفة سنوية تقديرية",
    avgMonthlyKm: "متوسط الكم الشهري", noOdoData: "أضف قراءة العداد للحساب",
    serviceInterval: "كل 10,000 كم",
  },
};

// ── Utilities ─────────────────────────────────────────────────────────────────
const STORE_KEY = "carCostTracker_v3";
function loadStore()    { try { const r=localStorage.getItem(STORE_KEY); return r?JSON.parse(r):null; } catch { return null; } }
function saveStore(d)   { try { localStorage.setItem(STORE_KEY,JSON.stringify(d)); } catch {} }
function initStore(lang){ return { version:3, language:lang||"ar", settings:{defaultFuelPrice:6.8}, expenses:[], car:null, maintenance:[], fuelEfficiency:12 }; }

// ── Maintenance helpers ───────────────────────────────────────────────────────
const SERVICE_INTERVAL = 10000;

function getMaintenanceStatus(store) {
  const odomReadings = store.expenses
    .filter(e => e.odometer)
    .map(e => e.odometer)
    .sort((a, b) => b - a);
  const currentKm = odomReadings[0] || null;

  const lastServiceKm = store.maintenance.length > 0
    ? store.maintenance[store.maintenance.length - 1].km
    : (store.car?.initialKm || null);

  if (!currentKm) return { status: "unknown", currentKm: null, nextServiceKm: null, lastServiceKm };

  const base = lastServiceKm || 0;
  const nextServiceKm = base + SERVICE_INTERVAL;
  const remaining = nextServiceKm - currentKm;

  let status = "ok";
  if (remaining <= 0) status = "overdue";
  else if (remaining <= 1500) status = "due";

  return { status, currentKm, nextServiceKm, lastServiceKm: base, remaining };
}

// ── Fuel estimation helpers ───────────────────────────────────────────────────
const EFFICIENCY_MAP = { 16: "efficient", 12: "average", 8: "high" };
// Simple model → efficiency hints (km/L)
const MODEL_EFFICIENCY = {
  "hybrid": 18, "yaris": 16, "jazz": 16, "fiesta": 15, "polo": 14,
  "corolla": 13, "civic": 13, "focus": 13, "golf": 12, "astra": 12,
  "mazda3": 12, "i20": 14, "i30": 13, "elantra": 12,
  "kuga": 10, "tiguan": 10, "rav4": 10, "tucson": 10, "qashqai": 11,
  "x5": 8, "x6": 8, "mustang": 8, "camaro": 8,
};

function guessEfficiency(model) {
  if (!model) return null;
  const lower = model.toLowerCase();
  for (const [key, val] of Object.entries(MODEL_EFFICIENCY)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

function calcFuelCost(store) {
  // Estimate monthly km from odometer readings
  const readings = store.expenses
    .filter(e => e.odometer)
    .map(e => ({ km: e.odometer, date: new Date(e.date) }))
    .sort((a, b) => a.date - b.date);

  let monthlyKm = null;
  if (readings.length >= 2) {
    const first = readings[0], last = readings[readings.length - 1];
    const months = Math.max(1, (last.date - first.date) / (1000 * 60 * 60 * 24 * 30));
    monthlyKm = Math.round((last.km - first.km) / months);
  }

  const efficiency = store.fuelEfficiency || 12;
  const fuelPrice  = store.settings.defaultFuelPrice || 6.8;

  if (!monthlyKm || monthlyKm <= 0) return { monthlyKm: null, monthlyFuel: null, yearlyFuel: null };

  const monthlyLiters = monthlyKm / efficiency;
  const monthlyFuel   = Math.round(monthlyLiters * fuelPrice);
  const yearlyFuel    = monthlyFuel * 12;
  return { monthlyKm, monthlyFuel, yearlyFuel };
}
function getCurrentMonth(){ const n=new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`; }
function fmtNum(n) { return new Intl.NumberFormat("he-IL",{maximumFractionDigits:0}).format(Math.round(n)); }
function fmtDec(n) { return new Intl.NumberFormat("he-IL",{minimumFractionDigits:1,maximumFractionDigits:1}).format(n); }
function uid()     { return `${Date.now()}-${Math.random().toString(36).slice(2,7)}`; }
function fmtDate(iso){ const d=new Date(iso); return `${d.getDate().toString().padStart(2,"0")}/${(d.getMonth()+1).toString().padStart(2,"0")}/${d.getFullYear()}`; }

const CAT_ICONS = { fuel:"⛽", maintenance:"🔧", fixed:"📄" };
const CAT_COL = {
  fuel:        { bg:"#EFF6FF", text:"#1D4ED8", bar:"#3B82F6" },
  maintenance: { bg:"#FFF7ED", text:"#C2410C", bar:"#F97316" },
  fixed:       { bg:"#F0FDF4", text:"#15803D", bar:"#22C55E" },
};

// ── PDF Export — Hebrew via canvas rendering ──────────────────────────────────
async function exportPDF(store, t) {
  // Load jsPDF
  if (!window.jspdf) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, M = 18;
  let y = 0;

  // Helper: draw RTL text via canvas → image embedded in PDF
  // This avoids Hebrew garbling entirely
  function addHebrewText(text, x, yPos, opts = {}) {
    const {
      fontSize = 11, fontWeight = "normal", color = "#000000",
      align = "left", maxWidth = null
    } = opts;

    const canvas = document.createElement("canvas");
    const scale = 3;
    const pxSize = fontSize * scale * 1.4;
    canvas.height = Math.ceil(pxSize * 1.6);

    // Measure text width
    const ctx = canvas.getContext("2d");
    ctx.font = `${fontWeight} ${pxSize}px 'Segoe UI', 'Arial Hebrew', Arial, sans-serif`;
    let measured = ctx.measureText(text).width;
    if (maxWidth) measured = Math.min(measured, maxWidth * scale * 3.78);
    canvas.width = Math.ceil(measured + 8);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontWeight} ${pxSize}px 'Segoe UI', 'Arial Hebrew', Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.direction = "rtl";
    ctx.textBaseline = "middle";

    let drawX = canvas.width - 4;
    if (align === "center") {
      ctx.textAlign = "center";
      drawX = canvas.width / 2;
    } else if (align === "left") {
      ctx.textAlign = "left";
      ctx.direction = "ltr";
      drawX = 4;
    } else {
      ctx.textAlign = "right";
    }
    ctx.fillText(text, drawX, canvas.height / 2);

    const imgData = canvas.toDataURL("image/png");
    const mmW = canvas.width / (scale * 3.78);
    const mmH = canvas.height / (scale * 3.78);

    let drawXmm = x;
    if (align === "right") drawXmm = x - mmW;
    else if (align === "center") drawXmm = x - mmW / 2;

    doc.addImage(imgData, "PNG", drawXmm, yPos - mmH / 2, mmW, mmH);
  }

  const maintEntries = store.expenses.filter(e => e.category === "maintenance").sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalMaint = maintEntries.reduce((s, e) => s + e.amount, 0);
  const totalAll   = store.expenses.reduce((s, e) => s + e.amount, 0);

  // Header bar
  doc.setFillColor(29, 78, 216);
  doc.rect(0, 0, W, 44, "F");

  // Car name & number — rendered as image (Hebrew safe)
  addHebrewText(store.car?.model || "Renter", W - M, 13, { fontSize: 13, fontWeight: "bold", color: "#ffffff", align: "right" });
  addHebrewText(store.car?.number || "", W - M, 22, { fontSize: 10, color: "rgba(255,255,255,0.85)", align: "right" });
  addHebrewText(t.pdfTitle, M, 36, { fontSize: 14, fontWeight: "bold", color: "#ffffff", align: "left" });

  // Date (Latin — no issue)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text(`${fmtDate(new Date().toISOString())}`, M, 26);

  y = 54;

  // Summary boxes
  const boxes = [
    { label: t.pdfTotalMaint, val: `${Math.round(totalMaint).toLocaleString()} ILS` },
    { label: t.pdfTotalAll,   val: `${Math.round(totalAll).toLocaleString()} ILS` },
    { label: t.pdfRecords,    val: `${maintEntries.length}` },
  ];
  const bw = (W - M * 2 - 8) / 3;
  boxes.forEach((b, i) => {
    const bx = M + i * (bw + 4);
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(bx, y, bw, 22, 3, 3, "F");
    addHebrewText(b.label, bx + bw / 2, y + 7, { fontSize: 6.5, color: "#1d4ed8", align: "center" });
    addHebrewText(b.val,   bx + bw / 2, y + 16, { fontSize: 11, fontWeight: "bold", color: "#1d4ed8", align: "center" });
  });
  y += 30;

  // Section title
  addHebrewText(t.pdfHistory, M, y + 3, { fontSize: 12, fontWeight: "bold", color: "#0f172a", align: "left" });
  y += 8;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(M, y, W - M, y);
  y += 6;

  if (maintEntries.length === 0) {
    addHebrewText(t.pdfNoRecords, M, y + 7, { fontSize: 10, color: "#94a3b8", align: "left" });
  } else {
    // Table header
    doc.setFillColor(248, 250, 252);
    doc.rect(M, y, W - M * 2, 8.5, "F");
    const headerY = y + 5.5;
    addHebrewText(t.pdfNum,  M + 3,    headerY, { fontSize: 7, color: "#64748b", align: "left" });
    addHebrewText(t.pdfDate, M + 13,   headerY, { fontSize: 7, color: "#64748b", align: "left" });
    addHebrewText(t.pdfDesc, M + 40,   headerY, { fontSize: 7, color: "#64748b", align: "left" });
    addHebrewText("ILS",     W - M - 2,headerY, { fontSize: 7, color: "#64748b", align: "right" });
    y += 11;

    maintEntries.forEach((e, i) => {
      if (y > 267) { doc.addPage(); y = 20; }
      if (i % 2 === 0) { doc.setFillColor(252, 252, 253); doc.rect(M, y - 3.5, W - M * 2, 11, "F"); }
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.2);
      doc.line(M, y + 7, W - M, y + 7);

      const rowY = y + 4;
      // Row number & date — Latin, fine
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(String(i + 1), M + 3, rowY);
      doc.text(fmtDate(e.date), M + 13, rowY);

      // Description — Hebrew, use canvas
      const desc = (e.description || "-");
      const truncated = desc.length > 30 ? desc.slice(0, 28) + "…" : desc;
      addHebrewText(truncated, M + 40, rowY, { fontSize: 8, fontWeight: "bold", color: "#0f172a", align: "left" });

      // Amount
      addHebrewText(Math.round(e.amount).toLocaleString(), W - M - 2, rowY, { fontSize: 8.5, fontWeight: "bold", color: "#1d4ed8", align: "right" });
      y += 12;
    });

    y += 2;
    // Total row
    doc.setFillColor(29, 78, 216);
    doc.rect(M, y, W - M * 2, 10, "F");
    addHebrewText(t.pdfTotal, M + 5, y + 6, { fontSize: 8.5, fontWeight: "bold", color: "#ffffff", align: "left" });
    addHebrewText(`${Math.round(totalMaint).toLocaleString()} ILS`, W - M - 2, y + 6, { fontSize: 9, fontWeight: "bold", color: "#ffffff", align: "right" });
  }

  // Page footer
  for (let i = 1; i <= doc.getNumberOfPages(); i++) {
    doc.setPage(i);
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.text(`${t.pdfPage}  •  Page ${i} of ${doc.getNumberOfPages()}`, W / 2, 290, { align: "center" });
  }

  doc.save(`car-record-${(store.car?.number || "car").replace(/\s/g, "-")}.pdf`);
}

// ── PlateLookupWidget ─────────────────────────────────────────────────────────
function PlateLookupWidget({ t, onUse }) {
  const [plate,   setPlate]   = useState("");
  const [status,  setStatus]  = useState("idle");
  const [result,  setResult]  = useState(null);
  const debounceRef = useRef(null);
  const lastPlateRef = useRef("");

  const doFetch = useCallback(async (raw) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length < 7) return;
    if (digits === lastPlateRef.current) return;
    lastPlateRef.current = digits;
    setStatus("loading");
    setResult(null);
    const car = await fetchCarByPlate(digits);
    if (car) { setResult(car); setStatus("found"); }
    else      { setStatus("notfound"); }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setPlate(val);
    setStatus("idle");
    setResult(null);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doFetch(val), 500);
  };

  const handleManualFetch = () => {
    clearTimeout(debounceRef.current);
    lastPlateRef.current = "";
    doFetch(plate);
  };

  const handleUse = () => {
    if (!result) return;
    const label = [result.manufacturer, result.model, result.year].filter(Boolean).join(" ");
    onUse({ number: plate.replace(/\D/g, ""), model: label, carDetails: result });
  };

  return (
    <div style={LS.wrapper}>
      <div style={LS.header}>
        <span style={LS.searchIcon}>🔍</span>
        <span style={LS.title}>{t.lookupTitle}</span>
      </div>
      <div style={LS.row}>
        <input
          type="text" inputMode="numeric"
          placeholder={t.lookupPlaceholder}
          value={plate} onChange={handleChange}
          dir="ltr" style={LS.input} maxLength={10}
        />
        <button
          onClick={handleManualFetch}
          disabled={status === "loading" || plate.replace(/\D/g, "").length < 7}
          style={LS.btn(status === "loading" || plate.replace(/\D/g, "").length < 7)}
        >
          {status === "loading" ? <Spinner /> : t.fetchBtn}
        </button>
      </div>

      {status === "found" && result && (
        <div style={LS.card}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 28 }}>🚗</span>
              <div>
                <div style={LS.carName}>{result.manufacturer} {result.model}</div>
                {result.year && <div style={LS.carYear}>{result.year}</div>}
              </div>
            </div>
            {/* Extra details grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", marginTop: 6 }}>
              {result.color    && <DetailRow icon="🎨" label={t.color}     val={result.color} />}
              {result.fuelType && <DetailRow icon="⛽" label={t.fuelType}  val={result.fuelType} />}
              {result.seats    && <DetailRow icon="💺" label={t.seats}     val={result.seats} />}
              {result.engineCC && <DetailRow icon="⚙️" label={t.engineCC} val={result.engineCC} />}
              {result.bodyType && <DetailRow icon="🏎️" label={t.bodyType} val={result.bodyType} />}
              {result.country  && <DetailRow icon="🌍" label={t.country}   val={result.country} />}
            </div>
          </div>
          <button onClick={handleUse} style={LS.useBtn}>{t.useData} →</button>
        </div>
      )}

      {status === "notfound" && (
        <div style={LS.notFound}>{t.notFound}</div>
      )}

      <div style={LS.divider}>
        <div style={LS.line}/>
        <span style={LS.dividerText}>{t.orManual}</span>
        <div style={LS.line}/>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, val }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#1E3A8A" }}>
      <span style={{ fontSize: 12 }}>{icon}</span>
      <span style={{ color: "#64748B", fontWeight: 600 }}>{label}:</span>
      <span style={{ fontWeight: 700 }}>{val}</span>
    </div>
  );
}

function Spinner() {
  return <span style={{ display:"inline-block",width:14,height:14,border:"2px solid rgba(255,255,255,0.35)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite" }}/>;
}

const LS = {
  wrapper: { marginBottom:10 },
  header:  { display:"flex",alignItems:"center",gap:7,marginBottom:10 },
  searchIcon: { fontSize:16 },
  title:   { fontSize:12,fontWeight:700,color:"#2563EB",letterSpacing:"0.3px",textTransform:"uppercase" },
  row:     { display:"flex",gap:8,marginBottom:10 },
  input:   { flex:1,padding:"12px 14px",fontSize:16,fontWeight:700,color:"#0F172A",background:"#F8FAFC",border:"2px solid #E2E8F0",borderRadius:14,outline:"none",fontFamily:"inherit",letterSpacing:"1px" },
  btn: (disabled) => ({ flexShrink:0,padding:"12px 16px",background:disabled?"#E2E8F0":"linear-gradient(135deg,#1D4ED8,#3B82F6)",color:disabled?"#94A3B8":"#fff",border:"none",borderRadius:14,fontSize:13,fontWeight:700,cursor:disabled?"default":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6,whiteSpace:"nowrap" }),
  card: { background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",border:"2px solid #BFDBFE",borderRadius:16,padding:"14px 16px",marginBottom:4,animation:"fadeIn 0.25s ease" },
  cardLeft: { display:"flex",alignItems:"center",gap:12 },
  carName:  { fontSize:15,fontWeight:800,color:"#1E3A8A",letterSpacing:"-0.3px",textTransform:"uppercase" },
  carYear:  { fontSize:20,fontWeight:800,color:"#3B82F6",lineHeight:1.1,marginTop:2 },
  useBtn:   { width:"100%",marginTop:10,background:"#1D4ED8",color:"#fff",border:"none",borderRadius:12,padding:"10px 14px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit" },
  notFound: { fontSize:12,fontWeight:600,color:"#C2410C",background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:12,padding:"10px 14px",marginBottom:4 },
  divider:  { display:"flex",alignItems:"center",gap:10,margin:"12px 0 14px" },
  line:     { flex:1,height:1,background:"#E2E8F0" },
  dividerText: { fontSize:11,fontWeight:700,color:"#94A3B8",whiteSpace:"nowrap" },
};

// ── Onboarding ────────────────────────────────────────────────────────────────
function Onboarding({ t, onDone, onLangToggle }) {
  const [num,   setNum]   = useState("");
  const [model, setModel] = useState("");
  const [err,   setErr]   = useState({});

  const submit = () => {
    const e = {};
    if (!num.trim())   e.num   = t.carNumberRequired;
    if (!model.trim()) e.model = t.carModelRequired;
    if (Object.keys(e).length) { setErr(e); return; }
    onDone({ number: num.trim(), model: model.trim() });
  };

  const handleLookupUse = ({ number, model: m, carDetails }) => {
    setNum(number);
    setModel(m);
    setErr({});
  };

  return (
    <div style={{...S.app(t.dir),display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",justifyContent:"flex-end",padding:"18px 18px 0"}}>
        <button onClick={onLangToggle} style={S.langBtn}>{t.lang}</button>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 20px 40px"}}>
        <div style={{width:96,height:96,borderRadius:"50%",background:"linear-gradient(135deg,#DBEAFE,#BFDBFE)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:22,boxShadow:"0 8px 28px rgba(59,130,246,0.2)"}}>
          <span style={{fontSize:50}}>🚗</span>
        </div>
        <h1 style={{fontSize:28,fontWeight:800,color:"#0F172A",margin:"0 0 8px",letterSpacing:"-1px",textAlign:"center"}}>{t.welcome}</h1>
        <p style={{fontSize:14,color:"#64748B",margin:"0 0 26px",textAlign:"center"}}>{t.welcomeSub}</p>

        <div style={{width:"100%",background:"#fff",borderRadius:22,padding:"22px 18px",boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}>
          <PlateLookupWidget t={t} onUse={handleLookupUse} />
          <label style={S.fieldLabel}>{t.carNumber}</label>
          <input style={{...S.input,...(err.num?S.inputErr:{})}} placeholder={t.carNumberPlaceholder} value={num} dir="ltr" onChange={e=>{setNum(e.target.value);setErr(r=>({...r,num:null}));}}/>
          {err.num && <p style={S.errMsg}>{err.num}</p>}
          <div style={{height:14}}/>
          <label style={S.fieldLabel}>{t.carModel}</label>
          <input style={{...S.input,...(err.model?S.inputErr:{})}} placeholder={t.carModelPlaceholder} value={model} onChange={e=>{setModel(e.target.value);setErr(r=>({...r,model:null}));}}/>
          {err.model && <p style={S.errMsg}>{err.model}</p>}
          <button onClick={submit} style={{...S.addBtn(true),marginTop:22}}>{t.letsGo} →</button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [store,      setStore]      = useState(()=>{ const s=loadStore()||initStore("ar"); if(!s.maintenance)s.maintenance=[]; if(!s.fuelEfficiency)s.fuelEfficiency=12; return s; });
  const [modal,      setModal]      = useState(null);
  const [addStep,    setAddStep]    = useState("type");
  const [addType,    setAddType]    = useState(null);
  const [form,       setForm]       = useState({amount:"",liters:"",fuelPrice:"",description:"",odometer:""});
  const [descErr,    setDescErr]    = useState(false);
  const [deleteId,   setDeleteId]   = useState(null);
  const [settingsFP, setSettingsFP] = useState("");
  const [pulse,      setPulse]      = useState(false);
  const [exporting,  setExporting]  = useState(false);
  const [maintAlertDismissed, setMaintAlertDismissed] = useState(false);

  const t = T[store.language];
  useEffect(()=>{ saveStore(store); document.documentElement.setAttribute("dir",t.dir); },[store]);

  const toggleLang = ()=>setStore(s=>({...s,language:s.language==="he"?"ar":"he"}));

  if (!store.car) return <Onboarding t={t} onLangToggle={toggleLang} onDone={car=>setStore(s=>({...s,car}))}/>;

  const thisMonth = getCurrentMonth();
  const monthExp  = store.expenses.filter(e=>e.month===thisMonth);
  const totals    = monthExp.reduce((acc,e)=>{acc[e.category]=(acc[e.category]||0)+e.amount;acc.total+=e.amount;return acc;},{fuel:0,maintenance:0,fixed:0,total:0});
  const recent    = [...monthExp].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,8);
  const cats      = ["fuel","maintenance","fixed"];
  const maxCat    = Math.max(...cats.map(c=>totals[c]),1);

  const openAdd   = ()=>{setAddStep("type");setAddType(null);setForm({amount:"",liters:"",fuelPrice:store.settings.defaultFuelPrice.toString(),description:"",odometer:""});setDescErr(false);setModal("add");};
  const fuelTotal = (()=>{const l=parseFloat(form.liters),p=parseFloat(form.fuelPrice);return(!isNaN(l)&&!isNaN(p)&&l>0)?l*p:null;})();

  // Maintenance & Fuel derived
  const maintInfo  = getMaintenanceStatus(store);
  const fuelEst    = calcFuelCost(store);
  const showMaintAlert = !maintAlertDismissed && (maintInfo.status === "due" || maintInfo.status === "overdue") && modal === null;

  const logService = () => {
    const km = maintInfo.currentKm || 0;
    const entry = { id: uid(), date: new Date().toISOString(), km, description: "Service logged" };
    setStore(s => ({ ...s, maintenance: [...(s.maintenance || []), entry] }));
    setMaintAlertDismissed(true);
  };

  const setFuelEfficiency = (val) => setStore(s => ({ ...s, fuelEfficiency: val }));

  const handleAdd = ()=>{
    if(addType==="maintenance"&&!form.description.trim()){setDescErr(true);return;}
    let amount=addType==="fuel"&&fuelTotal!==null?fuelTotal:parseFloat(form.amount);
    if(isNaN(amount)||amount<=0)return;
    const odo = form.odometer ? parseInt(form.odometer) : null;
    const expense={
      id:uid(), month:thisMonth, date:new Date().toISOString(), category:addType, amount,
      ...(odo ? { odometer: odo } : {}),
      ...(addType==="fuel"?{liters:parseFloat(form.liters)||null,pricePerLiter:parseFloat(form.fuelPrice)||null}:{}),
      ...(addType==="maintenance"?{description:form.description.trim()}:{}),
    };
    setStore(s=>({...s,expenses:[expense,...s.expenses]}));
    setPulse(true); setTimeout(()=>setPulse(false),600);
    setModal(null);
  };

  const handleExport  = async()=>{setExporting(true);try{await exportPDF(store,t);}finally{setExporting(false);}};
  const changeVehicle = ()=>{if(window.confirm(t.confirmChangeVehicle))setStore(initStore(store.language));};

  return (
    <div style={S.app(t.dir)}>

      {/* Header */}
      <header style={S.header}>
        <button onClick={()=>{setSettingsFP(store.settings.defaultFuelPrice.toString());setModal("settings");}} style={S.iconBtn}><GearIcon/></button>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1,gap:3}}>
          <span style={{fontSize:16,fontWeight:800,color:"#0F172A",letterSpacing:"-0.3px"}}>{t.appName}</span>
          <span onClick={changeVehicle} style={{fontSize:11,fontWeight:700,color:"#2563EB",background:"#EFF6FF",padding:"2px 10px",borderRadius:20,cursor:"pointer"}}>
            🚗 {store.car.number} · {store.car.model}
          </span>
        </div>
        <button onClick={toggleLang} style={S.langBtn}>{t.lang}</button>
      </header>

      {/* Hero */}
      <div style={{padding:"0 16px"}}>
        <div style={S.heroCard(pulse)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div>
              <p style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.7)",margin:"0 0 4px",letterSpacing:"0.5px"}}>{t.monthlyTotal}</p>
              <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                <span style={{fontSize:24,fontWeight:600,color:"rgba(255,255,255,0.85)"}}>{t.currency}</span>
                <span style={{fontSize:52,fontWeight:800,lineHeight:1,letterSpacing:"-3px",color:"#fff"}}>{fmtNum(totals.total)}</span>
              </div>
            </div>
            <button onClick={handleExport} disabled={exporting} style={{background:"rgba(255,255,255,0.18)",border:"1.5px solid rgba(255,255,255,0.38)",color:"#fff",borderRadius:14,padding:"9px 13px",display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer",fontSize:10,fontWeight:700,minWidth:58,fontFamily:"inherit"}}>
              <PdfIcon/>
              <span>{exporting?"...":t.exportPDF}</span>
            </button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.14)",borderRadius:12,padding:"9px 14px",marginBottom:10}}>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.72)",flex:1}}>{t.dailyCost}</span>
            <span style={{fontSize:19,fontWeight:700,color:"#fff"}}>{t.currency}{fmtDec(totals.total/30)}</span>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.55)"}}>{t.perDay}</span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,padding:"14px 16px 0"}}>
        {cats.map(cat=>{
          const col=CAT_COL[cat];
          const pct=totals.total>0?(totals[cat]/totals.total)*100:0;
          return(
            <div key={cat} style={{background:col.bg,borderRadius:16,padding:"14px 10px 12px",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <span style={{fontSize:20}}>{CAT_ICONS[cat]}</span>
              <span style={{fontSize:10,fontWeight:700,color:col.text,letterSpacing:"0.3px"}}>{t[cat]}</span>
              <span style={{fontSize:15,fontWeight:800,color:col.text,letterSpacing:"-0.5px"}}>{t.currency}{fmtNum(totals[cat])}</span>
              <div style={{width:"100%",height:4,background:"rgba(0,0,0,0.08)",borderRadius:4,overflow:"hidden",marginTop:3}}>
                <div style={{height:"100%",width:`${Math.min((totals[cat]/maxCat)*100,100)}%`,background:col.bar,borderRadius:4,transition:"width 0.5s ease"}}/>
              </div>
              <span style={{fontSize:10,fontWeight:600,color:col.text+"88"}}>{pct.toFixed(0)}%</span>
            </div>
          );
        })}
      </div>

      {/* ── Maintenance Status Card ── */}
      {maintInfo.status !== "unknown" && (
        <div style={{padding:"14px 16px 0"}}>
          <div style={{background:"#fff",borderRadius:18,padding:"14px 16px",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:14,background:maintInfo.status==="ok"?"#F0FDF4":maintInfo.status==="due"?"#FFFBEB":"#FFF1F2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
              {maintInfo.status==="ok"?"✅":maintInfo.status==="due"?"⚠️":"🔴"}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.3px",marginBottom:2}}>{t.maintStatus}</div>
              <div style={{fontSize:15,fontWeight:800,color:maintInfo.status==="ok"?"#15803D":maintInfo.status==="due"?"#B45309":"#DC2626"}}>
                {t[maintInfo.status==="ok"?"maintOk":maintInfo.status==="due"?"maintDue":"maintOverdue"]}
              </div>
              <div style={{fontSize:11,color:"#64748B",marginTop:2}}>
                {t.nextService}: {(maintInfo.nextServiceKm||0).toLocaleString()} {t.km}
                {maintInfo.remaining > 0 && ` (${maintInfo.remaining.toLocaleString()} ${t.km})`}
              </div>
            </div>
            <div style={{fontSize:10,fontWeight:600,color:"#CBD5E1",textAlign:"center",flexShrink:0}}>{t.serviceInterval}</div>
          </div>
        </div>
      )}

      {/* ── Fuel Estimate Card ── */}
      <div style={{padding:"14px 16px 0"}}>
        <div style={{background:"#fff",borderRadius:18,padding:"16px",boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.3px",marginBottom:10}}>{t.fuelEstTitle}</div>
          {/* Efficiency selector */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
            {[{val:16,label:t.fuelEfficient},{val:12,label:t.fuelAverage},{val:8,label:t.fuelHigh}].map(opt=>(
              <button key={opt.val} onClick={()=>setFuelEfficiency(opt.val)} style={{padding:"8px 4px",borderRadius:12,border:`2px solid ${store.fuelEfficiency===opt.val?"#3B82F6":"#E2E8F0"}`,background:store.fuelEfficiency===opt.val?"#EFF6FF":"#F8FAFC",color:store.fuelEfficiency===opt.val?"#1D4ED8":"#64748B",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",lineHeight:1.4,textAlign:"center"}}>
                {opt.label}
              </button>
            ))}
          </div>
          {fuelEst.monthlyFuel ? (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{background:"#EFF6FF",borderRadius:12,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:"#2563EB",fontWeight:600,marginBottom:3}}>{t.monthlyFuel}</div>
                <div style={{fontSize:20,fontWeight:800,color:"#1D4ED8"}}>{t.currency}{(fuelEst.monthlyFuel).toLocaleString()}</div>
              </div>
              <div style={{background:"#F0FDF4",borderRadius:12,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:"#15803D",fontWeight:600,marginBottom:3}}>{t.yearlyFuel}</div>
                <div style={{fontSize:20,fontWeight:800,color:"#15803D"}}>{t.currency}{(fuelEst.yearlyFuel).toLocaleString()}</div>
              </div>
            </div>
          ) : (
            <div style={{fontSize:12,color:"#94A3B8",textAlign:"center",padding:"8px 0"}}>{t.noOdoData}</div>
          )}
        </div>
      </div>
      <div style={{padding:"18px 16px 0"}}>
        <p style={{fontSize:11,fontWeight:700,color:"#94A3B8",marginBottom:10,letterSpacing:"0.8px",textTransform:"uppercase"}}>{t.recentEntries}</p>
        {recent.length===0?(
          <div style={{background:"#fff",borderRadius:16,padding:"28px 20px",textAlign:"center"}}>
            <p style={{fontSize:15,color:"#94A3B8",margin:"0 0 4px"}}>{t.noExpenses}</p>
            <p style={{fontSize:13,color:"#CBD5E1",margin:0}}>{t.addFirst}</p>
          </div>
        ):(
          <div style={{background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
            {recent.map((e,idx)=>{
              const col=CAT_COL[e.category];
              return(
                <div key={e.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderBottom:idx<recent.length-1?"1px solid #F1F5F9":"none"}}>
                  <div style={{width:36,height:36,borderRadius:10,background:col.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{CAT_ICONS[e.category]}</div>
                  <div style={{flex:1,display:"flex",flexDirection:"column",gap:1,minWidth:0,overflow:"hidden"}}>
                    <span style={{fontSize:13,fontWeight:700,color:col.text}}>{t[e.category]}</span>
                    {e.description&&<span style={{fontSize:12,color:"#334155",fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.description}</span>}
                    {e.liters&&<span style={{fontSize:11,color:"#94A3B8"}}>{e.liters}L × {t.currency}{e.pricePerLiter}</span>}
                    {e.odometer&&<span style={{fontSize:11,color:"#94A3B8"}}>🛣️ {e.odometer.toLocaleString()} {t.km}</span>}
                    <span style={{fontSize:11,color:"#CBD5E1"}}>{fmtDate(e.date)}</span>
                  </div>
                  <span style={{fontSize:15,fontWeight:700,color:"#0F172A",flexShrink:0}}>{t.currency}{fmtNum(e.amount)}</span>
                  <button onClick={()=>{setDeleteId(e.id);setModal("delete");}} style={{background:"none",border:"none",color:"#CBD5E1",fontSize:18,cursor:"pointer",padding:"0 0 0 4px",lineHeight:1}}>×</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{height:110}}/>

      {/* FAB */}
      <button onClick={openAdd} style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#1D4ED8,#3B82F6)",color:"#fff",border:"none",borderRadius:30,padding:"15px 28px",display:"flex",alignItems:"center",gap:8,cursor:"pointer",boxShadow:"0 6px 24px rgba(59,130,246,0.4)",zIndex:100,fontFamily:"inherit",fontSize:15,fontWeight:700}}>
        <span style={{fontSize:22,fontWeight:300}}>+</span>
        {t.addExpense}
      </button>

      {/* ── Maintenance Alert Modal ── */}
      {showMaintAlert && (
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.55)",backdropFilter:"blur(4px)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{direction:t.dir,background:"#fff",borderRadius:24,padding:"28px 24px",width:"100%",maxWidth:380,boxShadow:"0 24px 64px rgba(0,0,0,0.18)",animation:"fadeIn 0.2s ease"}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:52,marginBottom:12}}>🔧</div>
              <h2 style={{fontSize:20,fontWeight:800,color:"#0F172A",margin:"0 0 8px",letterSpacing:"-0.5px"}}>{t.maintAlert}</h2>
              <p style={{fontSize:14,color:"#64748B",margin:0}}>{t.maintQuestion}</p>
              {maintInfo.currentKm && (
                <p style={{fontSize:12,color:"#94A3B8",margin:"8px 0 0"}}>
                  {t.nextService}: {(maintInfo.nextServiceKm||0).toLocaleString()} {t.km} · {t.serviceInterval}
                </p>
              )}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <button onClick={()=>setMaintAlertDismissed(true)} style={{padding:"14px",background:"#F1F5F9",border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#64748B",cursor:"pointer",fontFamily:"inherit"}}>{t.no}</button>
              <button onClick={logService} style={{padding:"14px",background:"linear-gradient(135deg,#1D4ED8,#3B82F6)",border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:"inherit"}}>{t.yes}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.5)",backdropFilter:"blur(4px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setModal(null)}>
          <div style={{direction:t.dir,background:"#fff",borderRadius:"24px 24px 0 0",padding:"10px 20px 44px",width:"100%",maxWidth:430,animation:"slideUp 0.28s cubic-bezier(0.32,0.72,0,1)",boxShadow:"0 -4px 32px rgba(0,0,0,0.12)"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:"#E2E8F0",borderRadius:4,margin:"0 auto 18px"}}/>

            {/* Type chooser */}
            {modal==="add"&&addStep==="type"&&(<>
              <p style={S.sheetTitle}>{t.chooseType}</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
                {cats.map(cat=>{
                  const col=CAT_COL[cat];
                  return(
                    <button key={cat} onClick={()=>{setAddType(cat);setAddStep("form");}} style={{background:col.bg,border:`2px solid ${col.text}22`,borderRadius:16,padding:"18px 8px 14px",display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer",fontFamily:"inherit"}}>
                      <span style={{fontSize:28}}>{CAT_ICONS[cat]}</span>
                      <span style={{fontSize:12,fontWeight:700,color:col.text}}>{t[cat]}</span>
                    </button>
                  );
                })}
              </div>
              <button onClick={()=>setModal(null)} style={S.cancelBtn}>{t.cancel}</button>
            </>)}

            {/* Form */}
            {modal==="add"&&addStep==="form"&&(<>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <button onClick={()=>setAddStep("type")} style={{background:"#F1F5F9",border:"none",borderRadius:10,width:34,height:34,cursor:"pointer",fontSize:16,color:"#0F172A",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>←</button>
                <p style={{...S.sheetTitle,margin:0}}>{CAT_ICONS[addType]} {t[addType]}</p>
              </div>

              {addType==="maintenance"&&(<>
                <label style={S.fieldLabel}>{t.maintenanceDesc} <span style={{color:"#EF4444"}}>*</span></label>
                <input style={{...S.input,...(descErr?S.inputErr:{}),fontSize:15,fontWeight:500}} placeholder={t.maintenanceDescPlaceholder} value={form.description} onChange={e=>{setForm(f=>({...f,description:e.target.value}));setDescErr(false);}} autoFocus/>
                {descErr&&<p style={S.errMsg}>{t.maintenanceDescRequired}</p>}
                <div style={{height:4}}/>
              </>)}

              {addType==="fuel"?(<>
                <label style={S.fieldLabel}>{t.liters}</label>
                <input type="number" inputMode="decimal" placeholder="0.0" value={form.liters} onChange={e=>setForm(f=>({...f,liters:e.target.value}))} style={S.input} autoFocus={addType==="fuel"}/>
                <label style={S.fieldLabel}>{t.pricePerLiter}</label>
                <input type="number" inputMode="decimal" value={form.fuelPrice} onChange={e=>setForm(f=>({...f,fuelPrice:e.target.value}))} style={S.input}/>
                {fuelTotal!==null?(
                  <div style={{background:"#EFF6FF",borderRadius:14,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:14}}>
                    <span style={{fontSize:13,color:"#2563EB"}}>{t.totalFuel}</span>
                    <span style={{fontSize:24,fontWeight:800,color:"#1D4ED8"}}>{t.currency}{fmtDec(fuelTotal)}</span>
                  </div>
                ):(<>
                  <label style={S.fieldLabel}>{t.amount}</label>
                  <input type="number" inputMode="decimal" placeholder="0" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} style={S.input}/>
                </>)}
              </>):(<>
                <label style={S.fieldLabel}>{t.amount}</label>
                <input type="number" inputMode="decimal" placeholder="0" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} style={S.input} autoFocus={addType!=="maintenance"}/>
              </>)}

              {/* ── Odometer (optional) ── */}
              <label style={{...S.fieldLabel,marginTop:14}}>
                🛣️ {t.odometer}
                <span style={{fontSize:10,fontWeight:500,color:"#94A3B8",marginRight:6,marginLeft:6}}>({t.odometerOptional})</span>
              </label>
              <input
                type="number" inputMode="numeric"
                placeholder={t.odometerPlaceholder}
                value={form.odometer}
                onChange={e=>setForm(f=>({...f,odometer:e.target.value}))}
                style={{...S.input,fontSize:16}}
              />

              <button onClick={handleAdd} style={S.addBtn(true)}>{t.add}</button>
              <button onClick={()=>setModal(null)} style={S.cancelBtn}>{t.cancel}</button>
            </>)}

            {/* Settings */}
            {modal==="settings"&&(<>
              <p style={S.sheetTitle}>{t.settings}</p>
              <label style={S.fieldLabel}>{t.defaultFuelPrice} ({t.currency}/L)</label>
              <input type="number" inputMode="decimal" value={settingsFP} onChange={e=>setSettingsFP(e.target.value)} style={S.input} autoFocus/>
              <button onClick={()=>{const p=parseFloat(settingsFP);if(!isNaN(p)&&p>0)setStore(s=>({...s,settings:{...s.settings,defaultFuelPrice:p}}));setModal(null);}} style={S.addBtn(true)}>{t.save}</button>
              <div style={{borderTop:"1px solid #F1F5F9",marginTop:16,paddingTop:12}}>
                <button onClick={()=>{setModal(null);setTimeout(changeVehicle,100);}} style={{...S.cancelBtn,color:"#EF4444"}}>🔄 {t.changeVehicle}</button>
              </div>
            </>)}

            {/* Delete */}
            {modal==="delete"&&(<>
              <p style={{...S.sheetTitle,textAlign:"center"}}>{t.confirmDelete}</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:8}}>
                <button onClick={()=>setModal(null)} style={{padding:"14px",background:"#F1F5F9",border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#64748B",cursor:"pointer",fontFamily:"inherit"}}>{t.no}</button>
                <button onClick={()=>{setStore(s=>({...s,expenses:s.expenses.filter(e=>e.id!==deleteId)}));setModal(null);setDeleteId(null);}} style={{padding:"14px",background:"#FEE2E2",border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#DC2626",cursor:"pointer",fontFamily:"inherit"}}>{t.yes}</button>
              </div>
            </>)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function GearIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
}
function PdfIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  app: d=>({ direction:d,minHeight:"100vh",background:"#F4F6FB",fontFamily:"'Segoe UI','Helvetica Neue',Arial,sans-serif",maxWidth:430,margin:"0 auto",position:"relative" }),
  header: { display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px 10px",background:"#fff",borderBottom:"1px solid #EEF0F4",gap:8 },
  iconBtn: { background:"none",border:"none",cursor:"pointer",color:"#64748B",padding:6,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center" },
  langBtn: { background:"#EFF6FF",border:"none",color:"#2563EB",fontSize:12,fontWeight:700,padding:"6px 12px",borderRadius:20,cursor:"pointer",fontFamily:"inherit" },
  heroCard: p=>({ background:"linear-gradient(135deg,#1D4ED8 0%,#3B82F6 55%,#60A5FA 100%)",borderRadius:22,padding:"22px 20px 18px",marginTop:16,boxShadow:"0 8px 32px rgba(59,130,246,0.28)",transform:p?"scale(1.015)":"scale(1)",transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)" }),
  sheetTitle: { fontSize:18,fontWeight:800,color:"#0F172A",margin:"0 0 18px",letterSpacing:"-0.3px" },
  fieldLabel: { display:"block",fontSize:12,fontWeight:700,color:"#64748B",marginBottom:6,marginTop:10,letterSpacing:"0.3px" },
  input: { width:"100%",padding:"13px 14px",fontSize:20,fontWeight:700,color:"#0F172A",background:"#F8FAFC",border:"2px solid #E2E8F0",borderRadius:14,outline:"none",boxSizing:"border-box",transition:"border-color 0.15s",fontFamily:"inherit",textAlign:"inherit" },
  inputErr: { borderColor:"#FCA5A5",background:"#FFF5F5" },
  errMsg: { fontSize:12,color:"#EF4444",margin:"4px 0 0",fontWeight:600 },
  addBtn: a=>({ width:"100%",padding:"15px",background:a?"linear-gradient(135deg,#1D4ED8,#3B82F6)":"#E2E8F0",color:a?"#fff":"#94A3B8",border:"none",borderRadius:16,fontSize:16,fontWeight:800,cursor:a?"pointer":"default",marginTop:18,fontFamily:"inherit" }),
  cancelBtn: { width:"100%",padding:"13px",background:"none",color:"#94A3B8",border:"none",fontSize:15,fontWeight:600,cursor:"pointer",marginTop:6,fontFamily:"inherit" },
};

if (typeof document !== "undefined") {
  const s = document.createElement("style");
  s.textContent = `
    @keyframes slideUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin     { to{transform:rotate(360deg)} }
    * { -webkit-tap-highlight-color:transparent; box-sizing:border-box }
    body { margin:0; background:#F4F6FB }
    input:focus { border-color:#3B82F6!important; box-shadow:0 0 0 4px rgba(59,130,246,0.12)!important }
    button:active { opacity:0.85 }
  `;
  document.head.appendChild(s);
}
