import { ItemData } from '../typings/item';

export const Items: {
  [key: string]: ItemData | undefined;
} = {
  water: {
    name: 'water',
    close: false,
    label: 'Water',
    stack: true,
    usable: true,
    count: 0,
  },
  burger: {
    name: 'burger',
    close: false,
    label: 'BURGR',
    stack: false,
    usable: false,
    count: 0,
  },
  WEAPON_HAMMER: {
    name: 'WEAPON_HAMMER',
    label: 'Hammer',
    stack: false,
    usable: true,
    close: false,
    count: 0,
  },
  WEAPON_RAILGUN: {
    name: 'WEAPON_RAILGUN',
    label: 'Railgun',
    stack: false,
    usable: false,
    close: false,
    count: 0,
  },
};
