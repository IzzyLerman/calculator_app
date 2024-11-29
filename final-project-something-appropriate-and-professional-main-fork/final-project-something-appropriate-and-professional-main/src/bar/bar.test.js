/**
 * @jest-environment jsdom
 */
'use strict'

const JSDOM = require("jsdom").JSDOM
const fs = require("fs")
require("@testing-library/jest-dom")
const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default
const spy = jest.mock("./../lib/generateChartImg", function () {
    return jest.fn( function () { return "./../lib/__tests__/DearbornHall.png" } )
} )
const generateChartImg = require("./../lib/generateChartImg")

beforeEach(() => {
    window.localStorage.clear()
})

function initDomFromFiles(htmlPath, jsPath) {
    const html = fs.readFileSync(htmlPath, 'utf8')
    document.open()
    document.write(html)
    document.close()
    jest.isolateModules(function () {
        require(jsPath)
    })
}

test("the 'add values' button correctly adds a new pair of input fields to the page",
async function () {
    initDomFromFiles(
        `${__dirname}/bar.html`,
        `${__dirname}/bar.js`
    )
    //type pair and press '+'
    const user = userEvent.setup()
    const x_input = domTesting.getByLabelText(document,"X")
    const y_input = domTesting.getByLabelText(document,"Y")
    const add_values = domTesting.getByText(document,"+")
    await user.type(x_input,"1")
    await user.type(y_input,"2")
    await user.click(add_values)
    expect(x_input).toHaveValue("1")
    expect(y_input).toHaveValue(2)
    let x_input_arr = domTesting.queryAllByLabelText(document,"X")
    let y_input_arr = domTesting.queryAllByLabelText(document,"Y")
    expect(x_input_arr).toHaveLength(2)
    expect(y_input_arr).toHaveLength(2)
    //press '+' with no pair typed
    await user.click(add_values)
    expect(x_input).toHaveValue("1")
    expect(y_input).toHaveValue(2)
    x_input_arr = domTesting.queryAllByLabelText(document,"X")
    y_input_arr = domTesting.queryAllByLabelText(document,"Y")
    expect(x_input_arr).toHaveLength(3)
    expect(y_input_arr).toHaveLength(3)
    //add another value pair
    const x_input_2 = domTesting.getAllByLabelText(document,"X")[2]
    const y_input_2 = domTesting.getAllByLabelText(document,"Y")[2]
    await user.type(x_input_2,"3")
    await user.type(y_input_2,"4")
    await user.click(add_values)
    expect(x_input).toHaveValue("1")
    expect(y_input).toHaveValue(2)
    expect(x_input_2).toHaveValue("3")
    expect(y_input_2).toHaveValue(4)
    x_input_arr = domTesting.queryAllByLabelText(document,"X")
    y_input_arr = domTesting.queryAllByLabelText(document,"Y")
    expect(x_input_arr).toHaveLength(4)
    expect(y_input_arr).toHaveLength(4)

})

test("Alert is displayed when the user tries to generate a chart without data",
async function () {
    initDomFromFiles(
        `${__dirname}/bar.html`,
        `${__dirname}/bar.js`
    )
    const user = userEvent.setup()
    const spy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    const x_label_input = domTesting.getByLabelText(document,"X label")
    const y_label_input = domTesting.getByLabelText(document,"Y label")
    await user.type(x_label_input,"burgers")
    await user.type(y_label_input,"fries")
    const gen_chart = domTesting.getByRole(document,"button",{name:"Generate chart"})
    await user.click(gen_chart)
    expect(spy).toHaveBeenCalled()
    expect(spy.mock.calls[0][0]).toMatch("Error: No data specified!")
    spy.mockClear()
})

test("Alert is displayed when the user tries to generate a chart without both labels",
    async function () {
        initDomFromFiles(
            `${__dirname}/bar.html`,
            `${__dirname}/bar.js`
        )
        const user = userEvent.setup()
        const spy = jest.spyOn(window, 'alert').mockImplementation(() => {})
        const x_input = domTesting.getByLabelText(document,"X")
        const y_input = domTesting.getByLabelText(document,"Y")
        await user.type(x_input,"1")
        await user.type(y_input,"2")
        const y_label_input = domTesting.getByLabelText(document,"Y label")
        await user.type(y_label_input,"fries")
        const gen_chart = domTesting.getByRole(document,"button",{name:"Generate chart"})
        await user.click(gen_chart)
        expect(spy).toHaveBeenCalled()
        expect(spy.mock.calls[0][0]).toMatch("Error: Must specify a label for both X and Y!")
        spy.mockClear()
    })

