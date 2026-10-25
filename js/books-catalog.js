/**
 * FaithConnect - Interactive Books Catalog
 * Live search, category filtering, bookmark toggling, and quick preview modal.
 */

(function () {
  const ALL_BOOKS = [
    {
      id: 'book-hagin-spirit',
      title: 'How to Be Led by the Spirit of God',
      author: 'Kenneth E. Hagin',
      category: 'faith-stories',
      categoryLabel: 'Spiritual Guidance',
      badge: 'Featured Masterpiece',
      image: '/images/kenneth.png',
      description: 'Discover how believers can discern God’s inward witness, follow the Holy Spirit’s promptings, and walk in continuous divine clarity.',
      url: '/Ebooks1.html',
      pages: '192 pages',
      rating: '4.9 ★★★★★'
    },
    {
      id: 'book-bunyan-pilgrim',
      title: "The Pilgrim's Progress",
      author: 'John Bunyan',
      category: 'classics',
      categoryLabel: 'Classics',
      badge: 'Timeless Allegory',
      image: '/images/john.png',
      description: 'The world-famous journey of Christian traveling from the City of Destruction to the Celestial City, overcoming trials, doubts, and tribulations.',
      url: '/Ebooks1.html',
      pages: '324 pages',
      rating: '5.0 ★★★★★'
    },
    {
      id: 'book-adeboye-greatness',
      title: 'Mathematics of Greatness',
      author: 'Pastor E.A. Adeboye',
      category: 'faith-stories',
      categoryLabel: 'Spiritual Growth',
      badge: 'Bestseller',
      image: '/images/general.png',
      description: 'Unveils biblical equations and divine principles that elevate an ordinary believer from the lowest valley to the pinnacle of destiny.',
      url: '/Ebooks2.html',
      pages: '210 pages',
      rating: '4.9 ★★★★★'
    },
    {
      id: 'book-rivers-dawn',
      title: 'As Sure as the Dawn',
      author: 'Francine Rivers',
      category: 'fiction',
      categoryLabel: 'Christian Fiction',
      badge: 'Historical Epic',
      image: '/images/dawn.png',
      description: 'The unforgettable story of Atretes, a Germanic warrior fighting for honor, redemption, and Christ’s supernatural love in ancient Rome.',
      url: '/Ebooks3.html',
      pages: '480 pages',
      rating: '4.8 ★★★★★'
    },
    {
      id: 'book-adeboye-prayer100',
      title: '100 Prayer Points, Volume 4',
      author: 'Pastor E.A. Adeboye',
      category: 'faith-stories',
      categoryLabel: 'Prayer Warfare',
      badge: 'Must-Read',
      image: '/images/volume.png',
      description: 'Targeted scriptural prayer points designed to break generational bondages, spark revival, and secure divine intervention.',
      url: '/faith-stories.html',
      pages: '120 pages',
      rating: '4.9 ★★★../../'
    },
    {
      id: 'book-jakes-soar',
      title: 'Soar! Build Your Vision from the Ground Up',
      author: 'Bishop T.D. Jakes',
      category: 'faith-stories',
      categoryLabel: 'Leadership & Vision',
      badge: 'Empowering',
      image: '/images/soar.png',
      description: 'A masterclass combining entrepreneurial wisdom and kingdom perspective to launch your God-given ideas into flight.',
      url: '/faith-stories.html',
      pages: '288 pages',
      rating: '4.8 ★★★★★'
    },
    {
      id: 'book-elijah-noble',
      title: 'The Days of Elijah',
      author: 'John Noble',
      category: 'fiction',
      categoryLabel: 'Christian Fiction',
      badge: 'Biblical Drama',
      image: '/images/elijah.png',
      description: 'A gripping historical novel depicting Elijah’s courage during Israel’s darkest spiritual crisis under King Ahab and Jezebel.',
      url: '/Fictional.html',
      pages: '310 pages',
      rating: '4.7 ★★★★☆'
    },
    {
      id: 'book-oke-softly',
      title: 'Love Comes Softly',
      author: 'Janette Oke',
      category: 'fiction',
      categoryLabel: 'Christian Fiction',
      badge: 'Prairie Classic',
      image: '/images/softly.png',
      description: 'Tragedy and heartbreak give way to patience, grace, and an enduring covenant on the American pioneer frontier.',
      url: '/Fictional.html',
      pages: '224 pages',
      rating: '4.9 ★★★★★'
    },
    {
      id: 'book-warren-purpose',
      title: 'The Purpose Driven Life',
      author: 'Rick Warren',
      category: 'non-fiction',
      categoryLabel: 'Non-Fiction',
      badge: 'Over 35M Sold',
      image: '/images/purpose.png',
      description: 'A 40-day spiritual blueprint guiding you to understand God’s five great purposes for your life on earth.',
      url: '/Non-Fictional.html',
      pages: '368 pages',
      rating: '5.0 ★★★★★'
    },
    {
      id: 'book-tozer-pursuit',
      title: 'The Pursuit of God',
      author: 'A.W. Tozer',
      category: 'non-fiction',
      categoryLabel: 'Non-Fiction',
      badge: 'Spiritual Classic',
      image: '/images/pursuit.png',
      description: 'A burning plea to awaken believers from lukewarm religion into an all-consuming passion for intimate communion with the Almighty.',
      url: '/Non-Fictional.html',
      pages: '144 pages',
      rating: '5.0 ★★★★★'
    },
    {
      id: 'book-hinn-welcome',
      title: 'Welcome Holy Spirit',
      author: 'Benny Hinn',
      category: 'non-fiction',
      categoryLabel: 'Non-Fiction',
      badge: 'Pneumatology',
      image: '/images/Welcome.png',
      description: 'A deep personal exploration of the third Person of the Godhead, His transformative power, and the fellowship of the Spirit.',
      url: '/Non-Fictional.html',
      pages: '272 pages',
      rating: '4.8 ★★★★★'
    },
    {
      id: 'book-saunders-home',
      title: 'The Story of Home',
      author: 'Caroline Saunders',
      category: 'children',
      categoryLabel: "Children's Books",
      badge: 'Family Favorite',
      image: '/images/children.png',
      description: 'An engaging, Scripture-rich story for kids showing how God invites us into His eternal family and prepares a home for us.',
      url: '/children-books.html',
      pages: '48 pages',
      rating: '4.9 ★★★★★'
    }
  ];

  let currentCategory = 'all';
  let searchQuery = '';
  let activeSort = 'featured';

  function initCatalog() {
    const grid = document.getElementById('interactive-book-grid');
    if (!grid) return;

    renderBooks();
    setupFilters();
    setupSearch();
    setupSort();
    setupModal();

    window.addEventListener('faith:bookmarks-updated', () => {
      updateBookmarkButtons();
    });
  }

  function getFilteredBooks() {
    return ALL_BOOKS.filter((book) => {
      const matchesCat = currentCategory === 'all' || book.category === currentCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.categoryLabel.toLowerCase().includes(q) ||
        book.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (activeSort === 'title-asc') return a.title.localeCompare(b.title);
      if (activeSort === 'author-asc') return a.author.localeCompare(b.author);
      return 0; // featured default
    });
  }

  function renderBooks() {
    const grid = document.getElementById('interactive-book-grid');
    const countBadge = document.getElementById('book-count-badge');
    const emptyState = document.getElementById('book-empty-state');
    if (!grid) return;

    const books = getFilteredBooks();

    if (countBadge) {
      countBadge.textContent = `Showing ${books.length} of ${ALL_BOOKS.length} books`;
    }

    if (books.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    grid.innerHTML = books
      .map((book) => {
        const isSaved = window.FaithStore ? window.FaithStore.isBookmarked(book.id) : false;
        return `
          <article class="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200/80 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <!-- Book Image with overlay -->
              <div class="aspect-[3/4] overflow-hidden rounded-2xl mb-4 bg-gray-50 relative flex items-center justify-center p-2">
                <img src="${book.image}" alt="${book.title}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md" loading="lazy" />
                <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-gray-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs border border-gray-100">
                  ${book.badge}
                </span>

                <!-- Bookmark Button -->
                <button type="button" 
                  data-bookmark-id="${book.id}" 
                  class="btn-bookmark absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-md transition-all ${
                    isSaved ? 'bg-amber-500 text-white shadow-amber-500/30' : 'bg-white/90 text-gray-400 hover:text-amber-600 hover:bg-white'
                  }"
                  title="${isSaved ? 'Remove from library' : 'Save to library'}"
                  aria-label="Save ${book.title}">
                  <svg class="w-4 h-4" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                </button>
              </div>

              <!-- Metadata -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-amber-600 uppercase tracking-wider text-[11px]">${book.categoryLabel}</span>
                  <span class="text-gray-400 text-[11px]">${book.pages}</span>
                </div>
                <h3 class="font-extrabold text-gray-900 text-base sm:text-lg line-clamp-1 group-hover:text-amber-600 transition-colors" title="${book.title}">
                  ${book.title}
                </h3>
                <p class="text-xs font-semibold text-gray-500">by <span class="text-gray-700">${book.author}</span></p>
                <p class="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                  ${book.description}
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
              <a href="${book.url}" class="flex-1 text-center bg-amber-50 hover:bg-amber-100 text-amber-800 hover:text-amber-900 font-bold text-xs py-2.5 rounded-xl transition-colors">
                Read Details
              </a>
              <button type="button" data-preview-id="${book.id}" class="btn-quick-preview px-3 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-xs font-semibold transition-colors" title="Quick Preview">
                Quick View
              </button>
            </div>
          </article>
        `;
      })
      .join('');

    bindCardButtons();
  }

  function bindCardButtons() {
    // Bookmarking
    document.querySelectorAll('.btn-bookmark').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.bookmarkId;
        const book = ALL_BOOKS.find((b) => b.id === id);
        if (book && window.FaithStore) {
          window.FaithStore.toggleBookmark({
            id: book.id,
            type: 'book',
            title: book.title,
            author: book.author,
            category: book.categoryLabel,
            image: book.image,
            url: book.url
          });
        }
      });
    });

    // Quick Preview Modal
    document.querySelectorAll('.btn-quick-preview').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.previewId;
        const book = ALL_BOOKS.find((b) => b.id === id);
        if (book) openPreviewModal(book);
      });
    });
  }

  function updateBookmarkButtons() {
    document.querySelectorAll('.btn-bookmark').forEach((btn) => {
      const id = btn.dataset.bookmarkId;
      const isSaved = window.FaithStore ? window.FaithStore.isBookmarked(id) : false;
      if (isSaved) {
        btn.classList.add('bg-amber-500', 'text-white', 'shadow-amber-500/30');
        btn.classList.remove('bg-white/90', 'text-gray-400');
        btn.querySelector('svg').setAttribute('fill', 'currentColor');
      } else {
        btn.classList.remove('bg-amber-500', 'text-white', 'shadow-amber-500/30');
        btn.classList.add('bg-white/90', 'text-gray-400');
        btn.querySelector('svg').setAttribute('fill', 'none');
      }
    });
  }

  function setupFilters() {
    const pills = document.querySelectorAll('.category-pill');
    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pills.forEach((p) => {
          p.classList.remove('bg-amber-500', 'text-white', 'shadow-md');
          p.classList.add('bg-white', 'text-gray-700', 'hover:bg-amber-50');
        });
        pill.classList.remove('bg-white', 'text-gray-700', 'hover:bg-amber-50');
        pill.classList.add('bg-amber-500', 'text-white', 'shadow-md');

        currentCategory = pill.dataset.category || 'all';
        renderBooks();
      });
    });
  }

  function setupSearch() {
    const input = document.getElementById('book-search-input');
    const clearBtn = document.getElementById('book-search-clear');
    if (!input) return;

    input.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      if (clearBtn) {
        clearBtn.classList.toggle('hidden', searchQuery.length === 0);
      }
      renderBooks();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        searchQuery = '';
        clearBtn.classList.add('hidden');
        input.focus();
        renderBooks();
      });
    }
  }

  function setupSort() {
    const select = document.getElementById('book-sort-select');
    if (!select) return;
    select.addEventListener('change', (e) => {
      activeSort = e.target.value;
      renderBooks();
    });
  }

  function setupModal() {
    const modal = document.getElementById('book-preview-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const backdrop = document.getElementById('modal-backdrop');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
      });
    }
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        modal.classList.add('hidden');
      });
    }
  }

  function openPreviewModal(book) {
    const modal = document.getElementById('book-preview-modal');
    if (!modal) return;

    document.getElementById('modal-book-img').src = book.image;
    document.getElementById('modal-book-badge').textContent = book.badge;
    document.getElementById('modal-book-title').textContent = book.title;
    document.getElementById('modal-book-author').textContent = book.author;
    document.getElementById('modal-book-category').textContent = book.categoryLabel;
    document.getElementById('modal-book-rating').textContent = book.rating;
    document.getElementById('modal-book-desc').textContent = book.description;
    document.getElementById('modal-book-pages').textContent = book.pages;
    document.getElementById('modal-book-read-btn').href = book.url;

    const modalSaveBtn = document.getElementById('modal-book-save-btn');
    const isSaved = window.FaithStore ? window.FaithStore.isBookmarked(book.id) : false;
    modalSaveBtn.textContent = isSaved ? 'Remove from My Library' : 'Save to My Library';

    modalSaveBtn.onclick = () => {
      if (window.FaithStore) {
        const nowSaved = window.FaithStore.toggleBookmark({
          id: book.id,
          type: 'book',
          title: book.title,
          author: book.author,
          category: book.categoryLabel,
          image: book.image,
          url: book.url
        });
        modalSaveBtn.textContent = nowSaved ? 'Remove from My Library' : 'Save to My Library';
      }
    };

    modal.classList.remove('hidden');
  }

  document.addEventListener('DOMContentLoaded', initCatalog);
})();
