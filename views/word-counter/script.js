const textaria = document.querySelector('#text-aria')
const select = document.getElementById('select')
const arrowLeft = document.getElementById('arrow-left')
const arrowRight = document.getElementById('arrow-right')
const clear = document.getElementById('clear')
let characters
let words

function clearTextAria(){
    clear.addEventListener('click', function () {
        document.getElementById('text-aria').value = ''
        document.getElementById('text-aria').focus();
    });
}
clearTextAria()

function charCounter(){
    textaria.addEventListener('keyup', ()=>{
        characters = textaria.value.length
        document.getElementById('characters-count').innerHTML = `<b>` + characters + ` Characters</b>`
    })
}
charCounter()

function wordsCounter(){
    textaria.addEventListener('keyup', ()=>{

        if(textaria.value.length != 0){
            if ((textaria.value.match(/\S+/g)) != null) {
                words = textaria.value.match(/\S+/g).length;
            }
        }else if(textaria.value.length == 0){
            words = 0
        }

        document.getElementById('word-count').innerHTML = `<b>` + words + ` Words</b>`
        console.log(words)
    })

}
wordsCounter()

function caseStyle(){
    if(document.getElementById('select').value == "uppercase"){
        textaria.style.textTransform="uppercase"
    }
    else if(document.getElementById('select').value == "lowercase"){
        textaria.style.textTransform="lowercase"
    }
    else if(document.getElementById('select').value == "capitalize"){
        textaria.style.textTransform="capitalize"
    }
}