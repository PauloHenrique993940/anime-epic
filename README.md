# Epic Anime

Site de animes em HTML, CSS e JavaScript, com catálogo, páginas de personagens, GIFs, trailers e lista de favoritos no navegador.

Abra `index.html` no navegador ou use a extensão Live Server do VS Code.

## Estrutura

- `index.html`: página inicial.
- `pages/<anime>/index.html`: páginas individuais dos oito animes.
- `assets/styles/`: estilos e animações.
- `assets/scripts/`: busca, personagens, favoritos e players.
- `assets/images/`: imagens locais.

As fotos dos personagens dependem de Jikan/MyAnimeList ou AniList. GIFs e vídeos dependem de GIPHY e YouTube e precisam de internet.

Para recriar as páginas a partir do catálogo, execute com Node.js:

```sh
node scripts/create-anime-pages.js
```

Esse comando sobrescreve os arquivos `pages/<anime>/index.html`. Para mudanças permanentes nessas páginas, edite o gerador.
