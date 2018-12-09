window.onload = init;

function init(){
    registerButtons();
}

function registerButtons(){
    document.getElementById('formOk').onclick = sendData;
    document.getElementById('formCancel').onclick = hideForm;

    document.querySelectorAll('*.showForm').forEach(element => {
        element.onclick = () => {
            showForm(element.value);
        }
    })
}

function sendData(){

}

function hideForm(){
    document.getElementById('formular').style.display = 'none';
}

function showForm(competitorId){
    console.log(competitorId);
    document.getElementById('formular').style.display = 'block';
}