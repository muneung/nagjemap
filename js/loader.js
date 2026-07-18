// ====================================================================
// 페이지 전환 함수 (navigateTo)
// ====================================================================
async function navigateTo(pageUrl) {
    const mainContainer = document.getElementById('main');
    if (!mainContainer) return;

    // "map1-detail.html?id=xxx" 에서 fetch는 "map1-detail.html"만 함
    // 물음표(?)를 기준으로 잘라내어 순수 파일명만 추출
    const pureFileName = pageUrl.split('?')[0];
    // 같은 페이지 파일 내에서 파라미터(id)만 바뀌는 경우 처리
    const isSameFile = mainContainer.getAttribute('data-current-page') === pureFileName;

    try {
        const response = await fetch(pureFileName);
        if (!response.ok) throw new Error(`${pureFileName} 파일을 찾을 수 없습니다.`);
        
        const html = await response.text();
        
        // 메인 영역 교체
        mainContainer.innerHTML = html;
        mainContainer.setAttribute('data-current-page', pureFileName); // 현재 파일명 저장

        // 콘텐츠 로드 후 후속 로직 (페이지 요소에 따라 자동 실행)

        // 맵 테이블 로드 (id="map-table-placeholder" 가 있는 경우)
        if (document.getElementById('map-table-placeholder')) {
            loadMapTable(); 
        }

        // 지역 상세 정보 로드 (id="detail-content-area" 가 있는 경우)
        if (document.getElementById('detail-content-area')) {
            loadDetailContent();
        }

        // 포켓몬 상세 정보 로드 (id="pokemon-detail-placeholder" 가 있는 경우)
        if (document.getElementById('pokemon-detail-placeholder')) {
            loadPokemonDetail();
        }

        // 레시피 상세 정보
        if (document.getElementById('recipe-detail-placeholder')) {
            loadRecipeDetail();
        }

        // 날씨 위젯
        if (document.getElementById('weather-widget')) {
            loadWeatherWidget();
        }

        // 메뉴 활성화 표시 업데이트
        highlightActiveMenu(); 

        // 로드 완료 후 상단으로 스크롤
        window.scrollTo(0, 0);

    } catch (err) {
        console.error("Navigation error:", err);
        mainContainer.innerHTML = `<h2>오류 발생</h2><p>${pureFileName} 로드 실패.</p>`;
    }
}



// ====================================================================
// 맵 테이블 로드 함수 (mapN/table-mapN.html 호출)
// ====================================================================
function loadMapTable() {
    const tableContainer = document.getElementById('map-table-placeholder');
    if (!tableContainer) return; 

    // 현재 주소 해시에서 파일명 추출 (#map1-detail.html?id=... -> map1)
    const currentHash = window.location.hash.substring(1).split('?')[0]; 
    const match = currentHash.match(/map(\d+)/); // 숫지만 추출
    const mapNumber = match ? match[1] : '';
    
    if (!mapNumber) return;

    const tableFilePath = `details-map${mapNumber}/table-map${mapNumber}.html`; 

    fetch(tableFilePath)
        .then(res => {
            if (!res.ok) throw new Error("테이블 파일 없음");
            return res.text();
        })
        .then(html => {
            tableContainer.innerHTML = html;
        })
        .catch(err => {
            console.warn("Table load failed:", err);
            tableContainer.innerHTML = `<p>테이블을 불러올 수 없습니다.</p>`;
        });
}



// ====================================================================
// 상세 데이터 로드 함수 (details-mapN/지역명.html 호출)
// ====================================================================
function loadDetailContent() {
    const hash = window.location.hash;
    if (!hash.includes('?id=')) return;

    // 해시에서 파일명과 파라미터 분리
    const parts = hash.substring(1).split('?id='); 
    const currentPageFile = parts[0]; // map1-detail.html
    const detailId = parts[1];        // detail-지역명

    const dynamicContentArea = document.getElementById('detail-content-area');
    
    if (dynamicContentArea && detailId) {
        // 폴더명 동적 생성: map1-detail -> details-map1
        const mapKey = currentPageFile.split('-')[0];
        const filePath = `details-${mapKey}/${detailId}.html`; 

        fetch(filePath)
            .then(res => res.text())
            .then(html => {
                dynamicContentArea.innerHTML = html;
            })
            .catch(err => {
                dynamicContentArea.innerHTML = `<p>정보 로드 실패: ${err.message}</p>`;
            });
    }
}



