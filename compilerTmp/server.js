const axios = require("axios");
const { readFile } = require('fs/promises')

const encodedParams = new URLSearchParams();

async function content(path) {  
    return await readFile(path, 'utf8')
}

encodedParams.append("code", "#include <stdio.h>\nint main(){\nprintf(\"Hello World\");\n}");
encodedParams.append("language", "cpp");

const options = {
  method: 'POST',
  url: 'https://codex7.p.rapidapi.com/',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': '97f677e765mshcbb9631f7ebcaf6p17a90djsn6a8e2a5742ba',
    'X-RapidAPI-Host': 'codex7.p.rapidapi.com'
  },
  data: encodedParams
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});