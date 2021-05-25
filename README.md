# ozbargain-tracker
Track new ozbargain posts

## Setup & Usage
1. In the terminal type 'npm init' followed by 'npm install'. node-fetch and node-mailer should be installed. If there are any issues you can manually install them through 'npm install node-fetch' and 'npm install node-mailer'
2. On line 5 you can enter the items you want in the items array. They should be key words only, and should include a price. e.g. const items = ['Playstation 5 $900', 'Note 20 Ultra $1199']. Note that every word must match for an email to be sent
3. On line 13 and 14, please enter your burner gmail account 
4. On line 24 and 25, please enter your burner gmail and your main email account
5. On the very last line, you can change how often the polling happens by changing the 10 e.g. 60 * 1000 * 30 for 30 minutes
