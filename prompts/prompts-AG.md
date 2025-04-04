## PROMPT

As a Senior QA Engineer specializing in automated testing, your task is to develop comprehensive test coverage for the Candidate Insertion feature.
Please follow these instructions:

1. First, generate Gherkin scenarios that cover around 80% of the implementation logic into the `/backend/src/tests/gherkin/candidate-insertion.feature.md` folder

2. Then, for each Gherkin scenario, generate a corresponding **Jest unit test in TypeScript** using standard `describe()` and `it()` blocks (not BDD-style functions).

3. Output the Jest tests into: `/backend/src/tests/candidate-insertion.feature.spec.ts`

4. For create mock data use the Prisma client mapping as reference: `/backend/prisma/schema.prisma`

5. Move any mocked data into a separate `/backend/src/tests/mocks/` folder

6. Extract the Prisma client into a reusable helper if needed

7. Follow best practices for structuring and configuring TypeScript tests with Jest

8. Ensure all tests are executable and do not rely on a real database connection (mock if needed)

## USER STORY

# Candidate Insertion Feature

As a recruiter or HR manager, I want to insert a new candidate into the system using a form or an API, so that I can store and manage candidate information for future hiring processes.

Required fields:

- First name
- Last name
- Email (must be valid)
- CV (PDF)

Optional fields:

- Phone number
- Address
- Educations (institution, title, startDate, endDate)
- Work experiences (company, position, startDate, endDate)

Validation rules:

- All required fields must be present
- Email must be valid
- CV must be a PDF
- Dates must follow a consistent format

Expected outcomes:

- Valid data → candidate is saved in DB and success response is returned
- Missing/invalid fields → return validation error
- CV not PDF → return file format error

API endpoint:

- POST /api/candidates
- Accepts multipart/form-data
- Returns 201 on success, 400 on validation error, 500 on server error

When the Gherkin scenario is implemented, please generate the test in typescript for this user story into:
filename: **/test**/candidate-insertion.feature.spec.ts

- please move the mocked data file into a mock folder
- extract the prisma client into a separate file
- Please Follow **best practices** for structuring and configuring TypeScript tests with Jest.
- Ensure the test works properly.
