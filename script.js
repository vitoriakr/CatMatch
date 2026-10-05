/* ===== API ===== */

const API = "https://api.thecatapi.com/v1/breeds";

const API_KEY =
    "live_Jc42MA88IOksWpQi12ucfwHQzNYS7H31ipjDRF6xrFSVyVRuqxMlSRGfCNmuj2bE";
// chave gratuita da The Cat API

const API_TRADUCAO =
    "https://api.mymemory.translated.net/get";
// 2ª API: traduz a descrição (en -> pt-BR)


/* ===== Funções auxiliares ===== */
// A API pode mandar número, texto ou null

const nota = v =>
    (v === null || v === undefined || v === "")
        ? NaN
        : Number(v);

const flag = v =>
    v === 1 || v === true || v === "1";

const pesoMax = r =>
    Math.max(
        0,
        ...(String(r.weight?.metric || "")
            .match(/\d+(\.\d+)?/g) || [])
            .map(Number)
    );


/* ===== Características que o usuário pode escolher ===== */
// Cada uma é uma regra aplicada nos dados JSON de cada raça.
// Serve como plano B quando a API não manda a nota da raça.(estava aontecendo bastante)

const tem = (r, palavras) =>
    new RegExp(palavras, "i").test(
        String(r.temperament || "")
    );


const caracteristicas = [
    {
        id: "grande",
        nome: "🐯 Gato grande",
        teste: r => pesoMax(r) >= 7
    },
    {
        id: "pequeno",
        nome: "🐱 Gato pequeno",
        teste: r => pesoMax(r) > 0 && pesoMax(r) <= 5
    },
    {
        id: "carinhoso",
        nome: "💕 Carinhoso",
        teste: r =>
            nota(r.affection_level) >= 4 ||
            tem(r, "affectionate|loving|sweet|devoted|cuddly")
    },
    {
        id: "brincalhao",
        nome: "⚡ Brincalhão",
        teste: r =>
            nota(r.energy_level) >= 4 ||
            tem(r, "playful|active|energetic|lively|fun-loving")
    },
    {
        id: "calmo",
        nome: "😴 Calmo",
        teste: r =>
            nota(r.energy_level) <= 3 ||
            tem(r, "calm|relaxed|quiet|gentle|docile|placid|easygoing|easy going|mellow")
    },
    {
        id: "inteligente",
        nome: "🧠 Inteligente",
        teste: r =>
            nota(r.intelligence) >= 4 ||
            tem(r, "intelligent|smart|clever|bright")
    },
    {
        id: "criancas",
        nome: "👶 Bom com crianças",
        teste: r =>
            nota(r.child_friendly) >= 4 ||
            tem(r, "gentle|patient|sociable|friendly|social|outgoing")
    },
    {
        id: "caes",
        nome: "🐶 Bom com cães",
        teste: r =>
            nota(r.dog_friendly) >= 4 ||
            tem(r, "sociable|friendly|social|outgoing|gregarious")
    },
    {
        id: "colo",
        nome: "🛋️ Gosta de colo",
        teste: r =>
            flag(r.lap) ||
            tem(r, "cuddly|lap|affectionate|loving")
    },
    {
        id: "semPelo",
        nome: "🐈‍⬛ Sem pelo",
        teste: r =>
            flag(r.hairless) ||
            /hairless/i.test(r.description || "")
    }
];


/* ===== Tradução do temperamento ===== */
// Dicionário de tradução

