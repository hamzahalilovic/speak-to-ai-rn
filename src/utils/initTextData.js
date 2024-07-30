import {footerText} from '../appConfig';

export const initTextData = async () => {
  try {
    const data = {
      footer: footerText,
    };
    return data;
  } catch (e) {
    console.error('FAILED TO GET REMOTE TEXT DATA - DEFAULT TEXT DATA', e);
    return {
      footer: [
        'Get your own digital AI twin.',
        [
          'Powered by ',
          {text: 'Prifina', link: 'https://hi.speak-to.ai/'},
          '.',
        ],
      ],
    };
  }
};
