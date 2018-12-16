var assert = require('assert');
var sanitizer = require('../modules/sanitizer');

describe("Sanitizer - Unit Test", function(){

    describe("isValidCompetitor", function(){
        it("Valid user", function(){
            assert.equal(sanitizer.isValidCompetitor(10, "Välid", "Üsername"), true);
        });
        it("Invalid ID", function(){
            assert.equal(sanitizer.isValidCompetitor(null, "Valid", "Username"), false);
        });
        it("Invalid surename", function(){
            assert.equal(sanitizer.isValidCompetitor(5, "", "Username"), false);
        });
        it("Invalid lastname", function(){
            assert.equal(sanitizer.isValidCompetitor(-1, "Valid", ""), false);
        });
    });   

    describe("isValidId", function(){
        it("Valid ID", function(){
            assert.equal(sanitizer.isValidId(65), true);
            assert.equal(sanitizer.isValidId(-1), true);
        });
        it("Invalid ID", function(){
            assert.equal(sanitizer.isValidId(123456789), false);
            assert.equal(sanitizer.isValidId(""), false);
        });
    });

    describe("isValidTopic", function(){
        it("Valid topic", function(){
            assert.equal(sanitizer.isValidTopic(3700, "This, this is a valid title.", 900), true);
        });
        it("Invalid ID", function(){
            assert.equal(sanitizer.isValidTopic(null, "This is a valid title.", 900), false);
        });
        it("Invalid title", function(){
            assert.equal(sanitizer.isValidTopic(-1, "\n invalid title.", 900), false);
        });
    });

    describe("isValidQuestion", function(){
        it("Valid question", function(){
            assert.equal(sanitizer.isValidQuestion(3700, "This is a valid question. Or isn't it?", 9, 900), true);
        });
        it("Invalid ID", function(){
            assert.equal(sanitizer.isValidQuestion(null, "This is a valid question. Or isn't it?", 10, 900), false);
        });
        it("Invalid content", function(){
            assert.equal(sanitizer.isValidQuestion(-1, "\n invalid question.", 0, 900), false);
        });
        it("Invalid answer rating", function(){
            assert.equal(sanitizer.isValidQuestion(-5, "This is a valid question. Or isn't it?", 11, 900), false);
        });
    });

});