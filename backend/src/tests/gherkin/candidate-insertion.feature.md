```gherkin
Feature: Candidate Insertion
As a recruiter or HR manager
I want to insert a new candidate into the system
So that I can store and manage candidate information for future hiring processes

Background:
Given the system is ready to accept new candidates

Scenario: Successfully insert a candidate with required fields only
When I submit a candidate with the following required information:
| firstName | lastName | email                  | cv          |
| John      | Doe      | john.doe@example.com      | valid.pdf   |
Then the candidate should be successfully saved
And I should receive a 201 status code
And the response should contain the candidate's ID

Scenario: Successfully insert a candidate with all fields
When I submit a candidate with all information:
| firstName | lastName | email                | cv          | phone        | address           |
| Jane      | Smith    | jane.smith@test.com   | valid.pdf   | 123-456-7890 | 123 Main St, City |
And I include the following education:
| institution | title              | startDate  | endDate    |
| University  | Computer Science   | 2018-09-01 | 2022-06-30 |
And I include the following work experience:
| company    | position      | startDate  | endDate    |
| Tech Corp  | Software Dev  | 2022-07-01 | 2023-12-31 |
Then the candidate should be successfully saved
And I should receive a 201 status code
And the response should contain the candidate's ID

Scenario: Attempt to insert candidate with missing required fields
When I submit a candidate with missing required fields:
| firstName | lastName | email |
| John      | Doe      |       |
Then I should receive a 400 status code
And the response should contain validation errors

Scenario: Attempt to insert candidate with invalid email
When I submit a candidate with invalid email:
| firstName | lastName | email           | cv          |
| John      | Doe      | invalid-email   | valid.pdf   |
Then I should receive a 400 status code
And the response should contain email validation error

Scenario: Attempt to insert candidate with invalid CV format
When I submit a candidate with invalid CV format:
| firstName | lastName | email                  | cv            |
| John      | Doe      | john.doe@example.com      | invalid.jpg     |
Then I should receive a 400 status code
And the response should contain file format error

Scenario: Attempt to insert candidate with duplicate email
Given a candidate exists with email "existing@example.com"
When I submit a candidate with duplicate email:
| firstName | lastName | email                  | cv          |
| John      | Doe      | existing@example.com      | valid.pdf   |
Then I should receive a 400 status code
And the response should contain duplicate email error
```
