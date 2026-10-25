/**
 * FaithConnect - Dynamic "Verse of the Day" & Scripture Rotator
 */

(function () {
  const SCRIPTURES = [
    {
      reference: 'John 3:16',
      text: 'For God so loved the world, that he gave his only begotten Son, that whoever believes in him should not perish but have everlasting life.',
      theme: 'God’s Love & Salvation',
      translation: 'NIV'
    },
    {
      reference: 'Philippians 4:13',
      text: 'I can do all things through Christ who gives me strength.',
      theme: 'Divine Strength & Endurance',
      translation: 'NKJV'
    },
    {
      reference: 'Jeremiah 29:11',
      text: 'For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.',
      theme: 'Hope & Divine Destiny',
      translation: 'NIV'
    },
    {
      reference: 'Isaiah 40:31',
      text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
      theme: 'Renewed Strength & Trust',
      translation: 'NIV'
    },
    {
      reference: 'Romans 8:28',
      text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
      theme: 'Sovereign Purpose & Grace',
      translation: 'NIV'
    },
    {
      reference: 'Proverbs 3:5-6',
      text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
      theme: 'Wisdom & Guidance',
      translation: 'NIV'
    },
    {
      reference: 'Psalm 23:1-3',
      text: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.',
      theme: 'Peace & Divine Shepherd',
      translation: 'NIV'
    },
    {
      reference: '2 Timothy 1:7',
      text: 'For God has not given us a spirit of fear, but of power and of love and of a sound mind.',
      theme: 'Victory Over Fear',
      translation: 'NKJV'
    },
    {
      reference: 'Matthew 11:28',
      text: 'Come to me, all you who are weary and burdened, and I will give you rest.',
      theme: 'Rest in Christ',
      translation: 'NIV'
    },
    {
      reference: 'Joshua 1:9',
      text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
      theme: 'Courage & Presence',
      translation: 'NIV'
    }
  ];

  let currentIndex = 0;

  function updateVerseUI(animate = true) {
    const textEl = document.getElementById('verse-text');
    const refEl = document.getElementById('verse-reference');
    const themeEl = document.getElementById('verse-theme');
    const saveBtn = document.getElementById('verse-btn-save');

    if (!textEl || !refEl) return;

    const item = SCRIPTURES[currentIndex];

    if (animate) {
      textEl.parentElement.classList.add('opacity-0', 'scale-98');
      setTimeout(() => {
        textEl.textContent = `“${item.text}”`;
        refEl.textContent = `${item.reference} (${item.translation})`;
        if (themeEl) themeEl.textContent = item.theme;
        textEl.parentElement.classList.remove('opacity-0', 'scale-98');
        textEl.parentElement.classList.add('opacity-100', 'scale-100');
      }, 150);
    } else {
      textEl.textContent = `“${item.text}”`;
      refEl.textContent = `${item.reference} (${item.translation})`;
      if (themeEl) themeEl.textContent = item.theme;
    }

    // Check if saved
    if (saveBtn && window.FaithStore) {
      const isSaved = window.FaithStore.isBookmarked('verse-' + item.reference);
      saveBtn.querySelector('span').textContent = isSaved ? 'Saved' : 'Save Verse';
      saveBtn.classList.toggle('text-amber-600', isSaved);
    }
  }

  function initVerseWidget() {
    const nextBtn = document.getElementById('verse-btn-next');
    const copyBtn = document.getElementById('verse-btn-copy');
    const shareBtn = document.getElementById('verse-btn-share');
    const saveBtn = document.getElementById('verse-btn-save');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % SCRIPTURES.length;
        updateVerseUI(true);
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const item = SCRIPTURES[currentIndex];
        const full = `${item.reference} - "${item.text}"`;
        navigator.clipboard.writeText(full).then(() => {
          if (window.FaithStore) {
            window.FaithStore.toast(`Copied ${item.reference} to clipboard!`, 'success');
          } else {
            alert('Verse copied to clipboard!');
          }
        });
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const item = SCRIPTURES[currentIndex];
        const shareData = {
          title: `Scripture of the Day: ${item.reference}`,
          text: `"${item.text}" - ${item.reference} (via Faith Connect)`,
          url: window.location.href
        };
        if (navigator.share) {
          navigator.share(shareData).catch(() => {});
        } else {
          navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`).then(() => {
            if (window.FaithStore) {
              window.FaithStore.toast('Share link copied to clipboard!', 'info');
            }
          });
        }
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const item = SCRIPTURES[currentIndex];
        if (window.FaithStore) {
          window.FaithStore.toggleBookmark({
            id: 'verse-' + item.reference,
            type: 'verse',
            title: item.reference,
            author: item.translation,
            category: item.theme,
            image: '/images/Faith connect logo.png',
            url: '/index.html'
          });
          updateVerseUI(false);
        }
      });
    }

    updateVerseUI(false);
  }

  document.addEventListener('DOMContentLoaded', initVerseWidget);
})();
