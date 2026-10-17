document.querySelectorAll('[data-poster]').forEach(img => {
   img.addEventListener('error', () => {
      img.addEventListener('error', () => { img.src = '../../assets/images/colagemAnime.png'; }, { once: true });
      img.src = `https://cdn.myanimelist.net/images/anime/${img.dataset.poster}.jpg`;
   }, { once: true });
});
const save = document.querySelector('#detail-save');
const characterSearch = document.querySelector('#character-search');
function filterCharacters() {
   const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
   const query = normalize(characterSearch.value.trim());
   let visible = 0;
   document.querySelectorAll('.character-list li').forEach(item => {
      item.hidden = !normalize(item.textContent).includes(query);
      if (!item.hidden) visible++;
   });
   document.querySelector('#character-empty').hidden = visible > 0;
}
characterSearch.addEventListener('input', filterCharacters);
const animeIds = {
   'one-piece': 21, naruto: 20, 'attack-on-titan': 16498,
   'demon-slayer': 38000, 'tokyo-ghoul': 22319,
   'hunter-x-hunter': 11061, 'jujutsu-kaisen': 40748, 'dragon-ball': 223
};
const characterList = document.querySelector('.character-list');
const characterStatus = document.createElement('p');
characterStatus.className = 'character-loading';
characterStatus.setAttribute('role', 'status');
characterList.before(characterStatus);
const retryCharacters = document.createElement('button');
retryCharacters.className = 'button button-explore';
retryCharacters.textContent = 'Tentar carregar imagens novamente';
retryCharacters.hidden = true;
characterList.before(retryCharacters);
function portraitCard(name, imageUrl, role) {
   const card = document.createElement('li');
   card.className = 'character-card';
   const portrait = document.createElement('div');
   portrait.className = 'character-portrait';
   const initials = document.createElement('span');
   initials.className = 'character-initials';
   initials.textContent = name.split(/[ ,]+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('');
   initials.setAttribute('aria-hidden', 'true');
   portrait.append(initials);
   if (imageUrl && /^https:\/\//.test(imageUrl)) {
      const photo = document.createElement('img');
      photo.src = imageUrl;
      photo.alt = name;
      photo.loading = 'lazy';
      photo.width = 225;
      photo.height = 300;
      photo.addEventListener('error', () => { photo.remove(); }, { once: true });
      portrait.append(photo);
   }
   const caption = document.createElement('div');
   caption.className = 'character-caption';
   const title = document.createElement('h3');
   title.textContent = name;
   caption.append(title);
   if (role) { const label = document.createElement('p'); label.textContent = role === 'Main' ? 'Principal' : 'Coadjuvante'; caption.append(label); }
   card.append(portrait, caption);
   return card;
}
// Preserve the local cast while the portrait catalog loads or is unavailable.
const localCharacters = [...characterList.children].map(item => item.textContent);
characterList.replaceChildren(...localCharacters.map(name => portraitCard(name)));
const castCacheKey = `epic-character-photos-v1-${document.body.dataset.anime}`;
let hasCachedCast = false;
function renderCast(cast) {
   characterList.replaceChildren(...cast.map(({ character, role }) => portraitCard(character.name, character.images?.jpg?.image_url, role)));
   document.querySelector('.character-count').textContent = cast.length;
   filterCharacters();
}
try {
   const cached = JSON.parse(localStorage.getItem(castCacheKey));
   if (Array.isArray(cached) && cached.length && cached.every(item => item.character?.name)) {
      renderCast(cached); hasCachedCast = true;
   }
} catch {}
async function fetchJikan(signal) {
   const response = await fetch(`https://api.jikan.moe/v4/anime/${animeIds[document.body.dataset.anime]}/characters`, { signal });
   if (!response.ok) throw new Error('Jikan unavailable');
   const result = await response.json();
   if (!Array.isArray(result.data) || !result.data.length) throw new Error('Empty cast');
   return { data: result.data, source: 'MyAnimeList / Jikan' };
}
async function fetchAniList(signal) {
   const query = `query ($id: Int!) { Media(idMal: $id, type: ANIME) { characters(perPage: 50, sort: [ROLE, FAVOURITES_DESC]) { edges { role node { id name { full } image { large } } } } } }`;
   const response = await fetch('https://graphql.anilist.co', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables: { id: animeIds[document.body.dataset.anime] } }), signal
   });
   if (!response.ok) throw new Error('AniList unavailable');
   const result = await response.json();
   const edges = result.data?.Media?.characters?.edges;
   if (!edges?.length) throw new Error('Empty cast');
   return { source: 'AniList', data: edges.map(({ node, role }) => ({
      role: role === 'MAIN' ? 'Main' : 'Supporting',
      character: { mal_id: node.id, name: node.name.full, images: { jpg: { image_url: node.image.large } } }
   })) };
}
async function loadCharacters() {
   characterStatus.textContent = hasCachedCast ? 'Atualizando o elenco salvo…' : 'Carregando fotos dos personagens…';
   retryCharacters.hidden = true;
   const controller = new AbortController();
   const timeout = setTimeout(() => controller.abort(), 20000);
   try {
      const result = await Promise.any([fetchJikan(controller.signal), fetchAniList(controller.signal)]);
      const seen = new Set();
      const cast = result.data.filter(entry => {
         if (!entry.character?.name || seen.has(entry.character.mal_id)) return false;
         seen.add(entry.character.mal_id); return true;
      }).sort((a, b) => (a.role === 'Main' ? 0 : 1) - (b.role === 'Main' ? 0 : 1) || a.character.name.localeCompare(b.character.name));
      renderCast(cast);
      try { localStorage.setItem(castCacheKey, JSON.stringify(cast)); hasCachedCast = true; } catch {}
      characterStatus.textContent = `Fotos e elenco: ${result.source}.`;
   } catch {
      characterStatus.textContent = hasCachedCast ? 'Exibindo o elenco salvo. Os serviços de fotos estão indisponíveis no momento.' : 'Os serviços de fotos não responderam. Verifique sua conexão e tente novamente.';
      retryCharacters.hidden = false;
   } finally { clearTimeout(timeout); controller.abort(); }
}
retryCharacters.addEventListener('click', loadCharacters);
loadCharacters();
const key = `epic-saved-${document.body.dataset.anime}`;
let saved = false;
try { saved = localStorage.getItem(key) === 'true'; } catch {}
function updateSave() {
   save.textContent = saved ? '✓ Na minha lista' : '＋ Minha lista';
   save.setAttribute('aria-pressed', String(saved));
}
updateSave();
save.addEventListener('click', () => {
   saved = !saved;
   try {
      localStorage.setItem(key, String(saved));
      document.querySelector('#save-status').textContent = saved ? 'Anime salvo neste navegador.' : 'Anime removido da sua lista.';
   } catch { document.querySelector('#save-status').textContent = 'Sua escolha vale enquanto esta página estiver aberta.'; }
   updateSave();
});
const scene = document.querySelector('#detail-gif');
if (scene) {
   const toggle = document.querySelector('#scene-toggle');
   let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
   function updateScene() {
      scene.src = `https://media.giphy.com/media/${scene.dataset.gif}/${paused ? 'giphy_s.gif' : 'giphy.gif'}`;
      toggle.textContent = paused ? 'Reproduzir GIF' : 'Pausar GIF';
      toggle.setAttribute('aria-pressed', String(paused));
   }
   toggle.addEventListener('click', () => { paused = !paused; updateScene(); });
   scene.addEventListener('error', () => { scene.src = '../../assets/images/colagemAnime.png'; }, { once: true });
   updateScene();
}
