module.exports = {
  name: '구매',
  description: '아이템을 구매합니다.',
  async execute(message, args, weights, POINTS_COST, userData) {
    if (args.length === 0) {
      return message.reply('구매할 아이템을 지정해주세요.');
    }

    const item = args.join(' ').toLowerCase();
    const userId = message.author.id;
    let user = userData.get(userId);

    if (!user) {
      // 사용자 데이터가 없는 경우 초기화
      user = {
        points: 0,
        items: {},
        fatigue: 0,
        lastRestTime: Date.now(),
      };
    }

    // 사용자 아이템 객체가 없는 경우 초기화
    if (!user.items) {
      user.items = {};
    }

    // 구매할 아이템에 따라 처리합니다.
    switch (item) {
      case '피로 회복 주스':
        if (user.points >= POINTS_COST.JUICE) {
          user.points -= POINTS_COST.JUICE;
          user.items.juice = (user.items.juice || 0) + 1;
          user.fatigue = Math.max(user.fatigue - 50, 0); // 피로도 감소
          await message.reply('피로 회복 주스를 구매했습니다! 피로도가 추가로 50 감소합니다.');
        } else {
          await message.reply('포인트가 부족합니다.');
        }
        break;

      case '핫식스':
        if (user.points >= POINTS_COST.HOT6) {
          user.points -= POINTS_COST.HOT6;
          user.fatigue = 0; // 피로도 초기화
          await message.reply('핫식스를 구매했습니다! 피로도가 초기화됩니다.');
        } else {
          await message.reply('포인트가 부족합니다.');
        }
        break;

      case '낚시왕 칭호':
        if (user.items.title) {
          await message.reply('이미 낚시왕 칭호를 보유하고 있습니다.');
        } else if (user.points >= POINTS_COST.TITLE) {
          user.points -= POINTS_COST.TITLE;
          user.items.title = true;
          await message.reply('낚시왕 칭호를 구매했습니다! 최대 피로도가 300까지 증가합니다.');
        } else {
          await message.reply('포인트가 부족합니다.');
        }
        break;

      case '+2 품목':
        if (user.items.plus2) {
          await message.reply('+2 품목은 최대 1개만 구매할 수 있습니다.');
        } else if (user.points >= POINTS_COST.PLUS2) {
          user.points -= POINTS_COST.PLUS2;
          user.items.plus2 = true;
          await message.reply('+2 품목을 구매했습니다!');
        } else {
          await message.reply('포인트가 부족합니다.');
        }
        break;

      case '+3 품목':
        if (user.items.plus3) {
          await message.reply('+3 품목은 최대 1개만 구매할 수 있습니다.');
        } else if (user.points >= POINTS_COST.PLUS3) {
          user.points -= POINTS_COST.PLUS3;
          user.items.plus3 = true;
          await message.reply('+3 품목을 구매했습니다!');
        } else {
          await message.reply('포인트가 부족합니다.');
        }
        break;

      default:
        await message.reply('존재하지 않는 아이템입니다.');
        return;
    }

    // 사용자 데이터를 업데이트합니다.
    userData.set(userId, user);
  },
};
