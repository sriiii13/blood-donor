// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAyXu14PCVSGq3fiXAxo4Ztr_lSS5Bwp6Q",
  authDomain: "blooddonorfinder-430f2.firebaseapp.com",
  databaseURL: "https://blooddonorfinder-430f2-default-rtdb.firebaseio.com",
  projectId: "blooddonorfinder-430f2",
  storageBucket: "blooddonorfinder-430f2.firebasestorage.app",
  messagingSenderId: "825196202463",
  appId: "1:825196202463:web:4c181548e7d08a3e2f1c6a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const donorList = document.getElementById("donorList");
const searchInput = document.getElementById("searchInput");

// Fetch donors
const donorsRef = ref(db, "donors");
onValue(donorsRef, (snapshot) => {
  donorList.innerHTML = "";
  const donors = snapshot.val();

  if (donors) {
    Object.keys(donors).forEach((key) => {
      const d = donors[key];
      createDonorCard(d);
    });
  } else {
    donorList.innerHTML = `<p style="text-align:center;color:#888;">No donors found 🩸</p>`;
  }
});

// Create donor card
function createDonorCard(donor) {
  const card = document.createElement("div");
  card.classList.add("donor-card");

  card.innerHTML = `
    <div class="blood-group">${donor.bloodGroup || "?"}</div>
    <h3>${donor.name || "Unknown"}</h3>
    <p>📍 ${donor.city || "Not provided"}</p>
    <p>📞 ${donor.phone || "N/A"}</p>
    <p>📧 ${donor.email || "No email"}</p>
    <button class="sos-btn" onclick="sendSOS('${donor.phone}', '${donor.name}', '${donor.bloodGroup}')">
      <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp"/> Send SOS
    </button>
  `;

  donorList.appendChild(card);
}

// Search filter
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll(".donor-card");
  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(term) ? "block" : "none";
  });
});

// Send WhatsApp SOS
window.sendSOS = function(phone, name, bloodGroup) {
  const msg = `🩸 Hello ${name}, someone urgently needs ${bloodGroup} blood. Can you help? - LifeSaver App`;
  const whatsappURL = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
  window.open(whatsappURL, "_blank");
}
