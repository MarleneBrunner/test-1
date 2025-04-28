// commands/weatherchange.js

const { getCurrentWeather, changeWeather } = require('../weather');

module.exports = {
    name: '날씨변경',
    description: '특정 유저만 사용 가능한 현재 날씨 변경 명령어입니다.',
    execute(message, args, weights, POINTS_COST, userData) {
        // 여기에 여러 유저의 ID를 설정합니다.
        const allowedUserIds = ['989478702947639387', '1096075129232044193']; // 두 개의 ID 추가

        // 메시지를 보낸 사용자의 ID를 가져옵니다.
        const userId = message.author.id;

        // 특정 유저인지 확인합니다.
        if (!allowedUserIds.includes(userId)) {
            message.reply('이 명령어는 특정 유저만 사용할 수 있습니다!');
            return;
        }

        // 명령어 형식을 확인합니다.
        if (args.length !== 1 || !['Chaos', 'MTF', 'SCP', 'Glitch', 'Unknown', 'BloodMoon', 'NVDA', 'SCP330', 'GRUP', 'FBI', 'MCD'].includes(args[0])) {
            message.reply('올바른 형식으로 입력해주세요: `!날씨변경 [Chaos/MTF/SCP/Glitch]`');
            return;
        }

        // 변경할 날씨를 가져옵니다.
        const newWeather = args[0];

        // 현재 날씨와 동일하면 변경하지 않습니다.
        if (getCurrentWeather() === newWeather) {
            message.reply(`현재 날씨는 이미 **${newWeather}** 입니다.`);
            return;
        }

        // 날씨 변경 함수 호출
        changeWeather(newWeather);

        // 변경된 날씨 확인 메시지 전송
        message.channel.send(`날씨가 **${newWeather}**로 변경되었습니다!`);
    },
};
