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
xhttp.open("GET", "posts", true);
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


