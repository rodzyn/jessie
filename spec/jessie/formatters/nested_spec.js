describe('formatters', function() {
  var reporter = new (require('jessie/reporter')).reporter('nested')
  
  describe('nested formatter', function() {
    
    describe('single spec', function() {
      
      it("should use the spec description to render a successful spec", function() {
        capture = require('helpers/stdout').capture(function() {
          reporter.formatter.spec({fail: false}, {description: 'my spec'})
        })
        capture.output().should_match('my spec')
        capture.output().should_match(/\033\[32m/) // green
      })

      it("should use a F to render a successful spec", function() {
        capture = require('helpers/stdout').capture(function() {
          reporter.formatter.spec({fail: true}, {description: 'my spec'})
        })
        capture.output().should_match('my spec')
        capture.output().should_match(/\033\[31m/) // green
      })
      
      it("should render the spec with appropriate spacing on the left", function() {
        reporter.formatter.depth = 1
        capture = require('helpers/stdout').capture(function() {
          reporter.formatter.specStart({description: 'my spec'})
          reporter.formatter.spec({fail: true}, {description: 'my spec'})
        })
        capture.output().should_match(/^ {2}/)
        reporter.formatter.depth = 2
        capture = require('helpers/stdout').capture(function() {
          reporter.formatter.specStart({description: 'my spec'})
          reporter.formatter.spec({fail: true}, {description: 'my spec'})
        })
        capture.output().should_match(/^ {4}/)
      })
        
    })
    
    describe('single suite', function() {

      it("should render the suite name", function() {
        capture = require('helpers/stdout').capture(function() {
          reporter.formatter.suiteStart({description: 'my suite'})
        })
        capture.output().should_match('my suite')
      })  

      it("should render the suite name with appropriate spacing on the left", function() {
        reporter.formatter.depth = 1
        capture = require('helpers/stdout').capture(function() {
          reporter.formatter.suiteStart({description: 'my suite'})
        })

        capture.output().should_match(/^ {2}/)

        reporter.formatter.depth.should_be(2)
        reporter.formatter.suite()
        reporter.formatter.depth.should_be(1)
        
        reporter.formatter.depth = 2
        capture = require('helpers/stdout').capture(function() {
          reporter.formatter.suiteStart({description: 'my suite'})
        })
        capture.output().should_match(/^ {4}/)

      })

      it("should increase depth when starting a suite", function() {
        
        reporter.formatter.depth = 1

        capture = require('helpers/stdout').capture(function() {
          reporter.formatter.suiteStart({description: 'my suite'})
        })
                
        reporter.formatter.depth.should_be(2)
        
      })
      
      it("should decrease depth when ending a suite", function() {
        reporter.formatter.depth = 2
        reporter.formatter.suite()
        reporter.formatter.depth.should_be(1)
      })
      
    })
    
    describe('summary', function() {
      var result = {duration: 15, failed: 1, total: 2}
      result.failures= [{
        description: 'it should print errors',
        message: 'Expected A to be B',
        stacktrace: ['Expected A to be B', 'file.js:23:2', 'another_file.js:30:11']
      }]
      
      it("should properly render a summary", function() {
        capture = require('helpers/stdout').capture(function() {
          reporter.formatter.finish(result)
        })

        capture.output().should_match('2 examples, 1 failure')
        capture.output().should_match('Completed in 0.015 seconds')
        capture.output().should_match('it should print errors')
        capture.output().should_match('Expected A to be B')
        capture.output().should_match('file.js:23:2')
        capture.output().should_match('another_file.js:30:11')
        
      })
    })
  })
  
})