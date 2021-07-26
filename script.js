var taskNo = 0;
function displayTask()
{
    var inputTask= document.getElementById("task");
    var taskTag = document.getElementById("display");
    taskTag.innerHTML=inputTask.value;

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
if (tButton.getAttribute("data-status")=="Start")
    {
    timerInst[timerId].pause();
    tButton.setAttribute("data-status","Stop");
    }
    else
    {timerInst[timerId].start();
    setInterval(function()
                {
                var timedisplay = document.getElementById(timerId);
                //var timedisplay = document.querySelector('[data-timerDisplayNo="timerId"]');
                
                timeValues = timerInst[timerId].getTimeValues();
                timedisplay.innerHTML = timeValues.hours+":"+timeValues.minutes+":"+timeValues.seconds;
                },1000);
    tButton.setAttribute("data-status","Start");
    }
}

}
