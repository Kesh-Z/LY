/**
 * ========================================================
 * 1 MONTH ANNIVERSARY SURPRISE - SCRIPT (script.js)
 * Interactive envelope opening, romantic melodies,
 * photo lightbox, floating hearts, and customizable text
 * ========================================================
 */

// Global Audio Context for Sweet Romantic Music Box
let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;
let currentNoteIndex = 0;

// Gentle romantic melody notes (Canon in D / Romantic Music Box style)
const romanticMelody = [
  { note: 523.25, dur: 0.6 }, // C5
  { note: 659.25, dur: 0.6 }, // E5
  { note: 783.99, dur: 0.6 }, // G5
  { note: 659.25, dur: 0.6 }, // E5
  { note: 587.33, dur: 0.6 }, // D5
  { note: 698.46, dur: 0.6 }, // F5
  { note: 880.00, dur: 0.6 }, // A5
  { note: 698.46, dur: 0.6 }, // F5
  { note: 659.25, dur: 0.6 }, // E5
  { note: 783.99, dur: 0.6 }, // G5
  { note: 1046.50, dur: 0.9 }, // C6
  { note: 987.77, dur: 0.5 }, // B5
  { note: 880.00, dur: 0.6 }, // A5
  { note: 783.99, dur: 0.6 }, // G5
  { note: 659.25, dur: 0.6 }, // E5
  { note: 587.33, dur: 0.8 }, // D5
];

document.addEventListener('DOMContentLoaded', () => {
  initEnvelopeInteraction();
  initPhotoLightbox();
  initLoveCounter();
  initCustomizableMessage();
  checkUrlParams();
});

/* ========================================================
   Floating Hearts Background Generator (Disabled)
   ======================================================== */
function initFloatingHearts() {
  // Disabled as requested
}

/* ========================================================
   Envelope Opening Sequence
   ======================================================== */
function initEnvelopeInteraction() {
  const envelope = document.getElementById('envelopeAssembly');
  const openBtn = document.getElementById('openEnvelopeBtn');
  const envelopeView = document.getElementById('envelopeView');
  const revealView = document.getElementById('revealView');
  const replayBtn = document.getElementById('replayBtn');

  if (!envelope || !envelopeView || !revealView) return;

  function openEnvelope() {
    if (envelope.classList.contains('opening')) return;

    envelope.classList.add('opening');

    // Burst confetti/hearts from center
    burstHeartConfetti();

    // After animation, transition to the reveal stage
    setTimeout(() => {
      envelopeView.classList.add('hidden');
      revealView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1100);
  }

  envelope.addEventListener('click', openEnvelope);
  if (openBtn) {
    openBtn.addEventListener('click', openEnvelope);
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      revealView.classList.remove('active');
      envelopeView.classList.remove('hidden');
      envelope.classList.remove('opening');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ========================================================
   Confetti & Hearts Burst Animation
   ======================================================== */
function burstHeartConfetti() {
  const hearts = ['❤️', '💖', '💕', '🌹', '✨', '💐'];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < 28; i++) {
    const burstItem = document.createElement('div');
    burstItem.innerText = hearts[Math.floor(Math.random() * hearts.length)];
    burstItem.style.position = 'fixed';
    burstItem.style.left = centerX + 'px';
    burstItem.style.top = centerY + 'px';
    burstItem.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
    burstItem.style.pointerEvents = 'none';
    burstItem.style.zIndex = '999';
    burstItem.style.transition = 'all 1.2s cubic-bezier(0.1, 0.8, 0.3, 1)';

    document.body.appendChild(burstItem);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 250 + 100;
    const destX = centerX + Math.cos(angle) * distance;
    const destY = centerY + Math.sin(angle) * distance - 80;

    requestAnimationFrame(() => {
      burstItem.style.transform = `translate(${destX - centerX}px, ${destY - centerY}px) scale(${Math.random() * 0.8 + 0.8}) rotate(${Math.random() * 360}deg)`;
      burstItem.style.opacity = '0';
    });

    setTimeout(() => burstItem.remove(), 1300);
  }
}

/* ========================================================
   Audio Synthesis (Zero-dependency Romantic Music Box)
   ======================================================== */
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playChimeSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Play sweet celestial chime chord (F# - A - C# - E)
    [587.33, 739.99, 880.00, 1174.66].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.5);
    });
  } catch (e) {
    console.log("Audio autoplay prevented or unsupported");
  }
}

