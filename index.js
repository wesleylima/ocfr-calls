const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const moment = require('moment-timezone');

const axios = require('axios');
const tz = 'America/New_York';

const dateRe = /, ([A-z]+) ([0-9]{1,2}), ([0-9]{4})/;
const timeRe = /(0[0-9]|1[0-9]|2[0-3]|[0-9]):([0-5][0-9]):([0-5][0-9])$/;

const names_to_index = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11
};

exports.handler = async (event) => {
  const url = 'http://www.orangecountyfl.net/EmergencySafety/FireRescue/ActiveCalls.aspx';
  return axios.get(url).then(function(response) {
    const dom = new JSDOM(response.data);
    const tableId = 'dnn_ctr6845_WebCAD_lstvwCalls4Svc_itemPlaceholderContainer'
    const table = dom.window.document.getElementById(tableId);

    const currentDateText = dom.window.document.getElementById('dnn_ctr6845_WebCAD_lblActiveIncidents').textContent.trim();
    const currentDateParts = dateRe.exec(currentDateText);
    const currentDate = moment.tz({
      month: names_to_index[currentDateParts[1]],
      day: Number(currentDateParts[2]),
      year: Number(currentDateParts[3]),
    }, tz);

    // We're getting the 'current' date and time from the page because presumably it is running on the same clock as the call times. The comparisons of what happened today or yesteday should always match
    const retrievalTimeText = dom.window.document.getElementById('dnn_ctr6845_WebCAD_lblTime').textContent.trim();
    const retrievalTimeParts = timeRe.exec(retrievalTimeText);

    const retrievalDate = retrievalTimeParts && moment.tz({
      month: currentDate.month(),
      day: currentDate.date(),
      year: currentDate.year(),
      hour: Number(retrievalTimeParts[1]),
      minute: Number(retrievalTimeParts[2]),
      second: Number(retrievalTimeParts[3]),
    }, tz);

    const calls = [];
    const rows = table.children[0].children;

    for (let item of rows) {
        const call = {};
        //CALL NO 	DISPATCH TIME 	TYPE 	UNIT 	STREET NO 	STREET NAME 	MAP
        call.callNumber = item.cells[0].textContent.trim();
        const dispatchTimeParts = item.cells[1].textContent.trim().split(':');
        const dispatchDateTime = dispatchTimeParts && moment.tz({
          month: retrievalDate.month(),
          day: retrievalDate.date(),
          year: retrievalDate.year(),
          hour: Number(dispatchTimeParts[0]),
          minute: Number(dispatchTimeParts[1]),
          second: Number(dispatchTimeParts[2]),
        }, tz);

        if (dispatchDateTime.hour() > retrievalDate.hour()) {
          // This call happened yesterday
          dispatchDateTime.subtract('days', 1);
        }

        call.callTime = dispatchDateTime.format();
        call.type = item.cells[2].textContent.trim();
        call.unit = item.cells[3].textContent.trim();
        call.streetNumber = item.cells[4].textContent.trim();
        call.streetName = item.cells[5].textContent.trim();
        const mapTag = item.cells[6].getElementsByTagName('a')[0];
        const geo = mapTag && mapTag.search.replace('?latlng=', '').split(',');
        call.location = geo && {lat: geo[0], lng: geo[1]};
        calls.push(call);
    }

    const body = JSON.stringify(calls.slice(1));

    return {
    'statusCode': 200,
      'headers': {'Content-Type': 'application/json'},
      'body': body,
    }
  });
};
