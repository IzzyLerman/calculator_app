/**
 * @jest-environment jsdom
 */

const JSDOM = require("jsdom").JSDOM
const fs = require("fs")
require("@testing-library/jest-dom")
const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default

function initDomFromFiles(htmlPath, jsPath) {
    const html = fs.readFileSync(htmlPath, 'utf8')
    document.open()
    document.write(html)
    document.close()
    jest.isolateModules(function () {
        require(jsPath)
    })
}

test("Blank test",
function () {
    initDomFromFiles(
        `${__dirname}/index.html`,
        `${__dirname}/chartBuilder/chartBuilder.js`
    )
    const g = document.getElementById("gallery")
    expect(g).toBeEmptyDOMElement()

})