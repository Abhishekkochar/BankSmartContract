// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Tol.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract BankContract {
    using SafeMath for uint256;
    string public name = "Tol Token farm";
    
    uint256 totalFarmSupply = 10000000000000000000000; //10,000 total supply for Pool
    Tol public tol;
    address public owner;
    
    address[] public stakers;
    uint256 stakersCount;
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public rewardBalance;
    mapping(address => uint256) public startTime;
    mapping(address => bool) hasStaked;
    mapping(address => bool) public  isStaking;
    uint256 private duration = 10 seconds;
    uint256 private subPoolOneTime = 40 seconds;
    uint256 private subPoolTwoTime = 60 seconds;
    uint256 private  end;
    uint256 private totalStakedBalance;
    uint256 private totalStakedTime;

    event Stake(address indexed from, uint256 amount);
    event UnStake(address indexed from, uint256 amount);
    
    constructor(Tol _tol) public {
        tol =_tol;
        owner = msg.sender;
        end = block.timestamp + duration;
    }    
        
    //staking Token - owner is able to stake coins
    function stakeTokens(uint256 _amount) public{
        require(_amount > 0 && tol.balanceOf(msg.sender)>=_amount, "Amount can not be 0");
        require(msg.sender != address(0), 'bank can not despoit in reward pool');
        require(end>=block.timestamp, "No more Depoist allowed"); 
        //transfering token for staking
        tol.transferFrom(msg.sender, address(this), _amount);
        //update staking balance
        stakingBalance[msg.sender] += _amount;
        startTime[msg.sender] = block.timestamp;        
        //adding user to stake array if they haven't before
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
            stakersCount++;
        }
        totalStakedBalance += stakingBalance[msg.sender];
        //update the status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
        
        emit Stake(msg.sender, _amount);
    }
    
    //unstake tokens 
    function unStakeTokens() public{
        //this adds 10secs extra. This way user not able to withdaraw for 10 secs after the deposit finished
        end = end+duration;
        require(isStaking[msg.sender]=true && stakingBalance[msg.sender]>0, 'No token to unstake');
        require(block.timestamp >=end, 'Too early');
        
        totalStakedTime = block.timestamp.sub(startTime[msg.sender]);
        if(totalStakedTime<subPoolOneTime){
            uint reward =  rewardPoolOne(msg.sender);
            uint256 value = stakingBalance[msg.sender] + reward;
            tol.transfer(msg.sender, value);
            totalFarmSupply -= reward;
            totalStakedBalance -= stakingBalance[msg.sender];
            stakingBalance[msg.sender] -= stakingBalance[msg.sender];
            isStaking[msg.sender] = false;
            stakersCount --;
            emit UnStake(msg.sender, value);
        } else if( totalStakedTime>subPoolOneTime&&totalStakedTime<subPoolTwoTime){
            uint reward =  rewardPoolTwo(msg.sender);
            uint256 value = stakingBalance[msg.sender] + reward;
            totalStakedBalance -= stakingBalance[msg.sender];
            tol.transfer(msg.sender, value);
            totalFarmSupply -= reward;
            stakingBalance[msg.sender] -= stakingBalance[msg.sender];
            isStaking[msg.sender] = false;
            stakersCount --;
            emit UnStake(msg.sender, value);
        } else if(totalStakedTime>subPoolTwoTime){
            uint reward =  rewardPoolThree(msg.sender);
            uint256 value = stakingBalance[msg.sender] + reward;
            totalStakedBalance -= stakingBalance[msg.sender];
            tol.transfer(msg.sender, value);
            totalFarmSupply -= reward;
            stakingBalance[msg.sender] -= stakingBalance[msg.sender];
            isStaking[msg.sender] = false;
            stakersCount --;
            emit UnStake(msg.sender, value);
        }
    }
    
   //bank able to remove the remaning reward after all stakers left the pool
    function withdrawReward() public  {
        require(stakersCount == 0 && msg.sender==owner);
        require(tol.balanceOf(address(this)) > 0, 'No token left in the pool.');
        tol.transfer(msg.sender, tol.balanceOf(address(this)));
    }
    /*R1 pool starts once the peroid where user is unable to depsoit finishes.
    deposit > unDeposit period > R1 > R2 > R3
       |__10sec__|____40sec______|
       R1 & R2 has 60 secs reward period between them. Meaning R1 pool duration: 40 secs, R2: 60secs & R3 once R2 finishes 
     */
    function rewardPoolOne( address _user) public  returns(uint256){
            uint256 pool = 100;
            uint256 poolAllocation = 20;
            uint256 PoolOneSupply  = (totalFarmSupply.mul(poolAllocation)).div(pool);
            uint256 userAllocation = (stakingBalance[_user].mul(pool)).div(totalStakedBalance);
            uint256 poolOneReward  = (PoolOneSupply.mul(userAllocation)).div(pool);
            return poolOneReward;
    }

    function rewardPoolTwo( address _user) public  returns(uint256){
            uint256 previousPoolReward = rewardPoolOne(_user);
            uint256 pool = 100;
            uint256 poolAllocation = 30;
            uint256 PoolOneSupply  = (totalFarmSupply.mul(poolAllocation)).div(pool);
            uint256 userAllocation = (stakingBalance[_user].mul(pool)).div(totalStakedBalance);
            uint256 poolTwoReward  = (PoolOneSupply.mul(userAllocation)).div(pool);
            uint256 totalPoolReward = poolTwoReward.add(previousPoolReward);
            return totalPoolReward;
    }

      function rewardPoolThree( address _user) public  returns(uint256){
            uint256 previousPoolReward = rewardPoolTwo(_user);
            uint256 pool = 100;
            uint256 poolAllocation = 50;
            uint256 PoolOneSupply  = (totalFarmSupply.mul(poolAllocation)).div(pool);
            uint256 userAllocation = (stakingBalance[_user].mul(pool)).div(totalStakedBalance);
            uint256 poolThreeReward  = (PoolOneSupply.mul(userAllocation)).div(pool);
            uint256 totalPoolReward = poolThreeReward.add(previousPoolReward);
            return totalPoolReward;
    }    
}