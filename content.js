const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
let currentSpeed = 1;

function getVideo() {
    return document.querySelector('video');
}

function setSpeed(speed) {
    const video = getVideo();
    if (video) {
        video.playbackRate = speed;
        currentSpeed = speed;
        updateButtons();
        updateLabel(speed);
    }
}

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

function updateLabel(speed) {
    const label = document.getElementById('crs-current');
    if (label) label.textContent = speed + 'x';
}

function createPanel() {
    if (document.getElementById('crs-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'crs-panel';

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
    })

    document.querySelectorAll('.crs-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const speed = parseFloat(btn.dataset.speed);
            setSpeed(speed);
        });
    });
}

function isWatchPage() {
    return window.location.href.includes('/watch/');
}

function showPanel() {
    const panel = document.getElementById('crs-panel');
    if (panel) panel.style.display = 'block';
}

function hidePanel() {
    const panel = document.getElementById('crs-panel');
    if (panel) panel.style.display = 'none';
    
}

function attachRateGuard(video) {
    video.addEventListener('ratechange', () => {
        if (video.playbackRate !== currentSpeed){
            video.playbackRate = currentSpeed;
        }
    });
}

function waitForVideo() {

    if(!isWatchPage()) return;

    const video = getVideo();

    if (video) {
        createPanel();
        attachRateGuard(video);

        const bodyObserver = new MutationObserver(() => {
            const newVideo = getVideo();
            if (newVideo && newVideo !== video) {
                attachRateGuard(newVideo);
            }
        });

        bodyObserver.observe(document.body, { childList: true, subtree: true});

    } else {
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

function startUrlObserver() {
    let lastUrl = window.location.href;
    const urlObserver = new MutationObserver(() => {
        if(window.location.href !== lastUrl){
            lastUrl = window.location.href;

            if (isWatchPage()) {
                showPanel();
                setTimeout(waitForVideo, 2000);
            } else {
                hidePanel();
            }
        }
    });

    urlObserver.observe(document.body, { childList: true, subtree: true });
}

if (document.body) {
    startUrlObserver();
} else {
    document.addEventListener('DOMContentLoaded', startUrlObserver);
}

setTimeout(waitForVideo, 2000);