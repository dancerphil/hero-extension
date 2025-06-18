import * as vscode from 'vscode';
import {getContext} from "../regions/context";
import {addTreeItem, getTreeItems} from "../regions/treeItems";
import {Action} from "../types";

export class TreeItem extends vscode.TreeItem {
  constructor(
      public readonly label: string,
      public readonly command?: vscode.Command
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    // this.description = command?.description || '';
  }

  iconPath = new vscode.ThemeIcon('notebook-execute');
}

export const addAction = ({command, callback}: Action) => {
  const context = getContext();
  if (command.command.startsWith('hero.')) {
    const disposable = vscode.commands.registerCommand(command.command, callback);
    context.subscriptions.push(disposable);
  }

  addTreeItem(new TreeItem(command.title, command));
};

export class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: TreeItem): vscode.ProviderResult<TreeItem[]> {
    return getTreeItems();
  }
}
