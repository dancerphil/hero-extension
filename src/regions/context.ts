import vscode from "vscode";
import {createRegion} from './createRegion';

const contextRegion = createRegion<vscode.ExtensionContext>(undefined as vscode.ExtensionContext);

export const getContext = contextRegion.get;

export const setContext = contextRegion.set;
