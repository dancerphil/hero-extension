import {Action} from '../types';

export const openSettingsAction: Action = {
    command: {
        command: 'workbench.action.openSettings',
        title: '打开设置',
        arguments: ['hero.'],
    },
} as Action;
