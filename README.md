# appro
Fuzzy-search string
Supported methods:
* N-gram search
* Distance based search

### Install
```npm install appro```

### Usage
```javascript
var items = new appro.Appro(["match", "day", "football", "example", "allofthis", "loveis", "she", "her",
"what", "come", "because", "after", "back", "now", "low"]);
console.log(items.ngrams("came"));
console.log(items.fuzzy("came",1));
```

### Licence
MIT

