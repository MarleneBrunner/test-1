const { getCurrentWeather } = require('../weather'); // 날씨 정보 가져오기

module.exports = {
  name: '용병투입',
  description: '용병을 투입하여 결과에 따라 포인트를 조정합니다.',
  cooldown: 300, // 5분 = 300초

  async execute(message, args, weights, POINTS_COST, userData) {
    const userId = message.author.id;
    let user = userData.get(userId);

    if (!user) {
      user = { points: 0, lastCommand: 0 };
      userData.set(userId, user);
    }

    // 현재 날씨 확인 (Chaos 날씨인지 체크)
    const currentWeather = getCurrentWeather();
    if (currentWeather !== 'Chaos') {
      return message.reply('현재 날씨가 카오스가 아니므로 용병 투입을 할 수 없습니다.');
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
    if (user.points < 500) {
      return message.reply('용병 투입에 필요한 500 포인트가 부족합니다.');
    }

    // 포인트 차감
    user.points -= 500;
    user.lastCommand = currentTime; // 명령어 실행 시간 업데이트

    // 랜덤 결과 생성
    const randomChance = Math.random();  // 0 ~ 1 사이의 랜덤 값 생성
    let pointsChange = 0;
    let responseMessage = '';

    // 3% 확률로 대실패
    if (randomChance < 0.03) {
      pointsChange = -Math.floor(Math.random() * 3000); // 대실패로 포인트 차감 (-4000 ~ 0)
      responseMessage = `[🔴]대실패! PMC용병이 임무에서 큰 실패를 경험했습니다. 포인트 -${Math.abs(pointsChange)}\n현재 포인트: **${user.points}**`;
    }
    // 0.2% 확률로 재난
    else if (randomChance < 0.032) {
      pointsChange = -Math.floor(Math.random() * 9999999); // 재난으로 포인트 차감 (-20000 ~ 0)
      responseMessage = `[⚫]재난! PMC용병이 심각한 재난을 일으켰습니다. 포인트 -${Math.abs(pointsChange)}\n현재 포인트: **${user.points}**`;
    }
    // 63.8% 확률로 실패
    else if (randomChance < 0.938) {
      pointsChange = -Math.floor(Math.random() * 1000); // 실패로 포인트 차감 (-1000 ~ 0)
      responseMessage = `[🟠]실패! PMC용병이 임무를 실패했습니다. 포인트 -${Math.abs(pointsChange)}\n현재 포인트: **${user.points}**`;
    }
    // 30% 확률로 성공
    else if (randomChance < 0.938 + 0.30) {
      pointsChange = Math.floor(Math.random() * 3000) + 500; // 성공으로 포인트 획득 (+1000 ~ +3500)
      responseMessage = `[🟡]성공! PMC용병이 임무를 성공적으로 수행했습니다. 포인트 +${pointsChange}\n현재 포인트: **${user.points}**`;
    }
    // 3% 확률로 대성공
    else if (randomChance < 1) {
      pointsChange = Math.floor(Math.random() * 5000) + 1000; // 대성공으로 포인트 획득 (+2000 ~ +5000)
      responseMessage = `[🟢]대성공! PMC용병이 재단점령 성과를 거두었습니다. 포인트 +${pointsChange}\n현재 포인트: **${user.points}**`;
    }

    // 포인트 업데이트 및 메시지 전송
    user.points += pointsChange;
    userData.set(userId, user);
    message.reply(responseMessage);
  },
};
