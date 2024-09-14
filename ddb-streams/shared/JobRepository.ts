import {Repository} from "./Repository";
import {Job} from "./entities/Job";
import {DynamoDBDocumentClient, GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";

export class JobRepository implements Repository<Job> {
    constructor(private readonly repository: DynamoDBDocumentClient, private readonly tableName: string) {
    }

    delete(item: Job): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    update(item: Job): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async find(id: string): Promise<Job> {
        const command = new GetCommand({
            Key: {
                PK: `JOB#${id}`,
                SK: `JOB#${id}`,
            }, TableName: this.tableName
        })
        const {Item} = await this.repository.send(command);
        if (!Item)
            throw new Error('Not Found')
        return new Job(Item.token, Item.id)
    }

    async save(job: Job): Promise<boolean> {
        const command = new PutCommand({
            Item: {
                PK: `JOB#${job.id}`,
                SK: `JOB#${job.id}`,
                id: job.id,
                token: job.token
            }, TableName: this.tableName
        })
        const response = await this.repository.send(command);

        return response.$metadata.httpStatusCode === 200;
    }
}