const imageBase = 'https://cdn.myanimelist.net/images/anime/';
const anime = [
   { title: 'Attack on Titan', genre: 'Action', image: '10/47347.jpg' },
   { title: 'Naruto', genre: 'Adventure', image: '13/17405.jpg' },
   { title: 'One Piece', genre: 'Adventure', image: '6/73245.jpg' },
   { title: 'Demon Slayer', genre: 'Action', image: '1286/99889.jpg' },
   { title: 'Tokyo Ghoul', genre: 'Fantasy', image: '5/64449.jpg' },
   { title: 'Hunter x Hunter', genre: 'Adventure', image: '1337/99013.jpg' },
   { title: 'Jujutsu Kaisen', genre: 'Action', image: '1171/109222.jpg' },
   { title: 'Dragon Ball', genre: 'Adventure', image: '1887/92364.jpg' }
];
const fallback = './assets/images/colagemAnime.png';
function animePage(title) {
   return `./pages/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}/index.html`;
}
const extraGifs = [
   { id: 'YqzxGY7ahqobr09YSY', title: 'Demon Slayer · Tanjiro' },
   { id: 'LqQ1CUu5PdjTKu8P9I', title: 'Dragon Ball · Goku' },
   { id: 'vcDEmtZm4kfqwERgaB', title: 'One Piece · Gear 5' },
   { id: '26hitl5xWKMuo4XuM', title: 'One Piece · Chopper' }
];
extraGifs.forEach(({ id, title }) => {
   const card = document.createElement('figure');
   card.className = 'gif-card';
   const img = document.createElement('img');
   img.dataset.gifId = id;
   img.alt = title;
   img.loading = 'lazy';
   img.width = 480;
   img.height = 270;
   const caption = document.createElement('figcaption');
   const name = document.createElement('a');
   name.href = animePage(title.split(' · ')[0]);
   name.textContent = title;
   const source = document.createElement('a');
   source.href = `https://giphy.com/gifs/${id}`;
   source.target = '_blank';
   source.rel = 'noopener noreferrer';
   source.textContent = 'GIPHY ↗';
   caption.append(name, source);
   card.append(img, caption);
   document.querySelector('.gif-grid').append(card);
});
const gifToggle = document.querySelector('#toggle-gifs');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let gifsPaused = motionPreference.matches;
function updateGifs() {
   document.querySelectorAll('[data-gif-id]').forEach(img => {
      img.src = `https://media.giphy.com/media/${img.dataset.gifId}/${gifsPaused ? 'giphy_s.gif' : 'giphy.gif'}`;
   });
   gifToggle.textContent = gifsPaused ? 'Reproduzir GIFs' : 'Pausar GIFs';
   gifToggle.setAttribute('aria-pressed', String(gifsPaused));
}
gifToggle.addEventListener('click', () => { gifsPaused = !gifsPaused; updateGifs(); });
motionPreference.addEventListener('change', event => { gifsPaused = event.matches; updateGifs(); });
document.querySelectorAll('[data-gif-id]').forEach(img => img.addEventListener('error', () => {
   img.src = fallback;
   img.alt = 'Animação indisponível. Veja o GIF pelo link abaixo.';
}, { once: true }));
updateGifs();
function cover(item, className = '') {
   const img = document.createElement('img');
   img.src = imageBase + item.image.replace(/\.jpg$/, 'l.jpg');
   img.alt = item.title;
   img.loading = 'lazy';
   img.className = className;
   img.addEventListener('error', () => {
      img.addEventListener('error', () => { img.src = fallback; }, { once: true });
      img.src = imageBase + item.image;
   }, { once: true });
   return img;
}
function renderAnime(genre = 'All', query = '') {
   const grid = document.querySelector('#anime-grid');
   grid.replaceChildren();
   anime.filter(item => (genre === 'All' || item.genre === genre) && item.title.toLowerCase().includes(query.toLowerCase())).forEach(item => {
      const card = document.createElement('a');
      card.className = 'anime-card';
      card.href = animePage(item.title);
      card.append(cover(item));
      const title = document.createElement('h3'); title.textContent = item.title;
      const subtitle = document.createElement('p'); subtitle.textContent = item.genre + ' · Series';
      card.append(title, subtitle); grid.append(card);
   });
   if (!grid.children.length) { const p = document.createElement('p'); p.textContent = 'No anime found. Try another search.'; grid.append(p); }
}
renderAnime();
document.querySelectorAll('[data-genre]').forEach(button => button.addEventListener('click', () => {
   document.querySelectorAll('[data-genre]').forEach(item => { item.classList.toggle('selected', item === button); item.setAttribute('aria-pressed', String(item === button)); });
   renderAnime(button.dataset.genre);
}));
document.querySelector('#show-all').addEventListener('click', () => document.querySelector('[data-genre="All"]').click());
document.querySelector('.search').addEventListener('submit', event => {
   event.preventDefault(); document.querySelector('[data-genre="All"]').click();
   renderAnime('All', new FormData(event.currentTarget).get('q')); document.querySelector('#genres').scrollIntoView();
});
const headlines = [
   ['A world of stories to discover', 'Find your next adventure in our anime collection.', 0],
   ['Your next anime marathon starts here', 'Explore action, friendship, and unforgettable journeys.', 1],
   ['Meet the heroes behind the adventure', 'Discover the characters that make every story special.', 2],
   ['Beyond the ordinary', 'Step into extraordinary worlds with our fantasy picks.', 4],
   ['The power of friendship', 'Great adventures are even better with a crew.', 2],
   ['Make room on your watchlist', 'Rediscover favorites and explore something new.', 3]
];
headlines.forEach(([title, description, index]) => {
   const card = document.createElement('article'); card.className = 'news-card';
   const media = document.createElement('div'); media.className = 'news-media';
   const artwork = cover(anime[index]);
   const backdrop = document.createElement('img'); backdrop.className = 'news-backdrop'; backdrop.alt = ''; backdrop.setAttribute('aria-hidden', 'true');
   artwork.addEventListener('load', () => { backdrop.src = artwork.currentSrc; });
   media.append(backdrop, artwork); card.append(media);
   const content = document.createElement('div'); content.className = 'news-content'; const label = document.createElement('small'); label.textContent = 'EPIC EDITORIAL';
   const heading = document.createElement('h3');
   const articleLink = document.createElement('a'); articleLink.href = animePage(anime[index].title); articleLink.textContent = title; heading.append(articleLink);
   const text = document.createElement('p'); text.textContent = description;
   content.append(label, heading, text); card.append(content); document.querySelector('#news-grid').append(card);
});
anime.slice(0, 4).forEach(item => {
   const card = document.createElement('a'); card.className = 'release-card'; card.href = animePage(item.title); card.append(cover(item));
   const title = document.createElement('h3'); title.textContent = item.title;
   const text = document.createElement('p'); text.textContent = 'Discover the story · Watch trailers ↗'; card.append(title, text); document.querySelector('#release-grid').append(card);
});
const featured = [
   { title: 'One Piece', subtitle: 'Adventure · Fantasy', image: './assets/images/tripulacao.png' },
   { title: 'The Straw Hat Crew', subtitle: 'Friendship · Adventure', image: './assets/images/TripulacaoChapeu.png' },
   { title: 'A World of Anime', subtitle: 'Discover your next favorite', image: fallback }
];
let current = 0;
function selectFeatured(index) {
   current = (index + featured.length) % featured.length;
   const item = featured[current]; document.querySelector('.featured-backdrop').style.backgroundImage = `url("${item.image}")`;
   document.querySelector('.featured-label span').textContent = item.title; document.querySelector('.featured-label small').textContent = item.subtitle;
   document.querySelectorAll('.carousel-dots button').forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
}
featured.forEach((item, i) => { const button = document.createElement('button'); button.setAttribute('aria-label', item.title); button.addEventListener('click', () => selectFeatured(i)); document.querySelector('.carousel-dots').append(button); });
document.querySelector('.previous').addEventListener('click', () => selectFeatured(current - 1));
document.querySelector('.next').addEventListener('click', () => selectFeatured(current + 1)); selectFeatured(0);
const dialog = document.querySelector('#info-dialog');
const videoDialog = document.querySelector('#video-dialog');
const videoFrame = videoDialog.querySelector('.video-frame');
document.querySelector('.featured-watch').addEventListener('click', () => {
   const player = document.createElement('iframe');
   player.src = 'https://www.youtube-nocookie.com/embed/1KMcoJBMWE4?autoplay=1&rel=0';
   player.title = 'One Piece trailer';
   player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
   player.allowFullscreen = true;
   player.referrerPolicy = 'strict-origin-when-cross-origin';
   videoFrame.replaceChildren(player);
   videoDialog.showModal();
   document.body.classList.add('video-open');
});
videoDialog.querySelector('.video-close').addEventListener('click', () => videoDialog.close());
videoDialog.addEventListener('click', event => {
   const bounds = videoDialog.getBoundingClientRect();
   if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) videoDialog.close();
});
videoDialog.addEventListener('close', () => {
   videoFrame.replaceChildren();
   document.body.classList.remove('video-open');
});
function showInfo(title, message) { dialog.querySelector('h2').textContent = title; dialog.querySelector('p').textContent = message; dialog.showModal(); }
document.querySelectorAll('.dialog-close, .dialog-dismiss').forEach(button => button.addEventListener('click', () => dialog.close()));
const saveButton = document.querySelector('#save-anime');
let saved = false;
try { saved = localStorage.getItem('epic-watchlist') === 'hunter'; } catch {}
function updateSaved() { saveButton.textContent = saved ? '✓ Added to watchlist' : '＋ Add to watchlist'; saveButton.setAttribute('aria-pressed', String(saved)); }
updateSaved();
saveButton.addEventListener('click', () => { saved = !saved; try { saved ? localStorage.setItem('epic-watchlist', 'hunter') : localStorage.removeItem('epic-watchlist'); } catch {} updateSaved(); });
document.querySelectorAll('a[href="#watchlist"], a[href="#profile"], a[href="#premium"]').forEach(link => link.addEventListener('click', event => {
   event.preventDefault(); const target = link.getAttribute('href');
   if (target === '#watchlist') showInfo('Your watchlist', saved ? 'Hunter x Hunter is on your watchlist.' : 'Your watchlist is empty. Add Hunter x Hunter to get started.');
   if (target === '#profile') showInfo('Welcome to Epic Anime', 'Explore the collection and keep a watchlist on this browser.');
   if (target === '#premium') showInfo('Epic Anime Premium', 'Premium is coming soon. Explore our anime collection while you wait.');
}));
