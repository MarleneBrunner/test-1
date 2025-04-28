const { getCurrentWeather } = require('../weather'); // 날씨 정보 가져오기

module.exports = {
  name: '침투', // 명령어 변경
  description: 'FBI 침투를 수행하고 결과에 따라 포인트와 피로도를 조정합니다.',
  cooldown: 1800, // 쿨타임 0으로 설정

  async execute(message, args, weights, POINTS_COST, userData) {
    const userId = message.author.id;
    let user = userData.get(userId);

    if (!user) {
      user = { points: 0, lastCommand: 0, fatigue: 1 }; // 피로도의 기본값을 1로 설정
      userData.set(userId, user);
    }

    // 현재 날씨 확인 (FBI 날씨인지 체크)
    const currentWeather = getCurrentWeather();
    if (currentWeather !== 'FBI') {
      return message.reply('현재 날씨가 FBI가 아니므로 FBI 침투를 수행할 수 없습니다.');
    }

    // 쿨타임 확인
    const currentTime = Date.now();
    const timeSinceLastCommand = currentTime - user.lastCommand;
    const remainingCooldown = this.cooldown * 1000 - timeSinceLastCommand;

    if (user.lastCommand && remainingCooldown > 0) {
      const minutesLeft = Math.ceil(remainingCooldown / 60000);
      return message.reply(`이 명령어는 ${minutesLeft}분 후에 사용할 수 있습니다.`);
    }

    // 포인트 차감 (1000 포인트 필요)
    if (user.points < 1000) {
      return message.reply('FBI 침투에 필요한 1000 포인트가 부족합니다.');
    }

    // 포인트 차감
    user.points -= 1000;
    user.lastCommand = currentTime; // 명령어 실행 시간 업데이트

    // 랜덤 결과 생성
    const randomChance = Math.random();  // 0 ~ 1 사이의 랜덤 값 생성
    let pointsChange = 0;
    let fatigueChange = 0;
    let responseMessage = '';

    // 45% 확률로 실패
    if (randomChance < 0.45) {
      fatigueChange = Math.floor(Math.random() * (35 - 20 + 1)) + 20; // 피로도 +20 ~ +35
      responseMessage = `[🟡]실패! FBI 침투에 실패했습니다. 피로도 +${fatigueChange}\n현재 포인트: **${user.points}**\n현재 피로도: **${user.fatigue + fatigueChange}**`;
    }
    // 50% 확률로 성공
    else if (randomChance < 0.95) {
      fatigueChange = Math.floor(Math.random() * (40 - 10 + 1)) - 40; // 피로도 -10 ~ -40
      responseMessage = `[🟢]성공! FBI 침투가 성공적으로 완료되었습니다. 피로도 -${Math.abs(fatigueChange)}\n현재 포인트: **${user.points}**\n현재 피로도: **${user.fatigue + fatigueChange}**`;
    }
    // 5% 확률로 대성공
    else if (randomChance < 1) {
      fatigueChange = -user.fatigue; // 피로도 리셋
      responseMessage = `[🟣]대성공! FBI 침투가 완벽하게 이루어졌습니다. 피로도 리셋!\n현재 포인트: **${user.points}**\n현재 피로도: **0**`;
    }

    // 피로도 업데이트 및 제한 적용 (최대 200, 최소 1)
    user.fatigue = Math.max(1, Math.min(user.fatigue + fatigueChange, 200)); // 피로도 최소 1, 최대 200으로 제한
    userData.set(userId, user);
    message.reply(responseMessage);
  },
};


