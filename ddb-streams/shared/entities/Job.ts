import {Entity} from "../Entity";
import { v4 as uuidv4 } from 'uuid';

export class Job implements Entity {
    id: string;

    constructor(public readonly token: string, id?: string) {
        this.token = token
        this.id = id || uuidv4()
    }
}