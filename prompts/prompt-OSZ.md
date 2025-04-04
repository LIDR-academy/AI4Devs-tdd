# Model: Claude 3.7 Sonnet

## Prompts

1. "install ts-jest to be able to work with tdd methodology"

2. "install types for ts-jest"

3. "now let's create config for it"

4. "I think that you could do it from npx command line"

5. "sorry, i need to test only backend for now, revert all changes until now and apply in @backend"

6. "remove global @package-lock.json and node_modules"

7. "no, you deleted node_modules in @backend, run npm install to add it again and delete node_modules in global folder"

8. "create folder called prompts in global directory and inside create files called prompt-OSZ.md. In this file put as header model used during our conversation and from now on after our interaction and when you give me your response put my prompt literally in this file, enumerate it, and never change my prompt"

9. "run docker containers using @docker-compose.yml"

10. "I already stopped running containers. Run it again"

11. "now let's run frontend and backend"

12. "fix these error after running npm start"

13. "I have running prostgre container but do not have any tables yet. generate tables defined in prisma"

14. "do not create new env file, use @.env"

15. "now, let's add suite of unit tests for 2 functionalities.

- Receive candidate data from frontend form @candidateService.ts
- Save candidate in DB @Candidate.ts

Create mock service in tests to use in place of prisma and avoid real DB calls when test will run."

16. "move all created tests inside folder backend/src/test in file called tests-OSZ.test.ts"

17. "great, but let's modify some details. You created 1 test suite for all tests. Create 2 of them for 2 different functionalities which is receiving candidate data and save it in DB"
