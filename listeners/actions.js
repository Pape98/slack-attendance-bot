/* eslint-disable no-unused-vars */
import dayjs from 'dayjs';
import { Form, Message } from '../views';

export const showNewAttendanceForm = async ({
  ack, body, client,
}) => {
  await ack();
  const { message: { blocks }, user } = body;

  // Grabbing name and date of event
  const [name, date] = blocks[2].fields.map((field) => field.text);

  const eventDate = date.split('\n')[1];

  // Check if event date is before today's date
  const isAfterEvent = dayjs().isAfter(eventDate, 'day');

  if (isAfterEvent) {
    return client.chat.postMessage({
      channel: user.id,
      text: 'You cannot submit attendance for an event that has already passed 😔.',
    });
  }

  await client.views.open({
    trigger_id: body.trigger_id,
    view: Form.NewAttendance(name, date),
  });
};

export const sendAttendanceReminder = async ({ ack, body, client }) => {
  await ack();

  const { message: { blocks }, user } = body;
  const event = blocks[2].fields[2].text.split('\n ')[1];
  const date = blocks[2].fields[3].text.split('\n ')[1];

  // Grabbing the ids of users who have not responded
  const unformattedIs = blocks[blocks.length - 2].text.text;
  const userIds = unformattedIs.split(', ').map((id) => {
    const formattedId = id.split('|')[0].replace('<@', '').replace('>', '');
    return formattedId;
  });

  await Promise.all(userIds.map(async (id) => {
    await client.chat.postMessage({
      channel: id,
      text: 'Sending attendance reminder',
      blocks: Message.Attendance(id, event, date),
    });
  }));

  await client.chat.postMessage({
    channel: user.id,
    text: 'Attendance search results',
    blocks: Message.General(`Sent reminders to ${unformattedIs}`),
  });
};
