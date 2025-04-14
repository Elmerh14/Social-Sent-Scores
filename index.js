import {readFile} from 'node:fs/promises';


//async function will return a promise(placeholder for a future value)
async function buildSocialSentimentTable(filePath){
    const sentimentTable ={};  //js object which we will use as a dictionary

    //await will pause inside this function until the promise is ready
    const data = await readFile(filePath, 'utf-8'); //read data as string

    const lines = data.trim().split('\n').filter(line => line.trim() !== ''); // split the string into lines. we have an array with lines now

    for(const line of lines){
        const [word, total] = line.split(','); //split the line at every comma store the first part in word and the sencond in total (destructuring)

        sentimentTable[word] = parseFloat(total); //typecast the the total values in our dic from strings to ints
    }

    return sentimentTable;
}

async function getSocialSentimentScore(sentimentTable, filename){
    //read the file as string
    const content = await readFile(filename, 'utf-8');
    const words = content.split(/\s+/); //split by whitespace

    let totalScore = 0;

    //loop through each word in the file
    for(const wordRaw of words) {
        //convert words to lowercase
        const word = wordRaw.toLowerCase().replace(/[^a-z0-9']/gi, ''); //use regex to keep only letters, numbers and apostrophes

        //check if the words exist in the sentiment table
        if(word in sentimentTable){
            const total = sentimentTable[word]; //get the total of the word from the table
            totalScore += total; //add to the total total

            console.log(`[${word}: ${total}, ${totalScore.toFixed(2)}]`);
        }
    }

    return totalScore;
}

function getStarRating(total){
    let stars;

    switch (true) {
        case total < -5.0:
          stars = 1;
          break;
        case total >= -5.0 && total < -1.0:
          stars = 2;
          break;
        case total >= -1.0 && total < 1.0:
          stars = 3;
          break;
        case total >= 1.0 && total < 5.0:
          stars = 4;
          break;
        case total >= 5.0:
          stars = 5;
          break;
        default:
          stars = 1; // fallback
      }

      return "★".repeat(stars);
}

async function main() {
    try {
        const sentimentTable = await buildSocialSentimentTable('socialsent.csv');

        //get file name from command line args
        const filename = process.argv[2] || 'review.txt'; // defaults to "review.txt" if nothing is passed
        const totalScore = await getSocialSentimentScore(sentimentTable, filename);

        console.log(`\nFinal Score: ${totalScore.toFixed(2)}`);
        console.log(`Star Rating: ${getStarRating(totalScore)}`);

    } catch (error) {
        console.error("Error:", error.message);
    }
}

main();