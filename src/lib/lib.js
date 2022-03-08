import { longMonthNames, shortMonthNames } from '../lang/index';

export const getMonthInChinese = num => {
  if (typeof num !== 'number') return;
  if ((num < 0) | (num >= 12)) return;
  switch (num) {
    case 0:
      return '一月';
    case 1:
      return '二月';
    case 2:
      return '三月';
    case 3:
      return '四月';
    case 4:
      return '五月';
    case 5:
      return '六月';
    case 6:
      return '七月';
    case 7:
      return '八月';
    case 8:
      return '九月';
    case 9:
      return '十月';
    case 10:
      return '十一月';
    case 11:
      return '十二月';
    default:
      return '';
  }
};

export const checkLanguage = language => {
  switch (language) {
    case 'en':
      return 0;
    case 'es':
      return 1;
    case 'ca':
      return 2;
    case 'fr':
      return 3;
    default:
      return 0;
  }
};

export const getMonth = (num, language) => {
  if (typeof num !== 'number') return;
  if ((num < 0) | (num >= 12)) return;
  const languageSelected = checkLanguage(language);
  switch (num) {
    case 0:
      return shortMonthNames[languageSelected][0];
    case 1:
      return shortMonthNames[languageSelected][1];
    case 2:
      return shortMonthNames[languageSelected][2];
    case 3:
      return shortMonthNames[languageSelected][3];
    case 4:
      return shortMonthNames[languageSelected][4];
    case 5:
      return shortMonthNames[languageSelected][5];
    case 6:
      return shortMonthNames[languageSelected][6];
    case 7:
      return shortMonthNames[languageSelected][7];
    case 8:
      return shortMonthNames[languageSelected][8];
    case 9:
      return shortMonthNames[languageSelected][9];
    case 10:
      return shortMonthNames[languageSelected][10];
    case 11:
      return shortMonthNames[languageSelected][11];
    default:
      return '';
  }
};

export const getLongMonth = (num, language) => {
  if (typeof num !== 'number') return;
  if ((num < 0) | (num >= 12)) return;
  const languageSelected = checkLanguage(language);
  switch (num) {
    case 0:
      return longMonthNames[languageSelected][0];
    case 1:
      return longMonthNames[languageSelected][1];
    case 2:
      return longMonthNames[languageSelected][2];
    case 3:
      return longMonthNames[languageSelected][3];
    case 4:
      return longMonthNames[languageSelected][4];
    case 5:
      return longMonthNames[languageSelected][5];
    case 6:
      return longMonthNames[languageSelected][6];
    case 7:
      return longMonthNames[languageSelected][7];
    case 8:
      return longMonthNames[languageSelected][8];
    case 9:
      return longMonthNames[languageSelected][9];
    case 10:
      return longMonthNames[languageSelected][10];
    case 11:
      return longMonthNames[languageSelected][11];
    default:
      return '';
  }
};
