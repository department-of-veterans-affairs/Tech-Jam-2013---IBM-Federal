
/* JavaScript content from js/demo.js in folder common */
if(!!(window.addEventListener)) window.addEventListener('DOMContentLoaded', main);
else window.attachEvent('onload', main);

function main() {
    lineChart();
    pieChart();
}

function lineChart() {
    var data = {
        labels : ["January","February","March","April","May","June","July"],
        datasets : [
            {
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : [132,140,135,152,160,155,163],
            title : 'Systolic'
        },
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data : [81,83,80,85,92,94,95],
            title : 'Diastolic'
        }
        ]
    };

    var ctx = document.getElementById("lineChart").getContext("2d");
    new Chart(ctx).Line(data);

    legend(document.getElementById("lineLegend"), data);
}

function pieChart() {
    var data = [
        {
            value: 30,
            color:"#FF0000",
            title: 'High BP Stage 2'
        },
        {
            value : 50,
            color : "#F38630",
            title: 'High BP Stage 1'
        },
        {
            value : 100,
            color : "#00FF00",
            title: 'Normal'
        }
    ];

    var ctx = document.getElementById("pieChart").getContext("2d");
    new Chart(ctx).Pie(data);

    legend(document.getElementById("pieLegend"), data);
}
