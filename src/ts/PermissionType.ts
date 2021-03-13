import { PermissionString } from 'discord.js';
import { DJPermission } from '../helpers/requestPermission';

type PermissionType = PermissionString | DJPermission;
export default PermissionType;