test("Alert is displayed when the user tries to generate a chart without both labels",
    async function () {
        initDomFromFiles(
            `${__dirname}/bar.html`,
            `${__dirname}/bar.js`
        )
        const user = userEvent.setup()
        const spy = jest.spyOn(window, 'alert').mockImplementation(() => {})
        const x_input = domTesting.getByLabelText(document,"X")
        const y_input = domTesting.getByLabelText(document,"Y")
        await user.type(x_input,"1")
        await user.type(y_input,"2")
        const x_label_input = domTesting.getByLabelText(document,"X label")
        await user.type(x_label_input,"burgers")
        const gen_chart = domTesting.getByRole(document,"button",{name:"Generate chart"})
        await user.click(gen_chart)
        expect(spy).toHaveBeenCalled()
        expect(spy.mock.calls[0][0]).toMatch("Error: Must specify a label for both X and Y!")
        spy.mockClear()
    })

test("Clear chart data button clears all fields",
    async function () {
        initDomFromFiles(
            `${__dirname}/bar.html`,
            `${__dirname}/bar.js`
        )
        const user = userEvent.setup()
        const title = domTesting.getByLabelText(document,"Chart title")
        await user.type(title, "fast food")

        const color = document.getElementById("chart-color-input")
        await domTesting.fireEvent.change(color, {target:{value: "#111111"}})
        
        const x_input = domTesting.getAllByLabelText(document,"X")[0]
        const y_input = domTesting.getAllByLabelText(document,"Y")[0]
        await user.type(x_input,"1")
        await user.type(y_input,"2")
        const add_values = domTesting.getByRole(document, "button", {name:"+"})
        await user.click(add_values)
        const x_input_2 = domTesting.getAllByLabelText(document,"X")[1]
        const y_input_2 = domTesting.getAllByLabelText(document,"Y")[1]
        await user.type(x_input,"3")
        await user.type(y_input,"4")
        await user.click(add_values)
        
        const x_label_input = domTesting.getByLabelText(document,"X label")
        const y_label_input = domTesting.getByLabelText(document,"Y label")
        await user.type(x_label_input,"burgers")
        await user.type(y_label_input,"fries")

        const clear_data = domTesting.getByRole(document,"button",{name:"Clear chart data"})
        await user.click(clear_data)

        expect(title).toBeEmptyDOMElement()
        expect(x_input).toBeEmptyDOMElement()
        expect(y_input).toBeEmptyDOMElement()
        expect(x_label_input).toBeEmptyDOMElement()
        expect(y_label_input).toBeEmptyDOMElement()

        let x_input_arr = domTesting.queryAllByLabelText(document,"X")
        let y_input_arr = domTesting.queryAllByLabelText(document,"Y")
        expect(x_input_arr).toHaveLength(1)
        expect(y_input_arr).toHaveLength(1)

        expect(color).toHaveValue("#ff4500")


        
 })

test("Generating a chart sends the correct data to the generateChartImg function",
    async function () {
        initDomFromFiles(
            `${__dirname}/bar.html`,
            `${__dirname}/bar.js`
        )
        const user = userEvent.setup()
        const title = domTesting.getByLabelText(document,"Chart title")
        await user.type(title, "fast food")
        const color = document.getElementById("chart-color-input")
        await domTesting.fireEvent.change(color, {target:{value: "#111111"}})
        const x_input = domTesting.getAllByLabelText(document,"X")[0]
        const y_input = domTesting.getAllByLabelText(document,"Y")[0]
        await user.type(x_input,"1")
        await user.type(y_input,"2")
        const add_values = domTesting.getByRole(document, "button", {name:"+"})
        await user.click(add_values)
        const x_input_2 = domTesting.getAllByLabelText(document,"X")[1]
        const y_input_2 = domTesting.getAllByLabelText(document,"Y")[1]
        await user.type(x_input_2,"3")
        await user.type(y_input_2,"4")
            
        const x_label_input = domTesting.getByLabelText(document,"X label")
        const y_label_input = domTesting.getByLabelText(document,"Y label")
        await user.type(x_label_input,"burgers")
        await user.type(y_label_input,"fries")

        const gen_chart = domTesting.getByRole(document,"button",{name:"Generate chart"})
        await user.click(gen_chart)

        const res = generateChartImg.mock.calls[0]
        expect(res[0]).toMatch("bar")
        expect(res[1]).toEqual([{x: "1", y:"2"},{x: "3", y:"4"}])
        expect(res[2]).toMatch("burgers")
        expect(res[3]).toMatch("fries")
        expect(res[4]).toMatch("fast food")
        expect(res[5]).toMatch("#111111")
    
    
    
            
})
    

