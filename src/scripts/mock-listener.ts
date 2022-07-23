import { ScheduledEvent } from "aws-lambda";
import { handler } from "../lambdas/listener";

const EVENT_DATE_STRING = new Date("2022-05-09");
console.log(EVENT_DATE_STRING.toISOString());
const MOCK_CLOUDWATCH_SCHEDULED_EVENT: ScheduledEvent<any> = {
  version: "0",
  id: "53dc4d37-cffa-4f76-80c9-8b7d4a4d2eaa",
  "detail-type": "Scheduled Event",
  source: "aws.events",
  account: "123456789012",
  time: EVENT_DATE_STRING.toISOString(),
  region: "us-east-1",
  resources: ["arn:aws:events:us-east-1:123456789012:rule/my-scheduled-rule"],
  detail: {},
};

handler(MOCK_CLOUDWATCH_SCHEDULED_EVENT);
