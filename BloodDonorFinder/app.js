// app.js (module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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

function isValidPhone(p){
  const s = (p||'').replace(/\D/g,'');
  return /^\d{7,15}$/.test(s);
}

const form = document.getElementById('registerForm');
if(form){
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = (document.getElementById('name').value||'').trim();
    const age = (document.getElementById('age').value||'').trim();
    const bloodGroup = (document.getElementById('bloodGroup').value||'').trim().toUpperCase();
    const phone = (document.getElementById('phone').value||'').trim();
    const city = (document.getElementById('city').value||'').trim();
    const latitude = document.getElementById('latitude').value || null;
    const longitude = document.getElementById('longitude').value || null;

    if(!name || !bloodGroup || !phone || !city){
      alert('Please fill all required fields.');
      return;
    }
    if(!isValidPhone(phone)){
      alert('Please enter a valid phone number (digits only).');
      return;
    }

    try{
      const donorsRef = ref(db,'donors');
      const newRef = push(donorsRef);
      await set(newRef,{
        name, age, bloodGroup, phone, city,
        latitude: latitude || null,
        longitude: longitude || null,
        createdAt: Date.now()
      });
      alert('Donor registered successfully!');
      form.reset();
    }catch(err){
      console.error(err);
      alert('Error registering donor: ' + (err.message || err));
    }
  });
}
