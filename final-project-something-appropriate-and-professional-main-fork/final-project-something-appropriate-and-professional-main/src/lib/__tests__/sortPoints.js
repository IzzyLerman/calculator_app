const sortPoints = require("./../sortPoints.js")



test("Correctly sorts a list of points", function () {
   //do shit
   var points = [{x:12,y:3}, {x:3,y:12}]

   sortPoints(points)

   expect(points).toStrictEqual([{x:3,y:12},{x:12,y:3}])
})

test("Sorts with duplicates", function () {
   var points = [{x:7,y:7},{x:7,y:6},{x:3,y:4},{x:2,y:-1},{x:8,y:4}]
   var sorted_xs = [2,3,7,7,8]

   sortPoints(points)

   for (var i = 0; i < points.length; i++)
      expect(points[i].x).toBe(sorted_xs[i])
})