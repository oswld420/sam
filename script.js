const password = 'te amo sam';

const defaultPhrases = [
  'Te amo más de lo que las palabras pueden explicar.',
  'Cada día contigo se siente como un sueño hermoso que no quiero despertar.',
  'Eres mi lugar favorito, mi paz y mi mayor alegría.',
  'Contigo, el mundo se vuelve más suave, más brillante y más lleno de amor.',
  'No hay nada que quiera más que seguir amándote como lo hago ahora.',
  'Eres la persona que hace que mi corazón se sienta en casa.',
  'Te quiero con todo mi ser, hoy, mañana y siempre.'
];

const storageKeys = {
  note: 'love-note-sam',
  photos: 'love-photos-sam',
  videos: 'love-videos-sam',
  phrases: 'love-phrases-sam'
};

const loginOverlay = document.getElementById('loginOverlay');
const app = document.getElementById('app');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');

const noteArea = document.getElementById('loveNote');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const clearNoteBtn = document.getElementById('clearNoteBtn');

const phraseDisplay = document.getElementById('phraseDisplay');
const newPhraseBtn = document.getElementById('newPhraseBtn');
const saveCustomPhraseBtn = document.getElementById('saveCustomPhraseBtn');
const customPhraseInput = document.getElementById('customPhraseInput');

const photoInput = document.getElementById('photoInput');
const photoGallery = document.getElementById('photoGallery');
const videoInput = document.getElementById('videoInput');
const videoGrid = document.getElementById('videoGrid');

function loadSavedNote() {
  const saved = localStorage.getItem(storageKeys.note);
  if (saved) noteArea.value = saved;
}

function saveNote() {
  localStorage.setItem(storageKeys.note, noteArea.value);
  showFlash('Mensaje guardado con amor 💖');
}

function clearNote() {
  noteArea.value = '';
  localStorage.removeItem(storageKeys.note);
  showFlash('Mensaje borrado ✨');
}

function loadPhrases() {
  const saved = JSON.parse(localStorage.getItem(storageKeys.phrases) || 'null');
  if (Array.isArray(saved) && saved.length) {
    return saved;
  }
  localStorage.setItem(storageKeys.phrases, JSON.stringify(defaultPhrases));
  return [...defaultPhrases];
}

let phraseList = loadPhrases();

function showRandomPhrase() {
  const random = phraseList[Math.floor(Math.random() * phraseList.length)];
  phraseDisplay.textContent = random;
}

function saveCustomPhrase() {
  const value = customPhraseInput.value.trim();
  if (!value) {
    showFlash('Escribe una frase antes de guardarla 💗');
    return;
  }

  phraseList.push(value);
  localStorage.setItem(storageKeys.phrases, JSON.stringify(phraseList));
  customPhraseInput.value = '';
  showRandomPhrase();
  showFlash('Frase guardada con cariño 💕');
}

function showFlash(message) {
  const original = phraseDisplay.textContent;
  phraseDisplay.textContent = message;
  setTimeout(() => {
    if (phraseDisplay.textContent === message) {
      phraseDisplay.textContent = original;
    }
  }, 1400);
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const typed = (passwordInput.value || '').trim().toLowerCase();

  if (typed === password) {
    loginOverlay.classList.add('hidden');
    app.classList.remove('hidden');
    return;
  }

  loginError.textContent = 'Contraseña incorrecta. Intenta de nuevo.';
  passwordInput.value = '';
}

function renderPhotos() {
  const photos = JSON.parse(localStorage.getItem(storageKeys.photos) || '[]');
  photoGallery.innerHTML = '';

  photos.forEach((src) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `<img src="${src}" alt="Foto de amor" />`;
    photoGallery.appendChild(item);
  });
}

function handlePhotoUpload(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  const promiseList = files.map((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  });

  Promise.all(promiseList)
    .then((images) => {
      const existing = JSON.parse(localStorage.getItem(storageKeys.photos) || '[]');
      const next = [...existing, ...images];
      localStorage.setItem(storageKeys.photos, JSON.stringify(next));
      renderPhotos();
      showFlash('Fotos guardadas 💖');
      photoInput.value = '';
    })
    .catch(() => {
      showFlash('No se pudieron cargar las fotos 😕');
    });
}

function renderVideos() {
  const videos = JSON.parse(localStorage.getItem(storageKeys.videos) || '[]');
  videoGrid.innerHTML = '';

  videos.forEach((src) => {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `<video src="${src}" controls playsinline></video>`;
    videoGrid.appendChild(card);
  });
}

function handleVideoUpload(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  const promiseList = files.map((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  });

  Promise.all(promiseList)
    .then((videos) => {
      const existing = JSON.parse(localStorage.getItem(storageKeys.videos) || '[]');
      const next = [...existing, ...videos];
      localStorage.setItem(storageKeys.videos, JSON.stringify(next));
      renderVideos();
      showFlash('Videos guardados 🎬');
      videoInput.value = '';
    })
    .catch(() => {
      showFlash('No se pudieron cargar los videos 😕');
    });
}

loginForm.addEventListener('submit', handleLoginSubmit);
saveNoteBtn.addEventListener('click', saveNote);
clearNoteBtn.addEventListener('click', clearNote);
newPhraseBtn.addEventListener('click', showRandomPhrase);
saveCustomPhraseBtn.addEventListener('click', saveCustomPhrase);
photoInput.addEventListener('change', handlePhotoUpload);
videoInput.addEventListener('change', handleVideoUpload);

loadSavedNote();
renderPhotos();
renderVideos();
showRandomPhrase();
