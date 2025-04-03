# Insert Candidate Functionality Test Roadmap

## User Stories and Acceptance Criteria

### US1: Basic Candidate Insertion
**As a** recruiter  
**I want to** add a new candidate with basic information (first name, last name, email)  
**So that** I can store essential candidate details in the database  

**Acceptance Criteria:**
- Valid first name, last name, and email must be provided
- First and last name must contain only letters, spaces, and accented characters
- Email must be in valid format
- On successful insertion, a candidate ID is returned
- The candidate is stored in the database with the provided information

### US2: Candidate with Optional Information
**As a** recruiter  
**I want to** add optional information to a candidate (phone, address)  
**So that** I can have more complete candidate profiles  

**Acceptance Criteria:**
- Phone number format follows Spanish phone number pattern (starts with 6, 7, or 9 followed by 8 digits)
- Address, if provided, doesn't exceed 100 characters
- Optional fields are correctly stored in the database

### US3: Candidate with Education History
**As a** recruiter  
**I want to** add education history for a candidate  
**So that** I can track their academic background  

**Acceptance Criteria:**
- Education entries require institution, title, and start date
- Institution and title must not exceed 100 characters
- Dates must be in YYYY-MM-DD format
- End date can be omitted for ongoing education
- Multiple education entries can be added for a single candidate
- All education entries are stored and associated with the candidate

### US4: Candidate with Work Experience
**As a** recruiter  
**I want to** add work experience for a candidate  
**So that** I can evaluate their professional background  

**Acceptance Criteria:**
- Work experience entries require company, position, and start date
- Company and position must not exceed 100 characters
- Description, if provided, must not exceed 200 characters
- Dates must be in YYYY-MM-DD format
- End date can be omitted for current jobs
- Multiple work experience entries can be added for a single candidate
- All work experience entries are stored and associated with the candidate

### US5: Candidate with Resume
**As a** recruiter  
**I want to** attach a resume to a candidate profile  
**So that** I can have their CV available for review  

**Acceptance Criteria:**
- Resume must have a valid file path and file type
- Resume is stored and associated with the candidate

### US6: Prevent Duplicate Candidates
**As a** recruiter  
**I want to** be prevented from adding candidates with duplicate emails  
**So that** I avoid data redundancy  

**Acceptance Criteria:**
- System checks if the email already exists in the database
- If the email exists, an appropriate error message is returned
- The operation is aborted without affecting the database

### US7: Handle Validation Errors
**As a** recruiter  
**I want to** receive clear error messages when providing invalid candidate data  
**So that** I can correct the information and try again  

**Acceptance Criteria:**
- System validates all required fields
- System validates format of all fields according to rules
- System returns specific error messages for each validation failure
- The operation is aborted without affecting the database

### US8: Handle Database Connection Issues
**As a** recruiter  
**I want to** be notified when there are database connection issues  
**So that** I can report the problem to IT support  

**Acceptance Criteria:**
- System detects database connection problems
- System returns a clear error message about the database connection
- The operation is aborted without partial data insertion

### US9: Data Persistence for Valid Candidate
**As a** developer  
**I want to** ensure that validated candidate data is properly persisted in the database  
**So that** data integrity is maintained throughout the application  

**Acceptance Criteria:**
- When data passes all validations, it is correctly inserted into the database
- The database record accurately reflects all provided candidate information
- The returned ID corresponds to a real database record
- Transaction is properly committed
- Database connections are properly closed after operations

### US10: Complete Transaction Rollback on Error
**As a** developer  
**I want to** ensure database transactions are rolled back completely when errors occur  
**So that** no partial or inconsistent data is stored  

**Acceptance Criteria:**
- When an error occurs during any stage of the insertion process, all database changes are rolled back
- No orphaned related records (education, work experience, resumes) are created if candidate insertion fails
- Transactions are properly managed across all related tables
- Database connections are properly closed even when errors occur

### US11: Proper Database Schema Constraints
**As a** developer  
**I want to** ensure database schema constraints are properly enforced during insertion  
**So that** data integrity is maintained at the database level  

