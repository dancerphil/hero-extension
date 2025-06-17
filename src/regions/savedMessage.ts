import {createRegion} from './createRegion';

const savedMessageRegion = createRegion<string>();

export const getSavedMessage = savedMessageRegion.get;

export const setSavedMessage = savedMessageRegion.set;