// ====================================================================
// 포켓몬 상세 정보 로드 (pokedex-detail.html?name=포켓몬번호)
// ====================================================================
function loadPokemonDetail() {
    const detailContainer = document.getElementById('pokemon-detail-placeholder');
    if (!detailContainer) return;

    // SPA 구조에 맞게 해시(#)에서 파라미터를 추출
    const hash = window.location.hash;
    if (!hash.includes('?name=')) {
        detailContainer.innerHTML = `<p>포켓몬 정보가 지정되지 않았습니다.</p>`;
        return;
    }

    // URL에서 포켓몬 이름 추출 (#pokedex-detail.html?name=번호 > 번호)
    const pokemonName = hash.split('?name=')[1];

    // 데이터 파일 경로 지정 (폴더: details-pokemon / 파일: 포켓몬번호.html)
    const detailFilePath = `details-pokemon/${pokemonName}.html`;

    detailContainer.innerHTML = `<p><strong>${pokemonName}</strong> 정보를 불러오는 중입니다...</p>`;

    fetch(detailFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${pokemonName} 상세 파일을 찾을 수 없습니다.`);
            }
            return response.text();
        })
        .then(html => {
            // 가져온 HTML을 컨테이너에 삽입
            detailContainer.innerHTML = html;
        })
        .catch(error => {
            console.error('Pokemon detail loading failed:', error);
            detailContainer.innerHTML = `<p style="color: red;">정보를 불러오는 데 실패했습니다. (파일명: ${pokemonName}.html)</p>`;
        });
}


// ====================================================================
// 레시피 상세 정보 로드 (recipe-detail.html?name=레시피이름)(위에거 뽑아옴)
// ====================================================================
function loadRecipeDetail() {
    const detailContainer = document.getElementById('recipe-detail-placeholder');
    if (!detailContainer) return;

    // SPA 구조에 맞게 해시(#)에서 파라미터를 추출
    const hash = window.location.hash;
    if (!hash.includes('?name=')) {
        detailContainer.innerHTML = `<p>레시피 정보가 지정되지 않았습니다.</p>`;
        return;
    }

    // URL에서 레시피 이름 추출 (#pokedex-detail.html?name=이름 > 이름)
    const recipeName = hash.split('?name=')[1];

    // 데이터 파일 경로 지정 (폴더: details-recipe / 파일: 레시피이름.html)
    const detailFilePath = `details-recipe/${recipeName}.html`;

    detailContainer.innerHTML = `<p><strong>${recipeName}</strong> 정보를 불러오는 중입니다...</p>`;

    fetch(detailFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${recipeName} 상세 파일을 찾을 수 없습니다.`);
            }
            return response.text();
        })
        .then(html => {
            // 가져온 HTML을 컨테이너에 삽입
            detailContainer.innerHTML = html;
        })
        .catch(error => {
            console.error('Recipe detail loading failed:', error);
            detailContainer.innerHTML = `<p style="color: red;">정보를 불러오는 데 실패했습니다. (파일명: ${recipeName}.html)</p>`;
        });
}



