import { App, AwsLambdaReceiver } from '@slack/bolt';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import {
  createEvent,
  searchAttendance,
  onSubmitNewAttendance,
  onSubmitNewEvent,
  onSubmitAttendanceSearch,
  sendAttendanceReminder,
  showNewAttendanceForm,
} from './listeners';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const receiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

// Register listeners
app.action('show_new_attendance_form', showNewAttendanceForm);
app.action('send_attendance_reminder', sendAttendanceReminder);
app.action('event_options', ({ ack }) => ack());
app.action('select', ({ ack }) => ack());

app.view('new_event_form', onSubmitNewEvent);
app.view('new_attendance_form', onSubmitNewAttendance);
app.view('attendance_search_form', onSubmitAttendanceSearch);

app.shortcut('create_event', createEvent);
app.shortcut('get_attendance', searchAttendance);

export const attendanceHandler = async (event, context, callback) => {
  const handler = await receiver.start();
  return handler(event, context, callback);
};

export const slackEventChallengeHandler = async (event) => ({
  statusCode: 200,
  body: JSON.parse(event.body).challenge,
});

export const healthHandler = async () => ({
  statusCode: 200,
  body: JSON.stringify({ message: 'Slack Attendance App is healthy 😊!' }),
});
