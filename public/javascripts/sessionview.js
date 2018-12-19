window.onload = init;
var IDs = {
    competitorId : null,
    topicId : null
};

const Pattern = {
    ID : /^-?[1-9][0-9]{0,7}$/,
    CONTENT : /^\w{0,256}$/,
    BOOLEAN : /^[tfyn01]$/,
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
    IDs.competitorId = document.getElementById('competitor_id').attributes.value.value;
    IDs.topicId = document.getElementById('topic_id').attributes.value.value;
    const counterButton = document.getElementById('counterButton');
    const clockNode = document.getElementById('currentTime');
    const topicId = IDs.topicId;
    var counter = new Counter(counterButton, clockNode);

    counterButton.onclick = function(){
        counter.trigger();
    }

    //document.getElementById('sessionOk').onclick = TODO;
    document.getElementById('sessionOk').onclick = () => sendSession(counter, topicId);
    document.getElementById('sessionReset').onclick = counter.reset.bind(counter);

    document.getElementById('formOk').onclick = sendData;
    document.getElementById('formCancel').onclick = hideForm;  
    
    document.getElementById('formCritiqueOk').onclick = sendCritiqueData;
    document.getElementById('formCritiqueCancel').onclick = hideForm; 
    
    document.querySelectorAll('*.showForm').forEach(element => {
        element.onclick = () => {
            showForm(element.attributes.value.value);
        };
    });

    document.querySelectorAll('*.showCritiqueForm').forEach(element => {
        element.onclick = () => {
            showCritiqueForm(element.attributes.value.value, element.attributes.session.value);
        };
    });

    document.querySelectorAll('*.deleteCritique').forEach(element => {
        element.onclick = () => {
            deleteEntity('critique', element.attributes.value.value);
        }
    });

    document.querySelectorAll('*.deleteSession').forEach(element => {
        element.onclick = () => {
            deleteEntity('session', element.attributes.value.value);
        }
    });

    document.querySelectorAll('*.deleteQuestion').forEach(element => {
        element.onclick = () => {
            deleteEntity('question', element.attributes.value.value);
        }
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

    document.querySelectorAll("i[class^='fas fa-angle']").forEach(element => {
        console.log(element);
        element.onclick = function(){
            modifyQuestionCount(element.attributes.question.value , element.attributes.value.value);
        }
    });
}

function sendData(){
    var id = document.getElementById('input_id').attributes.value.value;
    var content = document.getElementById('question').attributes.value.value;
    var answerRating = document.getElementById('answerrating').attributes.value.value;
    var topicId = document.getElementById('topic_id').attributes.value.value;

    if (Pattern.ID.test(id) && Pattern.ID.test(topicId) && Pattern.CONTENT.test(content) && Pattern.RATING.test(answerRating)){
        document.getElementById('input_send').click();
    } else {
        document.getElementById('info').innerHTML = 'Something is wrong...';
    }
}

function sendCritiqueData(){
    var id = document.getElementById('critique_id').attributes.value.value;
    var content = document.getElementById('critique_content').attributes.value.value;
    var positive = document.getElementById('critique_positive').value;
    var sessionId = document.getElementById('critique_session_id').attributes.value.value;
    var topicId = document.getElementById('critique_topic_id').attributes.value.value;
    var competitorId = document.getElementById('critique_competitor_id').attributes.value.value;

    if (Pattern.ID.test(id) && Pattern.ID.test(sessionId) && Pattern.ID.test(competitorId) && Pattern.ID.test(topicId)  && Pattern.CONTENT.test(content) && Pattern.BOOLEAN.test(positive)){
        document.getElementById('critique_send').click();
    } else {
        document.getElementById('critiqueInfo').innerHTML = 'Something is wrong...';
    }
}

function hideForm(){
    document.getElementById('formular').style.display = 'none';
    document.getElementById('formularCritique').style.display = 'none';
    document.getElementById('info').innerHTML = '';
    document.getElementById('critiqueInfo').innerHTML = '';
}

function showForm(questionId){
    var content = document.getElementById('question');
    var answerRating = document.getElementById('answerrating');
    document.getElementById('input_id').value = questionId;
    if (questionId == -1) {
        content.value = '';
        answerRating.value = 0;
    } else {
        content.value = document.getElementById(`question_${questionId}_content`).innerHTML;
        answerRating.value = document.getElementById(`question_${questionId}_answerRating`).innerHTML;
    }
    document.getElementById('formular').style.display = 'block';
    document.getElementById('formularCritique').style.display = 'none';
}

function showCritiqueForm(critiqueId, sessionId){
    var content = document.getElementById('critique_content');
    var positive = document.getElementById('critique_positive');
    document.getElementById('critique_id').value = critiqueId;
    document.getElementById('critique_session_id').value = sessionId;
    if (critiqueId == -1) {
        content.value = '';
        positive.value = 't';
    } else {
        content.value = document.getElementById(`critique_${critiqueId}_content`).innerHTML;
        positive.value = document.getElementById(`critique_${critiqueId}_positive`).attributes.value.value;
    }
    document.getElementById('formular').style.display = 'none';
    document.getElementById('formularCritique').style.display = 'block';
}

function refreshPage(){
    window.location.href = `${window.location.href.split('?')[0]}?competitorid=${IDs.competitorId}&topicid=${IDs.topicId}`;
}

/**
 * 
 * @param {*} targetId ID of the dataset to be deleted.
 * @param {*} targetType Type can be "question" or "critique".
 */
function deleteEntity(targetType, targetId){
    var request = new XMLHttpRequest();
    request.open('DELETE', `/details/session?type=${targetType}&id=${targetId}`, false);
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

function sendSession(counter, topicId){
    var time = counter.getTime();
    var request = new XMLHttpRequest();
    request.open('PUT' ,`/details/session?sessiondate=${time.date}&elapsedtime=${time.elapsedMillis}&topicid=${topicId}`, false);
    request.onload = refreshPage;
    request.send(null);
}