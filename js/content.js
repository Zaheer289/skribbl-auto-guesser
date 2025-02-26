console.log("This is just the beginning!");
const wordBankURL = "https://wlay.me/Skribblio-Word-Bank/words_en_v1.0.0.json";
let wordList;
fetch(wordBankURL).then(data => {
    return data.json();
}).then(llist=>{
    wordList = llist;
})
const hintsbox = document.querySelector(".hints .container");
const descbox = document.querySelector("#game-word");
const hints = hintsbox.children
const startObserver = new MutationObserver(entries => {
    for(const entry of entries){
        if(entry.target.classList.contains("description") && entry.target.textContent=="GUESS THIS"){
            console.log(entry);
            hintObserver.observe(hintsbox,{
                attributes:true,
                attributeFilter:["class"],
                subtree:true
            })
        }
        for(let i=0;i<hints.length-1;i++){
            hints[i].id = i;
        }
    }
})
const indexSet = new Set()
const hintObserver = new MutationObserver(entries => {
    for(const entry of entries){
        if(!indexSet.has(entry.target.id)){
            console.log(entry.target.id);
            indexSet.add(entry.target.id);
        }
        if(indexSet.size == hints.length-1){
            indexSet.clear();
            hintObserver.disconnect()
        }
        
    }
})
startObserver.observe(descbox,{
    subtree:true,
    childList:true
})