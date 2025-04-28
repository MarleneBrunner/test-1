const { getCurrentWeather } = require('../weather'); // 날씨 정보 가져오기

module.exports = {
  name: '발라븐투입', // 명령어 변경
  description: '용병을 투입하여 결과에 따라 포인트를 조정합니다.',
  cooldown: 1800, // 30분 = 1800초로 변경

  async execute(message, args, weights, POINTS_COST, userData) {
    const userId = message.author.id;
    let user = userData.get(userId);

    if (!user) {
      user = { points: 0, lastCommand: 0 };
      userData.set(userId, user);
    }

    // 현재 날씨 확인 (MCD 날씨인지 체크)
    const currentWeather = getCurrentWeather();
    if (currentWeather !== 'MCD') {
      return message.reply('현재 날씨가 MCD가 아니므로 발라븐을 투입할 수 없습니다.');
    }

    // 쿨타임 확인
    const currentTime = Date.now();
    const timeSinceLastCommand = currentTime - user.lastCommand;
    const remainingCooldown = this.cooldown * 1000 - timeSinceLastCommand;

    if (user.lastCommand && remainingCooldown > 0) {
      const minutesLeft = Math.ceil(remainingCooldown / 60000);
      return message.reply(`이 명령어는 ${minutesLeft}분 후에 사용할 수 있습니다.`);
    }

    // 포인트 차감 (2500 포인트 필요)
    if (user.points < 2500) {
      return message.reply('발라븐 투입에 필요한 2500 포인트가 부족합니다.');
    }

    // 포인트 차감
    user.points -= 2500;
    user.lastCommand = currentTime; // 명령어 실행 시간 업데이트

    // 랜덤 결과 생성
    const randomChance = Math.random();  // 0 ~ 1 사이의 랜덤 값 생성
    let pointsChange = 0;
    let responseMessage = '';

    // 80% 확률로 성공
    if (randomChance < 0.80) {
      pointsChange = Math.floor(Math.random() * 1500) + 2500; // 성공으로 포인트 획득 (+2500 ~ +4000)
      responseMessage = `[🟡]성공! 발라븐 코퍼레이션이 임무를 수행했습니다. 포인트 +${pointsChange}\n현재 포인트: **${user.points}**`;
    }
    // 10% 확률로 대성공
    else if (randomChance < 0.90) {
      pointsChange = Math.floor(Math.random() * 1000) + 4000; // 대성공으로 포인트 획득 (+4000 ~ +5000)
      responseMessage = `[🟢]대성공! 발라븐 코퍼레이션이 임무를 완벽하게 거두었습니다. 포인트 +${pointsChange}\n현재 포인트: **${user.points}**`;
    }
    // 10% 확률로 실패 (아무 보상 없음)
      else {
          responseMessage = `[🔴]실패! 발라븐 코퍼레이션이 임무를 실패했습니다. 아무런 보상도 없습니다.\n현재 포인트: **${user.points}**`;
      }

    // 포인트 업데이트 및 메시지 전송
    user.points += pointsChange;
    userData.set(userId, user);
    message.reply(responseMessage);
  },
};


