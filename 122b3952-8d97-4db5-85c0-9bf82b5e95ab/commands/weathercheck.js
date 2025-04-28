const { getCurrentWeather, getNextChangeTime } = require('../weather');

module.exports = {
    name: '날씨확인',
    description: '현재 날씨와 다음 날씨 변경까지 남은 시간을 확인합니다.',
    execute(message, args) {
        const currentWeather = getCurrentWeather(); // 현재 날씨 가져오기
        const nextChangeTime = getNextChangeTime(); // 다음 날씨 변경까지의 시간 가져오기

        // 현재 시간 및 다음 변경 시간 계산
        const currentTime = Date.now();
        let remainingTime = nextChangeTime - currentTime;

        // 만약 남은 시간이 음수라면 0으로 설정
        if (remainingTime < 0) {
            remainingTime = 0;
        }

        // 분과 초 단위로 남은 시간 계산
        const remainingMinutes = Math.floor(remainingTime / (1000 * 60));
        const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        // 날씨 정보와 남은 시간 보내기
        message.channel.send(`현재 날씨는 **${currentWeather}** 입니다.\n다음 날씨 변경까지 **${remainingMinutes}분 ${remainingSeconds}초** 남았습니다.`);
    },
};
