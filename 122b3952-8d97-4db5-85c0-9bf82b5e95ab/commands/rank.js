module.exports = {
  name: '순위',
  description: '포인트 순위를 표시합니다.',
  async execute(message, args, weights, POINTS_COST, userData) {
    // userData 맵을 배열로 변환하여 포인트를 기준으로 내림차순 정렬
    const rankings = Array.from(userData.entries())
      .map(([userId, user]) => ({
        userId,
        points: user.points,
      }))
      .sort((a, b) => b.points - a.points); // 내림차순 정렬

    // 상위 30위까지 가져오기
    const top30 = rankings.slice(0, 30);

    // 결과 메시지 생성
    let replyMessage = '**포인트 순위 (Top 30)**\n';
    for (const [index, rank] of top30.entries()) {
      // 유저의 이름을 가져오기
      const user = await message.client.users.fetch(rank.userId);
      replyMessage += `${index + 1}. ${user.username} - ${rank.points} 포인트\n`;  // 유저 이름 사용
    }

    // 순위가 없을 경우
    if (top30.length === 0) {
      replyMessage = '**현재 포인트 순위가 없습니다.**';
    }

    // 순위 메시지 보내기
    await message.reply(replyMessage);
  },
};

