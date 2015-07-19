
//Set list of words to the input
export class Appro {
    constructor(list, n){
        this.list = list;
        this.n = n;
        this.dict = NGramDict(this.list);
        console.log(this.dict);
    }

    fit(word){
        let result = [];
        let ngrams = splitWord(word, this.n);
        let used = {};
        for(let ng = 0;ng < ngrams.length;ng++){
                let words = this.dict.get(ngrams[ng]);
                words.forEach(word => {
                    if (result.indexOf(word) == -1){
                        result.push(word);
                    }
                });
        }
        return result;
    }
};


let NGramDict = function(listofwords, len=3){
    let map = new Map();
    listofwords.forEach(word => {
        for(let i = 0;i < word.length-len+1;++i){
            let item = word.substring(i, i+len);
            if(!map.has(item)){
                map.set(item, [word]);
            } else {
                let data = map.get(item);
                map.set(item,data.concat(word));
            }

        }
    });

    return map;
   }

//Levenshtein distance
let distance = function(s1, s2){
    let length1 = s1.length;
    let length2 = s2.length;
    let result = {};
    for(let i = 0;i < length1;++i){
        for(let j = 0;j < length2;++j){
            if(i == 0 && j == 0){
                result[[i,j]] = 0;
                continue;
            }

            if(i > 0 && j == 0){
                result[[i,j]] = i;
                continue;
            }

            if(j > 0 && i == 0){
                result[[i,j]] = j;
                continue;
            }
            let cost = 0;
            if(s1[i] != s2[j]){
                cost = 1;
            }
            result[[i,j]] = Math.min(result[[i,j-1]]+1, result[[i-1,j]]+1, result[[i-1,j-1]]+cost);

        }
    }
    return result[[length1, length2]];
}


let mapToSortedList = function(map){
    let newitems = [];
    for(let [key, value] of map.entries()){
        newitems.push([key, value]);
    }
    return newitems.sort((x,y) => {
       if(map.get(x[0]).length < map.get(y[0]).length){
           return 1
       }
       if(map.get(x[0]).length > map.get(y[0]).length){
           return -1;
       } else {
           return 0;
       }
    });

}


//Split word to the n grams
let splitWord = function(word, n){
    let result = [];
    for(let i = 0;i < word.length-n+1;++i){
        result.push(word.substring(i, i+n));
    }
    return result;
}

