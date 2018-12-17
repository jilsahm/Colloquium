window.onload = init;

const Pattern = {
    ID : /^-?[1-9][0-9]{0,7}$/,
    CONTENT : /^\w{0,256}$/,
    RATING : /^([0-9]|10)$/
};

class Clock{
    constructor(){
        this.seconds = 0;
        this.minutes = 0;
        this.elapsedMillis = 0;
    }
    nextMinute(){
        this.minutes++;
        this.seconds -= 60;
    }
    hasOverflow(){
        return this.seconds >= 60.0;
    }
    reset(){
        this.seconds = 0;
        this.minutes = 0;
        this.elapsedMillis = 0;
    }
    toString(){
        let secondPrefix = (this.seconds < 10) ? '0' : '';
        let minutePrefix = (this.minutes < 10) ? '0' : '';
        let roundedSeconds = parseFloat(this.seconds).toFixed(1);
        return `${minutePrefix}${this.minutes}:${secondPrefix}${roundedSeconds}`;
    }
}

class Counter{
    constructor(button, clockNode){
        this.button = button;
        this.clockNode = clockNode;
        this.time = null;
        this.clock = new Clock();
        this.running = false;
        this.runner = null;
        this.today = null;
    }
    start(){
        this.today = new Date();
        if (!this.time){
            this.time = performance.now();
        } 
        if (!this.running){
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }       
        this.button.classList.remove('fa-play');
        this.button.classList.add('fa-pause');
    }
    stop(){
        this.running = false;
        this.time = null;
        this.button.classList.add('fa-play');
        this.button.classList.remove('fa-pause');
    }
    restart() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
        this.reset();
    }
    reset(){
        this.clock.reset();
        this.clockNode.innerHTML = "00:00.0";
    }
    trigger(){
        if (this.running){
            this.stop();
        } else {
            this.start();
        }
    }
    step(timestamp){
        if (!this.running){
            return;
        } 
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }
    calculate(timestamp){
        var difference = timestamp - this.time;
        this.clock.seconds += difference / 1000; 
        this.clock.elapsedMillis += difference;       
    }
    print(){
        if (this.clock.hasOverflow()){
            this.clock.nextMinute();
        }
        this.clockNode.innerHTML = this.clock.toString();
    }
    getTime(){       
        return {
            date : this.today.toISOString(),
            elapsedMillis : this.clock.elapsedMillis
        }
    }
}

function init(){
    registerButtons();
}

function registerButtons(){
    const counterButton = document.getElementById('counterButton');
    const clockNode = document.getElementById('currentTime');
    var counter = new Counter(counterButton, clockNode);

    counterButton.onclick = function(){
        counter.trigger();
    }

    //document.getElementById('sessionOk').onclick = TODO;
    document.getElementById('sessionOk').onclick = () => sendSession(counter);
    document.getElementById('sessionReset').onclick = counter.reset.bind(counter);

    document.getElementById('formOk').onclick = sendData;
    document.getElementById('formCancel').onclick = hideForm;    
    
    document.querySelectorAll('*.showForm').forEach(element => {
        element.onclick = () => {
            showForm(element.attributes.value.value);
        };
    });

    document.querySelectorAll('tr:not(:first-child)').forEach(element => {
        element.onclick = () => {
            element.classList.add('selected');
            document.querySelectorAll('tr:not(:first-child)').forEach(node => {
                if (element !== node){
                    node.classList.remove('selected');
                }
            });
            document.querySelectorAll('*.showDetails').forEach(node => {
                node.value = element.attributes.value.value;
            });
        };
    });

    document.querySelectorAll('i[class^=fa-angle]').forEach(element => {
        element.onclick = function(){
            // TODO
            modifyQuestionCount(/* TODO */ element.attributes.value.value);
        }
    });
}

function sendData(){
    //TODO
    var id = document.getElementById('input_id').attributes.value.value;
    var content = document.getElementById('question').attributes.value.value;
    var answerRating = document.getElementById('answerrating').attributes.value.value;
    var topicId = document.getElementById('topic_id').attributes.value.value;

    console.log(id, content, answerRating, topicId);

    if (Pattern.ID.test(id) && Pattern.ID.test(topicId) && Pattern.CONTENT.test(content) && Pattern.RATING.test(answerRating)){
        document.getElementById('input_send').click();
    } else {
        document.getElementById('info').innerHTML = 'Something is wrong....';
    }
}

function hideForm(){
    document.getElementById('formular').style.display = 'none';
    document.getElementById('info').innerHTML = '';
}

function showForm(questionId){
    var content = document.getElementById('question');
    var answerRating = document.getElementById('answerrating');
    document.getElementById('input_id').value = questionId;
    if (questionId < 0){
        content.value = '';
        answerRating.value = 0;
    } else {
        content.value = document.getElementById(`question_${questionId}_content`).innerHTML;
        answerRating.value = document.getElementById(`question_${questionId}_answerRating`).innerHTML;
    }
    document.getElementById('formular').style.display = 'block';
}

function refreshPage(){
    window.location.href = window.location.href;
}

/**
 * 
 * @param {*} targetId ID of the dataset to be deleted.
 * @param {*} targetType Type can be "question" or "critique".
 */
function deleteEntity(targetId, targetType){
    var request = new XMLHttpRequest();
    request.open('DELETE', `./details/session?${targetType}Id=${targetId}`, false);
    request.onload = refreshPage;
    request.send(null);
}

//TODO
function modifyQuestionCount(questionId, questionMod){
    var request = new XMLHttpRequest();
    request.open('PUT' ,`/details/session?questionid=${questionId}&mod=${questionMod}`, false);
    request.onload = refreshPage;
    request.send(null);
}

function sendSession(counter){
    var time = counter.getTime();
    console.log("Sending", time.date,time.elapsedMillis);
    var request = new XMLHttpRequest();
    request.open('PUT' ,`/details/session?sessiondate=${time.date}&elapsedtime=${time.elapsedMillis}`, false);
    request.onload = refreshPage;
    request.send(null);
}