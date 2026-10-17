# Epic Anime

Site para explorar universos de anime, conhecer personagens e descobrir novas histórias. Desenvolvido com **HTML, CSS e JavaScript**, com tema escuro, detalhes em verde e layout responsivo.

## Funcionalidades

- Catálogo com busca por nome e filtros por gênero.
- Carrossel de animes em destaque.
- Páginas individuais com sinopse, personagens e recomendações.
- Galeria de personagens com fotos e busca por nome.
- Consulta de elenco pelo Jikan/MyAnimeList e AniList, com cache dos dados no navegador.
- GIFs com controle para pausar e reproduzir.
- Trailer de One Piece em uma janela sobre a página.
- Player flutuante para ouvir o áudio do trailer de One Piece.
- Favoritos no navegador com `localStorage`.
- Animações que respeitam a preferência de movimento reduzido.

## Animes disponíveis

| Anime | Arquivo da página |
| --- | --- |
| One Piece | [index.html](pages/one-piece/index.html) |
| Naruto | [index.html](pages/naruto/index.html) |
| Attack on Titan | [index.html](pages/attack-on-titan/index.html) |
| Demon Slayer | [index.html](pages/demon-slayer/index.html) |
| Tokyo Ghoul | [index.html](pages/tokyo-ghoul/index.html) |
| Hunter x Hunter | [index.html](pages/hunter-x-hunter/index.html) |
| Jujutsu Kaisen | [index.html](pages/jujutsu-kaisen/index.html) |
| Dragon Ball | [index.html](pages/dragon-ball/index.html) |

Os links acima abrem arquivos do repositório. Para navegar pelo site, execute o projeto localmente.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| HTML5 | Estrutura das páginas |
| CSS3 | Layout, responsividade e animações |
| JavaScript | Busca, filtros, galerias, favoritos e players |
| Node.js | Geração das páginas individuais durante o desenvolvimento |

O site é estático e não exige instalação de pacotes nem etapa de build.

## Como executar

Clone o repositório:

```sh
git clone https://github.com/PauloHenrique993940/anime-epic.git
cd anime-epic
```

Abra a pasta no VS Code e inicie `index.html` com a extensão **Live Server**. Também é possível abrir o arquivo diretamente no navegador, mas um servidor local é recomendado para as integrações externas.

É necessário acesso à internet para consultar o elenco, carregar imagens externas, exibir GIFs e reproduzir vídeos. Não é preciso configurar chaves de API. Node.js só é necessário para executar o gerador de páginas.

## Estrutura do projeto

```text
anime-epic/
├── index.html
├── README.md
├── assets/
│   ├── images/                  # Imagens locais
│   ├── styles/
│   │   ├── reset.css            # Normalização dos estilos
│   │   ├── styles.css           # Página inicial
│   │   ├── anime.css            # Páginas individuais
│   │   └── animations.css       # Animações compartilhadas
│   └── scripts/
│       ├── main.js              # Catálogo, filtros, GIFs e carrossel
│       ├── anime.js             # Personagens e favoritos por anime
│       ├── animations.js        # Animações ao entrar na tela
│       └── sound.js             # Player flutuante
├── pages/
│   └── <nome-do-anime>/
│       └── index.html           # Uma página para cada anime
└── scripts/
    └── create-anime-pages.js    # Gerador das páginas individuais
```

## Personalização

### Editar as páginas dos animes

Os dados e o HTML das páginas individuais ficam em [scripts/create-anime-pages.js](scripts/create-anime-pages.js). Após editar o catálogo, execute:

```sh
node scripts/create-anime-pages.js
```

**Esse comando sobrescreve os arquivos `pages/<nome-do-anime>/index.html`.** Faça alterações permanentes no gerador para preservá-las na próxima execução.

### Adicionar um anime

1. Adicione seus dados ao catálogo e ao `characterCatalog` do gerador.
2. Inclua seu identificador do MyAnimeList em `animeIds`, no arquivo `assets/scripts/anime.js`.
3. Acrescente o anime ao catálogo da página inicial em `assets/scripts/main.js`.
4. Execute o gerador e confira a nova página e os links.

### Alterar o visual

Edite `styles.css` para a página inicial, `anime.css` para as páginas individuais e `animations.css` para os efeitos. Todos ficam em `assets/styles/`.

## Integrações

| Serviço | Conteúdo |
| --- | --- |
| Jikan / MyAnimeList | Elenco e fotos dos personagens; capas pelo CDN do MyAnimeList |
| AniList | Fonte alternativa para elenco e fotos |
| GIPHY | GIFs animados |
| YouTube | Trailers e áudio do trailer |

Se os serviços de personagens estiverem indisponíveis, a página mantém o elenco salvo ou a lista local e oferece uma nova tentativa. O cache guarda dados e endereços das fotos; não garante imagens disponíveis sem internet.

## Estado do projeto

O site oferece navegação e descoberta de animes. Os trailers usam conteúdo externo; o projeto não hospeda episódios. Conta e Premium são demonstrações de interface.

Os favoritos ficam no navegador utilizado e não são sincronizados entre dispositivos. A lista da página inicial e os favoritos das páginas individuais usam armazenamentos separados.

## Créditos

Desenvolvido por [Paulo Henrique](https://github.com/PauloHenrique993940).

Personagens, marcas, imagens, GIFs e vídeos pertencem aos respectivos titulares e fontes. Este repositório não atribui licença de redistribuição a esses materiais.
