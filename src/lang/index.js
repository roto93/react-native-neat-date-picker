import { shortEn, longEn } from './en';
import { shortEs, longEs } from './es';
import { shortCa, longCa } from './ca';
import { shortFr, longFr } from './fr';

/*
  we pass the index number to get the array of the specific language we want. after it we can call the index of the month we want from inside the returned array
  e.g: shortMonthNames[0][0] will return 'Jan';
*/
export const shortMonthNames = [shortEn, shortEs, shortCa, shortFr];
/*
  we pass the index number to get the array of the specific language we want. after it we can call the index of the month we want from inside the returned array
  e.g: longMonthNames[0][0] will return 'January';
*/
export const longMonthNames = [longEn, longEs, longCa, longFr];
