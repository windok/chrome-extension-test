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

    const availableDates = [...table.querySelectorAll('button:not([disabled])')];

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
    const isHighFrequencyRate = (new Date().getHours() === 7 && new Date().getMinutes() > 50) ||
      (new Date().getHours() === 8 && new Date().getMinutes() <= 59) ||
      (new Date().getHours() === 9 && new Date().getMinutes() <= 30);

    let wasWaiting = false;
    // while (!isHighFrequencyRate) {
    //   wasWaiting = true;
    //   const now = new Date();
    //   now.getSeconds() === 0 && console.log(`waiting, hours ${now.getHours()} minutes ${now.getMinutes()}`)
    //
    //   await wait(1000);
    // }

    !wasWaiting && await wait(isHighFrequencyRate ? 20 * 1000 : 2 * 60 * 1000);
    window.location.reload();
  } else {
    await wait(3000);


  }
})();

setTimeout(() => {
  const sourceTag = document.createElement('source');
  sourceTag.src = 'alarm.mp3';

  const audioTag = document.createElement('audio');
  audioTag.autoplay = true;
  audioTag.appendChild(sourceTag);

  document.body.appendChild(audioTag);
}, 4000);
