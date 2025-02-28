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
    const hints = hintsbox.children;
    const indexSet = new Set();
    const chatForm = document.querySelector("#game-chat .chat-form");
    const inputBox = chatForm.querySelector("input");
    const submitBtn = document.createElement('button');
    const closeColor = hexToRGB(getComputedStyle(document.documentElement).getPropertyValue('--COLOR_CHAT_TEXT_CLOSE').trim());
    const spamColor = hexToRGB(getComputedStyle(document.documentElement).getPropertyValue('--COLOR_CHAT_TEXT_LEAVE').trim());
    const chat = document.querySelector("#game-chat .chat-content");
    const GUESS_INTERVAL = 925;
    chatForm.append(submitBtn);
    let interval;
    console.log("chat",chatForm);
    const startObserver = new MutationObserver(entries => {
        for(const entry of entries){
            if(entry.target.classList.contains("description") && entry.target.textContent=="GUESS THIS"){
                console.log("YEAH")
                const wordCount = hints[hints.length-1].textContent.split(" ");
                const totalLetters = wordCount.reduce((acc,curr) => acc+parseInt(curr),0);
                filteredList = llist[String(wordCount.length)][String(totalLetters)];
                if(wordCount.length>1){
                    filteredList = filteredList.filter((value) => {
                        for(let j=0; j<wordCount.length;j++){
                            
                            if(parseInt(wordCount[j])!==value.lens[j]){
                                return false
                            }
                        }
                        return true
                    })
                }
                for(let i=0;i<hints.length-1;i++){
                    if(hints[i].classList.contains("uncover")){
                        console.log("eugfeu")
                        filteredList = filterList(filteredList, hints[i], i);
                    }
                }
                console.log(filteredList);
                hintObserver.observe(hintsbox,{
                    attributes:true,
                    attributeFilter:["class"],
                    subtree:true
                })
                for(let i=0;i<hints.length-1;i++){
                    hints[i].id = i;
                }
                setTimeout(()=>{
                    interval = setInterval(()=>{
                        if(filteredList.length==0){
                            clearInterval(interval);
                        }
                        else{
                            idx = Math.floor((Math.random()*filteredList.length))
                            const guess = filteredList.splice(idx,1);
                            inputBox.value = guess[0].word;
                            submitBtn.click();
                        }
                    },GUESS_INTERVAL);
                },750);
            }

        }
    })

    const hintObserver = new MutationObserver(entries => {
        for(const entry of entries){
            idIdx = entry.target.id;
            if(!indexSet.has(idIdx)){
                indexSet.add(idIdx);
                filteredList = filterList(filteredList, entry.target, idIdx);
                console.log(filteredList);
            }
            if(indexSet.size === hints.length-1){
                indexSet.clear();
                hintObserver.disconnect();
                clearInterval(interval);
            }
            
        }
    })
    startObserver.observe(descbox,{
        subtree:true,
        childList:true
    })

    const chatObserver = new MutationObserver(entries => {
        for(const message of entries){
            const lastChat = message.target.lastElementChild;
            const messageColor = getComputedStyle(lastChat).color.trim();
            if(messageColor===closeColor){
                const closeString = lastChat.querySelector('b').textContent;
                console.log(closeString.substring(closeString.length-6,closeString.length),"close!");
                if(closeString.substring(closeString.length-6,closeString.length)==="close!"){
                    filteredList = filterClose(closeString,filteredList);
                    console.log(filteredList);
                }

            }
        }
    })
    chatObserver.observe(chat, {
        subtree:true,
        childList:true
    })
}
function filterList(currList,dom, idIdx){
    const letter = dom.textContent;
    currList = currList.filter(value => {
        return value.word[idIdx] === letter;
    })
    return currList;
}
function filterClose(closeString, currList){
    const closeGuess = closeString.substring(0,closeString.length-10);
    currList = currList.filter((entry)=>{
        return isClose(entry.word,closeGuess);
    })
    return currList;
}
function isClose(word1,word2){
    if(word1.length!==word2.length){
        return false;
    }
    let oneWrong = false;
    for(let i=0;i<word1.length;i++){
        if(word1[i].toLowerCase()!==word2[i].toLowerCase()){
            if(oneWrong){
                return false;
            }
            oneWrong=true;
        }
    }
    return true;
}
function hexToRGB(hex){
    hex = hex.replace(/^#/,"");
    if(hex.length==3){
        hex = hex.split('').map(val => val+val).join('');
    }
    const hexToDec = parseInt(hex,16);
    const r = (hexToDec>>16) & 255;
    const g = (hexToDec>>8) & 255;
    const b = (hexToDec) & 255;
    return `rgb(${r}, ${g}, ${b})`
}