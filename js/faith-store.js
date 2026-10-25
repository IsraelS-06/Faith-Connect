/**
 * FaithConnect - Global Store & State Management
 * Handles Bookmarks, Prayer Requests, Devotional Journal, and User Profiles
 */

(function () {
  const STORAGE_KEYS = {
    BOOKMARKS: 'faithconnect_bookmarks',
    PRAYERS: 'faithconnect_prayers',
    NOTES: 'faithconnect_notes',
    USER: 'faithconnect_user',
    VERSE_FAVORITES: 'faithconnect_favorite_verses'
  };

  // Seed data for Community Prayer Requests
  const INITIAL_PRAYERS = [
    {
      id: 'prayer-1',
      author: 'David O.',
      isAnonymous: false,
      category: 'Healing & Strength',
      content: 'Please pray for my mother as she recovers from surgery this week. Believing God for total divine healing and restoration.',
      date: '2 hours ago',
      timestamp: Date.now() - 7200000,
      prayedCount: 38,
      prayedByMe: false
    },
    {
      id: 'prayer-2',
      author: 'Anonymous Sister',
      isAnonymous: true,
      category: 'Spiritual Growth',
      content: 'Seeking deeper hunger for God’s Word and divine clarity regarding a major career and ministry decision. Praying for peace that surpasses understanding.',
      date: '5 hours ago',
      timestamp: Date.now() - 18000000,
      prayedCount: 52,
      prayedByMe: false
    },
    {
      id: 'prayer-3',
      author: 'Grace M.',
      isAnonymous: false,
      category: 'Testimony & Thanksgiving',
      content: 'Testimony! God opened doors for a full university scholarship after 6 months of prayer with my church family. Truly, He makes all things beautiful in His time!',
      date: 'Yesterday',
      timestamp: Date.now() - 86400000,
      prayedCount: 89,
      prayedByMe: true
    },
    {
      id: 'prayer-4',
      author: 'Emmanuel K.',
      isAnonymous: false,
      category: 'Family & Marriage',
      content: 'Praying for restoration, unity, and love to overflow in our family home. That Christ may remain the center of all we do.',
      date: '2 days ago',
      timestamp: Date.now() - 172800000,
      prayedCount: 64,
      prayedByMe: false
    }
  ];

  // Seed data for default Bookmarks
  const INITIAL_BOOKMARKS = [
    {
      id: 'book-purpose',
      type: 'book',
      title: 'The Purpose Driven Life',
      author: 'Rick Warren',
      image: '/images/purpose.png',
      category: 'Non-Fiction',
      url: '/Non-Fictional.html',
      savedAt: Date.now() - 500000
    },
    {
      id: 'pod-stepping-faith',
      type: 'podcast',
      title: 'Stepping in Faith',
      author: 'Faith Connect Media',
      image: '/images/stepping.png',
      category: 'Podcast',
      url: '/stepping-in-faith.html',
      savedAt: Date.now() - 300000
    }
  ];

  // Helper: safe JSON parsing
  function load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('Error reading from localStorage', e);
      return fallback;
    }
  }

  function save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Error writing to localStorage', e);
    }
  }

  // Initialize store if empty
  if (!localStorage.getItem(STORAGE_KEYS.PRAYERS)) {
    save(STORAGE_KEYS.PRAYERS, INITIAL_PRAYERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) {
    save(STORAGE_KEYS.BOOKMARKS, INITIAL_BOOKMARKS);
  }

  // Toast Notification System
  function showToast(message, type = 'success', duration = 3000) {
    let container = document.getElementById('faith-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'faith-toast-container';
      container.className = 'fixed bottom-24 right-4 sm:right-6 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    const isInfo = type === 'info';

    toast.className = `pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-xl border text-sm font-medium transition-all duration-300 transform translate-y-4 opacity-0 ${
      isSuccess
        ? 'bg-gray-900 text-white border-amber-500/40'
        : isInfo
        ? 'bg-amber-600 text-white border-amber-400'
        : 'bg-red-900 text-white border-red-500'
    }`;

    const icon = isSuccess
      ? `<svg class="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`
      : `<svg class="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

    toast.innerHTML = `
      ${icon}
      <span class="flex-1">${message}</span>
      <button type="button" class="text-gray-400 hover:text-white transition-colors" aria-label="Dismiss">&times;</button>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    const close = () => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('button').addEventListener('click', close);
    setTimeout(close, duration);
  }

  // Global FaithConnect Store API
  window.FaithStore = {
    // Bookmarks API
    getBookmarks: () => load(STORAGE_KEYS.BOOKMARKS, []),
    isBookmarked: (id) => {
      const list = load(STORAGE_KEYS.BOOKMARKS, []);
      return list.some((item) => item.id === id);
    },
    toggleBookmark: (item) => {
      let list = load(STORAGE_KEYS.BOOKMARKS, []);
      const exists = list.some((b) => b.id === item.id);
      if (exists) {
        list = list.filter((b) => b.id !== item.id);
        save(STORAGE_KEYS.BOOKMARKS, list);
        showToast(`Removed "${item.title}" from library`, 'info');
      } else {
        list.push({ ...item, savedAt: Date.now() });
        save(STORAGE_KEYS.BOOKMARKS, list);
        showToast(`Saved "${item.title}" to library!`, 'success');
      }
      window.dispatchEvent(new CustomEvent('faith:bookmarks-updated', { detail: { list, toggled: item.id } }));
      return !exists;
    },

    // Community Prayers API
    getPrayers: () => load(STORAGE_KEYS.PRAYERS, INITIAL_PRAYERS),
    addPrayer: ({ author, isAnonymous, category, content }) => {
      const list = load(STORAGE_KEYS.PRAYERS, INITIAL_PRAYERS);
      const newPrayer = {
        id: 'prayer-' + Date.now(),
        author: isAnonymous ? 'Anonymous Believer' : (author || 'Faithful Member'),
        isAnonymous: !!isAnonymous,
        category: category || 'Spiritual Growth',
        content: content.trim(),
        date: 'Just now',
        timestamp: Date.now(),
        prayedCount: 1,
        prayedByMe: true
      };
      list.unshift(newPrayer);
      save(STORAGE_KEYS.PRAYERS, list);
      showToast('Prayer request shared with community!', 'success');
      window.dispatchEvent(new CustomEvent('faith:prayers-updated', { detail: { list } }));
      return newPrayer;
    },
    togglePrayed: (id) => {
      const list = load(STORAGE_KEYS.PRAYERS, INITIAL_PRAYERS);
      const target = list.find((p) => p.id === id);
      if (target) {
        if (target.prayedByMe) {
          target.prayedCount = Math.max(0, target.prayedCount - 1);
          target.prayedByMe = false;
        } else {
          target.prayedCount += 1;
          target.prayedByMe = true;
          showToast('You prayed for this request. Amen!', 'success');
        }
        save(STORAGE_KEYS.PRAYERS, list);
        window.dispatchEvent(new CustomEvent('faith:prayers-updated', { detail: { list, toggled: id } }));
      }
      return target;
    },

    // Daily Devotional Notes API
    getNotes: () => load(STORAGE_KEYS.NOTES, []),
    saveNote: ({ scripture, title, content }) => {
      let list = load(STORAGE_KEYS.NOTES, []);
      const newNote = {
        id: 'note-' + Date.now(),
        scripture: scripture || 'Daily Scripture Reflection',
        title: title || 'Devotional Journal',
        content: content.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: Date.now()
      };
      list.unshift(newNote);
      save(STORAGE_KEYS.NOTES, list);
      showToast('Reflection saved to your private journal!', 'success');
      window.dispatchEvent(new CustomEvent('faith:notes-updated', { detail: { list } }));
      return newNote;
    },
    deleteNote: (id) => {
      let list = load(STORAGE_KEYS.NOTES, []);
      list = list.filter((n) => n.id !== id);
      save(STORAGE_KEYS.NOTES, list);
      showToast('Journal note deleted', 'info');
      window.dispatchEvent(new CustomEvent('faith:notes-updated', { detail: { list } }));
    },

    // User Profile API
    getUser: () => load(STORAGE_KEYS.USER, { name: 'Beloved Member', email: 'member@faithconnect.org', loggedIn: false }),
    setUser: (userData) => {
      save(STORAGE_KEYS.USER, { ...userData, loggedIn: true, lastLogin: Date.now() });
      window.dispatchEvent(new CustomEvent('faith:user-updated', { detail: userData }));
    },

    // Toast helper
    toast: showToast
  };
})();
