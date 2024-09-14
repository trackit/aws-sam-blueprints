import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {Job} from "../shared/entities/Job";
import {JobRepository} from "../shared/JobRepository";
import {Video} from "../shared/entities/Video";
import {VideoRepository} from "../shared/VideoRepository";
import {Transcription} from "../shared/entities/Transcription";
import {JobStatus} from "../shared/enums/JobStatus";


;(async () => {
    const ddbClient = new DynamoDBClient({})
    const tableName = 'sam-samples-SingleTable-16XHJK3R7Q6EQ'

    const jobSample = new Job('fake-token', '1');
    const jobRepository = new JobRepository(ddbClient, tableName);
    await jobRepository.save(jobSample);

    const transcription = new Transcription({
        jobStatus: JobStatus.DONE,
        key: "transcription.srt",
        outputPath: "s3://my-bucket/output/test/transcription.srt",
    }, '1')

    const videoSample = new Video({
        jobStatus: JobStatus.IN_PROGRESS,
        key: "test.mp4",
        outputPath: "s3://my-bucket/output/test/test.mp4",
        transcription: transcription
    }, '1')

    const videoRepository = new VideoRepository(ddbClient, tableName)
    await videoRepository.save(videoSample)
})();

