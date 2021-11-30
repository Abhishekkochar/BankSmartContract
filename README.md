# BankSmartContract

When trying to implemet this contract make sure you have the same node version to avoid any sort of issue.
I have provided an package.json file. 
If you haven't before, make a dir, put the package file there and install using truffle init and npm install.
Truflle init & npm install is important as it intsall the needed dependencies for both solodity and testing.

At this stage .sol files and test file in test folder is all we need. No need to have the migration and truffle.config files. As they should be in your directory once you run the truflle init. They are there to make sure we have the correct settings for these files.

Once you insatlled the needed dependencies. Run truffle compile in cmd line. If using Ganche GUi make sure it is working or other wise run ganache-cli in cmd line.
Once the contracts have been sucessfully compiled, run truffle migrate in cmd line. and to run test - truffle test. 

In this pool, we use the Tol token for both staking and reward. Pool farm supply have been hard coded to 10,000 Tol tokens. Tol Tokens supply is 1 million. In test file there are 4 investors with various sum staked. There are importtant notes in test file. Please have a read through carefully.

If you change the duration uint in bankContract.sol file, you would need to update the test file wait() function accordingly. At this stage, this is set at 10secs. Same things go for the time cycle for Sub Pool 1, 2 & 3. 

Both the Tol and Bank Contract have been delpoyed on Ropsten test net.

Tol token cntract address:  0xE1223B936E8f00789C1092626C5be0564e6f1724,

Bank contract address: 0xFB2B51250eb0371DB6ae56B67316627bDBaD4Dd3

Not enough Eth given by faucet on Rinkeby.So, I have to deploy on Rospten.

If you have any further question. Email me at abhishekochar2@gmail.com
