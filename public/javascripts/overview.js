window.onload = init;

const Pattern = {
    ID : /^-?[1-9][0-9]{0,7}$/,
    NAME : /^\w{0,64}$/
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
        }
    });
    document.querySelectorAll('*.deleteCompetitor').forEach(element => {
        element.onclick = () => {
            deleteCompetitor(element.attributes.value.value);
        }
    });
}

function sendData(){
    var id = document.getElementById('input_id').attributes.value.value;
    var surename = document.getElementById('surename').attributes.value.value;
    var lastname = document.getElementById('lastname').attributes.value.value;

    if (Pattern.ID.test(id) && Pattern.NAME.test(surename) && Pattern.NAME.test(lastname)){
        document.getElementById('input_send').click();
    } else {
        document.getElementById('info').innerHTML = 'Name is not valid...';
    }
}

function hideForm(){
    document.getElementById('formular').style.display = 'none';
    document.getElementById('info').innerHTML = '';
}

function showForm(competitorId){
    var surename = document.getElementById('surename');
    var lastname = document.getElementById('lastname');
    document.getElementById('input_id').value = competitorId;
    if (competitorId < 0){
        surename.value = '';
        lastname.value = '';
    } else {
        surename.value = document.getElementById(`competitor_${competitorId}_surename`).innerHTML;
        lastname.value = document.getElementById(`competitor_${competitorId}_lastname`).innerHTML;
    }
    document.getElementById('formular').style.display = 'block';
}

function deleteCompetitor(competitorId){
    
}