const express = require('express');
const cors = require('cors')
const xml2js = require('xml2js');
const app = express();
const port = 9001;

// enables all CORS requests
app.use(cors())

// METARs
app.get(`/metar/:airportId`, async (req, res) => {
    const url = `https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=K${req.params.airportId}&hoursBeforeNow=2&mostRecent=true`

    const apiResponse = await fetch(url);
    const xmlData = await apiResponse.text();
    const parser = new xml2js.Parser()

    parser.parseStringPromise(xmlData).then(function (result) {
        res.status(200).json(result)
    })
    .catch(function (err) {
        console.log("Failed", err)
    })    
    })

// TAFs
app.get(`/taf/:airportId`, async (req, res) => {
    const url = `https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=K${req.params.airportId}&hoursBeforeNow=2&mostRecent=true`

    const apiResponse = await fetch(url);
    const xmlData = await apiResponse.text();
    const parser = new xml2js.Parser()

    parser.parseStringPromise(xmlData).then(function (result) {
        res.status(200).json(result)
    })
    .catch(function (err) {
        console.log("Failed", err)
    })    
    })

// listen command
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


// for reference

// this code will return XML wrapped as JSON (not properly parsed to JSON).
// app.get(`/metar/:airportId`, async (req, res) => {
//     const url = `https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=K${req.params.airportId}&hoursBeforeNow=2&mostRecent=true`
//     const apiResponse = await fetch(url)
//     const data = await apiResponse.text()
//     res.status(200).json(data)
// })

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`)
// })