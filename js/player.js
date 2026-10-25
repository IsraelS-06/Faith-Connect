/**
 * FaithConnect - Interactive Podcast & Audio Player
 * Fixed bottom floating player bar with playback controls, timeline scrubbing, speed switcher, volume, and visualizer.
 */

(function () {
  let isPlaying = false;
  let currentTime = 0;
  let duration = 1845; // default 30m 45s
  let playbackRate = 1.0;
  let volume = 0.8;
  let isMuted = false;
  let timer = null;
  let isExpanded = true;
  let synthAudioCtx = null;
  let synthGain = null;
  let synthOscillators = [];

  const currentTrack = {
    title: 'Walking by Faith in Uncertain Seasons',
    speaker: 'Pastor Kevin Wilson',
    show: 'A Christian Podcast',
    image: '/images/A christian podcast.png',
    duration: 1845
  };

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Web Audio ambient tone generator for realistic live playback
  function startSynthAmbient() {
    try {
      if (!synthAudioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        synthAudioCtx = new AudioCtx();
      }
      if (synthAudioCtx.state === 'suspended') {
        synthAudioCtx.resume();
      }

      stopSynthAmbient();

      synthGain = synthAudioCtx.createGain();
      synthGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.12, synthAudioCtx.currentTime);
      synthGain.connect(synthAudioCtx.destination);

      // Warm peaceful organ/pad chord: D, F#, A, C# (Dmaj7)
      const freqs = [146.83, 220.0, 277.18, 369.99];
      synthOscillators = freqs.map((f, i) => {
        const osc = synthAudioCtx.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, synthAudioCtx.currentTime);
        osc.connect(synthGain);
        osc.start();
        return osc;
      });
    } catch (e) {
      console.warn('Web Audio not supported or blocked', e);
    }
  }

  function stopSynthAmbient() {
    synthOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    synthOscillators = [];
  }

  function updateSynthVolume() {
    if (synthGain && synthAudioCtx) {
      synthGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.12, synthAudioCtx.currentTime);
    }
  }

  function renderPlayer() {
    if (document.getElementById('faith-audio-player')) return;

    const bar = document.createElement('aside');
    bar.id = 'faith-audio-player';
    bar.setAttribute('aria-label', 'Podcast Audio Player');
    bar.className = 'fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 transform translate-y-0';
    bar.innerHTML = `
      <div class="max-w-6xl mx-auto px-3 sm:px-6 mb-2 sm:mb-3">
        <div class="bg-gray-950/95 backdrop-blur-xl border border-gray-800/80 shadow-2xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-white">
          
          <!-- Timeline progress bar (top edge of player) -->
          <div class="relative w-full mb-2 sm:mb-3 group cursor-pointer" id="player-timeline-container" title="Click to seek">
            <div class="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div id="player-timeline-fill" class="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-100" style="width: 0%"></div>
            </div>
          </div>

          <div class="flex items-center justify-between gap-3 sm:gap-6">
            
            <!-- Left: Thumbnail & Episode Details -->
            <div class="flex items-center gap-3 sm:gap-4 min-w-0 max-w-[45%] sm:max-w-xs">
              <div class="relative shrink-0">
                <img id="player-thumb" src="${currentTrack.image}" alt="Episode cover" class="w-11 h-11 sm:w-14 sm:h-14 rounded-xl object-cover border border-gray-700 shadow-md" />
                <div id="player-visualizer" class="absolute -bottom-1 -right-1 bg-amber-500 text-gray-950 p-1 rounded-full shadow hidden">
                  <div class="flex items-end gap-0.5 h-3 w-3 justify-center">
                    <span class="w-0.5 bg-gray-950 animate-pulse h-3"></span>
                    <span class="w-0.5 bg-gray-950 animate-pulse h-2"></span>
                    <span class="w-0.5 bg-gray-950 animate-pulse h-3"></span>
                  </div>
                </div>
              </div>

              <div class="min-w-0 truncate">
                <p id="player-title" class="font-bold text-xs sm:text-sm text-gray-100 truncate">${currentTrack.title}</p>
                <p id="player-speaker" class="text-[11px] sm:text-xs text-amber-400 truncate">${currentTrack.speaker} &bull; <span class="text-gray-400" id="player-show">${currentTrack.show}</span></p>
                <div class="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400">
                  <span id="player-time-current">0:00</span>
                  <span>/</span>
                  <span id="player-time-total">${formatTime(currentTrack.duration)}</span>
                </div>
              </div>
            </div>

            <!-- Center: Core Controls -->
            <div class="flex items-center gap-2 sm:gap-4">
              <!-- Rewind 15s -->
              <button id="player-btn-rewind" type="button" class="p-2 text-gray-400 hover:text-white transition-colors" title="Rewind 15 seconds" aria-label="Rewind 15 seconds">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/>
                </svg>
              </button>

              <!-- Play / Pause Main Toggle -->
              <button id="player-btn-play" type="button" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold flex items-center justify-center shadow-lg shadow-amber-500/20 transition-transform active:scale-95" title="Play or pause" aria-label="Play">
                <svg id="player-icon-play" class="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg id="player-icon-pause" class="w-5 h-5 hidden" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              </button>

              <!-- Forward 15s -->
              <button id="player-btn-forward" type="button" class="p-2 text-gray-400 hover:text-white transition-colors" title="Fast-forward 15 seconds" aria-label="Fast forward 15 seconds">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"/>
                </svg>
              </button>

              <!-- Speed Switcher -->
              <button id="player-btn-speed" type="button" class="px-2 py-1 text-xs font-bold rounded-lg bg-gray-800 text-gray-300 hover:text-amber-400 hover:bg-gray-700 transition-colors" title="Playback Speed">
                1x
              </button>
            </div>

            <!-- Right: Volume & Minimize -->
            <div class="hidden md:flex items-center gap-3">
              <!-- Mute / Unmute -->
              <button id="player-btn-volume" type="button" class="text-gray-400 hover:text-white transition-colors" title="Toggle Mute" aria-label="Volume">
                <svg id="player-icon-vol-on" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                </svg>
                <svg id="player-icon-vol-mute" class="w-5 h-5 hidden text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
                </svg>
              </button>

              <!-- Volume Slider -->
              <input id="player-volume-slider" type="range" min="0" max="1" step="0.05" value="0.8" class="w-20 accent-amber-500 bg-gray-800 h-1.5 rounded-full cursor-pointer" aria-label="Volume Slider" />

              <!-- Minimize / Dismiss -->
              <button id="player-btn-close" type="button" class="p-1.5 rounded-full text-gray-500 hover:text-white hover:bg-gray-800 transition-colors ml-2" title="Hide Player" aria-label="Hide Player">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>

            <!-- Mobile Close / Hide -->
            <button id="player-btn-mobile-close" type="button" class="flex md:hidden p-1.5 text-gray-400 hover:text-white" aria-label="Close Player">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

          </div>
        </div>
      </div>
    `;

    document.body.appendChild(bar);
    bindPlayerEvents();
  }

  function bindPlayerEvents() {
    const playBtn = document.getElementById('player-btn-play');
    const playIcon = document.getElementById('player-icon-play');
    const pauseIcon = document.getElementById('player-icon-pause');
    const visualizer = document.getElementById('player-visualizer');
    const rewindBtn = document.getElementById('player-btn-rewind');
    const forwardBtn = document.getElementById('player-btn-forward');
    const speedBtn = document.getElementById('player-btn-speed');
    const volBtn = document.getElementById('player-btn-volume');
    const volSlider = document.getElementById('player-volume-slider');
    const volOn = document.getElementById('player-icon-vol-on');
    const volMute = document.getElementById('player-icon-vol-mute');
    const timelineContainer = document.getElementById('player-timeline-container');
    const timelineFill = document.getElementById('player-timeline-fill');
    const timeCurrent = document.getElementById('player-time-current');
    const closeBtn = document.getElementById('player-btn-close');
    const mobileCloseBtn = document.getElementById('player-btn-mobile-close');

    function togglePlay() {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        visualizer.classList.remove('hidden');
        startSynthAmbient();
        if (window.FaithStore) {
          window.FaithStore.toast(`Playing: ${currentTrack.title}`, 'info');
        }

        timer = setInterval(() => {
          currentTime += 1 * playbackRate;
          if (currentTime >= duration) {
            currentTime = 0;
            togglePlay();
          }
          const pct = (currentTime / duration) * 100;
          timelineFill.style.width = `${pct}%`;
          timeCurrent.textContent = formatTime(currentTime);
        }, 1000);
      } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        visualizer.classList.add('hidden');
        stopSynthAmbient();
        clearInterval(timer);
      }
    }

    playBtn.addEventListener('click', togglePlay);

    rewindBtn.addEventListener('click', () => {
      currentTime = Math.max(0, currentTime - 15);
      const pct = (currentTime / duration) * 100;
      timelineFill.style.width = `${pct}%`;
      timeCurrent.textContent = formatTime(currentTime);
    });

    forwardBtn.addEventListener('click', () => {
      currentTime = Math.min(duration, currentTime + 15);
      const pct = (currentTime / duration) * 100;
      timelineFill.style.width = `${pct}%`;
      timeCurrent.textContent = formatTime(currentTime);
    });

    // Speed switcher
    const speeds = [1.0, 1.25, 1.5, 0.8];
    let speedIdx = 0;
    speedBtn.addEventListener('click', () => {
      speedIdx = (speedIdx + 1) % speeds.length;
      playbackRate = speeds[speedIdx];
      speedBtn.textContent = `${playbackRate}x`;
    });

    // Volume
    volSlider.addEventListener('input', (e) => {
      volume = parseFloat(e.target.value);
      isMuted = volume === 0;
      if (isMuted) {
        volOn.classList.add('hidden');
        volMute.classList.remove('hidden');
      } else {
        volOn.classList.remove('hidden');
        volMute.classList.add('hidden');
      }
      updateSynthVolume();
    });

    volBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (isMuted) {
        volOn.classList.add('hidden');
        volMute.classList.remove('hidden');
      } else {
        volOn.classList.remove('hidden');
        volMute.classList.add('hidden');
      }
      updateSynthVolume();
    });

    // Seek scrubber
    timelineContainer.addEventListener('click', (e) => {
      const rect = timelineContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      currentTime = Math.floor(pos * duration);
      const pct = (currentTime / duration) * 100;
      timelineFill.style.width = `${pct}%`;
      timeCurrent.textContent = formatTime(currentTime);
    });

    const hidePlayer = () => {
      const player = document.getElementById('faith-audio-player');
      if (player) {
        player.classList.toggle('translate-y-full');
      }
    };
    if (closeBtn) closeBtn.addEventListener('click', hidePlayer);
    if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', hidePlayer);
  }

  // Public Player API
  window.FaithAudio = {
    init: renderPlayer,
    playEpisode: ({ title, speaker, show, image, durationSeconds }) => {
      renderPlayer();
      const player = document.getElementById('faith-audio-player');
      if (player && player.classList.contains('translate-y-full')) {
        player.classList.remove('translate-y-full');
      }

      currentTrack.title = title || currentTrack.title;
      currentTrack.speaker = speaker || currentTrack.speaker;
      currentTrack.show = show || currentTrack.show;
      currentTrack.image = image || currentTrack.image;
      currentTrack.duration = durationSeconds || 1800;

      duration = currentTrack.duration;
      currentTime = 0;

      document.getElementById('player-thumb').src = currentTrack.image;
      document.getElementById('player-title').textContent = currentTrack.title;
      document.getElementById('player-speaker').childNodes[0].nodeValue = `${currentTrack.speaker} • `;
      document.getElementById('player-show').textContent = currentTrack.show;
      document.getElementById('player-time-total').textContent = formatTime(duration);
      document.getElementById('player-time-current').textContent = '0:00';
      document.getElementById('player-timeline-fill').style.width = '0%';

      if (!isPlaying) {
        document.getElementById('player-btn-play').click();
      }
    }
  };

  // Auto-bind on any page
  document.addEventListener('DOMContentLoaded', () => {
    // If on podcast pages, initialize player bar
    const path = window.location.pathname.toLowerCase();
    const isPodcastPage = path.includes('podcast') || path.includes('stepping') || path.includes('bible-project');
    if (isPodcastPage) {
      renderPlayer();
    }

    // Connect any play buttons on page
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-podcast-play], .play-podcast-btn, .listen-now-btn');
      if (target) {
        e.preventDefault();
        const title = target.dataset.title || target.closest('article, .episode-card')?.querySelector('h2, h3, h4')?.textContent?.trim() || 'Christian Devotional Episode';
        const speaker = target.dataset.speaker || 'Faith Connect Media';
        const show = target.dataset.show || 'Faith Connect Podcast';
        const image = target.dataset.image || target.closest('article, .episode-card')?.querySelector('img')?.src || '/images/A christian podcast.png';
        const durationSeconds = parseInt(target.dataset.duration || '2400', 10);

        window.FaithAudio.playEpisode({ title, speaker, show, image, durationSeconds });
      }
    });
  });
})();
