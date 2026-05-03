// Velocidades disponíveis no painel
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

// Guarda a velocidade atual para resistir aos resets do player
let currentSpeed = 1;

// Retorna o elemento <video> da página
function getVideo() {
    return document.querySelector('video');
}

// Altera a velocidade do vídeo e atualiza a interface
function setSpeed(speed) {
    const video = getVideo();
    if (video) {
        video.playbackRate = speed;
        currentSpeed = speed;
        updateButtons();
        updateLabel(speed);
    }
}

// Destaca o botão da velocidade ativa e remove o destaque dos outros
function updateButtons() {
    document.querySelectorAll('.crs-btn').forEach(btn => {
        const speed = parseFloat(btn.dataset.speed);
        if (speed === currentSpeed) {
            btn.classList.add('crs-active');
        } else {
            btn.classList.remove('crs-active');
        }
    });
}

// Atualiza o texto de velocidade exibido no cabeçalho do painel
function updateLabel(speed) {
    const label = document.getElementById('crs-current');
    if (label) label.textContent = speed + 'x';
}

// Cria e injeta o painel de controle na página
function createPanel() {
    // Evita criar o painel duas vezes
    if (document.getElementById('crs-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'crs-panel';

    // Gera os botões dinamicamente a partir do array SPEEDS
    const buttons = SPEEDS.map(speed =>
        `<button class="crs-btn" data-speed="${speed}">${speed}x</button>`
    ).join('');

    panel.innerHTML = `
    <div id="crs-header">
      <span>⚡ Velocidade</span>
      <span id="crs-current">1x</span>
      <button id="crs-minimize">—</button>
    </div>
    <div id="crs-buttons">${buttons}</div>
    `;

    document.body.appendChild(panel);

    // Evento do botão minimizar — alterna entre mostrar e esconder os botões
    document.getElementById('crs-minimize').addEventListener('click', () => {
        const buttonsDiv = document.getElementById('crs-buttons');
        const isMinimized = buttonsDiv.style.display === 'none';

        if (isMinimized) {
            buttonsDiv.style.display = 'flex';
            document.getElementById('crs-minimize').textContent = '-';
        } else {
            buttonsDiv.style.display = 'none';
            document.getElementById('crs-minimize').textContent = '+';
        }
    });

    // Adiciona evento de clique em cada botão de velocidade
    document.querySelectorAll('.crs-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const speed = parseFloat(btn.dataset.speed); // lê o valor do atributo data-speed
            setSpeed(speed);
        });
    });
}

// Verifica se a URL atual é uma página de episódio
// URLs de episódio sempre contém "/watch/", ex: crunchyroll.com/pt-br/watch/ABC123/...
function isWatchPage() {
    return window.location.href.includes('/watch/');
}

// Exibe o painel caso ele exista na página
function showPanel() {
    const panel = document.getElementById('crs-panel');
    if (panel) panel.style.display = 'block';
}

// Esconde o painel caso ele exista na página
function hidePanel() {
    const panel = document.getElementById('crs-panel');
    if (panel) panel.style.display = 'none';
}

// Escuta o evento ratechange e força a velocidade de volta caso o player tente resetar
// Isso acontece ao pular partes do vídeo ou quando o player reinicializa
function attachRateGuard(video) {
    video.addEventListener('ratechange', () => {
        if (video.playbackRate !== currentSpeed){
            video.playbackRate = currentSpeed;
        }
    });
}

// Aguarda o elemento <video> aparecer no DOM e inicializa o painel
// Necessário porque a Crunchyroll é uma SPA — o vídeo é criado dinamicamente
function waitForVideo() {
    if(!isWatchPage()) return;

    const video = getVideo();

    if (video) {
        createPanel();
        attachRateGuard(video);

        // Vigia se o player criou um novo elemento <video> (acontece ao pular o vídeo)
        // e reanexar o evento de proteção de velocidade no novo elemento
        const bodyObserver = new MutationObserver(() => {
            const newVideo = getVideo();
            if (newVideo && newVideo !== video) {
                attachRateGuard(newVideo);
            }
        });

        bodyObserver.observe(document.body, { childList: true, subtree: true});

    } else {
        // Vídeo ainda não existe — observa o DOM até ele aparecer
        const observer = new MutationObserver(() => {
            const video = getVideo();
            if (video) {
                observer.disconnect();
                waitForVideo();
            }
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true});
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                observer.observe(document.body, { childList: true, subtree: true});
            });
        }
    }
}

// Vigia mudanças de URL — necessário porque a Crunchyroll é uma SPA
// Em SPAs a página não recarrega ao navegar, só a URL muda
function startUrlObserver() {
    let lastUrl = window.location.href;
    const urlObserver = new MutationObserver(() => {
        if(window.location.href !== lastUrl){
            lastUrl = window.location.href;

            if (isWatchPage()) {
                // Entrou em um episódio — mostra o painel e inicializa o vídeo
                showPanel();
                setTimeout(waitForVideo, 2000);
            } else {
                // Saiu do episódio — esconde o painel
                hidePanel();
            }
        }
    });

    urlObserver.observe(document.body, { childList: true, subtree: true });
}

// Inicia o observer de URL apenas quando o body existir
// O script roda com document_start, então o body pode ainda não existir
if (document.body) {
    startUrlObserver();
} else {
    document.addEventListener('DOMContentLoaded', startUrlObserver);
}

// Delay inicial para dar tempo ao player da Crunchyroll de inicializar
setTimeout(waitForVideo, 2000);