const temperamentos = {
    active: "ativo",
    energetic: "energético",
    independent: "independente",
    intelligent: "inteligente",
    gentle: "gentil",
    affectionate: "carinhoso",
    social: "social",
    playful: "brincalhão",
    loyal: "leal",
    curious: "curioso",
    calm: "calmo",
    relaxed: "relaxado",
    sweet: "doce",
    quiet: "quieto",
    friendly: "amigável",
    outgoing: "extrovertido",
    adaptable: "adaptável",
    easygoing: "tranquilo",
    alert: "alerta",
    agile: "ágil",
    athletic: "atlético",
    patient: "paciente",
    loving: "amoroso",
    lively: "animado",
    dependent: "dependente",
    demanding: "exigente",
    sensible: "sensato",
    tenacious: "tenaz",
    "fun-loving": "divertido",
    interactive: "interativo",
    devoted: "dedicado",
    "highly intelligent": "muito inteligente",
    sociable: "sociável",
    peaceful: "pacífico",
    docile: "dócil",
    warm: "caloroso",
    smart: "esperto",
    trainable: "treinável",
    responsive: "receptivo",
    vocal: "vocal",
    talkative: "falante",
    mischievous: "travesso",
    "strong willed": "determinado",
    sensitive: "sensível",
    open: "aberto",
    courageous: "corajoso",
    fearless: "destemido",
    clever: "astuto",
    inquisitive: "inquisitivo",
    amiable: "amável",
    bold: "ousado",
    dignified: "digno",
    gregarious: "sociável",
    "good-natured": "de bom gênio",
    lovable: "adorável",
    observant: "observador",
    stable: "estável",
    tolerant: "tolerante",
    reserved: "reservado",
    shy: "tímido",
    "even tempered": "equilibrado",
    mild: "dócil",
    placid: "plácido",
    "sweet-tempered": "de temperamento doce",
    cuddly: "fofo",
    muscular: "musculoso",
    entertaining: "divertido",
    lazy: "preguiçoso",
    strong: "forte",
    cat: "gato",
    familial: "familiar",
    trusting: "confiante",
    rowdy: "agitado",
    bright: "esperto",
    "people-oriented": "ligado às pessoas",
    "easy going": "tranquilo",
    expressive: "expressivo",
    rugged: "robusto",
    popular: "popular",
    generous: "generoso",
    mellow: "sereno",
    pleasant: "agradável",
    lovely: "adorável",
    fun: "divertido"
};


const traduzirTemperamento = t =>
    String(t || "")
        .split(",")
        .map(p => p.trim())
        .filter(Boolean)
        .map(
            p =>
                temperamentos[p.toLowerCase()] ||
                p.toLowerCase()
        )
        .join(", ");


/* ===== Tradução do país ===== */

const paises = new Intl.DisplayNames(
    ["pt-BR"],
    { type: "region" }
);

function traduzirOrigem(r) {
    try {
        return String(
            r.country_codes || r.country_code
        )
            .split(",")
            .map(c => paises.of(c.trim()))
            .join(", ");
    } catch {
        return r.origin || "desconhecida";
    }
}


/* ===== API: tradução da descrição ===== */
// Traduz somente quando o usuário clica em "Saber mais"

const cacheTraducao = {};

async function traduzir(texto) {
    if (cacheTraducao[texto]) {
        return cacheTraducao[texto];
    }

    // A API aceita aproximadamente 500 caracteres por pedido.(dividimos)

    const frases =
        texto.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g) || [texto];

    const blocos = [];
    let atual = "";

    frases.forEach(f => {
        if ((atual + f).length > 400) {
            blocos.push(atual);
            atual = f;
        } else {
            atual += f;
        }
    });

    if (atual) {
        blocos.push(atual);
    }

    const partes = await Promise.all(
        blocos.map(async bloco => {
            const resposta = await fetch(
                `${API_TRADUCAO}?q=${encodeURIComponent(bloco)}&langpair=en|pt-BR`
            );

            if (!resposta.ok) {
                throw new Error(resposta.status);
            }

            const dados = await resposta.json();

            if (Number(dados.responseStatus) !== 200) {
                throw new Error(dados.responseStatus);
            }

            return dados.responseData.translatedText;
        })
    );

    return (cacheTraducao[texto] = partes.join(" "));
}


/* ===== Fotos ===== */
// Se a raça não tem foto ou a foto não carrega,
// busca outra foto da mesma raça.

const cacheFoto = {};

async function buscarFoto(r) {
    if (r.id in cacheFoto) {
        return cacheFoto[r.id];
    }

    const opcoes = API_KEY
        ? { headers: { "x-api-key": API_KEY } }
        : {};

    const resposta = await fetch(
        `https://api.thecatapi.com/v1/images/search?breed_ids=${encodeURIComponent(r.id)}&limit=1`,
        opcoes
    );

    if (!resposta.ok) {
        throw new Error(resposta.status);
    }

    const dados = await resposta.json();

    return (cacheFoto[r.id] =
        dados.length ? dados[0].url : null);
}


