const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const axios = require('axios');

const url = 'http://www.orangecountyfl.net/EmergencySafety/FireRescue/ActiveCalls.aspx';
axios.get(url).then(function(response) {
  const dom = new JSDOM(response.data);
  const tableId = 'dnn_ctr6845_WebCAD_lstvwCalls4Svc_itemPlaceholderContainer'
  const table = dom.window.document.getElementById(tableId);

  const calls = [];
  const rows = table.children[0].children;


  for (let item of rows) {
      const call = {};
      //CALL NO 	DISPATCH TIME 	TYPE 	UNIT 	STREET NO 	STREET NAME 	MAP
      call.callNumber = item.cells[0].textContent.trim();
      call.dispatchTime = item.cells[1].textContent.trim();
      call.type = item.cells[2].textContent.trim();
      call.unit = item.cells[3].textContent.trim();
      call.streetNumber = item.cells[4].textContent.trim();
      call.streetName = item.cells[5].textContent.trim();
      const mapTag = item.cells[6].getElementsByTagName('a')[0];

      call.location = mapTag && mapTag.search.replace('?latlng=', '').split(',');
      // call.location = item.cells[6].textContent.trim();// = {};
      calls.push(call);
  }

  console.log(JSON.stringify(calls));

});
