## Overview

- Error-Free code: Verify that the code runs without errors.
- Responsiveness: Check if the application looks good on mobile devices
- Linting: Verify if the codebase uses eslint.
- .gitignore: Ensure no dist files, editor/IDE files are checked in.

## Testing

- Unit tests: Confirm there are unit tests for crucial parts of the codebase.

## Naming:

- Consistency: Ensure filenames, variables, functions, and modules have consistent casing and descriptive names.

## Code quality

- Code duplication: Look for blocks of code that can refactored to reduce duplication.
- Simplify code: Simplify overly complex code.
- Unused code: Remove unused or unreachable code.
- Commented-out code: Delete commented-out code
- Console Logs: Remove console.log statements unless necessary.
- Comments: Remove unnecessary comments that describe "how" and add comments where needed that describe "why".

## React Best practices

- Minimize Render logic: Move logic out of render method into helper methods, container components, or Redux actions.
- Side effects: Move code with side effects( eg. ajax calls) out of render methods.
- Components size: split up larger components to reduce duplication and adhere to the single responsibility principle.
- Destructuring Props: Destructure props in Es6 components.
- Functional components: Use functional components for stateless components
- Immutable Props: Ensure props are not modified within components.

## Redux

- State Mutations: Verify the reducers do not mutate the state.

## Component Design

- Component size: Keep components small and break them down into child components if necessary.
- JSX size: Ensure JSX markup is no more than 50 lines,
- Function comments - Add comments describing what each function does.
- Linter errors: Ensure code id free of linter errors.
- React warnings: Resolve any react warnings, such and missing key props in array.
- DRY principle: Avoid repeating code, ensure code is reusable.
- Code Pattens: Adhere to existing code patterns and naming conventions
- Usused props: Remove any unused props
- Styling: Prefer using common styling files over inline styles.
- Constants and Enums: Avoid hardcoded values. Use constants and group similar values under Enum.
- Interfaces and Types: Ensure proper use of interfaces and types, Extending them where required.

## API and Async Handling

- Service Layer: create a service layer for API calls.
- promises/Async/Await: Use Promises or async/await for asynchronous operations and handle API rejections.
- Avoid infinite call inside loops.
- Exception Handling: Implement proper exception handling and resource cleanup.
- Timers: Unregister timers in clean-up effects if registered during mounting.

## Additional Considerations

- Image Alt Text: Ensure all images have appropriate alt attributes.
- Git commit messages: Use small and understandable commit messages.
- NPM package: Check for new npm packages and avoid functionality duplicates.
- Imports: Ensure imports to avoid bundling unused library parts.
- Translations: Verify that new text areas are translated if translations are used.
- Typescript: Fix any missing or invalid types, avoid any types unless necessary.
- Boolean naming: Use prefixes like is/are/should for boolean variables.
- Function names: Ensure functions declare their purpose clearly and name them according to their action.
- Hardcoded values: Avoid hardcoded names, paths and values.
- Backward compatibility: Ensure backward compatibility in props and method parameters.
- Form Validation: Check for form validation and proper handling of errors.
- Async Methods: Optimize async methods for parallel execution where possible.
