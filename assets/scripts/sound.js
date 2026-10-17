(() => {
   const toggle = document.querySelector('.sound-toggle');
   const panel = document.querySelector('#one-piece-sound');
   const container = document.querySelector('.sound-player');
   function stopSound() {
      container.replaceChildren();
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '♫ Som de One Piece';
   }
   toggle.addEventListener('click', () => {
      if (!panel.hidden) { stopSound(); return; }
      const player = document.createElement('iframe');
      player.src = 'https://www.youtube-nocookie.com/embed/1KMcoJBMWE4?autoplay=1&rel=0';
      player.title = 'One Piece — áudio e vídeo do trailer';
      player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      player.allowFullscreen = true;
      player.referrerPolicy = 'strict-origin-when-cross-origin';
      container.replaceChildren(player);
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.textContent = '■ Parar som';
   });
   document.querySelector('.sound-stop').addEventListener('click', () => { stopSound(); toggle.focus(); });
   panel.addEventListener('keydown', event => { if (event.key === 'Escape') { stopSound(); toggle.focus(); } });
   document.querySelector('.featured-watch')?.addEventListener('click', stopSound);
})();
