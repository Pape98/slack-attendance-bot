import { GoogleSpreadsheet } from 'google-spreadsheet';

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

// eslint-disable-next-line func-names
(async function () {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  });
}());

export const getSheet = async () => {
  await doc.loadInfo();
  return doc.sheetsByIndex[0];
};

export const getData = async () => {
  await doc.loadInfo();
  const sheet = await getSheet();
  // eslint-disable-next-line no-underscore-dangle
  const rows = (await sheet.getRows()).map((row) => row._rawData);
  const data = rows.map((row) => ({
    timestamp: row[0],
    term: row[1],
    event: row[2],
    user_id: row[3],
    username: row[4],
    attendance: row[5],
    comment: row[6],
  }));

  return data;
};
