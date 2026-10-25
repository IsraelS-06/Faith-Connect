/**
 * FaithConnect - Community Prayer Request & Testimony Wall
 */

(function () {
  let activeFilter = 'all';

  function initPrayerWall() {
    renderPrayers();
    setupFilters();
    setupSubmissionForm();

    window.addEventListener('faith:prayers-updated', () => {
      renderPrayers();
    });
  }

  function getPrayers() {
    if (!window.FaithStore) return [];
    return window.FaithStore.getPrayers();
  }

  function renderPrayers() {
    const container = document.getElementById('prayer-cards-container');
    const countEl = document.getElementById('prayer-count-display');
    if (!container) return;

    let list = getPrayers();

    if (activeFilter !== 'all') {
      list = list.filter((p) => p.category.toLowerCase().includes(activeFilter.toLowerCase()));
    }

    if (countEl) {
      countEl.textContent = `${list.length} community prayers active`;
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 bg-white rounded-3xl border border-gray-200 p-8">
          <p class="text-gray-500 text-sm">No prayer requests in this category yet. Be the first to share!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list
      .map((prayer) => {
        const isTestimony = prayer.category.toLowerCase().includes('testimony');
        return `
          <div class="bg-white rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 border ${
            isTestimony ? 'border-amber-300/80 bg-gradient-to-br from-white to-amber-50/40' : 'border-gray-200/80'
          } flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-3 mb-4">
                <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  isTestimony ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                }">
                  ${prayer.category}
                </span>
                <span class="text-xs text-gray-400">${prayer.date}</span>
              </div>

              <p class="text-sm sm:text-base text-gray-800 leading-relaxed mb-6">
                “${prayer.content}”
              </p>
            </div>

            <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-xs uppercase">
                  ${prayer.author.charAt(0)}
                </div>
                <span class="text-xs font-semibold text-gray-700">${prayer.author}</span>
              </div>

              <button type="button" 
                data-prayer-id="${prayer.id}" 
                class="btn-pray-for-this inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  prayer.prayedByMe
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                }">
                <svg class="w-4 h-4 ${prayer.prayedByMe ? 'text-white' : 'text-amber-500'}" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                <span>${prayer.prayedByMe ? 'Prayed' : 'Pray'}</span>
                <span class="text-[11px] opacity-80">(${prayer.prayedCount})</span>
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    bindPrayerButtons();
  }

  function bindPrayerButtons() {
    document.querySelectorAll('.btn-pray-for-this').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.dataset.prayerId;
        if (window.FaithStore) {
          window.FaithStore.togglePrayed(id);
        }
      });
    });
  }

  function setupFilters() {
    const tabs = document.querySelectorAll('.prayer-filter-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('bg-amber-500', 'text-white', 'shadow-md');
          t.classList.add('bg-white', 'text-gray-700', 'hover:bg-amber-50');
        });
        tab.classList.remove('bg-white', 'text-gray-700', 'hover:bg-amber-50');
        tab.classList.add('bg-amber-500', 'text-white', 'shadow-md');

        activeFilter = tab.dataset.filter || 'all';
        renderPrayers();
      });
    });
  }

  function setupSubmissionForm() {
    const openBtn = document.getElementById('open-prayer-modal-btn');
    const modal = document.getElementById('prayer-modal');
    const closeBtn = document.getElementById('close-prayer-modal-btn');
    const backdrop = document.getElementById('prayer-modal-backdrop');
    const form = document.getElementById('prayer-form');

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
      });
    }

    const closeModal = () => {
      if (modal) modal.classList.add('hidden');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const authorInput = document.getElementById('prayer-author-name');
        const anonCheckbox = document.getElementById('prayer-is-anonymous');
        const categorySelect = document.getElementById('prayer-category-select');
        const contentInput = document.getElementById('prayer-content');

        const content = contentInput.value.trim();
        if (!content) return;

        if (window.FaithStore) {
          window.FaithStore.addPrayer({
            author: authorInput.value.trim() || 'Faithful Member',
            isAnonymous: anonCheckbox.checked,
            category: categorySelect.value,
            content: content
          });
        }

        form.reset();
        closeModal();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initPrayerWall);
})();
