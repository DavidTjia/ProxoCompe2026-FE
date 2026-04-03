const https = require("https");
const url = "https://tilikkota-be.up.railway.app/items/comments?fields=*";
const options = {
  headers: {
    "Authorization": "Bearer oBK6dAMjB19alXR6Z_wSrJT0Oa40Mkeu"
  }
};
https.get(url, options, (res) => {
  let body = "";

  res.on("data", (chunk) => {
    body += chunk;
  });

  res.on("end", () => {
    try {
      let json = JSON.parse(body);
      const fs = require('fs');
      fs.writeFileSync('c:\\Codes\\Prox\\ProxoCompe2026-FE\\test-out.json', JSON.stringify(json.data[0], null, 2));
      console.log("Wrote to test-out.json");
    } catch (error) {
      console.error(error.message);
    }
  });

}).on("error", (error) => {
  console.error(error.message);
});
