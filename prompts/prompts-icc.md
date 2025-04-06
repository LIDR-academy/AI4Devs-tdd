# Prompt 1
Start this project, run migrations if needed@Codebase @README.md 

# Prompt 2
Solve issues related to versions of prisma and typescript in @package.json

# Prompt 3
1) Identify all use cases that involve the candidate creation.
2) Identify all unit test that can cover these use cases.
3) Ask me all realted question about how yo can implement these unit tests with ts-jest.
4) Do not create code.

# Prompt 4
First let me ask some questions to you.
Are there any specific error messages you want to return for different validation failures?
- Do you need to handle different validation failures?
How do you want to handle asynchronous operations in your tests (e.g., using async/await)?
- Is there any method that need asynchronous operations ?

# Prompt 5
Using the following information provided by you implement the unit test using ts-jest under a new folder named tests in the following path:
-backend 
--src
---tests
**Is very important to mock database with mock prisma client to ensure that database is not involved in these tests.**

1. Specific Error Messages for Validation Failures
For different validation failures, you can customize the error messages returned by your validation functions. Here are some examples based on your current validation logic:
Invalid Email: "The provided email is invalid."
Invalid Institution: "The institution name is required and must be less than 100 characters."
Invalid Company: "The company name is required and must be less than 100 characters."
Invalid CV Data: "The CV data must include a valid file path and file type."

2. Handling Different Validation Failures
Yes, you should handle different validation failures in your tests. Each validation function can throw specific errors, which you can catch in your unit tests. For example, you can write tests that expect certain errors to be thrown when invalid data is passed to the validateCandidateData function.

3. Handling Asynchronous Operations in Tests
Since your addCandidate function involves asynchronous operations (like saving to the database), you should use async/await in your tests. This allows you to wait for the promises to resolve and assert the results accordingly.



