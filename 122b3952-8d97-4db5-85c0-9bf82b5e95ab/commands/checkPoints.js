module.exports = {
    name: '포인트확인',
    description: '현재 포인트를 확인합니다.',
    async execute(message, args, weights, POINTS_COST, userData) {
      const userId = message.author.id;
      const user = userData.get(userId) || { points: 0, items: {}, fatigue: 0, lastRestTime: Date.now() };
  
      // 사용자 데이터를 업데이트합니다.
      userData.set(userId, user);
  
      // 포인트 확인
      await message.reply(`현재 포인트: ${user.points} 포인트입니다.`);
    },
  };
  