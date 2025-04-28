// 날씨 종류 및 확률 설정
const weatherTypes = ['Chaos', 'MTF', 'SCP', 'Glitch', 'Unknown', 'BloodMoon', 'NVDA', 'SCP330', 'GRUP', 'FBI', 'MCD'];
const weatherChangeChance = {
    Chaos: 0.30,    // 
    MTF: 0.30,      // 
    SCP: 0.25,      // 
    Glitch: 0.01,   // 
    Unknown: 0.01,  // 
    BloodMoon: 0.01,// 
    NVDA: 0.01,      // 
    SCP303: 0.03,      // 
    GRUP: 0.03,      // 
    FBI: 0.03,      // 
    MCD: 0.02      // 
};

let currentWeather = getRandomWeather(); // 초기 날씨를 랜덤으로 설정
let nextChangeTime = calculateNextChangeTime(); // 다음 날씨 변경까지의 시간 초기화

// 1분마다 날씨 변경 함수
function changeWeather() {
    const rand = Math.random();
    let cumulativeProbability = 0;
    for (const weather of weatherTypes) {
        cumulativeProbability += weatherChangeChance[weather];
        if (rand < cumulativeProbability) {
            currentWeather = weather;
            nextChangeTime = calculateNextChangeTime(); // 날씨가 변경될 때마다 다음 변경까지의 시간 업데이트
            break;
        }
    }
}

// 랜덤으로 날씨를 선택하는 함수
function getRandomWeather() {
    const randIndex = Math.floor(Math.random() * weatherTypes.length); // 0부터 배열 길이-1 사이의 랜덤 인덱스
    return weatherTypes[randIndex]; // 랜덤으로 선택된 날씨 반환
}

// 초기 설정
changeWeather();
setInterval(changeWeather, 30 * 60 * 1000); // 30분마다 날씨 변경

// 다음 날씨 변경까지의 시간을 계산하는 함수 (밀리초 단위)
function calculateNextChangeTime() {
    const now = new Date(); // 현재 시간
    const nextMinute = new Date(now);
nextMinute.setMinutes(now.getMinutes() + 30); // 다음 30분

    return nextMinute.getTime(); // 다음 분의 타임스탬프 반환
}

// 현재 날씨 및 다음 변경까지의 시간을 외부에 공개
module.exports = {
    getCurrentWeather: function() {
        return currentWeather;
    },
    getNextChangeTime: function() {
        return nextChangeTime;
    },
    changeWeather: function(newWeather) {
        currentWeather = newWeather;
        nextChangeTime = calculateNextChangeTime(); // 날씨 변경 시 다음 변경까지의 시간 다시 계산
    }
};
