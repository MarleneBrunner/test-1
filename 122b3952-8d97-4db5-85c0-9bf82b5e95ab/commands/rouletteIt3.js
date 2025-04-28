module.exports = {
  name: '룰렛3',
  description: '룰렛을 돌려 원하는 상품을 뽑습니다.',
  async execute(message, args, weights, POINTS_COST, userData) {
    const userId = message.author.id;
    let user = userData.get(userId);

    // 사용자가 데이터가 없으면 룰렛을 돌릴 수 없음
    if (!user) {
      return message.reply('사용자 데이터가 존재하지 않습니다. 먼저 초기화를 진행해주세요.');
    }

    // 룰렛1 돌리기 위해 필요한 포인트 차감
    if (user.points < 1000) {
      return message.reply(`룰렛을 돌리기 위해서는 4500 포인트가 필요합니다.`);
    }

    // 포인트 차감: 룰렛을 돌리기 전에 차감
    user.points -= 1000;

    // 룰렛 상품 목록과 확률 설정
    const rouletteItems = [
      { item: '털게', probability: 0.05 },
      { item: '가방', probability: 0.01 },
      { item: '꽝', probability: 0.94 },
    ];

    // 상품 목록에 대한 확률 합계 계산
    const totalProbability = rouletteItems.reduce((acc, item) => acc + item.probability, 0);

    // 0과 totalProbability 사이의 랜덤값을 생성하여 상품을 선택
    const random = Math.random() * totalProbability;

    let cumulativeProbability = 0;
    let selectedItem = null;

    // 누적 확률을 기준으로 랜덤값에 맞는 상품 선택
    for (const { item, probability } of rouletteItems) {
      cumulativeProbability += probability;
      if (random < cumulativeProbability) {
        selectedItem = item;
        break;
      }
    }

    // 털게가 뽑혔을 때 포인트 차감
    if (selectedItem === '털게') {
      user.points -= 10000;
      await message.reply(`🎰 **룰렛 결과**: ${selectedItem} -10,000 포인트 차감!`);
    } else {
      await message.reply(`🎰 **룰렛 결과**: ${selectedItem}`);
    }

    // 사용자 데이터를 업데이트
    userData.set(userId, user);
  },
};
