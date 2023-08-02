const express = require('express');
const cors = require('cors')
const xml2js = require('xml2js');
const airportDiagrams = require("airport-diagrams")
const chartSupplements = require("chart-supplements")
const app = express();
const port = 9001;

// enables all CORS requests
app.use(cors())

// Airport demographic, ownership, geographic, runways info
// FAA 28-day NASR subscription by way of api.aeronautical.info
app.get(`/airport/:airportId`, async (req, res) => {
    const url = `https://api.aeronautical.info/dev/?airport=${req.params.airportId}&include=demographic&include=ownership&include=geographic&include=runways`
    const apiResponse = await fetch(url)
    const data = await apiResponse.json()
    res.status(200).json(data)
})

// METARs - aviationweather.gov
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

// TAFs - aviationweather.gov
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

// Airport Diagrams - NOT WORKING

app.get('/airportDiagram/:airportId', async (req, res) => {
    try {
        const diagrams = await airportDiagrams.list(`K${req.params.airportId}`);
        res.status(200).json(diagrams);
    } catch (error) {
        console.error('Error fetching airport diagram:', error);
        res.status(500).json({ error: 'An error occurred while fetching airport diagram' })
    }
})

// Chart Supplements - WORKING

app.get(`/chartSupplement/:airportId`, (req, res) => {
    chartSupplements.list(`K${req.params.airportId}`)
        .then(result => {
        res.status(200).json(result)
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