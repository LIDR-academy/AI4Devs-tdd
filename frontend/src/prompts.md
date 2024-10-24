## 1 Initial Setup for React Testing Environment:

We have 2 projects. The frontend project and the backend project. We are going to work on the Frontend project. It is a React application.
Create a testing environment using react-testing-library

## 2 Error: Can't find a root directory while resolving a config file path:

I'm getting the following error:
Error: Can't find a root directory while resolving a config file path.
Provided path to resolve: jest.config.js

## 3 Test the App Component:

Test the App component and place the unit test in the **tests** folder

## 4 Avoid Destructuring Queries from render Result:

avoid destructuring queries from `render` result, use `screen.getByText` instead

## 5 Fix Error: Cannot Read Properties of Undefined (Reading 'html'):

Fix the following error:
TypeError: Cannot read properties of undefined (reading 'html')

## 6 Add jest-environment-jsdom:

Add the 'jest-environment-jsdom'

## 7 Fix SyntaxError: Cannot Use Import Statement Outside a Module:

fix this error:
/Users/francesc.munoz/Documents/ai4devs/AI4Devs-tdd/frontend/src/setupTests.js:1
({"Object.<anonymous>":function(module,exports,require,**dirname,**filename,jest){import "@testing-library/jest-dom/extend-expect";
^^^^^^
SyntaxError: Cannot use import statement outside a module

## 8 Fix Error: Support for the Experimental Syntax 'jsx' Isn't Currently Enabled:

fix this error:
SyntaxError: /Users/francesc.munoz/Documents/ai4devs/AI4Devs-tdd/frontend/src/**tests**/App.test.jsx: Support for the experimental syntax 'jsx' isn't currently enabled (11:3):

## 9 Fix Error: You Cannot Render a <Router> Inside Another <Router>:

When ran the test i got this error:
You cannot render a <Router> inside another <Router>. You should never have more than one in your app.

## 10 Fix Error: useRoutes() May Be Used Only in the Context of a <Router> Component:

When ran the test i got this error:
useRoutes() may be used only in the context of a <Router> component.

## 11 Revert to the First Version of the Test:

yOu becoming craazy. Go to the first version of the test.

## 12 Unit Test the candidateService:

Unit Test the service `candidateService`

## 13 Fix Warning: ReactDOMTestUtils.act is Deprecated in Favor of React.act:

fix this warning:
Warning: `ReactDOMTestUtils.act` is deprecated in favor of `React.act`. Import `act` from `react` instead of `react-dom/test-utils`. See https://react.dev/warnings/react-dom-test-utils for more info.

## 14 Fix Warning: ReactDOMTestUtils.act is Deprecated in Favor of React.act in App.test.js:

Still getting this warning about the App.test.js:
Warning: `ReactDOMTestUtils.act` is deprecated in favor of `React.act`. Import `act` from `react` instead of `react-dom/test-utils`. See https://react.dev/warnings/react-dom-test-utils for more info.

## 15 Move All Mocks to the Service Mock File:

move all the mocks to the service mock file

## 16 Add Unit Testing for All 3 Components:

Add unit testing for all the 3 components. Add them in his respective file inside the **tests** folder

## 17 Add Unit Test for the FileUploader Component:

Also add a unit test for the FileUploader file

## 18 Fix Error: Unable to Find an Element with the Placeholder Text of: Empresa:This list captures all the prompts you provided during our conversation.This list captures all the prompts you provided during our conversation.

this test is not passing. Im getting this error:
TestingLibraryElementError: Unable to find an element with the placeholder text of: Empresa
