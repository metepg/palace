const $ = (id) => document.getElementById(id);

/* ================= Drawer ================= */
const drawer = $("drawer");
const menuBtn = $("menuBtn");
const closeDrawer = $("closeDrawer");

function openDrawer() {
  drawer.style.display = "block";
  drawer.setAttribute("aria-hidden", "false");
}

function hideDrawer() {
  drawer.style.display = "none";
  drawer.setAttribute("aria-hidden", "true");
}

menuBtn?.addEventListener("click", openDrawer);
closeDrawer?.addEventListener("click", hideDrawer);
drawer?.addEventListener("click", (e) => {
  if (e.target === drawer) hideDrawer();
});

/* ================= Toast ================= */
const toast = $("toast");
const toastTitle = $("toastTitle");
const toastMsg = $("toastMsg");
const toastClose = $("toastClose");

let toastTimer = null;

function showToast(title, msg) {
  toastTitle.textContent = title;
  toastMsg.textContent = msg;
  toast.style.display = "block";
  $("name").value = "";
  $("datetime").value = "";
}

toastClose.addEventListener("click", () => toast.style.display = "none");

/* ================= Reservation ================= */
function submitReservation() {
  const name = $("name").value.trim() || "Vierailija";
  const dtValue = $("datetime").value;
  if (!dtValue) return;

  const dt = new Date(dtValue);

  showToast(
    "Varaus hyväksytty",
    `Nimi: ${name} • Aika: ${dt.toLocaleString("fi-FI")}`
  );

  const btn = $("calendarBtn");
  btn.style.display = "inline-flex";
  btn.onclick = () => downloadICS(name, dt);
}

function downloadICS(name, date) {
  const start = date.toISOString().replace(/[-:]/g, "").split(".")[0];
  const end = new Date(date.getTime() + 60 * 60 * 1000)
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0];

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Varaus
DTSTART:${start}Z
DTEND:${end}Z
DESCRIPTION:Varaus nimellä ${name}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "varaus.ics";
  a.click();
}

$("reserveSubmit").addEventListener("click", submitReservation);

$("reserveBtn")?.addEventListener("click", () => {
  $("reserveSection")?.scrollIntoView({ behavior: "smooth" });
});

$("drawerReserveBtn")?.addEventListener("click", () => {
  hideDrawer();
  $("reserveSection")?.scrollIntoView({ behavior: "smooth" });
});

$("scrollMenuBtn")?.addEventListener("click", () => {
  $("menu")?.scrollIntoView({ behavior: "smooth" });
});

$("reserveSubmit")?.addEventListener("click", submitReservation);

/* ================= Open status ================= */
function minutes(hm) {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

const hours = {
  1: ["5:45", "21:00"],
  2: ["5:45", "21:00"],
  3: ["5:45", "21:00"],
  4: ["5:45", "21:00"],
  5: ["5:45", "21:30"],
  6: ["5:45", "22:30"],
  0: ["5:45", "21:30"],
};

function setOpenStatus() {
  const now = new Date();
  const dow = now.getDay();
  const [open, close] = hours[dow];

  const nowMin = now.getHours() * 60 + now.getMinutes();
  const isOpen = nowMin >= minutes(open) && nowMin < minutes(close);

  $("openStatus").textContent = isOpen
    ? `Auki nyt (Sulkeutuu ${close})`
    : `Suljettu (Avataan ${open})`;

  $("openBadge").textContent = isOpen ? "Auki" : "Suljettu";
}

setOpenStatus();
setInterval(setOpenStatus, 60_000);

/* ================= Theme ================= */
let holiday = true;
$("themeBtn")?.addEventListener("click", () => {
  holiday = !holiday;
  document.documentElement.style.setProperty("--bg0", holiday ? "#0b0a0a" : "#070707");
  document.documentElement.style.setProperty("--bg1", holiday ? "#121010" : "#0d0b0b");
  document.documentElement.style.setProperty("--red", holiday ? "#c1121f" : "#e11d2e");
  document.documentElement.style.setProperty("--red2", holiday ? "#a10f1a" : "#b0121f");

  showToast(
    "Teema",
    holiday
      ? "Joulun punainen teema käytössä."
      : "Kirkkaampi punainen teema käytössä."
  );
});

/* ================= Footer ================= */
$("year").textContent = new Date().getFullYear();

/* ================= Form validation ================= */
const nameInput = $("name");
const timeInput = $("datetime");
const submitBtn = $("reserveSubmit");

function updateSubmitState() {
  submitBtn.disabled =
    nameInput.value.trim() === "" ||
    timeInput.value.trim() === "";
}

nameInput.addEventListener("input", updateSubmitState);
timeInput.addEventListener("input", updateSubmitState);
updateSubmitState();

/* ================= GATE (AUTO) ================= */
const gate = $("gate");
const gateInput = $("gateInput");
const gateError = $("gateError");

let gateErrorTimer = null;
const PASSWORD = "testi";

function unlockGate() {
  document.body.classList.add("reveal");
  gate.classList.add("fade-out");
  setTimeout(() => gate.remove(), 500);
}

gateInput.addEventListener("input", () => {
  if (gateInput.value === PASSWORD) {
    unlockGate();
    return;
  }

  if (gateInput.value.length >= PASSWORD.length) {
    gateError.style.display = "block";
    gateInput.value = "";
    clearTimeout(gateErrorTimer);
    gateErrorTimer = setTimeout(() => {
      gateError.style.display = "none";
    }, 5000);
  }
});
