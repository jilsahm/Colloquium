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

    describe("isValidISO8601", function(){
        var valid01 = "2018-12-17T13:01:00.572Z";
        var valid02 = "1990-01-01T23:59:59.000+09:00";
        var valid03 = "-0001-12-31T00:00:00.000-11:59";
        var valid04 = "-190001-12-31T24:00:00.000-11";

        it(valid01, function(){
            assert.equal(sanitizer.isValidISO8601(valid01), true);
        });
        it(valid02, function(){
            assert.equal(sanitizer.isValidISO8601(valid02), true);
        });
        it(valid03, function(){
            assert.equal(sanitizer.isValidISO8601(valid03), true);
        });
        it(valid04, function(){
            assert.equal(sanitizer.isValidISO8601(valid04), true);
        });

        var invalid01 = "";
        var invalid02 = "1990-01-01T24:59:59.000Z";
        var invalid03 = "-0001-12-31T00:00:00.000-12:59";
        var invalid04 = "-190001-13-31T24:00:00.000-11";

        it(invalid01, function(){
            assert.equal(sanitizer.isValidISO8601(invalid01), false);
        });
        it(invalid02, function(){
            assert.equal(sanitizer.isValidISO8601(invalid02), false);
        });
        it(invalid03, function(){
            assert.equal(sanitizer.isValidISO8601(invalid03), false);
        });
        it(invalid04, function(){
            assert.equal(sanitizer.isValidISO8601(invalid04), false);
        });
    });

});