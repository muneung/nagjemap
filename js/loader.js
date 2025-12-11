// ====================================================================
// 사이드바 메뉴 로딩 및 활성화
// ====================================================================
// 현재 페이지 URL을 분석하여 해당 메뉴 항목에 'active' 클래스를 할당
function highlightActiveMenu() {
    const currentPath = window.location.pathname.split('/').pop(); // 현재 파일명 (예: map1-detail.html)
    
    // 모든 메뉴 링크를 검색
    const menuItems = document.querySelectorAll('#menu a');

    menuItems.forEach(link => {
        // 기존 active 클래스 제거 (재실행 시 필요)
        link.closest('.menu-item').classList.remove('active'); 
        
        const linkPath = link.getAttribute('href'); 

        // 일반 페이지 (index.html, map1.html 등) 활성화
        if (linkPath === currentPath) {
            link.closest('.menu-item').classList.add('active');
        } 
        
        // 상세 페이지 (mapN-detail.html) 접속 시 상위 카테고리 (mapN.html) 활성화: 모든 mapN-detail.html 페이지를 mapX.html 메뉴 항목과 연결
        else if (currentPath.endsWith('-detail.html')) {
             // currentPath가 'map1-detail.html' 이고 linkPath가 'map1.html' 인 경우
             if (linkPath.startsWith(currentPath.split('-')[0]) && linkPath.endsWith('.html')) {
                 link.closest('.menu-item').classList.add('active');
             }
        }
    });
}


// 외부 파일 (menu-sidebar.html)을 불러와 #menu 영역에 삽입
function loadSidebarMenu() {
    const menuContainer = document.getElementById('menu');
    
    if (!menuContainer) {
        console.warn("메뉴 컨테이너 (#menu)를 찾을 수 없습니다. 메뉴 로딩 생략.");
        return;
    }
    
    // 로드 파일 경로 설정
    const menuFilePath = 'menu-sidebar.html'; 
    
    fetch(menuFilePath) 
        .then(response => {
            if (!response.ok) {
                throw new Error(`메뉴 파일을 찾을 수 없습니다: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            menuContainer.innerHTML = html;
            // 메뉴 삽입 후 바로 활성화 로직 실행
            highlightActiveMenu(); 
        })
        .catch(error => {
            console.error("Sidebar menu loading failed:", error);
            menuContainer.innerHTML = "<p>메뉴를 불러올 수 없습니다.</p>";
        });
}



// ====================================================================
// 상세 콘텐츠 로드 함수 (mapN-detail.html 전용)
// ====================================================================
function loadDetailContent() {
    const detailId = window.location.hash.substring(1); 
    
    // 타겟 요소는 #detail-content-area
    const dynamicContentArea = document.getElementById('detail-content-area'); 
    
    // 만약 타겟 컨테이너를 찾지 못하면 실행 중단
    if (!dynamicContentArea) {
        console.error("동적 콘텐츠 영역 (#detail-content-area)을 찾을 수 없습니다.");
        return;
    }
    
    // ID가 없는 경우 (map1-detail.html만 접속한 경우)
    if (!detailId || detailId === '') {
        dynamicContentArea.innerHTML = "<h3>지역을 선택해주세요.</h3>";
        return;
    }
    
    const filePath = 'details-map1/' + detailId + '.html'; 
    
    // 로딩 메시지 표시
    dynamicContentArea.innerHTML = "<p>상세 정보를 불러오는 중입니다...</p>";

    // Fetch API를 사용하여 파일 로드
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                // HTTP 오류(404 등) 처리
                throw new Error(`파일을 찾을 수 없습니다: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // 가져온 HTML을 #detail-content-area에 삽입
            dynamicContentArea.innerHTML = html;
        })
        .catch(error => {
            console.error("Content loading failed:", error);
            dynamicContentArea.innerHTML = `<h3>오류 발생</h3><p>해당 지역의 상세 정보를 불러오는 데 실패했습니다. (${error.message})</p>`;
        });
}


// ====================================================================
// mapN.html 또는 mapN-detail.html에서 해당 맵의 테이블을 불러옴
// ====================================================================
function loadMapTable() {
    const tableContainer = document.getElementById('map-table-placeholder');
    if (!tableContainer) return; 

    const currentPath = window.location.pathname.split('/').pop(); 
    let mapNumber = '';
    
    // 현재 파일명에서 맵 번호 추출
    if (currentPath.startsWith('map1')) {
        mapNumber = '1';
    } else if (currentPath.startsWith('map2')) {
        mapNumber = '2';
    } else if (currentPath.startsWith('map3')) {
        mapNumber = '3';
    }
    
    // 맵 번호가 없으면 종료 (테이블 로드가 필요 없는 페이지)
    if (!mapNumber) return;

    // 경로 지정 >> 폴더: details-map[N] / 파일: table-map[N].html
    const tableFilePath = `details-map${mapNumber}/table-map${mapNumber}.html`; 
    
    tableContainer.innerHTML = `<p>맵 ${mapNumber} 테이블을 불러오는 중입니다...</p>`;

    fetch(tableFilePath)
        .then(response => {
            if (!response.ok) {
                // 맵 테이블 파일을 찾을 수 없거나 로드 실패
                throw new Error(`맵 ${mapNumber} 테이블 파일 로드 실패: ${response.status} (${tableFilePath})`);
            }
            return response.text();
        })
        .then(html => {
            // 로드된 HTML을 컨테이너에 삽입
            tableContainer.innerHTML = html;
        })
        .catch(error => {
            console.error(`Map ${mapNumber} table loading failed:`, error);
            tableContainer.innerHTML = `<p style="color: red;">맵 ${mapNumber} 테이블 로드 실패.</p>`;
        });
}



// ====================================================================
// 이벤트 등록 및 실행
// ====================================================================
window.onload = function() {
    loadSidebarMenu(); // 메뉴 로드 (모든 페이지에서 실행)

    // 맵 테이블 로드가 필요한 페이지인지 확인 후 실행
    if (document.getElementById('map-table-placeholder')) {
        loadMapTable(); 
    }

    // 상세 로드 기능을 가진 페이지인지 확인 후 설정
    if (document.getElementById('detail-content-area')) {
        // 페이지 로드 시 상세 내용 로드
        loadDetailContent();
        
        // 해시 변경 시 상세 내용 및 메뉴 활성화 재실행
        window.onhashchange = function() {
             loadDetailContent();
             highlightActiveMenu();
        };
    }
};