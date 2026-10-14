const PASSWORD = 'te amo sam';

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

document.body.classList.add('no-scroll');

function loadSavedNote() {
  const saved = localStorage.getItem(storageKeys.note);
  if (saved) noteArea.value = saved;
}

function saveNote() {
  localStorage.setItem(storageKeys.note, noteArea.value);
  flashMessage('Mensaje guardado con amor 💖');
}

function clearNote() {
  noteArea.value = '';
  localStorage.removeItem(storageKeys.note);
  flashMessage('Mensaje borrado ✨');
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
  if (!phraseList || !phraseList.length) return;
  const random = phraseList[Math.floor(Math.random() * phraseList.length)];
  phraseDisplay.textContent = random;
}

function saveCustomPhrase() {
  const value = customPhraseInput.value.trim();
  if (!value) {
    flashMessage('Escribe una frase antes de guardarla 💗');
    return;
  }

  phraseList.push(value);
  localStorage.setItem(storageKeys.phrases, JSON.stringify(phraseList));
  customPhraseInput.value = '';
  showRandomPhrase();
  flashMessage('Frase guardada con cariño 💕');
}

function flashMessage(message) {
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

  if (typed === PASSWORD.toLowerCase()) {
    loginError.textContent = '';
    loginOverlay.classList.add('hidden');
    app.classList.remove('hidden');
    app.classList.add('visible');
    document.body.classList.remove('no-scroll');
    app.setAttribute('aria-hidden', 'false');
    passwordInput.value = '';
    return;
  }

  loginError.textContent = 'Contraseña incorrecta. Intenta de nuevo.';
  loginForm.classList.remove('shake');
  void loginForm.offsetWidth;
  loginForm.classList.add('shake');
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
      flashMessage('Fotos guardadas 💖');
      photoInput.value = '';
    })
    .catch(() => {
      flashMessage('No se pudieron cargar las fotos 😕');
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
      flashMessage('Videos guardados 🎬');
      videoInput.value = '';
    })
    .catch(() => {
      flashMessage('No se pudieron cargar los videos 😕');
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
passwordInput.focus();
