const fs = require('fs');

const volcList = require('./volcano2.json')
let flatVolcList=[]
volcList.map(volc=>flatVolcList.push(volc["volc_name"]))
flatVolcList.sort()
let volcJSON = {"volcList":flatVolcList}
// convert JSON object to string
const data = JSON.stringify(volcJSON);

// write JSON string to a file
fs.writeFile('volcano.json', data, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});