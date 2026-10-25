/**
 * Faith Connect - Global Navigation & Interactive Components
 */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile drawer toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('translate-x-full');
    mobileDrawer.classList.add('translate-x-0');
    if (mobileBackdrop) {
      mobileBackdrop.classList.remove('hidden');
      requestAnimationFrame(() => {
        mobileBackdrop.classList.remove('opacity-0');
        mobileBackdrop.classList.add('opacity-100');
      });
    }
    document.body.classList.add('overflow-hidden');
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('translate-x-0');
    mobileDrawer.classList.add('translate-x-full');
    if (mobileBackdrop) {
      mobileBackdrop.classList.remove('opacity-100');
      mobileBackdrop.classList.add('opacity-0');
      setTimeout(() => {
        mobileBackdrop.classList.add('hidden');
      }, 250);
    }
    document.body.classList.remove('overflow-hidden');
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeDrawer);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeDrawer);

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
});
