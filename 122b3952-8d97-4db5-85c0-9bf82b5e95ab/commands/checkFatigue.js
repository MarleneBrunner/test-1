module.exports = {
  name: '피로도확인',
  description: '현재 피로도를 확인합니다.',
  async execute(message, args, weights, POINTS_COST, userData) {
    const userId = message.author.id;
    let user = userData.get(userId);

    // 사용자 데이터가 없으면 기본값을 설정
    if (!user) {
      user = { fatigue: 0, lastRestTime: Date.now(), points: 0, timerStartTime: null, timer: false };
      userData.set(userId, user);
    }

    // 피로도가 199 미만일 경우 피로도 상태를 확인할 수 없음
    if (user.fatigue < 199) {
      return message.reply('피로도가 199 미만일 경우, 피로도 상태를 확인할 수 없습니다.');
    }

    // 피로도가 199 이상일 경우 타이머 시작
    if (user.fatigue >= 199) {
      // 타이머가 이미 실행 중이라면 남은 시간 표시
      if (user.timer) {
        const elapsedTime = (Date.now() - user.timerStartTime) / 1000; // 경과 시간 (초 단위)
        const remainingTime = 3600 - elapsedTime; // 1시간 (3600초)에서 경과 시간을 빼면 남은 시간

        if (remainingTime > 0) {
          const minutesLeft = Math.floor(remainingTime / 60);  // 남은 시간 (분)
          const secondsLeft = Math.floor(remainingTime % 60);  // 남은 시간 (초)
          return message.reply(`타이머가 이미 실행 중입니다. 남은 시간: ${minutesLeft}분 ${secondsLeft}초`);
        } else {
          // 타이머 완료 후 피로도 0으로 초기화
          user.fatigue = 0;
          user.timer = false;  // 타이머 종료
          userData.set(userId, user);
          return message.reply('타이머가 완료되어 피로도가 0으로 초기화되었습니다.');
        }
      }

      // 타이머 시작: 현재 시간 기록
      user.timerStartTime = Date.now();
      user.timer = true;  // 타이머 진행 중 상태로 설정
      userData.set(userId, user);

      message.reply('타이머가 시작되었습니다. 남은 시간은 1시간입니다.');
    }

    // 타이머가 진행 중일 경우
    if (user.timer) {
      const elapsedTime = (Date.now() - user.timerStartTime) / 1000; // 경과 시간 (초 단위)
      const remainingTime = 3600 - elapsedTime; // 1시간 (3600초)에서 경과 시간을 빼면 남은 시간

      if (remainingTime <= 0) {
        // 타이머가 완료되면 피로도 0으로 초기화
        user.fatigue = 0;
        user.timer = false;  // 타이머 종료
        userData.set(userId, user);
        return message.reply('타이머가 완료되어 피로도가 0으로 초기화되었습니다.');
      }

      // 남은 시간 계산 (분, 초)
      const minutesLeft = Math.floor(remainingTime / 60);
      const secondsLeft = Math.floor(remainingTime % 60);

      message.reply(`타이머가 진행 중입니다. 남은 시간: ${minutesLeft}분 ${secondsLeft}초`);
    } else {
      // 타이머가 진행 중이지 않다면 피로도 상태 메시지
      const currentTime = Date.now();
      const timeSinceLastRest = (currentTime - user.lastRestTime) / (1000 * 60 * 60); // 시간 단위로 변경

      let fatigueStatus;

      if (timeSinceLastRest >= 1) {
        // 1시간 이상 휴식 시 피로도 초기화
        user.fatigue = 0;
        user.lastRestTime = currentTime;
        userData.set(userId, user);
        fatigueStatus = '피로도가 0으로 초기화되었습니다.';
      } else {
        // 1시간 이내일 때 피로도 감소 (이제 피로도 감소는 필요없음)
        fatigueStatus = `현재 피로도: ${user.fatigue}. 피로도 감소는 아직 이루어지지 않았습니다.`;
      }

      // 포인트 +1 처리
      user.points += 1;
      userData.set(userId, user);

      // 피로도 상태와 포인트 증가 메시지 보내기
      await message.reply(`${fatigueStatus} 포인트가 1 증가하여 현재 포인트는 ${user.points}입니다.`);
    }
  },
};

