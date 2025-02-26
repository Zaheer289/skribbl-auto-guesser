console.log("This is just the beginning!");
const wordBankURL = "https://wlay.me/Skribblio-Word-Bank/words_en_v1.0.0.json";
fetch(wordBankURL).then(data => {
    return data.json();
}).then(llist=>{
    gameLoop(llist);
})
function gameLoop(llist){
    let filteredList;
    const hintsbox = document.querySelector(".hints .container");
    const descbox = document.querySelector("#game-word");
    const hints = hintsbox.children
    const indexSet = new Set()
    const startObserver = new MutationObserver(entries => {
        for(const entry of entries){
            if(entry.target.classList.contains("description") && entry.target.textContent=="GUESS THIS"){

                const wordCount = hints[hints.length-1].textContent.split(" ");
                const totalLetters = wordCount.reduce((acc,curr) => acc+parseInt(curr),0);
                filteredList = llist[String(wordCount.length)][String(totalLetters)];
                console.log(filteredList);
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

    const hintObserver = new MutationObserver(entries => {
        for(const entry of entries){
            idIdx = entry.target.id
            if(!indexSet.has(idIdx)){
                indexSet.add(idIdx);
                const letter = entry.target.textContent;
                filteredList = filteredList.filter(value => {
                    return value.word[idIdx] === letter;
                })
                console.log(filteredList);
            }
            if(indexSet.size === hints.length-1){
                indexSet.clear();
                hintObserver.disconnect()
            }
            
        }
    })
    startObserver.observe(descbox,{
        subtree:true,
        childList:true
    })
}