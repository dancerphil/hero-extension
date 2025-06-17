import * as vscode from 'vscode';
import {getContext} from "../regions/context";
import {TreeDataProvider} from './TreeItem';

export function registerTreeView() {
  const context = getContext()

  const treeDataProvider = new TreeDataProvider();
  const treeView = vscode.window.createTreeView('heroView', { treeDataProvider });
  context.subscriptions.push(treeView);
}
