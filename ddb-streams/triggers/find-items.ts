import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {VideoRepository} from "../shared/VideoRepository";

;(async () => {
    const ddbClient = new DynamoDBClient({})
    const tableName = 'sam-samples-SingleTable-16XHJK3R7Q6EQ'
    const videoRepository = new VideoRepository(ddbClient, tableName)

    const video = await videoRepository.find('1');
    console.log(video.toJSON())
})();