const $ = (id) => document.getElementById(id);

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

// Toast
const toast = $("toast");
const toastTitle = $("toastTitle");
const toastMsg = $("toastMsg");
const toastClose = $("toastClose");

let toastTimer = null;

function showToast(title, msg) {
  toastTitle.textContent = title;
  toastMsg.textContent = msg;
  toast.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.style.display = "none", 10000);
  $("name").value = "";
  $("time").value = "";
}

toastClose.addEventListener("click", () => toast.style.display = "none");

// Fake reservation
function submitReservation() {
  const name = $("name").value.trim() || "Vierailija";
  const time = $("time").value.trim() || "—";
  showToast("Varaus hyväksytty", `Nimi: ${name} • Aika: ${time}`);
}

$("reserveBtn")?.addEventListener("click", () => {
  document.querySelector("#reserveSection")
    ?.scrollIntoView({ behavior: "smooth" });
});

$("drawerReserveBtn")?.addEventListener("click", () => {
  hideDrawer();
  document.querySelector("#reserveSection")
    ?.scrollIntoView({ behavior: "smooth" });
});

$("scrollMenuBtn")?.addEventListener("click", () => {
  document.querySelector("#menu")
    ?.scrollIntoView({ behavior: "smooth" });
});

$("reserveSubmit")?.addEventListener("click", submitReservation);

// Open/closed indicator (local time on client)
function minutes(hm) {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

// Simple hours map; adjust freely.
const hours = {
  1: ["5:45", "21:00"], // Mon
  2: ["5:45", "21:00"], // Tue
  3: ["5:45", "21:00"], // Wed
  4: ["5:45", "21:00"], // Thu
  5: ["5:45", "21:30"], // Fri
  6: ["5:45", "22:30"], // Sat
  0: ["5:45", "21:30"], // Sun
};

function setOpenStatus() {
  const now = new Date();
  const dow = now.getDay();
  const open = hours[dow][0];
  const close = hours[dow][1];

  const nowMin = now.getHours() * 60 + now.getMinutes();
  const isOpen = nowMin >= minutes(open) && nowMin < minutes(close);

  $("openStatus").textContent = isOpen
    ? `Auki nyt (Sulkeutuu ${close})`
    : `Suljettu (Avataan ${open})`;

  $("openBadge").textContent = isOpen ? "Auki" : "Suljettu";
  $("openBadge").style.borderColor = isOpen
    ? "rgba(110,231,183,.25)"
    : "rgba(193,18,31,.45)";
  $("openBadge").style.background = isOpen
    ? "rgba(110,231,183,.08)"
    : "rgba(193,18,31,.12)";
}

setOpenStatus();
setInterval(setOpenStatus, 60_000);

// Theme toggle
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

// Footer year
$("year").textContent = new Date().getFullYear();

// Smooth close drawer on link click
document.querySelectorAll(".drawer-link").forEach(a => {
  a.addEventListener("click", () => hideDrawer());
});
const nameInput = $("name");
const timeInput = $("time");
const submitBtn = $("reserveSubmit");

function updateSubmitState() {
  const valid =
    nameInput.value.trim() !== "" &&
    timeInput.value.trim() !== "";
  submitBtn.disabled = !valid;
}

nameInput.addEventListener("input", updateSubmitState);
timeInput.addEventListener("input", updateSubmitState);

const gate = document.getElementById("gate");
const gateInput = document.getElementById("gateInput");

gateInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && gateInput.value === "testi") {
    gate.remove();
  }
});

const gateError = document.getElementById("gateError");

let gateErrorTimer = null;

gateInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  if (gateInput.value === "testi") {
    gate.remove();
  } else {
    gateError.style.display = "block";
    gateInput.value = "";

    clearTimeout(gateErrorTimer);
    gateErrorTimer = setTimeout(() => {
      gateError.style.display = "none";
    }, 5_000);
  }
});

gateInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  if (gateInput.value === "testi") {
    document.body.classList.add("reveal");
    gate.classList.add("fade-out");
    setTimeout(() => gate.remove(), 2000);
  } else {
    gateError.style.display = "block";
    gateInput.value = "";

    clearTimeout(gateErrorTimer);
    gateErrorTimer = setTimeout(() => {
      gateError.style.display = "none";
    }, 10_000);
  }
});

// init on load
updateSubmitState();
