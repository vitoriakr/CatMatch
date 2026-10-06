<div align="center">

# 🐱 CatMatch

### Descubra qual raça de gato combina com você

Escolha as características que você procura e o CatMatch mostra as raças mais compatíveis, com porcentagem de *match*.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![API](https://img.shields.io/badge/The_Cat_API-F29B5C?style=for-the-badge&logoColor=white)

</div>

---

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Como funciona](#-como-funciona)
- [APIs utilizadas](#-apis-utilizadas)
- [Como as APIs são consumidas](#-como-as-apis-são-consumidas)
- [Chave de API e segurança](#-chave-de-api-e-segurança)
- [Sistema de match](#-sistema-de-match)
- [Front-end e responsividade](#-front-end-e-responsividade)
- [Tratamento de erros](#-tratamento-de-erros)
- [Conteúdos aplicados](#-conteúdos-aplicados)
- [Limitações](#-limitações)
- [Como executar](#-como-executar)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Autora](#-autora)

---

## 🐾 Sobre o projeto

O **CatMatch** é uma aplicação web que ajuda a encontrar raças de gatos que combinam com o que a pessoa procura. Em vez de pesquisar raça por raça, o usuário clica em características como *carinhoso*, *calmo*, *gato grande* ou *bom com crianças*, e o site compara essas escolhas com os dados reais de cada raça.

O projeto reúne duas atividades:

| Disciplina | O que foi pedido | Como aparece no CatMatch |
| --- | --- | --- |
| **Web (APIs/JSON)** | Buscar uma API, consumir os dados e explicar no README | Consumo da The Cat API e da MyMemory com `fetch`, `async/await` e JSON |
| **Front-end** | Página responsiva com header, título, descrição, 3+ cards com botão e footer | Layout mobile first, grid de cards com botão "Saber mais" em cada um, header e footer |

---

## 💻 Como funciona

1. O usuário abre o site e o JavaScript carrega as raças pela **The Cat API**.
2. O usuário clica nas características que procura (os "chips" da seção 1).
3. Para cada raça, o código testa se ela atende a cada característica escolhida.
4. O site calcula o **% de match** e ordena as raças da mais compatível para a menos compatível.
5. Os resultados aparecem em **cards** com foto, origem, porcentagem, barra de match e as características atendidas (✓).
6. O botão **Saber mais** abre os detalhes: temperamento, peso, vida média e descrição, traduzidos para português.
7. O botão **Mostrar mais raças** carrega mais resultados e **Limpar escolhas** reinicia os filtros.

---

## 🌐 APIs utilizadas

### 🐈 The Cat API

API principal. Fornece dados de raças e imagens. Base: `https://api.thecatapi.com/v1`

| Requisição | Para que serve |
| --- | --- |
| `GET /breeds?limit=100` | Lista as raças com nome, origem, temperamento, peso, vida média, descrição e foto |
| `GET /images/search?breed_ids={id}&limit=1` | Busca outra foto da mesma raça quando a lista não trouxe uma foto ou ela não carregou |

### 🌎 MyMemory

API de tradução gratuita, usada para traduzir a **descrição** da raça do inglês para o português do Brasil.

| Requisição | Para que serve |
| --- | --- |
| `GET https://api.mymemory.translated.net/get?q={texto}&langpair=en\|pt-BR` | Traduz um trecho de texto |

### 🔤 Outras traduções (sem API)

| Informação | Como é traduzida |
| --- | --- |
| Temperamento (ex.: *Affectionate* → *carinhoso*) | Dicionário dentro do `script.js` |
| País de origem (ex.: *Egypt* → *Egito*) | `Intl.DisplayNames`, recurso do próprio navegador |

---

## 🔌 Como as APIs são consumidas

O consumo é feito em JavaScript com `fetch()` e `async/await`, porque uma chamada HTTP é assíncrona: o navegador precisa esperar o servidor responder sem travar a página.

```text
Usuário abre o site
        ↓
JavaScript faz a requisição (fetch) com a chave no header
        ↓
The Cat API devolve um array JSON com as raças
        ↓
JavaScript lê os dados (response.json())
        ↓
Cada raça é comparada com os filtros e vira um card
        ↓
Usuário clica em "Saber mais"
        ↓
A descrição é enviada à MyMemory e volta traduzida
```

Exemplo simplificado do carregamento das raças:

```js
const resposta = await fetch("https://api.thecatapi.com/v1/breeds?limit=100", {
  headers: { "x-api-key": API_KEY },
});
if (!resposta.ok) throw new Error(resposta.status);
const racas = await resposta.json();
```

**Recursos de API usados no projeto**

- **Query parameters:** `limit`, `breed_ids`, `q` e `langpair`.
- **Headers:** `x-api-key` para autenticação na The Cat API.
- **JSON:** a resposta chega como texto JSON e é convertida em objetos com `response.json()`.
- **Cache:** traduções e fotos já buscadas ficam guardadas para não repetir requisições.
- **Tradução em blocos:** a MyMemory aceita textos curtos, então a descrição é dividida por frases em blocos de até 400 caracteres.

Exemplo simplificado de um item recebido da API:

```json
{
  "id": "abys",
  "name": "Abyssinian",
  "origin": "Egypt",
  "temperament": "Active, Energetic, Independent, Intelligent, Gentle",
  "life_span": "14 - 15",
  "weight": { "metric": "3 - 5" }
}
```

---

## 🔐 Chave de API e segurança

A The Cat API exige uma chave (`API Key`), enviada no header `x-api-key`. Sem ela a API responde com erro e o site mostra: *"A API recusou a chave"*.

Como o código roda no navegador, qualquer pessoa pode ver a chave pelas ferramentas do navegador ou pelo repositório. Por isso:

- a chave usada aqui é uma **chave gratuita criada só para esta atividade**, sem acesso a nada pago ou privado;
- em um projeto real, a chave ficaria em um **servidor (backend)** ou em variáveis de ambiente, nunca no JavaScript público.

Para usar outra chave, troque o valor da constante `API_KEY` no começo do `script.js`. Para criar uma gratuita, acesse [thecatapi.com](https://thecatapi.com/).

Outra proteção usada: os textos vindos das APIs passam pela função `esc()` antes de entrar no HTML, para evitar que algum conteúdo inesperado seja interpretado como código.

---

## 🧠 Sistema de match

Cada característica é uma **regra** aplicada aos dados da raça. Quando a API manda a nota (de 1 a 5), o código usa a nota. Quando a nota não vem, o código procura palavras no **temperamento**.

| Característica | Regra principal | Plano B (palavras no temperamento) |
| --- | --- | --- |
| 🐯 Gato grande | peso máximo ≥ 7 kg | — |
| 🐱 Gato pequeno | peso máximo ≤ 5 kg | — |
| 💕 Carinhoso | `affection_level` ≥ 4 | affectionate, loving, sweet, devoted, cuddly |
| ⚡ Brincalhão | `energy_level` ≥ 4 | playful, active, energetic, lively, fun-loving |
| 😴 Calmo | `energy_level` ≤ 3 | calm, relaxed, quiet, gentle, docile, placid, easygoing, mellow |
| 🧠 Inteligente | `intelligence` ≥ 4 | intelligent, smart, clever, bright |
| 👶 Bom com crianças | `child_friendly` ≥ 4 | gentle, patient, sociable, friendly, social, outgoing |
| 🐶 Bom com cães | `dog_friendly` ≥ 4 | sociable, friendly, social, outgoing, gregarious |
| 🛋️ Gosta de colo | `lap` = 1 | cuddly, lap, affectionate, loving |
| 🐈‍⬛ Sem pelo | `hairless` = 1 | "hairless" na descrição |

**Cálculo da porcentagem:**

```text
match (%) = (características que a raça atende ÷ características escolhidas) × 100
```

Exemplo: se o usuário escolhe 4 características e a raça atende 3, o match é **75%**.

**Regras extras da interface**

- Características que se contradizem se desmarcam sozinhas (*gato grande* × *gato pequeno* e *brincalhão* × *calmo*).
- Cada característica mostra, entre parênteses, quantas raças a atendem. Se nenhuma atende, ela fica desativada.
- O texto acima dos cards explica o resultado: se nenhuma raça atende a todas as características, o site avisa e mostra as mais próximas.

---

## 🎨 Front-end e responsividade

A página segue a estrutura pedida: **header**, **título principal**, **descrição**, **área de cards** (cada card com um botão) e **footer**.

O CSS usa a estratégia **mobile first**: o layout base é o de celular e as media queries (`min-width`) ampliam para telas maiores.

| Tela | Breakpoint | Colunas de cards | Mudanças |
| --- | --- | --- | --- |
| 📱 Celular | base | 1 | Header empilhado, layout em coluna |
| 📱 Tablet | `min-width: 768px` | 2 | Header em linha, logo à esquerda e menu à direita |
| 🖥️ Desktop | `min-width: 1100px` | 3 | Mais espaçamento na página |

**Conceitos de CSS aplicados**

| Conceito | Onde foi usado |
| --- | --- |
| CSS Grid com `fr` | Grade dos cards (`repeat(3, 1fr)`) |
| Flexbox | Header, chips de filtro, interior dos cards e botões |
| Media queries e breakpoints | 768px e 1100px |
| `clamp()` | Tamanho do título principal |
| Unidades `rem`, `%` e `vw` | Espaçamentos, larguras e fonte responsiva |
| Variáveis CSS | Paleta de cores em `:root` |
| `aspect-ratio` | Proporção das fotos dos cards |

---

## 🛡️ Tratamento de erros

O código usa `response.ok`, `response.status` e `try/catch` para informar o usuário em vez de simplesmente parar de funcionar.

| Situação | O que o site faz |
| --- | --- |
| Erro 401 ou 403 (chave recusada) | Mostra que a chave foi recusada e manda conferir a `API_KEY` |
| Erro 429 (muitas requisições) | Pede para esperar um pouco e recarregar |
| Falha de rede (sem internet) | Avisa que não foi possível conectar |
| Outro erro HTTP | Mostra o código do erro |
| Tradução indisponível | Mostra a descrição original em inglês, com aviso |
| Raça sem foto | Tenta outra foto da mesma raça; se não houver, mostra 🐱 e "Foto não disponível" |

---

## 📚 Conteúdos aplicados

**Web (APIs/JSON)**

- O que é uma API, cliente, servidor, requisição e resposta;
- Endpoints e método `GET`;
- Códigos de status HTTP (200, 401, 403, 429);
- JSON e `response.json()`;
- Fetch API, `async/await` e operações assíncronas;
- Tratamento de erros com `response.ok` e `try/catch`;
- Query parameters e headers;
- Autenticação com API Key e cuidados de segurança.

**Front-end**

- HTML semântico (`header`, `main`, `section`, `article`, `footer`);
- Media queries, breakpoints e mobile first;
- Unidades absolutas e relativas (`rem`, `%`, `vw`);
- CSS Grid com `fr`, Flexbox e `clamp()`;
- Manipulação do DOM e eventos em JavaScript.

---

## ⚠️ Limitações

- A The Cat API **não informa cor dos olhos nem comprimento do pelo**, por isso esses filtros não existem no CatMatch.
- Algumas raças não têm todas as notas na API. Nesses casos o match usa o temperamento como plano B, que é menos preciso.
- Algumas raças não têm foto na API e mostram o aviso "Foto não disponível".
- A tradução da descrição é automática e pode conter erros. Há um limite diário de uso gratuito na MyMemory.
- Os dados dependem da API: se ela mudar ou ficar fora do ar, o site é afetado.

---

## 🚀 Como executar

1. Baixe ou clone o repositório.
2. Abra a pasta do projeto.
3. Confira se a constante `API_KEY` no início do `script.js` tem uma chave válida.
4. Abra o `index.html` no navegador.
5. Clique nas características e veja os matches.

É preciso ter **internet** para as requisições às APIs e para carregar a fonte do Google Fonts.

---

## 📁 Estrutura do projeto

```text
CatMatch/
├── index.html   # estrutura: header, título, filtros, cards e footer
├── style.css    # visual e responsividade
├── script.js    # consumo das APIs, regras de match e criação dos cards
└── README.md    # documentação
```

---

## 👩‍💻 Autora

**Vitória Kereski da Rosa**

Projeto acadêmico desenvolvido para as disciplinas de **Web (APIs/JSON)** e **Front-end**.

Dados de gatos fornecidos pela [The Cat API](https://thecatapi.com/). Traduções por [MyMemory](https://mymemory.translated.net/).
