const fetch = require('node-fetch');
const nodemailer = require('nodemailer');

const URL = 'http://www.ozbargain.com.au/api/live?last=0&disable=comments%2Cvotes%2Cwiki&types=Comp&update=1';
const items = ['']; // List of items we're tracking
const checkedPosts = {}; // Once we've checked a post we store it here so we don't recheck posts
//let strictTracking = 0; // 0 = every word must match for an email to be sent, 1 = more than half of the words = email sent, 2 = any word matches except $ = email sent

// Stuff for emailing
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR BURNER EMAIL HERE',
        pass: 'YOUR BURNER EMAIL PASSWORD HERE'
    },
    secure: false,
    tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false
    }
});

let mailOptions = {
    from: 'YOUR BURNER EMAIL HERE',
    to: 'YOUR PERSONAL EMAIL HERE',
    subject: `Ozbargain-Tracker has found an item for you!`
};

const priceRegex = new RegExp(/\$/); //This is to find the user specified price
const itemPriceRegex = /\$[0-9.]+\s/; //This is to find the post title item price
const tracker = setInterval(() => {
    fetch(URL)
        .then((data) => data.json())
        .then((res) => {
            console.log("*** Pulling From Ozbargain ***")
            Object.keys(res['records']).forEach((key) => {
                const postTitle = res['records'][key].title;
                const postID = res['records'][key].link;
                let itemPrice = itemPriceRegex.exec(postTitle); // Get the posted item price

                if (itemPrice !== null) {
                    itemPrice = parseFloat(itemPrice[0].substring(1)); // If there is a price in the title, we get rid of the dollar sign
                }

                if (!(postID in checkedPosts)) { // Check if we've seen this post before
                    checkedPosts[`${postID}`] = 1; // Make sure we don't double email
                    
                    items.forEach((text) => { // For each item we want
                        let validItem = true;
                        itemsSplit = text.split(" "); // Get each word
                        itemsSplit.forEach((word) => {
                            let itemRegex = new RegExp(`${word}`, "i");
                            if (priceRegex.test(word)) { // If the current word is the price
                                // Checking price here
                                let userPrice = parseInt(word.substring(1));
                                if (itemPrice !== null && itemPrice > userPrice) {
                                    validItem = false;
                                }
                            } else {
                                if (!itemRegex.test(postTitle)) {
                                    validItem = false;
                                }
                            }
                        });

                        if (validItem === true) {
                            console.log("*** Item found ***");
                            console.log(res['records'][key]);
                            mailOptions.text = `${postTitle}\n www.ozbargain.com${postID}`;
                            
                            transporter.sendMail(mailOptions, function(error,info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log(`*** Email was sent ***`);
                                }
                            });
                        }
                    });

                } else {
                    console.log("*** Post already checked ***")
                }

            });
        })
}, 60 * 1000 * 10); // Poll once every 10 minutes

//References
//https://www.w3schools.com/nodejs/nodejs_email.asp
//https://stackoverflow.com/questions/52854027/nodemailer-econnrefused