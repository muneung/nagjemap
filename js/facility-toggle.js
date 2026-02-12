// facility-toggle.js
function initFacilityToggle() {
    // 특정 버튼 클릭 감지가 아니라, 문서 전체에서 .fac-trigger가 클릭되는지 감시
    document.addEventListener('click', function(e) {
        // 클릭된 요소가 .fac-trigger인지 확인
        const trigger = e.target.closest('.fac-trigger');
        if (!trigger) return;

        const targetId = trigger.getAttribute('data-target');
        const targetContent = document.getElementById(targetId);
        const isAlreadyActive = trigger.classList.contains('active');

        // 모든 트리거와 컨텐츠 초기화
        const allTriggers = document.querySelectorAll('.fac-trigger');
        const allContents = document.querySelectorAll('.fac-content');

        allTriggers.forEach(t => t.classList.remove('active'));
        allContents.forEach(c => c.style.display = 'none');

        // 토글 로직
        if (!isAlreadyActive && targetContent) {
            trigger.classList.add('active');
            targetContent.style.display = 'block';
        }
    });
}

// 스크립트가 로드되자마자 실행하도록 설정
initFacilityToggle();