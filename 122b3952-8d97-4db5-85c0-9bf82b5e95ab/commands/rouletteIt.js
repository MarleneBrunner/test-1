module.exports = {
  name: '룰렛1',
  description: '룰렛을 돌려 원하는 상품을 뽑습니다.',
  async execute(message, args, weights, POINTS_COST, userData) {
    const userId = message.author.id;
    let user = userData.get(userId);

    // 사용자가 데이터가 없으면 룰렛을 돌릴 수 없음
    if (!user) {
      return message.reply('사용자 데이터가 존재하지 않습니다. 먼저 초기화를 진행해주세요.');
    }

    // 룰렛1 돌리기 위해 필요한 포인트 차감
    if (user.points < 4500) {
      return message.reply(`룰렛을 돌리기 위해서는 4500 포인트가 필요합니다.`);
    }

    // 포인트 차감: 룰렛을 돌리기 전에 차감
    user.points -= 4500;

    // 룰렛 상품 목록과 확률 설정
    const rouletteItems = [
      { item: '!한정*한정!', probability: 0.1 },
      { item: 'D', probability: 0.1 },
      { item: 'BlackSmith', probability: 0.1 },
      { item: 'SCP-222', probability: 0.1 },
      { item: '저거넛', probability: 0.125 },
      { item: 'O5', probability: 0.125 },
      { item: '탈옥수', probability: 0.125 },
      { item: '카르텔', probability: 0.125 },
      { item: 'Chaos Hakcer', probability: 0.125 },
      { item: '밀수업자', probability: 0.125 },
      { item: 'Chaos Sniper', probability: 0.125 },
      { item: 'SCP-953', probability: 0.125 },
      { item: 'Combat Medic', probability: 0.4 },
      { item: '폭파병', probability: 0.4 },
      { item: 'Insurgency', probability: 0.4 },
      { item: '대테러부대', probability: 0.4 },
      { item: 'CHAOS ASSULT', probability: 0.4 },
      { item: 'HID병', probability: 2.1 },
      { item: '무전병', probability: 2 },
      { item: '의무병', probability: 2 },
      { item: '스파이', probability: 1 },
      { item: '꽝', probability: 86.45 },
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

    // 결과 메시지 생성
    await message.reply(`🎰 **룰렛 결과**: ${selectedItem}`);
    // 사용자 데이터를 업데이트
    userData.set(userId, user);
  },
};

