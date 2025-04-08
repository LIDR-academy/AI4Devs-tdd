Cursor with claude 3.7-sonnet agent

**Prompt 1**:
You are a senior software engineer with a very strong knowledge in TypeScript and unitary tests with jest.  You know how to apply the best pracitces and specially AAA and mocking principles for tests.
I want to generate unitary tests for a specific functionality: insert a new candidate into the database.
In order to write these tests I want you to write me first a filr called 00_test_roadmap.md in a new repo called documentation. This file will contain the following information:
1. All the possible users stories related to this functionality (the esay and usual ones as well as the very unlikely and unusual ones). You have to add in each user story the acceptance criteria that will help us later to generate the tests. **In order to write these user stories, use the codebase as context to understand the project**
2. A table containing the following:
a. each row will correspond to a user story
b. the column 1 contain its name
c. colmun 2 contain the test function name (if one user story needs several test functions then create as many row as needed for this user story)
d. column 3 the acceptance criteria tested
e. column 4, a boolean to say if this test as been written
f. column 5, a boolean to say if this test has passed.

**Prompt 2**:
You have done a great job, you have created a lot of user stories regarding final users but now I want you to add user stories for software developpers to ensure that in any case where the data is validated, then the data is effectively saved or updated properly in the databse. Update the file @00_test_roadmap.md 

**Prompt3**:
Now I want you to write each one of this tests in the appropriate repo (you can create any repo if needed).
For each test created you will:
1. generate the test file in the appropriate repo
2. verify that the test passed
3. fix the test is needed untill it passes
4. update the file @00_test_roadmap.md 

**Prompt 4**:
Perfect, now let's create and tests the tests for US9 to US12 following the same logic and updating the file @00_test_roadmap.md 