const semFoto = caixa => {
    caixa.innerHTML =
        '<div class="sem-foto">🐱<small>Foto não disponível</small></div>';
};


function mostrarImagem(caixa, url, alt, aoFalhar) {
    const img = document.createElement("img");

    img.alt = alt;

    img.onerror = () =>
        aoFalhar
            ? aoFalhar()
            : semFoto(caixa);

    img.src = url;

    caixa.innerHTML = "";
    caixa.appendChild(img);
}


async function carregarFoto(caixa, r, url) {
    const alternativa = async () => {
        try {
            const nova = await buscarFoto(r);

            nova
                ? mostrarImagem(
                    caixa,
                    nova,
                    `Gato da raça ${r.name}`
                )
                : semFoto(caixa);

        } catch {
            semFoto(caixa);
        }
    };

    url
        ? mostrarImagem(
            caixa,
            url,
            `Gato da raça ${r.name}`,
            alternativa
        )
        : alternativa();
}


/* ===== Estado ===== */

let racas = [];
let limite = 6;

const escolhidas = new Set();

const $ = s =>
    document.querySelector(s);

const esc = t =>
    String(t ?? "").replace(
        /[&<>"']/g,
        c =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[c])
    );


/* ===== Consumo da API de raças ===== */

async function carregarRacas() {
    try {
        const opcoes = API_KEY
            ? { headers: { "x-api-key": API_KEY } }
            : {};

        const resposta = await fetch(
            `${API}?limit=100`,
            opcoes
        );

        if (!resposta.ok) {
            throw new Error(resposta.status);
        }

        racas = await resposta.json();

        console.log(
            "Exemplo de raça vinda da API:",
            racas[0]
        );

        console.log(
            "Campos da 1ª raça:",
            [
                "affection_level",
                "energy_level",
                "intelligence",
                "child_friendly",
                "dog_friendly",
                "lap",
                "hairless"
            ].map(
                c => `${c}: ${racas[0][c]}`
            )
        );

        contarChips();
        atualizar();

    } catch (erro) {
        const status = Number(erro.message);

        $("#status").textContent =
            status === 401 || status === 403
                ? "A API recusou a chave. Confira a API_KEY no script.js."
                : status === 429
                    ? "Muitas requisições. Espere um pouco e recarregue a página."
                    : erro instanceof TypeError
                        ? "Sem conexão com a API. Verifique sua internet."
                        : `Não foi possível carregar as raças (erro ${erro.message}).`;
    }
}

// Percentual das características escolhidas


function atualizar() {
    const sel =
        caracteristicas.filter(
            c => escolhidas.has(c.id)
        );

    const lista = racas.map(r => {
        const ok =
            sel.filter(c => c.teste(r));

        return {
            r,
            ok,
            total: sel.length,
            pct: sel.length
                ? Math.round(
                    (ok.length / sel.length) * 100
                )
                : null
        };
    });

    if (sel.length) {
        lista.sort(
            (a, b) =>
                b.pct - a.pct ||
                a.r.name.localeCompare(b.r.name)
        );
    }

    const area = $("#cards");

    area.innerHTML = "";

    lista
        .slice(0, limite)
        .forEach(item =>
            area.appendChild(
                criarCard(item)
            )
        );

    $("#mais").hidden =
        limite >= lista.length;

    const melhor =
        lista.length
            ? lista[0].pct
            : 0;

    $("#status").textContent =
        !sel.length
            ? "Clique nas características acima para calcular o match. Por enquanto, algumas raças:"
            : melhor === 0
                ? "Nenhuma raça atende a essas características. Tente tirar alguma."
                : melhor < 100
                    ? "Nenhuma raça atende a todas as características; estas são as mais próximas:"
                    : "Raças ordenadas pelo match com o que você escolheu:";
}


/* ===== Criação dos cards ===== */

