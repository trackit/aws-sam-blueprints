import {Entity} from "../Entity";
import {v4 as uuidv4} from 'uuid';
import {JobStatus} from "../enums/JobStatus";
import {Transcription} from "./Transcription";

export interface VideoProps {
    jobStatus: JobStatus,
    key: string;
    outputPath: string;
    transcription: Transcription;
}

export class Video implements Entity {
    id: string;


    constructor(private readonly props: VideoProps, id?: string) {
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

    get transcription() {
        return this.props.transcription
    }

    toJSON() {
        return {
            id: this.id,
            key: this.key,
            outputPath: this.outputPath,
            jobStatus: this.jobStatus,
            transcription: this.transcription.toJSON()
        }
    }
}