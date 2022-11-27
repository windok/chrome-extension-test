const findNode = (text, nodes) => nodes.find(n => n.innerText.toLowerCase().includes(text.toLowerCase()));

async function wait(delay = 100) {
  await new Promise(resolve => setTimeout(resolve, delay));
}

async function waitNode(getNodeFn) {
  let node = getNodeFn();

  while (!node) {
    await wait();
    node = getNodeFn();
  }

  return node;
}

// const TELEGRAM_BOT_KEY = '0000000000:AAHAAHAAHAAHAAHAAHAAHAAHAAH';
// const TELEGRAM_CHAT_ID = 000000000;

let lastMessageId;
async function sendTelegramMessage() {
  const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };

  const [result] = await Promise.all([
    // API: https://core.telegram.org/bots/api#sendmessage
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_KEY}/sendMessage`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: window.location.href }),
    }),
    ...(lastMessageId ? [
      // API: https://core.telegram.org/bots/api#deletemessage
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_KEY}/deleteMessage`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, message_id: lastMessageId }),
      }),
    ] : []),
  ]);

  lastMessageId = (await result.json())?.result?.message_id;

  console.log('------ messageId', lastMessageId);
}

(async () => {
  let isSuccess = false;
  setInterval(() => !isSuccess && window.location.reload(), 5 * 60 * 1000);

  const findStep = (step) => findNode(step, [...document.querySelectorAll('.process-step-name')]);

  const czechTab = await waitNode(() => findNode('чехія', [...document.querySelectorAll('div.v-expansion-panel__header div.flex')]));
  czechTab.closest('.v-expansion-panel__header').click();

  const pragueOption = await waitNode(() => findNode('прага', [...document.querySelectorAll('[webid=branchId1]')]));
  pragueOption.click();

  const serviceOption = await waitNode(() => findNode('Ноторіальні дії Посвідчення довіреності', [...document.querySelectorAll('label')]));
  serviceOption.previousElementSibling.querySelector('input').click();

  await wait(100);
  findStep('дата та час').closest('.v-expansion-panel__header').click();

  const pickDate = async () => {
    const table = await waitNode(() => document.querySelector('.v-date-picker-table.v-date-picker-table--date'));

    const availableDates = [...table.querySelectorAll('button:not([disabled])')]
      .filter(node => !node.querySelector('div.v-btn__content')?.innerText.includes('27'));

    console.log(`availableDates ${new Date().toISOString()}`, availableDates);

    if (!availableDates.length) {
      const dateButtonLabel = await waitNode(() => findNode('chevron_right', [...document.querySelectorAll('i.v-icon.material-icons.theme--light')]));

      const button = await waitNode(() => dateButtonLabel.closest('button:not([disabled])'));

      button.click();

      return false;
    } else {
      availableDates[0].click();

      return true;
    }
  };

  for (let i = 0; i < 3; i++) {
    isSuccess = await pickDate();

    if (isSuccess) {
      break;
    }

    await wait(1000);
  }

  if (!isSuccess) {
    const isHighFrequencyRate = (
      (new Date().getHours() === 7 && new Date().getMinutes() > 45) ||
      [8, 9].includes(new Date().getHours())
    );

    let wasWaiting = false;
    // while (!isHighFrequencyRate) {
    //   wasWaiting = true;
    //   const now = new Date();
    //   now.getSeconds() === 0 && console.log(`waiting, hours ${now.getHours()} minutes ${now.getMinutes()}`)
    //
    //   await wait(1000);
    // }

    !wasWaiting && await wait(isHighFrequencyRate ? 15 * 1000 : 2 * 60 * 1000);
    window.location.reload();
  } else {
    await wait(3000);

    (async () => {
      for (let i = 0; i < 10; i++) {
        await sendTelegramMessage();
        await wait(5000);
      }
    })()

    (await waitNode(() => document.getElementById('LastName'))).value = '';
    (await waitNode(() => document.getElementById('FirstName'))).value = '';
    (await waitNode(() => document.getElementById('Email'))).value = '';
    (await waitNode(() => document.getElementById('countryCode'))).value = '';
    (await waitNode(() => document.getElementById('Phone'))).value = '';
    (await waitNode(() => document.getElementById('Notes'))).value = '';
  }
})();

// setTimeout(() => {
//   const sourceTag = document.createElement('source');
//   sourceTag.src = 'https://github.com/windok/chrome-extension-test/raw/main/alarm.mp3';
//   sourceTag.type = 'audio/mpeg';
//
//   const audioTag = document.createElement('audio');
//   audioTag.autoplay = true;
//   audioTag.appendChild(sourceTag);
//
//   // <meta http-equiv="Content-Security-Policy" content="img-src 'self' data:; default-src 'self' http://XX.XX.XX.XX:8084/mypp/">
//   const metaTag = document.createElement('meta');
//   metaTag.httpEquiv = 'Content-Security-Policy';
//   metaTag.content = `media-src 'self' data:; default-src 'self' https://github.com/windok/chrome-extension-test/raw/main/alarm.mp3`;
//   document.head.appendChild(metaTag);
//
//   document.body.appendChild(audioTag);
// }, 4000);
