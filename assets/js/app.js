// Set up SVG definitions
let svgWidth = 1260;
let svgHeight = 820;

// set up borders in svg
let margin = {
  top: 20,
  right: 40,
  bottom: 200,
  left: 100
};

// calculate chart height and width
let width = svgWidth - margin.right - margin.left;
let height = svgHeight - margin.top - margin.bottom;

// append a div class to the scatter element
let chart = d3.select('#scatter')
  .append('div')
  .classed('chart', true);

//append an svg element to the chart 
let svg = chart.append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

//append an svg group
let chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

//initial parameters; x and y axis
let chosenXAxis = 'NumberOfLikes';
let chosenYAxis = 'NumberOfCharacters';

//a function for updating the x-scale variable upon click of label
function xScale(tweetData, chosenXAxis) {
  //scales
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(tweetData, d => d[chosenXAxis]) * 0.8,
    d3.max(tweetData, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);

  return xLinearScale;
}
//a function for updating y-scale variable upon click of label
function yScale(tweetData, chosenYAxis) {
  //scales
  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(tweetData, d => d[chosenYAxis]) * 0.8,
    d3.max(tweetData, d => d[chosenYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}
//a function for updating the xAxis upon click
function renderXAxis(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(2000)
    .call(bottomAxis);

  return xAxis;
}

//function used for updating yAxis variable upon click
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(2000)
    .call(leftAxis);

  return yAxis;
}

//a function for updating the circles with a transition to new circles 
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(2000)
    .attr('cx', data => newXScale(data[chosenXAxis]))
    .attr('cy', data => newYScale(data[chosenYAxis]))

  return circlesGroup;
}

//function for updating tweet labels
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textGroup.transition()
    .duration(2000)
    .attr('x', d => newXScale(d[chosenXAxis]))
    .attr('y', d => newYScale(d[chosenYAxis]));

  return textGroup
}
//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

  //style based on variable
  //TweetLength
  if (chosenXAxis === 'NumberOfLikes') {
    return `${value}`;
  }
  //Hashtags
  else {
    return `${value}`;
  }
}

//funtion for updating circles group
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  //CharCount
  if (chosenXAxis === 'NumberOfLikes') {
    var xLabel = 'Number of Likes:';
  }
  //Retweets
  else {
    var xLabel = 'Number of Retweets:';
  }
  //Y label
  //TweetLength
  if (chosenYAxis === 'NumberOfCharacters') {
    var yLabel = "Number of Characters:"
  }
  //Hashtags
  else {
    var yLabel = 'Number of Hashtags:';
  }

  //create tooltip
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-8, 0])
    .html(function (d) {
      return (`TweetID:${d.id}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  //add
  circlesGroup.on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

  return circlesGroup;
}
//retrieve data
d3.csv('./assets/data/clean_data.csv').then(function (tweetData) {

  console.log(tweetData);

  //Parse data
  tweetData.forEach(function (data) {
    data.NumberOfCharacters = +data.NumberOfCharacters;
    data.NumberOfHashtags = +data.NumberOfHashtags;
    data.NumberOfRetweets = +data.NumberOfRetweets;
    data.NumberOfLikes = +data.NumberOfLikes;
  });

  //create linear scales
  var xLinearScale = xScale(tweetData, chosenXAxis);
  var yLinearScale = yScale(tweetData, chosenYAxis);

  //create x axis
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  //append X
  var xAxis = chartGroup.append('g')
    .classed('x-axis', true)
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  //append Y
  var yAxis = chartGroup.append('g')
    .classed('y-axis', true)
    //.attr
    .call(leftAxis);

  //append Circles
  var circlesGroup = chartGroup.selectAll('circle')
    .data(tweetData)
    .enter()
    .append('circle')
    .classed('tweetCircle', true)
    .attr('cx', d => xLinearScale(d[chosenXAxis]))
    .attr('cy', d => yLinearScale(d[chosenYAxis]))
    .attr('r', 3)
    .attr('opacity', '.5');

  //create a group for the x axis labels
  var xLabelsGroup = chartGroup.append('g')
    .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);

  var likesLabel = xLabelsGroup.append('text')
    .classed('aText', true)
    .classed('active', true)
    .attr('x', 0)
    .attr('y', 20)
    .attr('value', 'NumberOfLikes')
    .text('Number of Likes');

  var retweetsLabel = xLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 40)
    .attr('value', 'NumberOfRetweets')
    .text('Number of Retweets');

  //create a group for Y labels
  var yLabelsGroup = chartGroup.append('g')
    .attr('transform', `translate(${0 - margin.left / 4}, ${height / 2})`);

  var tweetLabel = yLabelsGroup.append('text')
    .classed('aText', true)
    .classed('active', true)
    .attr('x', 0)
    .attr('y', 0 - 20)
    .attr('dy', '1em')
    .attr('transform', 'rotate(-90)')
    .attr('value', 'NumberOfCharacters')
    .text('Number of Characters');

  var hashtagLabel = yLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 0 - 40)
    .attr('dy', '1em')
    .attr('transform', 'rotate(-90)')
    .attr('value', 'NumberOfHashtags')
    .text('Number of Hashtags');

  //update the toolTip
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  //x axis event listener
  xLabelsGroup.selectAll('text')
    .on('click', function () {
      var value = d3.select(this).attr('value');

      if (value != chosenXAxis) {

        //replace chosen x with a value
        chosenXAxis = value;

        //update x for new data
        xLinearScale = xScale(tweetData, chosenXAxis);

        //update x 
        xAxis = renderXAxis(xLinearScale, xAxis);

        //upate circles with a new x value
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update text 
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update tooltip
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        //change of classes changes text
        if (chosenXAxis === 'NumberOfLikes') {
          likesLabel.classed('active', true).classed('inactive', false);
          retweetsLabel.classed('active', false).classed('inactive', true);
        }
        else {
          likesLabel.classed('active', false).classed('inactive', true);
          retweetsLabel.classed('active', true).classed('inactive', false);
        }
      }
    });
  //y axis lables event listener
  yLabelsGroup.selectAll('text')
    .on('click', function () {
      var value = d3.select(this).attr('value');

      if (value != chosenYAxis) {
        //replace chosenY with value  
        chosenYAxis = value;

        //update Y scale
        yLinearScale = yScale(tweetData, chosenYAxis);

        //update Y axis 
        yAxis = renderYAxis(yLinearScale, yAxis);

        //Udate CIRCLES with new y
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update TEXT with new Y values
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update tooltips
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        //Change of the classes changes text
        if (chosenYAxis === 'NumberOfCharacters') {
          tweetLabel.classed('active', true).classed('inactive', false);
          hashtagLabel.classed('active', false).classed('inactive', true);
        }
        else {
          tweetLabel.classed('active', false).classed('inactive', true);
          hashtagLabel.classed('active', true).classed('inactive', false);
        }
      }
    });
});