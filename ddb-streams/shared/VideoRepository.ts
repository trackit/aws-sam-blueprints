import {Repository} from "./Repository";
import {Job} from "./entities/Job";
import {BatchWriteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {Video, VideoProps} from "./entities/Video";
import {Transcription, TranscriptionProps} from "./entities/Transcription";

interface Item extends VideoProps, TranscriptionProps {
    PK: string;
    SK: string;
    id: string;
}

export class VideoRepository implements Repository<Video> {
    private static readonly ENTITY = 'VIDEO'
    private static readonly CHILD_ENTITY = 'TRANSCRIPTION'

    constructor(private readonly repository: DynamoDBDocumentClient, private readonly tableName: string) {
    }

    delete(item: Video): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    update(item: Video): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async find(id: string): Promise<Video> {
        const command = new QueryCommand({
            ExpressionAttributeValues: {
                ':PK': `${VideoRepository.ENTITY}#${id}`,
                ':SK': 'VIDEO#',
            },
            KeyConditionExpression: 'PK = :PK AND begins_with(SK, :SK)',
            TableName: this.tableName
        })
        const {Items} = await this.repository.send(command);
        if (!Items?.length)
            throw new Error('Not Found')
        let [video, transcription] = Items as [Item, Item];

        return new Video({
                ...video,
                transcription: new Transcription(transcription, transcription.id)
            },
            video.id)
    }

    async save(video: Video): Promise<boolean> {
        const command = new BatchWriteCommand({
            RequestItems: {
                [this.tableName]: [{
                    PutRequest: {
                        Item: {
                            PK: `${VideoRepository.ENTITY}#${video.id}`,
                            SK: `${VideoRepository.ENTITY}#${video.id}`,
                            ...video.toJSON()
                        }
                    }
                }, {
                    PutRequest: {
                        Item: {
                            PK: `${VideoRepository.ENTITY}#${video.id}`,
                            SK: `${VideoRepository.ENTITY}#${VideoRepository.CHILD_ENTITY}#${video.transcription.id}`,
                            ...video.transcription.toJSON()
                        }
                    }
                }]
            }
        })
        const response = await this.repository.send(command);

        return response.$metadata.httpStatusCode === 200;
    }
}