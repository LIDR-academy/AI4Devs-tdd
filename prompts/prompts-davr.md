# Prompts setting up tests

## Prompt 1

I want to add testing to this, using Jest.  Should I add that to the top directory or to backend/frontend, or all?

_Chat says that it should be separate, then notes that Jest is already installed in the backend, and proceeds to configure it._

## Prompt 2

Yes, but first, can you check that we don't use the dev database for tests, but a separate db?

_Yes, absolutely! It's a best practice to use a separate database for testing. Let me check the current database configuration and help set up a test database..._

## Prompt 3

Rather than having an extra server, can you just add another db within the the server that's already running on 5432?  And use the same user/pw.  That will make it easier for me to check what's going on.

_Yes, absolutely! That's a simpler approach. Let's modify our setup to use the same PostgreSQL server but with a different database name..._

_Would you like me to help you create some sample tests now?_

## Prompt 4

[At this point, I'm only interested in setting up a _sample_ test to prove that I can run tests, and that's what chat is offering.  I haven't looked at the second part of the homework yet.]

yes!

_Great! Let's create a test for the candidate service. First, let me check the candidate service implementation to understand what we need to test:..._

## Prompt 5

I ran `npm test` and got two errors

_I see the errors from the test output. There are two main issues:..._

## Prompt 6

better, but still showing errors

_I see the issue now. The tests for education and work experience are failing because... I see the issue. The findOne method isn't including the related records in its query. Let's modify the findOne method to include the education and work experience records:_

## Prompt 7

[I definitely don't want to change the implementation just to get to a state where I can run the tests.]

Wait, is there a way to fix the test failure without changing the implementation?  For all I know they wanted the code just the way it was.

_Ah, you make a very good point! ..._

[It fixed the tests, and then I moved on to setting up testing for the frontend.  Given that the second part of the homework doesn't touch on the frontend, I'm going to skip those prompts.]

