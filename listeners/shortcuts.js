import { Form } from '../views';
import { getData } from '../services/db';

const optionsMaker = (options) => options.map((option) => ({
  text: { type: 'plain_text', text: option },
  value: option,
}));

export const createEvent = async ({
  shortcut, ack, client,
}) => {
  await ack();
  const {
    user: { id },
  } = shortcut;

  await client.views.open({
    trigger_id: shortcut.trigger_id,
    view: Form.NewEvent(id),
  });
};

export const searchAttendance = async ({ shortcut, ack, client }) => {
  await ack();
  const { trigger_id } = shortcut;

  // get spreadsheet data
  const data = await getData();

  // get unique terms and events
  const terms = [...new Set(data.map((row) => row.term))];
  const events = [...new Set(data.map((row) => row.event))];

  // create options for select menus
  const termOptions = optionsMaker(terms);
  const eventOptions = optionsMaker(events);

  await client.views.open({
    trigger_id,
    view: Form.AttendanceSearch({ termOptions, eventOptions }),
  });
};
