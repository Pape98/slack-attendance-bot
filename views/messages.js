import dayjs from 'dayjs';

const Attendance = (userID, name, date) => [
  {
    type: 'header',
    text: {
      type: 'plain_text',
      text: ':ballot_box_with_ballot: Attendance Check',
      emoji: true,
    },
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `Hello <@${userID}> :wave:! I would like to know about your attendance. Please submit your response within the next 24 hours.`,
    },
  },
  {
    type: 'section',
    fields: [
      {
        type: 'mrkdwn',
        text: `*Event:*\n${name}`,
      },
      {
        type: 'mrkdwn',
        text: `*When:*\n${date}`,
      },
    ],
  },
  {
    type: 'actions',
    elements: [
      {
        type: 'button',
        style: 'primary',
        text: {
          type: 'plain_text',
          text: 'Submit a response :point_right:',
          emoji: true,
        },
        value: 'click_me_123',
        action_id: 'show_new_attendance_form',
      },
    ],
  },
];

const MissingYou = (event, date) => [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Attendance Check* \n:white_check_mark: Your submission successfully went through for *${event}* happening on *${date}*. We will miss you a lot :sob:. Your DALI family will be waiting for you next week :happyjump:`,
    },
    accessory: {
      type: 'image',
      image_url:
          'https://thumbs.dreamstime.com/b/white-sad-bunny-rabbit-hanging-paper-board-miss-you-funny-head-face-big-ears-cute-cartoon-character-kawaii-animal-easter-symbol-116064880.jpg',
      alt_text: 'cute cat',
    },
  },
];

const General = (text) => [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Attendance Check* \n ${text}`,
    },
  },
];

const AttendanceSearchResults = (args) => {
  const {
    totalPeople,
    numResponses,
    attendingResponses,
    membersWhoHaveNotFilledOutForm,
    absentMembers,
  } = args;
  const { term, event, channel } = args;

  const absentMembersOutput = absentMembers
    .map((member) => `<@${member.user_id}> because \`${member.attendance}\`: "_${
      member.comment ?? 'No comment provided'
    }_" `)
    .join('\n');

  return [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: ':mag: Attendance Search',
        emoji: true,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Channel* \n<#${channel}>`,
        },
        {
          type: 'mrkdwn',
          text: `*Term*\n ${term.toUpperCase()}`,
        },
        {
          type: 'mrkdwn',
          text: `*Event *\n ${event}`,
        },
        {
          type: 'mrkdwn',
          text: `*Today*\n ${dayjs().format('MM-DD-YYYY')}`,
        },
      ],
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ':email: *Submissions Summary* :email:',
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `:people_holding_hands: Total # of people: *${totalPeople}*`,
        },
        {
          type: 'mrkdwn',
          text: `:mailbox: Responses: *${numResponses}*`,
        },
        {
          type: 'mrkdwn',
          text: `:clock1: Missing Responses: *${totalPeople - numResponses}*`,
        },
        {
          type: 'mrkdwn',
          text: `:thumbsup: Attending: *${attendingResponses}* `,
        },
        {
          type: 'mrkdwn',
          text: `:stethoscope: Absent: *${numResponses - attendingResponses}* `,
        },
      ],
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ':pill: *Absent Submissions From...* :pill:',
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: absentMembersOutput.length > 0 ? absentMembersOutput : 'None 😊',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ':question: *Missing Submissions From...* :question:',
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: membersWhoHaveNotFilledOutForm,
      },
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Remind people :bell:',
            emoji: true,
          },
          value: 'click_me_123',
          action_id: 'send_attendance_reminder',
        },
      ],
    },
  ];
};

export default {
  Attendance,
  AttendanceSearchResults,
  MissingYou,
  General,
};
