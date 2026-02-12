/* audioplayer.js */
window.initAudioPlayers = function () {
    const playerTargets = document.querySelectorAll('.custom-audio-target');

    playerTargets.forEach((target) => {
        if (target.dataset.initialized === 'true') return;

        const audioSrc = target.getAttribute('data-src');

        // HTML 주입
        target.innerHTML = `
            <div class="custom-player-wrapper">
                <audio class="main-audio" src="${audioSrc}"></audio>
                <div class="main-controls">
                    <button type="button" class="play-btn">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="display:block;">
                            <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
                        </svg>
                    </button>
                    
                    <div class="seek-area">
                        <input type="range" class="seek-bar" value="0" max="100">
                        <div class="time-row">
                            <span class="current-time">0:00</span>
                            <span class="duration-time">0:00</span>
                        </div>
                    </div>

                    <div class="volume-group">
                        <button type="button" class="mute-btn">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                            </svg>
                        </button>
                        <input type="range" class="vol-bar" min="0" max="1" step="0.1" value="0.5">
                    </div>
                    <div class="more-menu">
                        <button type="button" class="more-btn">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                        </button>
                        <div class="more-options">
                            <div class="opt-item">
                                <span>반복 재생</span>
                                <label class="loopswitch">
                                    <input type="checkbox" class="loop-chk">
                                    <span class="loopswitch-slider round"></span>
                                </label>
                            </div>
                            <div class="opt-item"><span>속도</span>
                                <select class="speed-sel">
                                    <option value="0.75">x0.75</option>
                                    <option value="1" selected>x1.0</option>
                                    <option value="1.25">x1.25</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 요소 선택
        const audio = target.querySelector('.main-audio');
        const playBtn = target.querySelector('.play-btn');
        const seekBar = target.querySelector('.seek-bar');
        const muteBtn = target.querySelector('.mute-btn');
        const volBar = target.querySelector('.vol-bar');
        const moreBtn = target.querySelector('.more-btn');
        const options = target.querySelector('.more-options');
        const loopChk = target.querySelector('.loop-chk');
        const speedSel = target.querySelector('.speed-sel');

        // 시간 표시 요소 선택
        const curTimeText = target.querySelector('.current-time');
        const durTimeText = target.querySelector('.duration-time');

        // 초(sec)를 0:00 형식으로 변환하는 함수
        const formatTime = (seconds) => {
            if (isNaN(seconds) || seconds === Infinity) return "0:00";
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60);
            return `${min}:${sec < 10 ? '0' + sec : sec}`;
        };

        // 오디오 메타데이터 로드 시 전체 시간 표시
        audio.onloadedmetadata = () => {
            durTimeText.innerText = formatTime(audio.duration);
        };

        // 재생/일시정지 버튼 클릭 이벤트
        playBtn.onclick = () => {
            if (audio.paused) {
                audio.play();
                // 일시정지 아이콘 (두 줄 막대) SVG 삽입
                playBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="display:block;">
                <path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"/>
            </svg>`;
            } else {
                audio.pause();
                // 재생 아이콘 (삼각형) SVG 삽입
                playBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="display:block;">
                <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
            </svg>`;
            }
        };

        // 오디오 재생이 끝났을 때 아이콘을 다시 재생(삼각형)으로 변경
        audio.onended = () => {
            playBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="display:block;">
                <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
            </svg>`;
        };

        // 재생바 및 현재 시간 업데이트
        audio.ontimeupdate = () => {
            const val = (audio.currentTime / audio.duration) * 100 || 0;
            seekBar.value = val;
            curTimeText.innerText = formatTime(audio.currentTime); // 현재 시간 실시간 표시
        };

        // 재생바 조절
        seekBar.oninput = () => {
            const time = (seekBar.value / 100) * audio.duration;
            audio.currentTime = time;
        };

        // 음량 아이콘 선언
        const volIcons = {
            high: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`,
            low: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>`,
            mute: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`
        };
        // 아이콘 업데이트를 위한 공통 함수
        const updateVolIcon = () => {
            const val = parseFloat(volBar.value);
            if (audio.muted || val === 0) {
                muteBtn.innerHTML = volIcons.mute;
            } else if (val < 0.5) {
                muteBtn.innerHTML = volIcons.low;
            } else {
                muteBtn.innerHTML = volIcons.high;
            }
        };

        // 음소거 버튼 클릭
        muteBtn.onclick = () => {
            audio.muted = !audio.muted;
            updateVolIcon();
        };

        // 볼륨 조절 슬라이더
        volBar.oninput = () => {
            audio.volume = volBar.value;
            // 볼륨이 0이 되면 자동으로 음소거 상태로 인식하게 함
            audio.muted = (volBar.value === "0");
            updateVolIcon();
        };

        // 더보기 버튼 클릭 시 메뉴 토글
        moreBtn.onclick = (e) => {
            e.stopPropagation(); // 이 버튼을 누를 때 문서 전체 클릭 이벤트가 발생하는 걸 막음
            options.classList.toggle('show');
        };

        // 메뉴 안쪽을 클릭했을 때 메뉴가 닫히지 않게 방지
        options.onclick = (e) => {
            e.stopPropagation(); // 메뉴 내부(속도 조절 등)를 클릭해도 닫히지 않음
        };

        // 반복 재생
        loopChk.onchange = () => {
            audio.loop = loopChk.checked;
        };

        // 속도 조절
        speedSel.onchange = () => {
            audio.playbackRate = parseFloat(speedSel.value);
        };

        target.dataset.initialized = 'true';
    });
};

// 외부 클릭 시 메뉴 닫기 및 감시 로직
if (!window.audioEventRegistered) {
    document.addEventListener('click', () => {
        document.querySelectorAll('.more-options').forEach(opt => opt.classList.remove('show'));
    });
    window.audioEventRegistered = true;
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            window.initAudioPlayers();
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });
window.initAudioPlayers();