// ====================================================================
// 일기예보 위젯
// ====================================================================
function loadWeatherWidget() {
    const widget = document.getElementById('weather-widget');
    if (!widget) return;

    const forecasts = [
        { weather: "☀ 맑음", text: "오늘은 대체로 맑을 것으로 예상됩니다.<br>모험을 떠나기에 덧없이 완벽한 하루가 될 예정입니다.<br>몬스터볼과 상처약은 충분한가요?" },
        { weather: "🌤 구름", text: "구름이 조금 끼겠지만, 대체로 좋은 날씨가 예상됩니다.<br>이따금 구름이 사이로 햇살이 내리쬐는 좋은 날씨일 것입니다." },
        { weather: "☁ 흐림", text: "흐린 하늘이 이어질 것으로 예상됩니다.<br>비가 내릴 가능성은 없겠으나, 태양이 잘 보이지 않을 전망입니다." },
        { weather: "🌧 비", text: "온종일 비가 내릴 것으로 예상됩니다.<br>웅덩이를 밟지 않도록 주의하세요.<br>눈이 내리는 지역에서는 설경을 관측할 수 있을 것입니다." },
        { weather: "⛈ 천둥", text: "천둥과 번개를 동반한 비가 예상됩니다.<br>비는 잦아들지 않고 하루 온종일 내릴 예정입니다.<br>우산을 잊진 않았는지 점검해 보세요." },
        { weather: "🌫 안개", text: "안개가 이데아를 가릴 것으로 예상됩니다.<br>시야가 흐릴 수 있으니 주의하시길 바랍니다.<br>앞을 잘 보면서 조심조심 걸으세요." },
        { weather: "💨 강풍", text: "편서풍이 강하게 불 것으로 예상됩니다." }
    ];

    function getSeed() {
        const d = new Date();
        return Number(
            d.getFullYear().toString() +
            String(d.getMonth() + 1).padStart(2, '0') +
            String(d.getDate()).padStart(2, '0')
        );
    }

    function mulberry32(a) {
        return function () {
            let t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    const rand = mulberry32(getSeed());
    const today = forecasts[Math.floor(rand() * forecasts.length)];
    const d = new Date();
    const dateString = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

    widget.innerHTML = `
        <h3>☁ 시어하트의 일기예보</h3>
        <p><strong>관측일</strong><br>${dateString}</p>
        <p><strong>오늘의 하늘</strong><br>${today.weather}</p>
        <p>${today.text}</p>
    `;
}



// ====================================================================
// 사이드바
// ====================================================================
// 메뉴 하이라이트 활성화
function highlightActiveMenu() {
    const currentPath = window.location.hash.substring(1).split('?')[0] || 'news.html';
    const menuItems = document.querySelectorAll('#menu a');

    menuItems.forEach(link => {
        const item = link.closest('.menu-item');
        if (!item) return;
        
        item.classList.remove('active'); 
        const linkPath = link.getAttribute('href'); 

        // 현재 페이지 혹은 상위 맵 페이지 활성화
        if (linkPath === currentPath) {
            item.classList.add('active');
        } else if (currentPath.endsWith('-detail.html') && linkPath === currentPath.replace('-detail', '')) {
            item.classList.add('active');
        }
    });
}

// 사이드바 HTML 로드
function loadSidebarMenu() {
    const menuContainer = document.getElementById('menu');
    if (!menuContainer) return;
    
    fetch('menu-sidebar.html') 
        .then(res => res.text())
        .then(html => {
            menuContainer.innerHTML = html;
            highlightActiveMenu(); 
        });
}



// ====================================================================
// 클릭 이벤트 관리
// ====================================================================
// 전역 클릭 이벤트 감시 (사이드바 메뉴 + 맵 테이블 내 링크 모두 대응)
document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');

    // 내부 .html 링크인 경우만 SPA 작동
    if (href && !href.startsWith('http') && href.includes('.html')) {
        e.preventDefault(); 
        
        // 주소창 업데이트 (# 추가)
        history.pushState(null, '', `#${href}`);
        
        // 실제 콘텐츠 로드
        navigateTo(href);
    }
});

// 초기 실행 및 뒤로가기 대응
window.onload = () => {
    loadSidebarMenu();
    const initialPage = window.location.hash.substring(1) || 'news.html';
    navigateTo(initialPage);
};

window.onpopstate = () => {
    const page = window.location.hash.substring(1) || 'news.html';
    navigateTo(page);
};
