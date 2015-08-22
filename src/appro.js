import U, {range, each, filter, reduce} from 'underscore';
import fs from 'fs';

//Set list of words to the input
export class Appro {
    constructor(list=[], text=''){
        this.list = list;
        if(text != '') {
            this.list = this.list.concat(textToList(text));
        }
    }

    //loadfromFile provides loading and preprocessing text to list of words
    loadFromFile(path) {
        var data = fs.readFileSync(path, 'utf-8');
        this.list = this.list.concat(textToList(data));
    }

    //Approximate search with ngrams
    ngrams(word, n=3){
        let result = [];
        let ngrams = splitWord(word, n);
        this.dict = NGramDict(this.list, n);
        let used = {};
        each(range(ngrams.length), ng => {
           let words = this.dict.get(ngrams[ng]);
           each(words, word => {
               if (result.indexOf(word) == -1){
                   result.push(word);
               }
           });
        });
        return result;
    }

    //Simple fuzzy search
    fuzzy(word, mis=1, dist='lev'){
        let distfunc = distance;
        if(dist === 'dlev') {
            distfunc = Damerau_Levenshtein;
        }
        return filter(this.list, x => {
            if(distfunc(word, x) <= mis){
                return 1;
            } else {
                return 0;
            }
        });
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
            if(i == 0 && j === 0){
                result[[i,j]] = 0;
                continue;
            }

            if(i > 0 && j === 0){
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
    return result[[length1-1, length2-1]];
}

let Damerau_Levenshtein = function(s1, s2) {
    let length1 = s1.length;
    let length2 = s2.length;
    let result = {};
    for(let i = 0;i < length1;++i) {
        result[[i,0]] = i;
    }
    for(let j = 0;j < length2;++j) {
        result[[0, j]] = j;
    }

    for(let i = 1;i < length1;++i) {
        for(let j = 1;j < length2;j++) {
            let cost_subs = 0;
            if(s1[i] != s2[j]){
                cost_subs = 1;
            }
            let cost_trans = 999999999;
            if(s1[i] === s2[j-1] && s1[i-1] === s2[j]) {
                cost_trans = 1;
            }
            result[[i,j]] = Math.min(result[[i,j-1]]+1, result[[i-1,j]]+1, result[[i-1,j-1]]+cost_subs);
            if(i > 1 && j > 1) {
                result[[i,j]] = Math.min(result[[i,j]], result[[i-2,j-2]]+cost_trans);
            }
        }
    }
    return result[[length1-1, length2-1]];
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

//Before start, check text param to convert text to list
let textToList = function(text) {
    text = text.replace(/\.|,|(|,|)|/g, "");
    return text.split(' ')
}

