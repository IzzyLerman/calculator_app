const fs = require("fs")
const http = require("msw").http
const HttpResponse = require("msw").HttpResponse
const setupServer = require("msw/node").setupServer

const fake_result = fs.readFileSync('./src/lib/__tests__/DearbornHall.png')

const server = setupServer(
   http.post(
      "https://quickchart.io/chart",
      async function ({request}) {
         return HttpResponse.json({
            status:200,
            headers: {
               'Content-Type': 'image/png',
            },
            body:fake_result,
         })
      }
   )
)
const generateChartImg = require("./../generateChartImg.js")

beforeAll(function () {
   server.listen()
 })
 
 afterAll(function () {
   server.close()
 })

test("Calls api", function () {
   let type = "line"
   let data = []
   let xLabel = "Cheese Consumption"
   let yLabel = "Racism"
   let title = "Effect of Shark attacks on ice cream sales"
   let color = "#ff4500"

   let thing = generateChartImg(type, data, xLabel, yLabel, title, color)
   
   expect(thing).toBeTruthy()
})