// 메뉴 토글 기능 및 반응형 처리를 위한 함수
function initializeMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');

    if (!menu || !menuToggle) {
        console.error("Required elements #menu or #menu-toggle not found.");
        return;
    }

    // 메뉴 토글 함수
    function toggleMenu() {
        // visible/hidden 클래스를 토글하여 메뉴를 열거나 닫음
        menu.classList.toggle('visible');
        menu.classList.toggle('hidden');
    }

    // 버튼 클릭 이벤트 리스너 연결
    menuToggle.addEventListener('click', toggleMenu);
    
    // 화면 크기를 감지하여 메뉴 상태를 설정하는 함수
    function checkViewport() {
        // 모바일 기준 폭 (768px)
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // 모바일 상태: 메뉴를 fixed로 고정하고 숨김 상태로 시작하도록 클래스 설정
            menu.style.position = 'fixed';
            menu.style.height = '100vh';
            
            // 데스크톱에서 설정된 인라인 transform 스타일을 제거하여 CSS 클래스 (.hidden)의 transform 규칙이 적용되게
            menu.style.transform = '';

            // 만약 visible 또는 hidden 클래스가 설정되어 있지 않다면 hidden으로 시작
            if (!menu.classList.contains('visible') && !menu.classList.contains('hidden')) {
                 menu.classList.add('hidden');
            }
        } else {
            // 데스크톱 상태: 메뉴를 항상 보이게 함
            menu.style.transform = 'none'; // CSS 변형 제거 (항상 보이게)
            menu.classList.remove('hidden', 'visible'); // hidden/visible 클래스 제거
            
            // 모바일에서 설정했던 모든 인라인 스타일을 제거
            menu.style.position = '';  // CSS의 sticky가 적용되도록 초기화
            menu.style.height = '';    // CSS의 max-height가 적용되도록 초기화
            menu.style.top = ''; 
            menu.style.left = '';
        }
    }
    
    // 페이지 로드 시 및 화면 크기 변경 시 함수 menu.style.position = 'fixed'
    window.addEventListener('load', checkViewport);
    window.addEventListener('resize', checkViewport);

    // load 이벤트 이전에 스크립트가 실행될 경우를 대비해 한 번 즉시 실행
    checkViewport(); 
}

// DOM 콘텐츠가 모두 로드된 후 initializeMenu 함수 실행
document.addEventListener('DOMContentLoaded', initializeMenu);