function criarCard({
    r,
    ok,
    total,
    pct
}) {
    const foto =
        r.image?.url ||
        (
            r.reference_image_id
                ? `https://cdn2.thecatapi.com/images/${r.reference_image_id}.jpg`
                : ""
        );

    const card =
        document.createElement("article");

    card.className = "card";

    card.innerHTML = `
        <div class="foto">
            <div class="sem-foto">🐱</div>
        </div>

        <div class="corpo">
            <h3>${esc(r.name)}</h3>

            <p class="origem">
                Origem: ${esc(traduzirOrigem(r))}
            </p>

            ${pct !== null ? `
                <div class="match-area">
                    <strong class="match">
                        ${pct}% de match
                    </strong>

                    <span class="contagem">
                        ${ok.length} de ${total} características
                    </span>

                    <div class="barra">
                        <div style="width:${pct}%"></div>
                    </div>
                </div>

                <div class="ok">
                    ${ok
                        .map(
                            c =>
                                `<span>✓ ${esc(
                                    c.nome.replace(/^\S+\s/, "")
                                )}</span>`
                        )
                        .join("")}
                </div>
            ` : ""}

            <div class="detalhes" hidden>
                <p>
                    <b>Temperamento:</b>
                    ${esc(
                        traduzirTemperamento(
                            r.temperament
                        )
                    )}
                </p>

                <p>
                    <b>Peso:</b>
                    ${esc(r.weight?.metric)} kg ·
                    <b>Vida média:</b>
                    ${esc(r.life_span)} anos
                </p>

                <p class="desc"></p>
            </div>

            <button
                class="btn"
                type="button"
                aria-expanded="false"
            >
                Saber mais
            </button>
        </div>
    `;

    carregarFoto(
        card.querySelector(".foto"),
        r,
        foto
    );

    const botao =
        card.querySelector("button");

    const det =
        card.querySelector(".detalhes");

    const desc =
        card.querySelector(".desc");

    botao.onclick = async () => {
        det.hidden = !det.hidden;

        botao.setAttribute(
            "aria-expanded",
            !det.hidden
        );

        botao.textContent =
            det.hidden
                ? "Saber mais"
                : "Mostrar menos";

        if (
            det.hidden ||
            desc.dataset.pronto ||
            !r.description
        ) {
            return;
        }

        desc.textContent =
            "Traduzindo descrição...";

        try {
            desc.textContent =
                await traduzir(
                    r.description
                );

        } catch {
            desc.textContent =
                r.description +
                " (tradução indisponível no momento; texto original em inglês)";
        }

        desc.dataset.pronto = "1";
    };

    return card;
}


/* ===== Chips ===== */
// Características que se contradizem:
// ao escolher uma, a outra é desmarcada.

const opostos = {
    peludo: ["pelofacil", "semPelo"],
    pelofacil: ["peludo"],
    semPelo: ["peludo"],
    grande: ["pequeno"],
    pequeno: ["grande"],
    brincalhao: ["calmo"],
    calmo: ["brincalhao"]
};


const botoesChip = {};

caracteristicas.forEach(c => {
    const b =
        document.createElement("button");

    b.type = "button";
    b.className = "chip";
    b.textContent = c.nome;

    b.setAttribute(
        "aria-pressed",
        "false"
    );

    b.onclick = () => {
        if (escolhidas.has(c.id)) {
            escolhidas.delete(c.id);

        } else {
            escolhidas.add(c.id);

            (opostos[c.id] || [])
                .forEach(o =>
                    escolhidas.delete(o)
                );
        }

        marcarChips();

        limite = 6;

        atualizar();
    };

    botoesChip[c.id] = b;

    $("#chips").appendChild(b);
});


function marcarChips() {
    caracteristicas.forEach(c => {
        botoesChip[c.id].setAttribute(
            "aria-pressed",
            escolhidas.has(c.id)
        );
    });
}


/* ===== Contagem dos chips ===== */
// Depois que as raças chegam, mostra quantas
// raças cada característica possui e desativa
// as que possuem 0.

function contarChips() {
    caracteristicas.forEach(c => {
        const n =
            racas.filter(
                r => c.teste(r)
            ).length;

        botoesChip[c.id].textContent =
            `${c.nome} (${n})`;

        botoesChip[c.id].disabled =
            n === 0;

        botoesChip[c.id].title =
            n === 0
                ? "Nenhuma raça da API tem essa característica"
                : "";
    });
}


/* ===== Botões ===== */

$("#limpar").onclick = () => {
    escolhidas.clear();
    limite = 6;

    marcarChips();
    atualizar();
};


$("#mais").onclick = () => {
    limite += 6;
    atualizar();
};


/* ===== Inicialização ===== */

carregarRacas();