**Acceptance Criteria:**
- Database-level constraints (like unique email) are honored by the application code
- Foreign key constraints between candidate and related tables are properly enforced
- Field length constraints in the database match validation rules in the application
- Required fields in the database schema are always provided in insertion operations

### US12: Proper Data Type Handling
**As a** developer  
**I want to** ensure proper data type conversions between application and database  
**So that** data is stored correctly without corruption  

**Acceptance Criteria:**
- Date fields are properly formatted and stored in the database
- String fields are properly escaped to prevent SQL injection
- Numeric fields are properly converted from strings when necessary
- Boolean values are properly stored in their database representation

## Test Cases Matrix

| User Story | Test Function | Acceptance Criteria Tested | Written | Passed |
|------------|--------------|----------------------------|---------|--------|
| US1 | testAddCandidateWithBasicInfo | Valid basic info is provided and stored correctly | ✅ | ✅ |
| US1 | testAddCandidateWithInvalidFirstName | First name validation | ✅ | ✅ |
| US1 | testAddCandidateWithInvalidLastName | Last name validation | ✅ | ✅ |
| US1 | testAddCandidateWithInvalidEmail | Email validation | ✅ | ✅ |
| US2 | testAddCandidateWithValidOptionalInfo | Optional info is stored correctly | ✅ | ✅ |
| US2 | testAddCandidateWithInvalidPhone | Phone validation | ✅ | ✅ |
| US2 | testAddCandidateWithInvalidAddress | Address validation | ✅ | ✅ |
| US3 | testAddCandidateWithSingleEducation | Single education entry is stored correctly | ✅ | ✅ |
| US3 | testAddCandidateWithMultipleEducations | Multiple education entries are stored correctly | ✅ | ✅ |
| US3 | testAddCandidateWithInvalidEducation | Education validation | ✅ | ✅ |
| US3 | testAddCandidateWithOngoingEducation | Ongoing education (no end date) is stored correctly | ✅ | ✅ |
| US4 | testAddCandidateWithSingleWorkExperience | Single work experience is stored correctly | ✅ | ✅ |
| US4 | testAddCandidateWithMultipleWorkExperiences | Multiple work experiences are stored correctly | ✅ | ✅ |
| US4 | testAddCandidateWithInvalidWorkExperience | Work experience validation | ✅ | ✅ |
| US4 | testAddCandidateWithCurrentJob | Current job (no end date) is stored correctly | ✅ | ✅ |
| US5 | testAddCandidateWithResume | Resume is stored and associated correctly | ✅ | ✅ |
| US5 | testAddCandidateWithInvalidResume | Resume validation | ✅ | ✅ |
| US6 | testAddCandidateWithDuplicateEmail | Duplicate email detection and appropriate error | ✅ | ✅ |
| US7 | testValidationErrorsAreReturned | All validation errors are properly returned | ✅ | ✅ |
| US8 | testDatabaseConnectionError | Database connection error handling | ✅ | ✅ |
| US9 | testValidatedDataIsPersisted | Valid data is properly stored in database | ✅ | ✅ |
| US9 | testReturnedIdMatchesDatabaseRecord | Returned ID corresponds to actual database record | ✅ | ✅ |
| US9 | testConnectionsProperlyClosedOnSuccess | Database connections closed after successful operations | ✅ | ✅ |
| US10 | testTransactionRollbackOnError | Transaction rollback on error occurs correctly | ✅ | ✅ |
| US10 | testNoOrphanedRecordsOnFailure | No orphaned related records when candidate insertion fails | ✅ | ✅ |
| US10 | testConnectionsProperlyClosedOnError | Database connections closed after errors | ✅ | ✅ |
| US11 | testDatabaseConstraintsEnforced | Database constraints enforced in application code | ✅ | ✅ |
| US11 | testForeignKeyConstraintsPreserved | Foreign key relationships maintained | ✅ | ✅ |
| US12 | testProperDateFormatting | Date fields properly formatted in database | ✅ | ✅ |
| US12 | testStringFieldEscaping | String fields properly escaped to prevent SQL injection | ✅ | ✅ | 