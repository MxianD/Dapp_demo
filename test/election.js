var Election = artifacts.require('../contracts/Election')

contract("Election", function(account) {
    var electionInstance;
    var accounts;
    web3.eth.getAccounts().then(acc => accounts = acc);
    it("initalizes with two candidates", function() {
        return Election.deployed().then(function(instance) {
            return instance.candidatesCount();
        }).then(function(count) {
            assert.equal(count, 2)
        })
    })

    it("it initalizes the candidates with correct values", function() {
            return Election.deployed().then(function(instance) {
                electionInstance = instance;
                return electionInstance.candidates(1);
            }).then(function(candidate) {
                assert.equal(candidate[0], 1, "contains the correct id");
                assert.equal(candidate[1], "Candidate 1", "contains the correct name");
                assert.equal(candidate[2], 0, "contains the votes count");
                return electionInstance.candidates(2);
            }).then(function(candidate) {
                assert.equal(candidate[0], 2, "contains the correct id");
                assert.equal(candidate[1], "Candidate 2", "contains the correct name");
                assert.equal(candidate[2], 0, "contains the votes count");

            })
        })
        /**
         * 投票一次
         */
        // it("allows a voter to cast a vote", function() {
        //     return Election.deployed().then(function(instance) {
        //         electionInstance = instance;
        //         candidateId = 1;
        //         return electionInstance.vote(candidateId, { from: accounts[0] });
        //     }).then(function(receipt) {
        //         return electionInstance.voters(accounts[0]);
        //     }).then(function(voted) {
        //         assert(voted, "the voter was marked as voted");
        //         return electionInstance.candidates(candidateId);
        //     }).then(function(candidate) {
        //         var voteCount = candidate[2];
        //         assert.equal(voteCount, 1, "increments the candidate's vote count");
        //     })
        // });
        /**
         * 投票并判断是否重复投票
         */
        // it("throws an exception for double voting", function() {
        //     return Election.deployed().then(function(instance) {
        //         electionInstance = instance;
        //         candidateId = 2;
        //         electionInstance.vote(candidateId, { from: accounts[1] });
        //         return electionInstance.candidates(candidateId);
        //     }).then(function(candidate) {
        //         var voteCount = candidate[2];
        //         assert.equal(voteCount, 1, "accepts first vote");
        //         // Try to vote again
        //         return electionInstance.vote(candidateId, { from: accounts[1] });
        //     }).then(assert.fail).catch(function(error) {
        //         assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
        //         return electionInstance.candidates(1);
        //     }).then(function(candidate1) {
        //         var voteCount = candidate1[2];
        //         assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
        //         return electionInstance.candidates(2);
        //     }).then(function(candidate2) {
        //         var voteCount = candidate2[2];
        //         assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
        //     });
        // });
        /**
         * 绑定事件投票一次
         */
    it("allows a voter to cast a vote", function() {
        return Election.deployed().then(function(instance) {
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId, { from: accounts[0] });
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, "an event was triggered");
            assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
            assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
            return electionInstance.voters(accounts[0]);
        }).then(function(voted) {
            assert(voted, "the voter was marked as voted");
            return electionInstance.candidates(candidateId);
        }).then(function(candidate) {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "increments the candidate's vote count");
        })
    });
})