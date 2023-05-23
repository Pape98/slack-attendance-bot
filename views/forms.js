export const NewAttendance = (name, date) => ({
  type: 'modal',
  callback_id: 'new_attendance_form',
  title: {
    type: 'plain_text',
    text: 'Confirm your attendance',
    emoji: true,
  },
  submit: {
    type: 'plain_text',
    text: 'Submit',
    emoji: true,
  },
  close: {
    type: 'plain_text',
    text: 'Cancel',
    emoji: true,
  },
  blocks: [
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `:tada: ${name}`,
        },
        {
          type: 'mrkdwn',
          text: `:calendar: ${date}`,
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      type: 'input',
      block_id: 'attendance',
      element: {
        type: 'radio_buttons',
        options: [
          {
            text: {
              type: 'mrkdwn',
              text: 'Yes, I will attend.',
            },
            value: 'Yes',
          },
          {
            text: {
              type: 'mrkdwn',
              text: 'No, I will miss it because of *class*.',
            },
            value: 'Class',
          },
          {
            text: {
              type: 'mrkdwn',
              text: 'No, I will miss it because I am *sick*.',
            },
            value: 'Sick',
          },
          {
            text: {
              type: 'mrkdwn',
              text: 'No, I will miss it because... (reason for absence required in comment)',
            },
            value: 'Other',
          },
        ],
        action_id: 'radios_value',
      },
      label: {
        type: 'plain_text',
        text: 'Will you attend the meeting?',
        emoji: true,
      },
    },
    {
      type: 'input',
      optional: true,
      block_id: 'comment',
      element: {
        type: 'plain_text_input',
        multiline: true,
        action_id: 'input_value',
      },
      label: {
        type: 'plain_text',
        text: 'Comment',
        emoji: true,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'plain_text',
          text: 'Note: If you are not attending, provide more details here. Only staff will be able to see the submissions.',
          emoji: true,
        },
      ],
    },
  ],
});

export const NewEvent = (userID) => {
  const customMessage = `Hi <@${
    userID
  }> :wave:! Please fill out the form below to create an event.`;
  return {
    type: 'modal',
    callback_id: 'new_event_form',
    title: {
      type: 'plain_text',
      text: 'Create new event',
    },
    submit: {
      type: 'plain_text',
      text: 'Send',
      emoji: true,
    },
    close: {
      type: 'plain_text',
      text: 'Cancel',
      emoji: true,
    },
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: customMessage,
        },
      },
      { type: 'divider' },
      {
        type: 'section',
        block_id: 'channel',
        text: {
          type: 'mrkdwn',
          text: ':mailbox: *Recipients* \nSelect channel to notify its members',
        },
        accessory: {
          type: 'channels_select',
          action_id: 'select',
        },
      },
      { type: 'divider' },
      {
        type: 'input',
        block_id: 'term',
        element: {
          type: 'plain_text_input',
          action_id: 'input_value',
          placeholder: {
            type: 'plain_text',
            text: 'e.g. 21W',
          },
        },
        label: {
          type: 'plain_text',
          text: 'School Term',
          emoji: true,
        },
      },
      {
        type: 'input',
        block_id: 'name',
        element: {
          type: 'plain_text_input',
          action_id: 'input_value',
          placeholder: {
            type: 'plain_text',
            text: 'e.g. All Lab Week 1',
          },
        },
        label: {
          type: 'plain_text',
          text: 'Name',
          emoji: true,
        },
      },
      {
        type: 'input',
        block_id: 'date',
        element: {
          type: 'datepicker',
          placeholder: {
            type: 'plain_text',
            text: 'Select a date',
            emoji: true,
          },
          action_id: 'date_value',
        },
        label: {
          type: 'plain_text',
          text: 'Date',
          emoji: true,
        },
      },
    ],
  };
};

export const AttendanceSearch = ({ eventOptions, termOptions }) => ({
  type: 'modal',
  callback_id: 'attendance_search_form',
  title: {
    type: 'plain_text',
    text: 'Get event attendance ',
    emoji: true,
  },
  submit: {
    type: 'plain_text',
    text: 'Submit',
    emoji: true,
  },
  close: {
    type: 'plain_text',
    text: 'Cancel',
    emoji: true,
  },
  blocks: [
    {
      type: 'section',
      block_id: 'channel',
      text: {
        type: 'plain_text',
        text: ':mailbox: Select channel to select its members',
      },
      accessory: {
        type: 'channels_select',
        action_id: 'select',
      },
    },
    {
      type: 'section',
      block_id: 'term',
      text: {
        type: 'mrkdwn',
        text: ':calendar: School term ',
      },
      accessory: {
        type: 'static_select',
        options: termOptions,
        action_id: 'select',
      },
    },
    {
      type: 'section',
      block_id: 'event',
      text: {
        type: 'mrkdwn',
        text: ':tada: Event name',
      },
      accessory: {
        type: 'static_select',
        options: eventOptions,
        action_id: 'select',
      },
    },
  ],
});

export default { NewAttendance, NewEvent, AttendanceSearch };
