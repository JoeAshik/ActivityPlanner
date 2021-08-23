var taskNo = 0;
function displayTask()
{
    let inputTask= document.getElementById("task");
    let taskTag = document.getElementById("display");
    taskTag.innerHTML=inputTask.value;

}

function sendpost(act,hours,mins,secs)
{
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("activity="+act+"&hours="+hours+"&minutes="+mins+"&seconds="+secs);
} 

function receivepost()
{
let result;
let xhttp = new XMLHttpRequest();
xhttp.onload = function(){
    result = JSON.parse(xhttp.responseText) //result is a JSON stringified object in format {data:[{entry1},{entry2},...]}
    let len = result.data.length;
    for(i=0;i<len;i++)
    {
    getTask(result.data[i]);
    }
}
xhttp.open("GET", "todayposts", true);
xhttp.send();
}

function deleteLi(task)
{
    task.parentElement.style.display = 'none';
     
}

function Timer(tButton)
{let timerId = tButton.getAttribute("data-no");
let timedisplay = document.getElementById(timerId);
let timeValues = timerInst[timerId].getTimeValues();
let actname = tButton.parentElement.parentElement.childNodes[0].textContent;
let hours = timeValues.hours;
let mins = timeValues.minutes;
let secs = timeValues.seconds;                
if (tButton.getAttribute("data-status")=="Start")
    {
    timerInst[timerId].pause();
    sendpost(actname,hours,mins,secs);
    tButton.setAttribute("data-status","Stop");
    }
    else
    {timerInst[timerId].start();
    setInterval(function()
                {
                timedisplay.innerHTML = timeValues.hours+":"+timeValues.minutes+":"+timeValues.seconds;
                },1000);
    tButton.setAttribute("data-status","Start");
    }
}

function dupcheck(entered)
{
    acts = document.querySelectorAll("td[info]")
    for(i=0;i<acts.length;i++)
    {
        if (acts[i].textContent == entered)
        return true; 
    }
}

function initialDisplay(createdTimer,idno)
{
    let initialValues = createdTimer.getTimeValues();
    let display = document.getElementById(idno);
    display.innerHTML=initialValues.hours+":"+initialValues.minutes+":"+initialValues.seconds;
}

function addtoselect(act)
{
    let select = document.getElementById("pastacts");
    let newentry = document.createElement("option");
    newentry.setAttribute("value",act);
    newentry.innerHTML = act;
    select.appendChild(newentry);
}

function addOld()
{
    document.getElementById("task").value= document.getElementById("pastacts").value;
}

function addRow(activity)
{
    addtoselect(activity);
    

    tTable = document.getElementById("taskTable");
    
    
    row = document.createElement("tr");
    cell1 = document.createElement("td");
    cell1.setAttribute("info","Activity");
    cell1.innerHTML = activity;
    row.appendChild(cell1)

    cell2 = document.createElement("td");
    let timerButton = document.createElement("button");
    timerButton.innerHTML="Start/Stop";
    timerButton.setAttribute("onclick","Timer(this);");
    timerButton.setAttribute("data-no",taskNo);
    timerButton.setAttribute("data-status","Stop");
    cell2.appendChild(timerButton);
    row.appendChild(cell2);

    cell3 = document.createElement("td");
    let counter = document.createElement("span");
    counter.id = taskNo;
    cell3.appendChild(counter);
    row.appendChild(cell3);

    cell4 = document.createElement("td");
    let close = document.createElement("button");
    close.innerHTML="X";
    close.setAttribute("onclick","deleteLi(this);");
    cell4.appendChild(close);
    row.appendChild(cell4);
    tTable.appendChild(row);
    initialDisplay(timerInst[taskNo],taskNo);
}


function submitTask()
{
    let inputTask= document.getElementById("task").value;
    
    if (inputTask=="")
    {
        alert("Empty activity name");
        return;
    }

    if (dupcheck(inputTask))
    {
        alert("Duplicate activity");
        return;
    }
   

    taskNo++;
    timerInst[taskNo]=new easytimer.Timer();
    addRow(inputTask);


}

