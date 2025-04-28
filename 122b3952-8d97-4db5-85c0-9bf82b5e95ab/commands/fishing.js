const { randomInt } = require('crypto');
const weather = require('../weather');  // weather.js 파일을 상위 폴더에서 불러오기

module.exports = {
  name: '낚시',
  description: '낚시를 시도하여 물고기를 잡고, 피로도가 쌓입니다.',
  async execute(message, args, weights, POINTS_COST, userData) {
    const userId = message.author.id;
    let user = userData.get(userId);

    // 사용자 정보가 없는 경우 초기화
    if (!user) {
      user = { points: 0, items: {}, fatigue: 0, lastRestTime: Date.now() };
      userData.set(userId, user);
    }

    const MAX_FATIGUE = (user.items && (user.items.title === '낚시왕' || user.items.title === true)) ? 300 : 200;

    if (user.fatigue >= MAX_FATIGUE) {
      await message.reply('**피로도가 최대치에 도달했습니다!**\n낚시를 진행할 수 없습니다. 잠시 쉬어야 합니다!');
      return; // 낚시를 진행할 수 없도록 리턴
    }

    // 현재 날씨 정보 가져오기
    const currentWeather = weather.getCurrentWeather();

    // 날씨에 따라 확률 증가 품목 선택
    let additionalWeights = {};
    switch (currentWeather) {
      case 'Chaos':
        additionalWeights = weights.chaosAdditionalWeights;
        break;
      case 'MTF':
        additionalWeights = weights.mtfAdditionalWeights;
        break;
      case 'SCP':
        additionalWeights = weights.scpAdditionalWeights;
        break;
      case 'Glitch':
        additionalWeights = weights.glitchAdditionalWeights;
        break;
      case 'Unknown':
        additionalWeights = weights.unknownAdditionalWeights;
        break;
      case 'BloodMoon':
        additionalWeights = weights.bloodmoonAdditionalWeights;
        break;
      case 'NVDA':
        additionalWeights = weights.nvdaAdditionalWeights;
        break;
      case 'SCP330':
        additionalWeights = weights.scp330AdditionalWeights;
        break;
      case 'GRUP':
        additionalWeights = weights.grupAdditionalWeights;
        break;
      case 'FBI':
        additionalWeights = weights.fbiAdditionalWeights;
        break;
      case 'MCD':
        additionalWeights = weights.mcdAdditionalWeights;
        break;
      default:
        additionalWeights = {};
        break;
    }

    const combinedWeights = { ...weights.fishWeights };
    for (const [item, weight] of Object.entries(additionalWeights)) {
      combinedWeights[item] = weight;
    }

    // 확률 합 계산
    const fishTypes = Object.keys(combinedWeights);
    const totalWeight = fishTypes.reduce((acc, fish) => acc + combinedWeights[fish], 0);

    let random = Math.random() * totalWeight;
    let selectedFish = '';

    for (const fish of fishTypes) {
      random -= combinedWeights[fish];
      if (random <= 0) {
        selectedFish = fish;
        break;
      }
    }

    const pointsEarned = randomInt(15, 26);
    const fatigueIncrease = randomInt(0, 4);

      // 피로도 업데이트 전에 NaN 체크
      if (isNaN(user.fatigue)) {
          user.fatigue = 50; // 피로도가 NaN일 경우 50으로 초기화
      }

      // 피로도 업데이트
      user.fatigue = Math.min(user.fatigue + fatigueIncrease, MAX_FATIGUE);

    // 포인트 업데이트
    user.points += pointsEarned;

    let replyMessage = '';
    
    switch (selectedFish) {
      case '[🐍]𝔸𝕟𝕒𝕟𝕥𝕒𝕤𝕙𝕖𝕤𝕙𝕒 (𝑀𝒴𝒯𝐼𝒞)':
        user.points = Math.max(user.points + 3500, 0);  // 수정된 부분
        replyMessage = `🎣 **낚은 것 '[🐍]𝔸𝕟𝕒𝕟𝕥𝕒𝕤𝕙𝕖𝕤𝕙𝕒 (𝑀𝒴𝒯𝐼𝒞)'을/를 잡았습니다! 3500포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🌟]𝕷𝖊𝖛𝖎𝖆𝖙𝖍𝖆𝖓 (𝑀𝒴𝒯𝐼𝒞)':
        user.points = Math.max(user.points + 2500, 0);  // 수정된 부분
        replyMessage = `🎣 **낚은 것 '[🌟]𝕷𝖊𝖛𝖎𝖆𝖙𝖍𝖆𝖓 (𝑀𝒴𝒯𝐼𝒞)'을/를 잡았습니다! 2500포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🦑]𝒦𝑅𝒜𝒦𝐸𝒩 (𝑀𝒴𝒯𝐼𝒞)':
        user.points += 2000;
        replyMessage = `🎣 **낚은 것 '[🦑]𝒦𝑅𝒜𝒦𝐸𝒩 (𝑀𝒴𝒯𝐼𝒞)'을/를 잡았습니다!2000포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[💸]𝒢𝑜𝓁𝒹𝑒𝓃 𝐹𝒾𝓈𝒽 (𝓛𝓮𝓰𝓮𝓷𝓭𝓪𝓻𝔂)':
        user.points += 500;
        replyMessage = `🎣 **낚은 것 '[💸]𝒢𝑜𝓁𝒹𝑒𝓃 𝐹𝒾𝓈𝒽 (𝓛𝓮𝓰𝓮𝓷𝓭𝓪𝓻𝔂)'을/를 잡았습니다! 500포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🌊]ɢɪᴀɴᴛ ᴍᴀɴᴛᴀ (𝓛𝓮𝓰𝓮𝓷𝓭𝓪𝓻𝔂)':
        user.points += 500;
        replyMessage = `🎣 **낚은 것 '[🌊]ɢɪᴀɴᴛ ᴍᴀɴᴛᴀ (𝓛𝓮𝓰𝓮𝓷𝓭𝓪𝓻𝔂)'을/를 잡았습니다! 500포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🐋]고래 | EPIC]':
        user.points += 250;
        replyMessage = `🎣 **낚은 것 '[🐋]고래 | EPIC]'을/를 잡았습니다! 250포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🦈]상어 | EPIC]':
        user.points += 250;
        replyMessage = `🎣 **낚은 것 '[🦈]상어 | EPIC]'을/를 잡았습니다! 250포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🐬]돌고래 | RARE]':
        user.points += 150;
        replyMessage = `🎣 **낚은 것 '[🐬]돌고래 | RARE]'을/를 잡았습니다! 150포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🐙]문어 | RARE]':
        user.points += 150;
        replyMessage = `🎣 **낚은 것 '[🐙]문어 | RARE]'을/를 잡았습니다! 150포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🐢]거북이 | RARE]':
        user.points += 150;
        replyMessage = `🎣 **낚은 것 '[🐢]거북이 | RARE]'을/를 잡았습니다! 150포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[댕댕이]939 | WEATHER!]':
        user.points += 400;
        replyMessage = `🎣 **낚은 것 '[댕댕이]939 | WEATHER!]'을/를 잡았습니다! 400포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🚪]UIU FBI | VERY TRASH]':
        user.points += 200;
        replyMessage = `🎣 **낚은 것 '[🚪]UIU FBI | VERY TRASH]'을/를 잡았습니다! 200포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[💸]지폐 | WEATHER]':
        user.points += 200;
        replyMessage = `🎣 **낚은 것 '[💸]지폐 | WEATHER]'을/를 잡았습니다! 200포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[💰]대량의돈 | WEATHER]':
        user.points += 3000;
        replyMessage = `🎣 **낚은 것 '[💰]대량의돈 | WEATHER]'을/를 잡았습니다! 3000포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[💫]무언가 | Glitch]':
        user.points += Math.floor(Math.random() * 4) + 4;
        replyMessage = `🎣 **낚은 것 '[💫]무언가 | Glitch]'을/를 잡았습니다! undefined포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[💫]ERROR | Glitch]':
        user.points += Math.floor(Math.random() * 40) + 6;
        replyMessage = `🎣 **낚은 것 '[💫]ERROR | Glitch]'을/를 잡았습니다! undefined포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[💫]UNDEFINDED]':
        user.points += Math.floor(Math.random() * 101) + 40;
        replyMessage = `🎣 **낚은 것 '[💫]UNDEFINDED]'을/를 잡았습니다! undefined포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[💫]REDACTED]':
        user.points += Math.floor(Math.random() * 404) + 202;
        replyMessage = `🎣 **낚은 것 '[💫]REDACTED]'을/를 잡았습니다! undefined포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[💫]Unknown]':
        user.points += Math.floor(Math.random() * 4040) + 404;
        replyMessage = `🎣 **낚은 것 '[💫]Unknown]'을/를 잡았습니다! undefined포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[댕댕이]939 | WEATHER!]':
        user.points += 400;
        replyMessage = `🎣 **낚은 것 '[댕댕이]939 | WEATHER!]'을/를 잡았습니다! 400포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🌈]무지개 캔디| SCP303 ]':
        user.points += 777;
        replyMessage = `🎣 **낚은 것 '[🟣]보라 캔디 | SCP303 ]'을/를 잡았습니다! 777포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[⚪]흰색 캔디 | SCP303 ]':
        user.points += 120;
        replyMessage = `🎣 **낚은 것 '[🟣]보라 캔디 | SCP303 ]'을/를 잡았습니다! 120포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[⚫]블랙 캔디 | SCP303 ]':
        user.points += 120;
        replyMessage = `🎣 **낚은 것 '[⚫]블랙 캔디 | SCP303 ]'을/를 잡았습니다! 120포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[⚪]회색 캔디 | SCP303 ]':
        user.points += 80;
        replyMessage = `🎣 **낚은 것 '[⚪]회색 캔디 | SCP303 ]'을/를 잡았습니다! 80포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🔵]파랑 캔디 | SCP303 ]':
        user.points += 50;
        replyMessage = `🎣 **낚은 것 '[🔵]파랑 캔디 | SCP303 ]'을/를 잡았습니다! 50포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🟢]초록 캔디 | SCP303 ]':
        user.points += 45
        replyMessage = `🎣 **낚은 것 '[🟢]초록 캔디 | SCP303 ]'을/를 잡았습니다! 45포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🟣]보라 캔디 | SCP303 ]':
        user.points += 35
        replyMessage = `🎣 **낚은 것 '[🟣]보라 캔디 | SCP303 ]'을/를 잡았습니다! 35인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🟡]노랑 캔디 | SCP303 ]':
        user.points += 25
        replyMessage = `🎣 **낚은 것 '[🟡]노랑 캔디 | SCP303 ]'을/를 잡았습니다! 25인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🟠]주황색 캔디 | SCP303 ]':
        user.points += 10;
        replyMessage = `🎣 **낚은 것 '[🟠]주황색 캔디 | SCP303 ]'을/를 잡았습니다! 10포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🔴]빨간 캔디 | SCP303 ]':
        user.points += 5;
        replyMessage = `🎣 **낚은 것 '[🔴]빨간 캔디 | SCP303 ]'을/를 잡았습니다! 5포인트를 획득하였습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🗑️]𝙎𝙊𝙇𝘼𝙍𝙏𝙄𝘾 | Trash]':
        user.points = Math.max(user.points - 150, 0);  // 수정된 부분
        replyMessage = `🎣 **낚은 것 '[🗑️]𝙎𝙊𝙇𝘼𝙍𝙏𝙄𝘾 | Trash]'을/를 잡았습니다! 150포인트를 잃었습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🗑️]𝙐𝙄𝙐 𝙁𝘽𝙄𝙎𝙃 | Trash]':
        user.points = Math.max(user.points - 200, 0);  // 수정된 부분
        replyMessage = `🎣 **낚은 것 '[🗑️]𝙐𝙄𝙐 𝙁𝘽𝙄𝙎𝙃 | Trash]'을/를 잡았습니다! 200포인트를 잃었습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🗑️]SCP106 | Trash]':
        user.points = Math.max(user.points - 106, 0);  // 수정된 부분
        replyMessage = `🎣 **낚은 것 '[🗑️]SCP106 | Trash]'을/를 잡았습니다! 106포인트를 잃었습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🗑️]우룰룰루 FISH | Very Trash]':
        user.points = Math.max(user.points - 700, 0);  // 수정된 부분
        replyMessage = `🎣 **낚은 것 '[🗑️]우룰룰루 FISH | Very Trash]'을/를 잡았습니다! 700포인트를 잃었습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🗑️]GT730 GRAPHIC CARD | Ultra Trash]':
        user.points = Math.max(user.points - 2190, 0);  // 수정된 부분
        replyMessage = `🎣 **낚은 것 '[🗑️]GT730 GRAPHIC CARD | Ultra Trash]'을/를 잡았습니다! 2190포인트를 잃었습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🗑️]털게 | Ultra Mega Trash]':
        user.points = Math.max(user.points - 10000, 0);  // 수정된 부분
        replyMessage = `🎣 **낚은 것 '[🗑️]털게 | Ultra Mega Trash]'을/를 잡았습니다! 10000포인트를 잃었습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🟢]카오스 소총수 | 시신]':
        user.points = Math.max(user.points - 50, 0);  // 수정된 부분
        replyMessage = `🎣 **낚은 것 '[🟢]카오스 소총수 | 시신]'을/를 잡았습니다! 50포인트를 잃었습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🟢]카오스 약탈자 | 시신]':
        user.points = Math.max(user.points - 100, 0);  // 수정된 부분
        replyMessage = `🎣 **낚은 것 '[🗑️]우룰룰루 FISH | Very Trash]'을/를 잡았습니다! 100포인트를 잃었습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      case '[🟢]카오스 압제자 | 시신]':
            user.points = Math.max(user.points - 200, 0);  // 포인트 차감
            user.fatigue += 5;  // 피로도 증가
            replyMessage = `🎣 **낚은 것 '[🟢]카오스 압제자 | 시신]'을/를 잡았습니다! 200포인트를 잃었습니다 피로도 5증가**\n🪙 **현재 포인트**: **${user.points}**\n💤 **현재 피로도**: **${user.fatigue}**`;
        break;
      case '[🚪]FBI OPEN UP | CJD3201]':
            user.fatigue += 20;  // 피로도 증가
            replyMessage = `🎣 **낚은 것 '[🚪]FBI OPEN UP | CJD3201]'을/를 잡았습니다! 피로도 20증가**\n🪙 **현재 포인트**: **${user.points}**\n💤 **현재 피로도**: **${user.fatigue}**`;
        break;
      case '[🟤]갈색 캔디 | SCP303 ]':
        user.points = Math.max(user.points - 100, 0);  // 수정된 부분
        replyMessage = `🎣 **낚은 것 '[🟤]갈색 캔디 | SCP303 ]'을/를 잡았습니다! 100포인트를 잃었습니다**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
        case '[🌸]분홍 캔디 | SCP303 ]':
            user.points = Math.max(user.points - 300, 0);  // 포인트 차감
            user.fatigue += 4;  // 피로도 증가
            replyMessage = `🎣 **낚은 것 '[🌸]분홍 캔디 | SCP303 ]'을/를 잡았습니다! 300포인트를 잃었습니다 피로도 4증가**\n🪙 **현재 포인트**: **${user.points}**\n💤 **현재 피로도**: **${user.fatigue}**`;
            break;
      case '[😈]Evil Candy | SCP303 ]':
            user.points = Math.max(user.points - 444, 0);  // 포인트 차감
            user.fatigue += 30;  // 피로도 증가
            replyMessage = `🎣 **낚은 것 '[😈]Evil Candy | SCP303 ]'을/를 잡았습니다! 444포인트를 잃었습니다 피로도 30증가**\n🪙 **현재 포인트**: **${user.points}**\n💤 **현재 피로도**: **${user.fatigue}**`;
            break;
      case '[💰]𝓝𝓥𝓓𝓐 (𝔼𝕩𝕔𝕝𝕦𝕤𝕚𝕧𝕖)':
        const randomChange = Math.floor(Math.random() * 20001) - 10000; // -30000 ~ +30000 사이의 랜덤 값 생성
        user.points += randomChange; // 포인트에 랜덤 값 더하기
        replyMessage = `🎣 **낚은 것 '[💰]𝓝𝓥𝓓𝓐 (𝔼𝕩𝕔𝕝𝕦𝕤𝕚𝕧𝕖)'을/를 잡았습니다! ${randomChange}포인트를 ${randomChange < 0 ? '잃었습니다' : '얻었습니다'}**\n🪙 **현재 포인트**: **${user.points}**`;
        break;
      default:
        replyMessage = `🎣 **낚은 것 '${selectedFish}'을/를 잡았습니다!**\n\n🪙 **현재 포인트**: **${user.points}**`;
        break;
    }

    // 유저 데이터 업데이트
    userData.set(userId, user);

    let fatigueStatus = `현재 피로도: **${user.fatigue}**.`;
    if (user.fatigue >= MAX_FATIGUE) {
      fatigueStatus = '**피로도가 최대치에 도달했습니다!** \n잠시 쉬어야 합니다!';
    }

    await message.reply(`${replyMessage}\n\n${fatigueStatus}`);
  },
};