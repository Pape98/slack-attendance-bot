import dayjs from 'dayjs';

// TODO: Stop being lazy and remove
import _ from 'underscore';

import { getData, getSheet } from '../services/db';
import { Message } from '../views';

export const onSubmitNewEvent = async ({
  ack, body, client, context,
}) => {
  ack();
  const {
    view: { state },
  } = body;
  let {
    term, date, name, channel,
  } = state.values;

  // eslint-disable-next-line no-unused-vars
  term = term.input_value.value.toUpperCase();
  date = dayjs(date.date_value.selected_date).format('ddd, MMM D, YYYY');
  name = name.input_value.value;
  channel = channel.select.selected_channel;

  // get list of all members in channel
  let { members } = await client.conversations.members({ channel, limit: 150 }); // C04JUP2P677

  // remove id of bot
  members = members.filter((member) => member !== context.botUserId);

  await Promise.all(
    members.map(async (memberID) => {
      await client.chat.postMessage({
        channel: memberID,
        text: 'Sending attendance view',
        blocks: Message.Attendance(memberID, name, date),
      });
    }),
  );
};

export const onSubmitAttendanceSearch = async ({
  ack,
  context,
  body,
  client,
}) => {
  ack();
  const {
    view: { state },
    user,
  } = body;
  let { term, event, channel } = state.values;

  term = term.select?.selected_option?.value;
  event = event.select?.selected_option?.value;
  channel = channel.select?.selected_channel;

  // check if user selected a term, event, and channel
  if (!term || !event || !channel) {
    return client.chat.postMessage({
      channel: user.id,
      text: ':exclamation: You must select a channel, term, and event to search for attendance.',
    });
  }

  // get list of all members in channel
  let { members } = await client.conversations.members({ channel, limit: 150 });

  // remove undesired ids
  members = members.filter(
    (member) => [context.botUserId].indexOf(member) === -1,
  );

  // get attendance data from speadsheet
  let attendanceEntries = await getData();
  attendanceEntries = _.uniq(attendanceEntries).filter(
    (row) => row.term === term && row.event === event,
  );

  const memberIds = attendanceEntries.map((row) => row.user_id);

  // list of members who have not filled out attendance form
  let membersWhoHaveNotFilledOutForm = _.difference(members, memberIds);
  membersWhoHaveNotFilledOutForm = membersWhoHaveNotFilledOutForm.map((id) => `<@${id}>`).join(', ')
    || 'Empty :smile:';

  // list of members who will be absent
  const absentMembers = attendanceEntries.filter(
    (row) => row.attendance !== 'Yes',
  );

  // compute attendance stats
  const totalPeople = members.length;
  const numResponses = attendanceEntries.length;
  const attendingResponses = attendanceEntries.filter(
    (e) => e.attendance === 'Yes',
  ).length;

  const blocks = Message.AttendanceSearchResults({
    term,
    event,
    channel,
    totalPeople,
    numResponses,
    attendingResponses,
    membersWhoHaveNotFilledOutForm,
    absentMembers,
  });

  return client.chat.postMessage({
    channel: user.id,
    text: 'Attendance search results',
    blocks,
  });
};

export const onSubmitNewAttendance = async ({ ack, body, client }) => {
  ack();
  const { user, view } = body;
  // eslint-disable-next-line prefer-const
  let { id, name } = user;
  let { attendance, comment } = view.state.values;

  // name's original format was first.last
  name = name
    .split('.')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

  attendance = attendance.radios_value.selected_option.value;
  comment = comment.input_value.value;

  // case user does not provide reason for not attending
  if (attendance === 'Other' && !comment) {
    return client.chat.postMessage({
      channel: id,
      text: 'Please provide a reason for not attending :smiley:',
      blocks: Message.General('Please provide a reason for absence :smiley:'),
    });
  }

  // get event name and date
  const [event, date] = view.blocks[0].fields.map(
    (field) => field.text.split('\n')[1],
  );

  const submission = {
    timestamp: new Date().toISOString(),
    term: '23s'.toUpperCase(),
    event,
    user_id: id,
    username: name,
    attendance,
    comment: comment || '',
  };

  // Add row to attendance spreasheet
  const sheet = await getSheet();
  await sheet.addRow(submission);

  // Send confirmation message to user
  const message = attendance === 'Yes'
    ? Message.General(
      ':white_check_mark: Thank you for confirming. See you there!',
    )
    : Message.MissingYou(event, date);

  await client.chat.postMessage({
    channel: id,
    text: 'Success',
    blocks: message,
  });

  // If member is not attending, alert admin
  if (attendance !== 'Yes') {
    const messageforAdmin = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hi:wave:! <@${id}> will miss *${event}* because *${attendance.toLowerCase()}*. \n>"${comment ?? 'No comment provided'}"`,
        },
      },
    ];

    await client.chat.postMessage({
      channel: process.env.ADMIN_SLACK_ID,
      text: 'Member not attending',
      blocks: messageforAdmin,
    });
  }
};
