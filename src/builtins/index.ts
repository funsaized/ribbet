import {semanticCommands} from './semantic.ts';
import {exactCommands} from './exact.ts';
import {filesystemCommands} from './filesystem.ts';
export const builtins={...semanticCommands,...exactCommands,...filesystemCommands};
export type BuiltinName=keyof typeof builtins;
