import {createRegion} from './createRegion';
import {TreeItem} from '../TreeView/TreeItem';

const treeItemsRegion = createRegion<TreeItem[]>([]);

export const getTreeItems = treeItemsRegion.get;

export const addTreeItem = (item: TreeItem) => {
    treeItemsRegion.set(arr => [...arr, item]);
};
