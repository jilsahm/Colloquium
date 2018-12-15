window.onload = init;

const Pattern = {
    ID : /^-?[1-9][0-9]{0,7}$/,
    CONTENT : /^\w{0,256}$/,
    RATING : /^([0-9]|10)$/
};

function init(){
    registerButtons();
}

function registerButtons(){
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

/**
 * 
 * @param {*} competitorId 
 * @param {*} topicId 
 * @param {*} targetId ID of the dataset to be deleted.
 * @param {*} targetType Type can be "question" or "critique".
 */
function deleteEntity(competitorId, topicId, targetId, targetType){
    var request = new XMLHttpRequest();
    request.open('DELETE', `./details/session?${targetType}Id=${targetId}`, false);
    request.onload = () => {
        window.open(`./details/session?competitorid=${competitorId}&topicid=${topicId}`, '_self');
    }
    request.send(null);
}