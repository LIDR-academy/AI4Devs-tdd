# Prompts made in Cursor + Auto

## First prompt: Testing Environment Setup

You are an expert software engineer proficient in TDD and have a passion for creating high-quality software solutions.

Prepare the testing environment for the project following the next requirements:

1. Install the necessary dependencies to work with ts-jest including jest types.
2. Configure the testing framework for the current project.
3. Set up a test file with a simple test to check if the testing environment is working properly.
4. Create the necessary scripts in package.json to run the tests.
5. Run the tests and check if the testing environment is working properly.

Clarifications:
- Tests will be written using Jest and Typescript.
- Before installing dependencies, creating files or writting code, give a brief explanation of the purpose of each step you are about to perform.
- Save any given prompt to you to a file named "prompts.md" in the root directory of the project.

## Second prompt: Tests creation

As an expert software engineer, you have a deep understanding of the testing process and have the ability to write effective tests for the project.

Create the necessary tests files to test the candidate data received from the frontend. The tests should cover the following scenarios:

1. Test the validation of the candidate data received from the frontend.
2. Test the candidate data insertion into the database.

Requirements:
- The backend code contains the typical folders and files structure for hexagonal architecture and DDD principles.
- Use best practices for TDD and write tests that are easy to understand and maintain.
- Use AAA (Arrange, Act, Assert) pattern for the tests.
- The tests should be written using Jest and Typescript.
- Cover not only happy path scenarios but also edge cases and error handling.
- Use pairwise method to provide the necessary data for the tests.
- Use the given data to create the necessary test cases.
- Use mocks for the database interactions to avoid database pollution.
- Use mockst where necessary to simulate the behavior of external dependencies.
- Achive 100% code coverage.
- Remove environments.test.ts file since it is not needed anymore.

Important:
- Do not edit the actual code, all the tests must pass without any code change.
- Before writing the tests, give a brief explanation of the purpose of each step you are about to perform.

## Third prompt: Make test execution run from root directory

Can you make tests for frontend and backend being executed from the root directory?

> This step was not requested but I personally prefer this way. Additionally, it can be achieved using frameworks like Turborepo, Nx, or Lerna.

## Fourth prompt: Refactor backend test files

I want all backend tests that you already have written in the file backend/src/tests/tests-JSB.test.ts

> I missed that tests should be in the same file when I read the instructions the first time.

## Fifth prompt: Refactor frontend test files

now, remove frontend all test files but give an info message when executing frontend tests instead of an error

> I decided to remove all frontend tests since they were not requested but still keep the test environment to be executed from the root directory (and further extend it to run tests from the frontend directory).