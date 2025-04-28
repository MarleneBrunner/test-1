module.exports = {
  name: '피로도변경',
  description: '특정 유저들의 피로도를 강제로 변경합니다. 멘션된 유저의 피로도를 지정한 값으로 설정합니다.',
  async execute(message, args, weights, POINTS_COST, userData) {
    // 특정 유저 2명만 사용 가능
    const allowedUsers = ['989478702947639387', '1096075129232044193']; // 사용할 수 있는 유저들 ID 목록
    if (!allowedUsers.includes(message.author.id)) {
      await message.reply('이 명령어는 특정 유저만 사용할 수 있습니다.');
      return;
    }

    // 피로도 변경할 값이 숫자인지 확인
    const fatigueValue = parseInt(args[args.length - 1], 10);
    if (isNaN(fatigueValue)) {
      await message.reply('피로도 값은 숫자로 입력해야 합니다.');
      return;
    }

    // 멘션된 유저 확인
    const mentionedUsers = message.mentions.users;

    if (mentionedUsers.size === 0) {
      await message.reply('피로도를 변경할 유저를 멘션해주세요.');
      return;
    }

    // 멘션된 유저 수가 2명 이상인 경우 처리
    if (mentionedUsers.size > 2) {
      await message.reply('최대 2명까지만 피로도를 변경할 수 있습니다.');
      return;
    }

    // 피로도 변경
    mentionedUsers.forEach(user => {
      // userData에서 해당 유저 정보를 찾기
      let userDataEntry = userData.get(user.id);

      if (!userDataEntry) {
        userDataEntry = { points: 0, items: {}, fatigue: 0, lastRestTime: Date.now() };
      }

      // 피로도 값을 강제 변경
      userDataEntry.fatigue = Math.min(Math.max(fatigueValue, 0), 200);  // 0 ~ 200 사이로 제한

      // 업데이트된 정보 저장
      userData.set(user.id, userDataEntry);

      // 결과 메시지
      message.reply(`**${user.tag}** 유저의 피로도가 **${userDataEntry.fatigue}**로 변경되었습니다.`);
    });
  },
};