function playNextMelodyNote() {
  if (!isMusicPlaying) return;

  try {
    const ctx = getAudioContext();
    const item = romanticMelody[currentNoteIndex];
    currentNoteIndex = (currentNoteIndex + 1) % romanticMelody.length;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Gentle music box tone (sine + harmonic richness)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(item.note, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + item.dur * 1.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + item.dur * 1.8);

    musicInterval = setTimeout(playNextMelodyNote, item.dur * 1000);
  } catch (e) {
    console.log("Melody play failed", e);
  }
}

function toggleMusic() {
  const btn = document.getElementById('musicToggleBtn');
  const icon = document.getElementById('musicIcon');
  const text = document.getElementById('musicText');

  if (isMusicPlaying) {
    isMusicPlaying = false;
    clearTimeout(musicInterval);
    if (btn) btn.classList.remove('playing');
    if (icon) icon.innerText = '🎵';
    if (text) text.innerText = 'Play Music';
  } else {
    isMusicPlaying = true;
    getAudioContext();
    playNextMelodyNote();
    if (btn) btn.classList.add('playing');
    if (icon) icon.innerText = '⏸️';
    if (text) text.innerText = 'Pause Music';
  }
}

function initMusicToggle() {
  const btn = document.getElementById('musicToggleBtn');
  if (btn) {
    btn.addEventListener('click', toggleMusic);
  }
}

/* ========================================================
   Photo Lightbox Modal
   ======================================================== */
function initPhotoLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');

  if (!modal || !modalImg) return;

  document.querySelectorAll('.polaroid-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.polaroid-img');
      const caption = card.querySelector('.polaroid-caption');
      
      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || "Our Moment";
      }
      if (modalCaption && caption) {
        modalCaption.innerText = caption.innerText;
      }
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* ========================================================
   Live Love Counter (1 Month Together)
   ======================================================== */
function initLoveCounter() {
  const daysEl = document.getElementById('counterDays');
  const hoursEl = document.getElementById('counterHours');
  const minutesEl = document.getElementById('counterMinutes');

  if (!daysEl) return;

  // Milestone: 1 month anniversary (30 days)
  let baseDays = 30;
  let baseHours = baseDays * 24;
  let baseMinutes = baseHours * 60;

  daysEl.innerText = baseDays;
  if (hoursEl) hoursEl.innerText = baseHours;
  if (minutesEl) minutesEl.innerText = baseMinutes.toLocaleString();
}

/* ========================================================
   Customizable Message Editor (Stored in LocalStorage)
   ======================================================== */
function initCustomizableMessage() {
  const editBtn = document.getElementById('editMessageBtn');
  const editModal = document.getElementById('editModal');
  const saveBtn = document.getElementById('saveMessageBtn');
  const cancelBtn = document.getElementById('cancelEditBtn');
  const textarea = document.getElementById('messageTextarea');
  const messageBody = document.getElementById('letterBodyText');

  if (!editBtn || !editModal || !textarea || !messageBody) return;

  // Load from localStorage if previously edited
  const savedMessage = localStorage.getItem('anniversary_letter_content');
  if (savedMessage) {
    messageBody.innerHTML = savedMessage;
  }

  editBtn.addEventListener('click', () => {
    // Populate textarea with plain text from paragraphs
    const paragraphs = Array.from(messageBody.querySelectorAll('p')).map(p => p.innerText);
    textarea.value = paragraphs.join('\n\n');
    editModal.classList.add('active');
  });

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      editModal.classList.remove('active');
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const rawText = textarea.value.trim();
      if (rawText) {
        const pTags = rawText.split('\n\n')
          .filter(t => t.trim().length > 0)
          .map(t => `<p>${t.replace(/\n/g, '<br>')}</p>`)
          .join('');
        
        messageBody.innerHTML = pTags;
        localStorage.setItem('anniversary_letter_content', pTags);
      }
      editModal.classList.remove('active');
    });
  }
}

/* ========================================================
   Check URL Parameters (e.g. ?open=true)
   ======================================================== */
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('open') === 'true') {
    const envelope = document.getElementById('envelopeAssembly');
    const envelopeView = document.getElementById('envelopeView');
    const revealView = document.getElementById('revealView');
    if (envelopeView && revealView) {
      if (envelope) envelope.classList.add('opening');
      envelopeView.classList.add('hidden');
      revealView.classList.add('active');
    }
  }
}
