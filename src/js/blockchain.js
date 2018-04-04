/*

GOALS:
- debug.. console going nuts over require.js
- use this "blockchain" as data instead of data/data.json
- accept submissions from html and add them to the chain (update data)

*/


const SHA256 = require("crypto-js/sha256.js");

// class for each individual block on the chain
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    // calculates the hash by putting all identifying information into SHA256
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

// class for the blockchain as a whole
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    // creates genesis block (index 0)
    createGenesisBlock(){
        var genesisBlockData = {
            "starName": "Sol",
            "id": 101,
            "mass": 1.9891e+30,
            "diameter": 1392000,
            "galX": 0,
            "galY": 0,
            "galZ": 0,
            "dist": 0,
            "starType": "G2(V)",
            "temp": 5760,
            "color": 16774636
        };  // this star happens to be our sun
        // return the block
        return new Block(0, Date.now().toLocaleString(), genesisBlockData, "0");
    }

    // gets last block on the chain (currentIndex - 1)
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // adds new block to the chain
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    // checks to see if the chain is valid by checking the hashes
    isChainValid() {
        // loops through all blocks in chain 
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            // return false if this block's hash is not as it should be
            if (currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            // return false if this block's previousHash does not point to the last block
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        // chain is valid
        return true;
    }
}

// create new instance of Blockchain called starChain
let starChain = new Blockchain();
console.log(starChain.isChainValid());
// console.log(JSON.stringify(starChain, null, 4));

var initHttpServer = () => {
    var app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => res.send(JSON.stringify(blockchain)));
    app.post('/addBlock', (req, res) => {
        var newBlock = addBlock(req.body.data)
    })
}



// ============== The code below should not be needed after ========
// ==============       my data has been cleaned up         ========


    // once a value has been added to the chain, it does not need to be added again,
    // start incrementer at the index it last left off on
// var i = starChain.length - 1;
//     // variables for tracking amount of useful/useless data
// var usefulStars = 0;
// var uselessStars = 0;
// var blockIndex = 1;
//     // this function creates a new block for every JSON entry that has enough useful data
// function initChain(){
//     // loop from incrementer value to the last entry in the JSON
//     while( i < data.length - 1 ){
//         // see if data is useful
//         if( isDataUseful(data[i]) ){
//             // if so, add it to our blockchain and increment usefulStars and blockIndex
//             starChain.addBlock(newBlock(blockIndex, Date.now(), data[i])); // here, the data[i] needs to be the json object
//             usefulStars ++;
//             blockIndex ++;
//         } else {
//             //if not, increment uselessStars
//             uselessStars ++;
//         }
//         // increment i
//         i ++;
//     }
//     // console out number of useful and useless stars
//     console.log("Useful stars:  " + usefulStars);
//     console.log("Useless stars: " + uselessStars);
// }
// // this function decides whether a particular star has enough
// // useful data to include on the starChain and graph/display
// function isDataUseful(star) {
//     // if the star in question is Sol (the sun), return true
//     if(data[star].name == "Sol" ){
//         return true;
//     }
//     // if any of the useful fields are empty or filled with
//     // arbitrary values, return false
//     if(
//     data[star].name == "A" ||
//     data[star].name == ""  ||
//     data[star].temp == 0   ||
//     data[star].dist == 0   ||
//     data[star].mass == 0   ||
//     data[star].circ == 0) {
//           return false;
//     }
//     // return true; the star has useful data
//     return true
// }


// I am thinking it may be a good idea to create a loop that will recreate a new JSON file with only useful
// data, that way I don't have to waste computing power on checking to see if every bit of data is useful 
// or not, I can just trust that every entry in the JSON is useful and will back navigating the bc easier
