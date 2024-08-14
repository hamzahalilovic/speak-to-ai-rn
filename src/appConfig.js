
import styled from 'styled-components/native';

import {NEXT_PUBLIC_CONTENT_LANGUAGE} from '@env';

export const HeaderImage = styled.View`
  position: relative;
  width: 215px;
  height: 111px;
  cursor: pointer;
`;

export const StyledImg = props => {
  return <HeaderImage {...props} />;
};

export const themeColor = '#000000';

export const customIconButton = {
  baseStyle: {
    background: themeColor,
    color: 'white',
    _hover: {
      background: 'blue.200',
    },
  },
};

export const buttonTheme = {
  components: {
    Button: {
      variants: {
        customIconButton,
      },
    },
  },
};


export const checkLanguage = true;
export const showExamples = false;
export const translateWhenNeeded = true;
export const showFeedback = false;

const domain = 'www.prifina.com';
export const headerOptions = {
  height: '105px',
  backgroundColor: themeColor,
  logo: {
    show: true,
    url: `https://${domain}/`,
    type: 'PNG',
    width: '200px',
    image: `/assets/logo.png`,
  },
  middle: {
    show: false,
    color: themeColor,
    text: '- Expert',
  },
  link: {
    show: true,
    color: themeColor,
    url: `https://${domain}/`,
  },
  booking: {
    show: false,
    url: `https://${domain}/`,
    text: 'BOOK A MEETING',
  },
};

export const EVALS = {
  contentLng: NEXT_PUBLIC_CONTENT_LANGUAGE,
  defaultScoreLimit: 0.2,
  appStorage: 'speakToAI',
  defaultHeight: 50,
  minScoreValue: 0.2,
  maxScoreValue: 0.5,
  sideBarWidth: 200,
  autoCompletion: false,
};

export const uploadOptions = {
  contentLng: false,
  translationLng: false,
  metaTags: false,
  subscriptionPlans: false,
};

export const main = {
  title: 'Speak to AI - Your Digital AI Twin',
  description:
    'Create an AI persona that interacts, engages, and learns from your audience in real-time.',
};

export const footerText = [
  [
    {
      text: 'Get your own digital AI twin.',
      link: 'https://hi.speak-to.ai/',
    },
  ],
];

export const links = {
  speakTo: 'https://hi.speak-to.ai/',
  termsOfUse: 'https://hi.speak-to.ai/speakers-terms-of-use.html',
  privacyPolicy: 'https://hi.speak-to.ai/audiences-privacy-policy.html',
};
