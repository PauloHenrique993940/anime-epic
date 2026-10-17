(() => {
   const preference = matchMedia('(prefers-reduced-motion: reduce)');
   if (preference.matches || !('IntersectionObserver' in window)) return;
   const selector = '.section, .detail-section, .character-card, .related-grid .anime-card, .farewell';
   const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
         if (!entry.isIntersecting) return;
         entry.target.classList.add('is-visible');
         observer.unobserve(entry.target);
      });
   }, { threshold: 0, rootMargin: '0px 0px -25px 0px' });
   function reveal(root) {
      const nodes = [];
      if (root instanceof Element && root.matches(selector)) nodes.push(root);
      if (root.querySelectorAll) nodes.push(...root.querySelectorAll(selector));
      nodes.forEach((node, index) => {
         if (node.classList.contains('epic-reveal')) return;
         node.classList.add('epic-reveal');
         if (node.classList.contains('character-card')) node.style.setProperty('--reveal-delay', `${(index % 5) * 45}ms`);
         observer.observe(node);
      });
   }
   reveal(document);
   const mutations = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(reveal)));
   mutations.observe(document.body, { childList: true, subtree: true });
   preference.addEventListener('change', event => {
      if (!event.matches) return;
      observer.disconnect(); mutations.disconnect();
      document.querySelectorAll('.epic-reveal').forEach(node => node.classList.add('is-visible'));
   });
})();
