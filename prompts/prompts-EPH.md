# TDD - EPH

IA used: Trae with Claude 3.7 Sonnet

# Prompts

## Prompt 1

```md
### 🧪 Add Unit Testing with Jest and ts-jest to Backend Project

Please configure the `/backend` project (a Node.js backend using Express and TypeScript) to support unit testing using **Jest** with **ts-jest**.

#### ✅ Requirements:

1. **Install and configure Jest** with `ts-jest` to support TypeScript.
2. **Tests should be placed in:**  
   `/backend/src/tests/tests-EPH.test.ts`
3. Add a **basic test** in that file to verify that the setup works.
4. Follow **best practices** for structuring and configuring TypeScript tests with Jest.
5. Modify the `package.json` (in `/backend`) to add a script:  
   `"test": "jest"`  
   so I can run tests with `npm run test` or `yarn test`.
6. Ensure the project is fully configured so the tests run properly with TypeScript (e.g. `tsconfig`, Jest config, etc).

> All test files and configurations must be written in TypeScript.
```

## Prompt 2

```md
### 🧪 Create Unit Test Suite for Candidate Data Insertion (TDD)

Please create a **unit test suite** for the candidate data insertion feature in the API.

We are following **Test-Driven Development (TDD)** practices and want high-quality unit tests that follow **Jest best practices**.

#### ✅ Test Requirements:

1. **Data Reception & Validation**
   - Implement tests to ensure that the API correctly validates incoming candidate data.
   - Invalid data should be rejected appropriately.
   - Valid data should be processed correctly.

2. **Data Persistence**
   - Implement tests to ensure the API correctly inserts candidate data into the database.
   - The system should handle errors (e.g. DB failures) gracefully.
   - Use **mocks** to simulate database interactions — these are unit tests, so **no real database access** should occur.

#### 🗂 Use Existing Project Files

- Reuse existing files, modules, and logic already present in the project for data handling, validation, and persistence.
- Do not rewrite or duplicate functionality already implemented — instead, test those existing components.
- If necessary, mock internal dependencies to isolate the unit under test.

#### 📌 Additional Notes:

- All tests must be written using **Jest** in **TypeScript**.
- Follow **TDD principles**: write failing tests first, then develop minimal code to make them pass.
- Follow best practices: clear test names, proper setup/teardown, isolated test cases.
- Organize the tests within the existing structure:  
  Place the test file at `/backend/src/tests/tests-EPH.test.ts`.

> Ensure everything is modular and testable — avoid tight coupling to external services.
```