function getTask(result)
{
    let savedTask = result.activity;
    taskNo ++;
    timerInst[taskNo]=new easytimer.Timer({startValues:[0,result.seconds,result.minutes,result.hours,0]});
    addRow(savedTask);
}

function createChart(activities,totalTimes)
{
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: activities,
        datasets: [{
            label: '# of Votes',
            data: totalTimes,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Pie Chart'
      }
    }
  },
});
}

function calcTotalTime(result)
{
    
    let totTime = result.seconds + (result.minutes*60) + (result.hours*60*60);
    return totTime;
    
}

function showChart(variation="todayposts")
{
let checkBox = document.getElementById("myCheck");
checkBox.checked = false;
let result;
let acts = [];
let totTimes= [];
let xhttp = new XMLHttpRequest();
xhttp.onload = function(){
    result = JSON.parse(xhttp.responseText) //result is a JSON stringified object in format {data:[{entry1},{entry2},...]}
    let len = result.data.length;
    for(i=0;i<len;i++)
    {
    if(acts.includes(result.data[i].activity))
    {   
        let position = acts.indexOf(result.data[i].activity);
        totTimes[position] += calcTotalTime(result.data[i]);
    }    
    else
    {
        acts.push(result.data[i].activity);
        totTimes.push(calcTotalTime(result.data[i]));
    }
    }
    createChart(acts,totTimes);

}
xhttp.open("GET", variation, true);
xhttp.send();
}

function changeChart()
{
document.addEventListener('input', function (event) {

	// Only run for #wchartDuration select
	if (event.target.id !== 'chartDuration') return;

    let display = document.getElementById("chartDisplay");
    
	if (event.target.value === 'today') {

        delChart();
		showChart("todayposts");
	}

	if (event.target.value === 'alltime') {
		delChart();
        showChart("allposts");
	}


}, false);
}

changeChart();


function addData(label, data) {
    let theChart = Chart.instances[findChart()];
    theChart.data.labels.push(label);
    theChart.data.datasets[0].data.push(data);
    theChart.update();
}

function delData() {
    let theChart = Chart.instances[findChart()];
    theChart.data.labels.pop();
    theChart.data.datasets[0].data.pop();
    theChart.update();
}



function toggleRem()
{
    let checkBox = document.getElementById("myCheck");
    let select = document.getElementById("chartDuration").value;
    if (checkBox.checked == true){
        addRem(select)                                               
    } 
    else {
        delData();
    }
}




function addRem(duration="today")
{   

    let rem;
    let doneActs = sumOfArray(Chart.instances[findChart()].data.datasets[0].data);
    if(duration=="today")
    {
        let todayTotal = 24*60*60
        rem = todayTotal - doneActs;
        addData("Remaining",rem);
    }    
                                           
    else if(duration=="alltime")
    {
        allTimeRem(doneActs).then(
            function(value) {addData("Remaining",value);},
            function(error) {console.log("Error");}
          );
       
    }
    
     else
    {}
}


function sumOfArray(arr)
{
    let sum = 0;
    for(i=0;i<arr.length;i++)
    sum += arr[i]
    return sum;
}

function isEmpty(obj) 
{ 
    for (var x in obj) 
    { return false; }
    return true;
 }

 function delChart()
 {
    if(!isEmpty(Chart.instances))
    {
        Chart.instances[findChart()].destroy();
    }
 }

 function findChart()
 {
     for (let inst in Chart.instances)
     {
         return parseInt(inst);
     }
 }

async function allTimeRem(completedActs)
{
let myPromise = new Promise(function(resolve,reject){
let result;
let xhttp = new XMLHttpRequest();
xhttp.open("GET", "daysNo", true);
xhttp.send();

xhttp.onload = function(){
    result = JSON.parse(xhttp.responseText) //result is a JSON stringified object in format {data:[{entry1},{entry2},...]}
    let total = 24*60*60*(result.data[0].noOfDays);
    rem = total-completedActs;
    resolve(rem);
}
});
let remain = await myPromise;
return remain;
}

/* Obselete, could be used for refactoring

function recDaysNoCB(days,compActs)
{
    let total = 24*60*60*days;
    rem = total-compActs;
    return rem;
}
*/


