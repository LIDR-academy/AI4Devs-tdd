# First try with almost no prompts and only copilot 'commands'

### Prompt 1
|> @workspace /tests Accept: "We recommend installing an extension to run jest tests."

### Prompt 2 
|> @workspace /setupTests jest: "Pick a testing framework"

helloWorld.test.ts generated ??
not running

### Prompt 3
|> @workspace /tests

candidateService.test.ts generated but don't compile
Manual click on error + ask copilot to explain + fix. Nothing was successfully fixed.

### Prompt 4
|> make sure mock entities are initialized correctly.

code compile but no test success: \
Test Suites: 2 failed, 2 total\
Tests:       7 failed, 1 passed, 8 total

### Prompt 5
|> @workspace /fixTestFailure

No test failures found.


## Conclusion tests without over explained prompts
Really not happy with the result, it's not exploitable and testing quality is poor basically we test mock is mocking. Happy path and error are tested only.


# Second attempt with Copilot chat
## Prompt 1
Hello copilot, today I'm expecting you to help me generate tests for a class that stores data in a database. You are a proven and experienced senior developer in typescript and you are a quality assurance expert able to recommend and perfectly implement a testing strategy associated with my use case to ensure maximum trustability in the code and maintainability for the future.

First, I would like you to provide me with a testing strategy for the candidateService.ts class, explaining what you are testing and why. Please note that I need the strategy to be in line with what is usually done in the TypeScript testing community.

## Prompt 2
For test 'should add a fully filled candidate successfully' I have an error : TypeError: Candidate_1.Candidate.prototype.save.mockResolvedValue is not a function please explain me why and how to fix it