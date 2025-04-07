# Prompts: Claude 3.7 Sonnet (Cursor + Agent mode)

## Prompt 1

```md
## Role

You are a brilliant senior software engineer, expert in both ts and js development, with high expertise in technologies such as Prisma ORM, React, Jest and relatives.

## General Objetive

Today you have a clear objective, setup a testing enviroment using ts-jest for working with the backend and the frontend

## Asssistant Approach

You have clear instructions to be a helpful assistant, who discuss the possible solutions with the user before implementing them, always asking for confirmation, this is not because you are doubtful on how to approach, but because might be missing context for you to understand the desired solution, in order to solve this issue you are going to have a constant feedback loop, in which you will ask all the possible questions, not infering anything nor taking nothing for granted.

For example you will always make a series of questions on how to approach, and just after the user gives you the confirmation you will proceed implementing the solutions.

## Timeout troubleshooting

Since this task may take several process, in order to avoid timeout problems you will proceed in batches, this will help to create an iterative solution rather than a single output with the full solution.

## Steps

1. You will read the full codebase in order to understand how it's composed and with what you will be working on. There will be useful information on the @README.md  file as well.

2. You will give me the insights from this, both technical and logical, and ask me all the questions you got from it, so you will understand deeply the codebase.

3. After this we will discuss the setup of a **UNIT testing process**, which will be the **ONLY** task we will fulfill. The discussion will have a technical focus, reaching a point in which a clear approach will be achieved.

4. At this point we will finnally implement the setup, installing the necessary packages, creating the needed files and defining the scripts for running the tests (even though there will be no test in that moment)

5. We will create dummy test just to show we have complete the setup.

## Iterative feedback process

It's important to keep the feedback loop with the human, since this will be our main methodology for working in a colaborative way
```

## Prompt 2
```md
1. We should keep the separate testing setups for frontend and backend, but adding a script to run all the tests from the main @package.json , it's important to mantain a fully verbose output in this case.

2. Just setup unit tests

3. We care more about the src parts, since we dont care to tests the database, migrations, etc

4. We want to work with AAA, make preparations on the file structures for that, in separate test directory

5. Jest should be enough for now
```

## Prompt 3
```md
Excelent, now that we have setup the unit testing, we need to create a series of tests for the backend.

It must cover 2 families of tests:

- The data reception from the form
- The data store on the database, always taking into consideration the mocking of the database to not generate data alteration, you can learn about this on:

@https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o#mock-prisma-client)


All the tests must be stored on @tests-yag.test.ts

Ask the relevant questions before proceeding
```

## Prompt 4
```md
1. We should create mocks for all the models, since i want to have tests suites for all the models
2. do a comprehensive testing for the current state of the code
3. do a simple mocking, dont simulate the full database interaction flow
4. just 1 single file, the @tests-yag.test.ts
5. no
```

## Prompt 5

```md
The @tests-yag.test.ts should always be on backend/src/tests, make sure to use that folder, also make the tests work for that file, use our jest setup for the testing, start by simple tests to check we are working correctly, after that create the full suites
```

## Prompt 6

```md
Create a PR Description with our work on the @tests-yag.test.ts file, how we made to make it work. It's important to know that i'll not include in the commit the full files we have modified, i'll just add the @tests-yag.test.ts file, so we should include in the PR a comprehensive description of what is needed for that file to run succesfully, do this in spanish
```

## Prompt 7

```md
The PR description should only be for the new @tests-yag.test.ts  , not for the setup side, update the PR Description to be only about the new tests, the full file should be in spanish
```