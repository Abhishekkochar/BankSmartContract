const { assert } = require('chai');

const TolToken = artifacts.require('./Tol');
const BankContract = artifacts.require('./BankContract');

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

const wait = ms => new Promise(res => setTimeout(res, ms));

contract('BankContract', ([deployer, investor, investor2, investor3, investor4]) => {

    let tolToken, bankContract;
    before(async()=>{
        tolToken = await TolToken.new()
        bankContract = await BankContract.new(tolToken.address)

        //transfer 10000 tokens to farm
        await tolToken.transfer(bankContract.address, tokens('10000'), {from:deployer})

        //send token to investor
        await tolToken.transfer(investor, tokens('50000'), {from:deployer})
        await tolToken.transfer(investor2, tokens('4000'), {from:deployer})
        await tolToken.transfer(investor3, tokens('15000'), {from:deployer})
        await tolToken.transfer(investor4, tokens('60000'), {from:deployer})
    })
    describe('Tol Token deployment', ()=>{
        it ('has a name', async()=>{
            
            const name = await tolToken.name()
            assert.equal(name, 'Tol token')
        })
    })

   describe('Bank Token deployment', async()=>{
        it ('has a name', async()=>{
            const name = await bankContract.name()
            assert.equal(name, 'Tol Token farm')
        })

        it('contract has tokens', async () => {
            let balance = await tolToken.balanceOf(bankContract.address)
            assert.equal(balance.toString(), tokens('10000'))
        })

        })
/*If you want to test the withdraw function by bank when no user staking uncomment this section*/ 
 /*  describe('Withdraw refund by bank', async()=>{
        it('Only bank can withdraw the refund', async()=>{
            let result

            //check investor balance before staking
            result = await tolToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('50000'),'Balance is correct before staking')         

            //approve and stake tol token
            await tolToken.approve(bankContract.address, tokens('10000'), {from:investor})
            await bankContract.stakeTokens(tokens('10000'), {from:investor})

            // check investor balance after staking
            result = await tolToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('40000'),'Investor Balance is correct after staking')

            //checking investor staking balance
            result = await bankContract.stakingBalance(investor)
            assert.equal(result.toString(), tokens('10000'), 'Investor staking balance is correct')

            //investor staking status
            result = await bankContract.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

            //unstacking token after Pool one and getting reward
            await wait (20000) //30sec
            await bankContract.unStakeTokens({from:investor})
            // check investor balance after unstaking
            result = await tolToken.balanceOf(investor)
            assert.equal(result.toString(), result,'Balance is correct after claiming rewards')
            console.log('Investor 1 total balance after clamimng reward:', result.toString())
            //checking staking balance of Investor after unstaking
            result = await bankContract.stakingBalance(investor)
            assert.equal(result.toString(), tokens('0'), 'Investor balance is correct')
            console.log('everything is working till now')
            await wait(5000);
            await bankContract.withdrawReward({from:investor}).should.be.rejected;
            await bankContract.withdrawReward({from:deployer});            
        })
    })*/


/*when testing staking, unstaking and reward. Use the below script. 
You are not able to run the both above and below script together as R1 pool has time of 30secs, R2: 30-60 secs, R3>60 secs
Run one script at a time. either "Withdraw refund by bank"OR "Farming Tokens"

Above script changes the Investor 1 balance which result in different result and also because staking period is limited 10secs for testing purpose.
If you like to change times. You would have to do so in BankContract.sol. Best to run one scripts at a time.
*/
    describe('Farming Tokens', ()=>{
        it('stake Tol token by investors', async () => {
            let result

            //check investor balance before staking
            result = await tolToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('50000'),'Balance is correct before staking')
            //check investor2 balance before staking
            result = await tolToken.balanceOf(investor2)
            assert.equal(result.toString(), tokens('4000'),'Balance is correct before staking')
            //check investor3 balance before staking
            result = await tolToken.balanceOf(investor3)
            assert.equal(result.toString(), tokens('15000'),'Balance is correct before staking')
            //check investor4 balance before staking
            result = await tolToken.balanceOf(investor4)
            assert.equal(result.toString(), tokens('60000'),'Balance is correct before staking')

            //approve and stake tol token
            await tolToken.approve(bankContract.address, tokens('10000'), {from:investor})
            await bankContract.stakeTokens(tokens('10000'), {from:investor})
            //approve and stake tol token for investor2
            await tolToken.approve(bankContract.address, tokens('1000'), {from:investor2})
            await bankContract.stakeTokens(tokens('1000'), {from:investor2})
            //approve and stake tol token for investor3
            await tolToken.approve(bankContract.address, tokens('2000'), {from:investor3})
            await bankContract.stakeTokens(tokens('2000'), {from:investor3})
            //approve and stake tol token for investor4
            await tolToken.approve(bankContract.address, tokens('11000'), {from:investor4})
            await bankContract.stakeTokens(tokens('11000'), {from:investor4})

            // check investor balance after staking
            result = await tolToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('40000'),'Investor Balance is correct after staking')
            //check investor2 balance after staking
            result = await tolToken.balanceOf(investor2)
            assert.equal(result.toString(), tokens('3000'),'Investor2 Balance is correct after staking')
            //check investor2 balance after staking
            result = await tolToken.balanceOf(investor3)
            assert.equal(result.toString(), tokens('13000'),'Investor3 Balance is correct after staking')
            //check investor2 balance after staking
            result = await tolToken.balanceOf(investor4)
            assert.equal(result.toString(), tokens('49000'),'Investor4 Balance is correct after staking')

            //checking investor staking balance
            result = await bankContract.stakingBalance(investor)
            assert.equal(result.toString(), tokens('10000'), 'Investor staking balance is correct')
            //checking investor2 staking balance
            result = await bankContract.stakingBalance(investor2)
            assert.equal(result.toString(), tokens('1000'), 'Investor2 staking balance is correct')
            //checking investor3 staking balance
            result = await bankContract.stakingBalance(investor3)
            assert.equal(result.toString(), tokens('2000'), 'Investor3 staking balance is correct')
            //checking investor4 staking balance
            result = await bankContract.stakingBalance(investor4)
            assert.equal(result.toString(), tokens('11000'), 'Investor4 staking balance is correct')

            //investor staking status
            result = await bankContract.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investor staking status correct after staking')
            //investor2 staking status
            result = await bankContract.isStaking(investor2)
            assert.equal(result.toString(), 'true', 'investor2 staking status correct after staking')
            //investor3 staking status
            result = await bankContract.isStaking(investor3)
            assert.equal(result.toString(), 'true', 'investor3 staking status correct after staking')
            //investor4 staking status
            result = await bankContract.isStaking(investor4)
            assert.equal(result.toString(), 'true', 'investor4 staking status correct after staking')

            //unstaking coin in locked period
            await wait (10000) //10sec
            await bankContract.unStakeTokens({from:investor}).should.be.rejected;         
            //staking when staking period is over
            await tolToken.approve(bankContract.address, tokens('5000'), {from:investor});
            await bankContract.stakeTokens(tokens('5000'), {from:investor}).should.be.rejected;

            //Owner Trying to withdraw from the contract while userstacking
            await bankContract.withdrawReward({from:investor}).should.be.rejected;
            await bankContract.withdrawReward({from:deployer}).should.be.rejected

            //unstacking token after Pool one and getting reward
            await wait (20000) //30sec
            await bankContract.unStakeTokens({from:investor})
            // check investor balance after unstaking
            result = await tolToken.balanceOf(investor)
            assert.equal(result.toString(), result,'Balance is correct after claiming rewards')
            console.log('Investor 1 total balance after clamimng reward:', result.toString())
            //checking staking balance of Investor after unstaking
            result = await bankContract.stakingBalance(investor)
            assert.equal(result.toString(), tokens('0'), 'Investor balance is correct')
            
            //unstacking token after Pool two and getting reward
            await wait (30000) //50sec
            await bankContract.unStakeTokens({from:investor2})
            // check investor balance after unstaking
            result = await tolToken.balanceOf(investor2)
            assert.equal(result.toString(), result,'Investor2 balance is correct after claiming rewards')
            console.log('Investor 2 total balance after clamimng reward:', result.toString())
            //checking staking balance of Investor after unstaking
            result = await bankContract.stakingBalance(investor2)
            assert.equal(result.toString(), tokens('0'), 'Investor2 balance shoud be 0')
            ////unstacking token after Pool three and getting reward

            await wait(20000) //70sec
            await bankContract.unStakeTokens({from:investor3})
            // check investor balance after unstaking
            result = await tolToken.balanceOf(investor3)
            assert.equal(result.toString(), result,'Investor3 balance is correct after claiming rewards')
            console.log('Investor 3 total balance after clamimng reward:', result.toString())
            //checking staking balance of Investor after unstaking
            result = await bankContract.stakingBalance(investor3)
            assert.equal(result.toString(), tokens('0'), 'Investor3 balance shoud be 0')
            //investor 4 unstaking
            await bankContract.unStakeTokens({from:investor4})
            // check investor balance after unstaking
            result = await tolToken.balanceOf(investor4)
            assert.equal(result.toString(), result,'Investor4 balance is correct after claiming rewards')
            console.log('Investor 4 total balance after clamimng reward:', result.toString())
            //checking staking balance of Investor after unstaking
            result = await bankContract.stakingBalance(investor4)
            assert.equal(result.toString(), tokens('0'), 'Investor4 balance shoud be 0')
        })
    })
})