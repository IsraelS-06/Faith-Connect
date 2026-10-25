/**
 * FaithConnect - Member Dashboard Controller (/Faithful/index.html)
 * Connects user profile, live library bookmarks, prayer wall metrics, and personal journal notes.
 */

(function () {
  function initDashboard() {
    loadUserProfile();
    loadLibraryMetrics();
    renderSavedLibrary();
    renderJournalNotes();
    setupJournalForm();

    window.addEventListener('faith:bookmarks-updated', () => {
      loadLibraryMetrics();
      renderSavedLibrary();
    });

    window.addEventListener('faith:notes-updated', () => {
      loadLibraryMetrics();
      renderJournalNotes();
    });

    window.addEventListener('faith:user-updated', () => {
      loadUserProfile();
    });
  }

  function loadUserProfile() {
    if (!window.FaithStore) return;
    const user = window.FaithStore.getUser();

    const nameEls = document.querySelectorAll('.dashboard-user-name');
    const emailEls = document.querySelectorAll('.dashboard-user-email');
    const welcomeEl = document.getElementById('dashboard-welcome-heading');

    const displayName = user.name || 'Faithful Member';
    const displayEmail = user.email || 'member@faithconnect.org';

    nameEls.forEach((el) => (el.textContent = displayName));
    emailEls.forEach((el) => (el.textContent = displayEmail));
    if (welcomeEl) {
      welcomeEl.textContent = `Welcome, ${displayName.split(' ')[0]}!`;
    }
  }

  function loadLibraryMetrics() {
    if (!window.FaithStore) return;
    const bookmarks = window.FaithStore.getBookmarks();
    const notes = window.FaithStore.getNotes();
    const prayers = window.FaithStore.getPrayers();

    const bookCount = bookmarks.filter((b) => b.type === 'book').length;
    const podCount = bookmarks.filter((b) => b.type === 'podcast').length;

    const bookStatEl = document.getElementById('stat-books-count');
    const podStatEl = document.getElementById('stat-podcast-count');
    const journalStatEl = document.getElementById('stat-journal-count');

    if (bookStatEl) bookStatEl.textContent = bookCount || 0;
    if (podStatEl) podStatEl.textContent = podCount || 0;
    if (journalStatEl) journalStatEl.textContent = notes.length || 0;
  }

  function renderSavedLibrary() {
    const container = document.getElementById('dashboard-saved-library');
    if (!container || !window.FaithStore) return;

    const bookmarks = window.FaithStore.getBookmarks();

    if (bookmarks.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-6 text-center text-gray-400 text-xs bg-gray-50 rounded-xl border border-dashed border-gray-200">
          No saved books or podcasts yet. Browse the <a href="/Books.html" class="text-amber-600 underline font-semibold">Catalog</a> or <a href="/Podcast.html" class="text-amber-600 underline font-semibold">Podcasts</a> and click "Save to Library".
        </div>
      `;
      return;
    }

    container.innerHTML = bookmarks
      .slice(0, 6)
      .map((item) => `
        <div class="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-amber-50/60 rounded-xl border border-gray-100 transition-colors">
          <div class="flex items-center gap-3 min-w-0">
            <img src="${item.image || '/images/Faith connect logo.png'}" alt="" class="w-9 h-9 rounded-lg object-contain bg-white shadow-xs p-0.5 shrink-0" />
            <div class="min-w-0">
              <p class="text-xs font-bold text-gray-900 truncate">${item.title}</p>
              <p class="text-[10px] text-gray-500 truncate">${item.author || item.category || 'Faith Resource'}</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0 ml-2">
            <a href="${item.url || '#'}" class="px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors">
              Open
            </a>
            <button type="button" data-remove-id="${item.id}" class="btn-remove-saved p-1 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="Remove">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      `)
      .join('');

    container.querySelectorAll('.btn-remove-saved').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.removeId;
        const item = bookmarks.find((b) => b.id === id);
        if (item) {
          window.FaithStore.toggleBookmark(item);
        }
      });
    });
  }

  function renderJournalNotes() {
    const list = document.getElementById('dashboard-journal-list');
    if (!list || !window.FaithStore) return;

    const notes = window.FaithStore.getNotes();

    if (notes.length === 0) {
      list.innerHTML = `
        <p class="text-xs text-gray-400 text-center py-4 italic">No reflection notes saved yet. Write your first prayer insight above!</p>
      `;
      return;
    }

    list.innerHTML = notes
      .slice(0, 4)
      .map((note) => `
        <div class="p-2.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
          <div class="flex items-center justify-between text-[11px]">
            <span class="font-bold text-amber-700">${note.scripture}</span>
            <span class="text-gray-400">${note.date}</span>
          </div>
          <p class="text-xs text-gray-700 leading-relaxed">${note.content}</p>
          <div class="text-right pt-1">
            <button type="button" data-del-note="${note.id}" class="btn-del-note text-[10px] text-red-500 hover:underline">
              Delete
            </button>
          </div>
        </div>
      `)
      .join('');

    list.querySelectorAll('.btn-del-note').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.FaithStore.deleteNote(btn.dataset.delNote);
      });
    });
  }

  function setupJournalForm() {
    const form = document.getElementById('dashboard-journal-form');
    if (!form || !window.FaithStore) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('journal-note-input');
      const val = input.value.trim();
      if (!val) return;

      window.FaithStore.saveNote({
        scripture: 'Daily Scripture Reflection',
        title: 'Personal Prayer Journal',
        content: val
      });

      input.value = '';
    });
  }

  document.addEventListener('DOMContentLoaded', initDashboard);
})();
