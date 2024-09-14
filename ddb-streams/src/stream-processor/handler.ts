import {Context, DynamoDBStreamEvent, StreamRecord} from "aws-lambda";
import {unmarshall} from "@aws-sdk/util-dynamodb";
import {AttributeValue} from "@aws-sdk/client-dynamodb";

interface PartialBatchResponse {
    itemIdentifier: string
}

const transformRecordForOpenSearch = (record: StreamRecord, batchItemFailures: Array<PartialBatchResponse>) => {
    // Get RID of DynamoDB keywords
    try {
        delete record.NewImage?.PK
        delete record.NewImage?.SK

        const document = {
            id: unmarshall(record.NewImage!.id as { [key: string]: AttributeValue }),
            index: 'Opensearch index name',
            body: {
                ...unmarshall(record.NewImage as { [key: string]: AttributeValue })
            }
        }

        console.log(document)

        // Insert to Opensearch
    } catch (e) {
        batchItemFailures.push({
            itemIdentifier: record.SequenceNumber!
        })
    }
}

export default async (event: DynamoDBStreamEvent, context: Context) => {
    console.log(`Received Records ${JSON.stringify(event.Records, null, 2)}`);
    const batchItemFailures: Array<PartialBatchResponse> = []

    const records = event.Records.map((record) => {
        if (!record || !record.dynamodb) {
            console.log('empty record')
            return
        }
        console.log(`DynamoDB event Type:${record.eventName}`) // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_streams_Record.html
        switch (record.eventName) {
            case 'INSERT':
                transformRecordForOpenSearch(record.dynamodb, batchItemFailures)
                break;
            case 'MODIFY':
                transformRecordForOpenSearch(record.dynamodb, batchItemFailures)
                break;
            case 'REMOVE':
                console.log('With remove we only have the OldImage key')
                break;
        }

    })

    return {
        batchItemFailures
    };
}