# Twitter Random Poetry Bot
## About
This random poetry bot can generate random poerty based on the titles set in the code. It searches the title keyword in twitter and chooses a tweet randomly, then analyzes the sentence and adds a line breaks after centrtin words to make it look like a poem. Then, it tweets the content! 

Also, during the analyzing process, it would choose a word from that sentence and add it to the titles--so the title is a never ending list.

## How to use
This bot was created in node.js and used two package--[twit](https://www.npmjs.com/package/twit) and [rita](https://www.npmjs.com/package/rita). So make sure you have them installed before you run it.

Also, make sure to create a config file with your twitter API keys and link it to the app.js file.

Right now, the bot will post every 50 seconds. You can change it to any time you wish. Also, you can set the titles on your own.

## Known bugs
* Since the twitter's language filter is not very accurate, the search result can sometimes include other language.

* Rita package cannot analyze non-word, so if the tweets includes non-word, like hashtags consisting of multiple words or typo or just random letters (as tweets always do), the result may not be very poetical.
