/**
 * @jest-environment jsdom
 */

const chartStorage = require("./../chartStorage.js")

const quote_enquote_chart = {msg:"Thanks for the lack of restrictions on the data", other_val:23}
const quote_enquote_charts = [{val:32, test_init:true},{sclr:3,test:true},{reason:null,test_init:true},{order:"I waited too long to do this",test_init:false}]

function saveSomeCharts() {
   for (var not_a_chart of quote_enquote_charts)
      chartStorage.saveChart(not_a_chart, null)
}

test("Saves charts to local storage", function () {
   expect(window.localStorage.getItem("savedCharts")).toBeNull()
   chartStorage.saveChart(quote_enquote_chart,null)
   expect(window.localStorage.getItem("savedCharts")).not.toBeNull()
   saveSomeCharts()
   expect(JSON.parse(window.localStorage.getItem("savedCharts"))).toHaveLength(5)
   window.localStorage.clear()
})

test("Loads charts from saved storage", function () {
   expect(window.localStorage.getItem("savedCharts")).toBeNull()
   saveSomeCharts()
   expect(chartStorage.loadAllSavedCharts()).toHaveLength(4)
   window.localStorage.clear()
})

test("Can recall a specific chart from saved storage", function () {
   chartStorage.saveChart(quote_enquote_chart, null)
   expect(chartStorage.loadSavedChart(0)).toEqual(quote_enquote_chart)
   window.localStorage.clear()
})

test("Can overwrite saved charts in local storage", function () {
   saveSomeCharts()
   chartStorage.saveChart(quote_enquote_chart, 2)
   expect(chartStorage.loadSavedChart(2)).toEqual(quote_enquote_chart)
   window.localStorage.clear()
})

test("Can manually set current chart data", function () {
   expect(window.localStorage.getItem("currentChartData")).toBeNull()
   chartStorage.updateCurrentChartData(quote_enquote_chart)
   expect(window.localStorage.getItem("currentChartData")).not.toBeNull()
   window.localStorage.clear()
})

test("Can retrieve current chart data", function () {
   chartStorage.updateCurrentChartData(quote_enquote_chart)
   expect(chartStorage.loadCurrentChartData()).toEqual(quote_enquote_chart)
   window.localStorage.clear()
})