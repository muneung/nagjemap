(() => {

const forecasts = [
{
    weather:"☀ 맑음",
    text:"오늘은 대체로 맑겠습니다. 야외 활동에 지장이 없겠습니다."
},
{
    weather:"🌤 구름 조금",
    text:"구름이 조금 끼겠지만 대체로 좋은 날씨가 예상됩니다."
},
{
    weather:"☁ 흐림",
    text:"종일 흐린 하늘이 이어질 전망입니다."
},
{
    weather:"🌧 비",
    text:"비가 내릴 것으로 예상됩니다. 우산을 준비하시기 바랍니다."
},
{
    weather:"⛈ 폭풍우",
    text:"천둥과 번개를 동반한 폭풍우가 예상됩니다."
},
{
    weather:"🌫 안개",
    text:"쿠모린~"
},
{
    weather:"❄ 눈",
    text:"눈이 내릴 가능성이 있습니다."
},
{
    weather:"💨 강풍",
    text:"바람이 강하게 불겠습니다."
}
];

function getSeed(){

    const d = new Date();

    return Number(
        d.getFullYear().toString() +
        String(d.getMonth()+1).padStart(2,'0') +
        String(d.getDate()).padStart(2,'0')
    );

}

function mulberry32(a){

    return function(){

        let t = a += 0x6D2B79F5;

        t = Math.imul(t ^ t >>> 15, t | 1);

        t ^= t + Math.imul(t ^ t >>> 7, t | 61);

        return ((t ^ t >>> 14) >>> 0) / 4294967296;

    }

}

const rand = mulberry32(getSeed());

const today = forecasts[
    Math.floor(rand() * forecasts.length)
];

const d = new Date();

const dateString =
`${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;

document.getElementById("weather-widget").innerHTML = `
<h3>☁ 시어하트의 일기예보</h3>

<p><strong>관측일</strong><br>${dateString}</p>

<p><strong>오늘의 날씨</strong><br>${today.weather}</p>

<p>${today.text}</p>

`;

})();