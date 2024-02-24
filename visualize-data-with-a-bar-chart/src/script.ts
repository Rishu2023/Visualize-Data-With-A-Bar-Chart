import * as d3 from "https://cdn.skypack.dev/d3@7.6.1";

fetch(
	"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
	.then((res) => res.json())
	.then((data) => formatGraph(data));

function handleMouseOver(event) {
	const tooltip = document.getElementById("tooltip");
	if (event.target.dataset.gdp) {
		tooltip.style.visibility = "visible";
		tooltip.innerHTML = `<p>DATE: ${event.target.dataset.date}</p>
                         <p>GDP: ${event.target.dataset.gdp}</p>`;
		tooltip.setAttribute("data-date", event.target.dataset.date);
	}
}

function handleMouseOut() {
	document.getElementById("tooltip").style.visibility = "hidden";
}

function formatGraph(data) {
	const svgHeight = 500;
	const svgWidth = 1500;
	const padding = 50;
	const minX = new Date(data.data[0][0]);
	const maxX = new Date(data.data[data.data.length - 1][0]);
	const maxY = d3.max(data.data.map((d) => d[1]));
	const xScale = d3
		.scaleTime()
		.domain([minX, maxX])
		.range([padding, svgWidth - padding]);
	const yScale = d3
		.scaleLinear()
		.domain([0, maxY])
		.range([svgHeight - padding, padding]);

	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);

	const svg = d3
		.select("#container")
		.append("svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight);

	svg
		.selectAll("rect")
		.data(data.data)
		.enter()
		.append("rect")
		.attr("x", (d, i) => xScale(new Date(d[0])))
		.attr("y", (d) => yScale(d[1]))
		.attr("height", (d) => svgHeight - padding - yScale(d[1]))
		.attr("width", 5)
		.attr("class", "bar")
		.attr("data-date", (d) => d[0])
		.attr("data-gdp", (d) => d[1])
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut);

	svg
		.append("g")
		.attr("transform", `translate(0, ${svgHeight - padding})`)
		.attr("id", "x-axis")
		.call(xAxis);

	svg
		.append("g")
		.attr("transform", `translate(${padding}, 0)`)
		.attr("id", "y-axis")
		.call(yAxis);

	const tooltip = d3
		.select("#container")
		.append("div")
		.attr("id", "tooltip") // Add id for easier selection
		.style("position", "absolute")
		.style("visibility", "hidden")
		.style("height", "85px")
		.style("width", "300px")
		.style("border-radius", "20px")
		.style("background", "#ffd700")
		.style("color", "#003366")
		.style("font-weight", "bold")
		.style("text-align", "center")
		.style("box-shadow", "0 0 10px rgba(0, 0, 0, 0.3)"); // Add shadow for better visibility
}
