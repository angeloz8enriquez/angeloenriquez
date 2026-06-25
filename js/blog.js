/* ============================================
   BLOG FILTER — Angelo S. Enriquez Portfolio
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const filterBar = document.getElementById('filter-bar');
  const blogGrid = document.getElementById('blog-grid');

  if (!filterBar || !blogGrid) return;

  const filterBtns = filterBar.querySelectorAll('.filter-btn');
  const blogPosts = blogGrid.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      // Filter posts with animation
      blogPosts.forEach((post, index) => {
        const category = post.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          post.style.display = '';
          // Stagger the reveal animation
          post.style.opacity = '0';
          post.style.transform = 'translateY(20px)';
          setTimeout(() => {
            post.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
          }, index * 80);
        } else {
          post.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          post.style.opacity = '0';
          post.style.transform = 'translateY(10px)';
          setTimeout(() => {
            post.style.display = 'none';
          }, 250);
        }
      });
    });
  });
});
