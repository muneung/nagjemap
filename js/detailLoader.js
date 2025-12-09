// 상세 콘텐츠 로드 함수
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

// 이벤트 등록 (페이지 로드 및 해시 변경 시)
window.onload = loadDetailContent; 
window.onhashchange = loadDetailContent;