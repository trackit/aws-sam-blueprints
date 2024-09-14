import {Entity} from "../Entity";
import { v4 as uuidv4 } from 'uuid';
import {JobStatus} from "../enums/JobStatus";

export interface TranscriptionProps {
    jobStatus: JobStatus,
    key: string;
    outputPath: string;
}

export class Transcription implements Entity {
    id: string;


    constructor(private readonly props: TranscriptionProps, id?: string) {
        this.props = props;
        this.id = id || uuidv4()
    }

    get jobStatus() {
        return this.props.jobStatus
    }

    get key() {
        return this.props.key
    }

    get outputPath() {
        return this.props.outputPath
    }

    toJSON() {
        return {
            id: this.id,
            key: this.key,
            outputPath: this.outputPath,
            jobStatus: this.jobStatus
        }
    }
}