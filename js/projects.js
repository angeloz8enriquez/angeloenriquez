/* ============================================
   PROJECTS FILTER — Angelo S. Enriquez Portfolio
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const filterBar = document.getElementById('filter-bar');
  const projectsGrid = document.getElementById('projects-grid');

  if (!filterBar || !projectsGrid) return;

  const filterBtns = filterBar.querySelectorAll('.filter-btn');
  const projectCards = projectsGrid.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      // Filter cards with animation
      projectCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          card.style.display = '';
          // Stagger the reveal animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 80);
        } else {
          card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // ---- Modal Logic ----
  const modal = document.getElementById('project-modal');
  const modalClose = modal ? modal.querySelector('.modal-close') : null;
  const modalBody = document.getElementById('modal-project-details');
  const openBtns = document.querySelectorAll('.open-project-details');

  if (modal && modalBody && openBtns.length > 0) {
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        if (!card) return;
        
        const rawData = card.getAttribute('data-details');
        if (!rawData) return;

        let details;
        try {
          details = JSON.parse(rawData);
        } catch (err) {
          console.error("Failed to parse project details", err);
          return;
        }

        // Build Gallery HTML
        let galleryHtml = '';
        if (details.gallery && details.gallery.length > 0) {
          galleryHtml = '<div class="project-gallery">';
          details.gallery.forEach(imgSrc => {
            galleryHtml += `<img src="${imgSrc}" alt="${details.title} gallery image" class="gallery-image">`;
          });
          galleryHtml += '</div>';
        }

        // Build Tech Pills
        let techHtml = '';
        if (details.tech && details.tech.length > 0) {
          techHtml = '<div class="modal-tech-stack">';
          details.tech.forEach(t => {
            techHtml += `<span class="tech-pill">${t}</span>`;
          });
          techHtml += '</div>';
        }

        // Render Modal Content
        modalBody.innerHTML = `
          <div class="modal-header">
            <span class="project-card-badge">${details.badge}</span>
            <h2 class="modal-title">${details.title}</h2>
          </div>
          <div class="modal-main-content">
            <img src="${details.image}" alt="${details.title} main image" class="modal-main-image">
            <p class="modal-description">${details.fullDesc}</p>
            ${techHtml}
            <div class="modal-actions">
              <a href="${details.link}" target="_blank" rel="noopener noreferrer" class="btn btn--primary">Visit Project</a>
              <span class="project-status"><span class="dot"></span> ${details.status}</span>
            </div>
            ${galleryHtml ? `<h3>Project Gallery</h3>${galleryHtml}` : ''}
          </div>
        `;

        // Show Modal
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close functionality
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { modalBody.innerHTML = ''; }, 300); // clear after transition
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
        closeModal();
      }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }
});
