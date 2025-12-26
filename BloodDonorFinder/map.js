// map.js (module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAyXu14PCVSGq3fiXAxo4Ztr_lSS5Bwp6Q",
  authDomain: "blooddonorfinder-430f2.firebaseapp.com",
  databaseURL: "https://blooddonorfinder-430f2-default-rtdb.firebaseio.com",
  projectId: "blooddonorfinder-430f2",
  storageBucket: "blooddonorfinder-430f2.firebasestorage.app",
  messagingSenderId: "825196202463",
  appId: "1:825196202463:web:4c181548e3e2f1c6a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const map = L.map('map').setView([20.5937,78.9629],5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution:'© OpenStreetMap contributors'
}).addTo(map);

async function loadMarkers(){
  try{
    const snap = await get(ref(db,'donors'));
    if(!snap.exists()){
      alert('No donors to display on map.');
      return;
    }
    const data = snap.val();
    const latlngs = [];
    for(const k in data){
      const d = data[k];
      if(d.latitude && d.longitude){
        const lat = parseFloat(d.latitude);
        const lng = parseFloat(d.longitude);
        if(isFinite(lat) && isFinite(lng)){
          const marker = L.marker([lat,lng]).addTo(map);
          const phoneDigits = (d.phone||'').replace(/\D/g,'');
          const whatsappMsg = encodeURIComponent(`Hi ${d.name||''}, there is an urgent need for ${d.bloodGroup||''} blood in ${d.city||''}. Please reply if you can help.`);
          const wa = `https://wa.me/${phoneDigits}?text=${whatsappMsg}`;
          marker.bindPopup(`<b>${d.name}</b><br>${d.bloodGroup || ''}<br>${d.city || ''}<br><a href="tel:${phoneDigits}">Call</a> · <a href="${wa}" target="_blank">WhatsApp</a>`);
          latlngs.push([lat,lng]);
        }
      }
    }
    if(latlngs.length>0){
      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds.pad(0.3));
    }
  }catch(err){
    console.error(err);
    alert('Error loading map data: ' + (err.message||err));
  }
}

loadMarkers();
