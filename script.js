var taskNo = 0;
function displayTask()
{
    var inputTask= document.getElementById("task");
    var taskTag = document.getElementById("display");
    taskTag.innerHTML=inputTask.value;

}

function sendpost(act,hours,mins,secs)
{
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("activity="+act+"&hours="+hours+"&minutes="+mins+"&seconds="+secs);
} 



function enterTask()

{
    var inputTask= document.getElementById("task").value;
    var tList = document.getElementById("taskList");
    var li = document.createElement("li");
    li.innerHTML=inputTask;
//    var content = document.createTextNode(inputTask);
//    li.appendChild(content);
    

   timerInst[taskNo+1]=new easytimer.Timer();
   taskNo ++;
   
   var timerButton = document.createElement("button");
    timerButton.innerHTML="Start/Stop";
    timerButton.setAttribute("onclick","Timer(this);");
    timerButton.setAttribute("data-no",taskNo);
    timerButton.setAttribute("data-status","Stop");
    li.appendChild(timerButton);

    var counter = document.createElement("span");
    counter.id = taskNo;
    li.appendChild(counter);
     
    var close = document.createElement("button");
    close.innerHTML="X";
    close.setAttribute("onclick","deleteLi(this);");
    li.appendChild(close);
    
    tList.appendChild(li);

}

function deleteLi(task)
{
    task.parentElement.style.display = 'none';
     
}

function Timer(tButton)
{var timerId = tButton.getAttribute("data-no");
var timedisplay = document.getElementById(timerId);
timeValues = timerInst[timerId].getTimeValues();
var actname = tButton.parentElement.childNodes[0].textContent;
var hours = timeValues.hours;
var mins = timeValues.minutes;
var secs = timeValues.seconds;                
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

