// commands/포인트주기.js
const allowedUsers = ['989478702947639387', '1096075129232044193']; // 포인트를 줄 수 있는 사용자 ID 목록

module.exports = {
    name: '포인트주기',
    description: '멘션한 사용자에게 포인트를 지급 또는 차감합니다.',
    async execute(message, args, weights, POINTS_COST, userData) {
        // 포인트 지급 권한 확인
        if (!allowedUsers.includes(message.author.id)) {
            return message.reply('포인트를 지급할 권한이 없습니다.');
        }

        // 입력된 인자가 적절한지 확인
        if (args.length < 4 || args.length % 2 !== 0) {
            return message.reply('사용법: !포인트주기 (멘션) (+/-) (수량) [멘션] (+/-) (수량) ...');
        }

        // 멘션과 포인트 수량을 처리
        const pointsData = [];
        let mentionIndex = 0; // 멘션 인덱스를 추적

        // 멘션과 포인트 수량이 짝을 맞춰야 함
        while (mentionIndex < args.length - 1) {
            const userMention = message.mentions.users.get(args[mentionIndex].replace(/[<@!>]/g, '')); // 멘션된 사용자 ID 추출
            const operation = args[mentionIndex + 1]; // + 또는 -
            const points = parseInt(args[mentionIndex + 2], 10);

            if (!userMention) {
                return message.reply('멘션된 사용자를 찾을 수 없습니다.');
            }

            if (operation !== '+' && operation !== '-') {
                return message.reply('사용법: !포인트주기 (멘션) (+/-) (수량) [멘션] (+/-) (수량) ...');
            }

            if (isNaN(points) || points <= 0) {
                return message.reply('수량은 1 이상의 숫자로 입력해 주세요.');
            }

            pointsData.push({ userMention, operation, points });
            mentionIndex += 3; // 멘션, 연산자, 포인트는 3개의 항목으로 구성
        }

        // 각 멘션된 사용자에게 포인트 추가 또는 차감
        pointsData.forEach(({ userMention, operation, points }) => {
            const userId = userMention.id;
            if (!userData.has(userId)) {
                userData.set(userId, { points: 0 });
            }

            const user = userData.get(userId);
            if (operation === '+') {
                user.points += points;
                message.reply(`${userMention.username}님에게 ${points} 포인트를 추가하였습니다.`);
            } else if (operation === '-') {
                if (user.points < points) {
                    return message.reply(`${userMention.username}님의 포인트가 부족합니다.`);
                }
                user.points -= points;
                message.reply(`${userMention.username}님으로부터 ${points} 포인트를 차감하였습니다.`);
            }

            userData.set(userId, user);
        });

        // 성공 메시지 전송
        return;
    }
};

