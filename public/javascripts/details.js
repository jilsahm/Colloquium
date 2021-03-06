window.onload = init;

const Pattern = {
    ID : /^-?[1-9][0-9]{0,7}$/,
    TITLE : /^\w{0,128}$/
};

function init(){
    registerButtons();    
}

function registerButtons(){
    const competitorId = new URL(window.location.href).searchParams.get('competitorid');

    document.getElementById('formOk').onclick = sendData;
    document.getElementById('formCancel').onclick = hideForm;

    document.querySelectorAll('*.showForm').forEach(element => {
        element.onclick = () => {
            showForm(element.attributes.value.value);
        };
    });

    document.querySelectorAll('*.showSessions').forEach(element => {
        element.onclick = () => {
            showSessions(competitorId, element.attributes.value.value);
        };
    });

    document.querySelectorAll('*.deleteTopic').forEach(element => {
        element.onclick = () => {
            deleteTopic(element.attributes.value.value);
        };
    });
}

function sendData(){
    var topicId = document.getElementById('input_id').attributes.value.value;
    var title = document.getElementById('title').attributes.value.value;
    var competitorId = document.getElementById('competitor_id').attributes.value.value;

    if (Pattern.ID.test(topicId) && Pattern.TITLE.test(title) && Pattern.ID.test(competitorId)){
        document.getElementById('input_send').click();
    } else {
        document.getElementById('info').innerHTML = 'Title is not valid...';
    }
}

function hideForm(){
    document.getElementById('formular').style.display = 'none';
    document.getElementById('info').innerHTML = '';
}

function showForm(topicId){
    var title = document.getElementById('title');
    document.getElementById('input_id').value = topicId;
    if (topicId < 0){
        title.value = '';
    } else {
        title.value = document.getElementById(`topic_${topicId}_title`).innerHTML;
    }
    document.getElementById('formular').style.display = 'block';
}

function showSessions(competitorId, topicId){
    if (Pattern.ID.test(competitorId) && Pattern.ID.test(topicId) && competitorId > 0 && topicId > 0){
        window.open(`/details/session?competitorid=${competitorId}&topicid=${topicId}`, '_self');
    }
}

function deleteTopic(topicId){
    if (Pattern.ID.test(topicId)){
        var request = new XMLHttpRequest();
        request.open('DELETE', `/details?topicid=${topicId}`, false);
        request.onload = refreshPage;
        request.send(null);       
    }    
}

function refreshPage(){
    const competitorId = document.getElementById('competitor_id').value;
    window.location.href = `${window.location.href.split('?')[0]}?competitorid=${competitorId}`;
}