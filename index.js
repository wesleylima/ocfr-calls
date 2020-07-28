const CryptoJS = require('crypto-js');

const secret = "tombrady5rings";

const JsonFormatter = {
  stringify: function(cipherParams) {
    // We're not sringyfying here
  },
  parse: function(jsonStr) {
    // parse json string
    var jsonObj = JSON.parse(jsonStr);

    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
    });

    if (jsonObj.iv) {
      cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
    }

    if (jsonObj.s) {
      cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
    }
    return cipherParams;
  }
};

const handler = async (event) => {
  const url = 'https://web.pulsepoint.org/DB/giba.php?agency_id=65060';
  return fetch(url).then(async function(response) {
    if (response.ok) {
      let json = await response.json();
      var decrypted = CryptoJS.AES.decrypt(JSON.stringify(json), secret, {
        format: JsonFormatter
      }).toString(CryptoJS.enc.Utf8);

      const body = JSON.parse(JSON.parse(decrypted));
      return {
      'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': body,
      }
    }

  });
};

exports.handler = handler;
