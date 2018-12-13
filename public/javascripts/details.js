window.onload = init;

const Pattern = {
    ID : /^-?[1-9][0-9]{0,7}$/,
    TITLE : /^\w{0,128}$/
};

function init(){
    registerButtons();
}

function registerButtons(){
    const competitorId = null;

    document.getElementById('formOk').onclick = sendData;
    document.getElementById('formCancel').onclick = hideForm;

    document.querySelectorAll('*.showForm').forEach(element => {
        element.onclick = () => {
            showForm(element.attributes.value.value);
        };
    });

    document.querySelectorAll('*.showSession').forEach(element => {
        element.onclick = () => {
            showSession(element.attributes.value.value);
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

function showSession(competitorId, sessionId){

}