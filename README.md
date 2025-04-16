# Calculator App

This project is a simple calculator desktop application built with **Angular** and **Electron**. It is designed primarily for **learning purposes** and to help developers get familiar with building cross-platform desktop applications using modern web technologies. The app demonstrates the integration of a frontend framework (Angular) with Electron for creating native-like desktop experiences.

## Tech Stack

- [Angular](https://angular.io/) – frontend framework
- [Electron](https://www.electronjs.org/) – for building cross-platform desktop apps
- [Node.js](https://nodejs.org/) – backend runtime environment
- [TypeScript](https://www.typescriptlang.org/) – strongly typed JavaScript
- [HTML & CSS] – UI structure and styling
- [UI Components](https://clarity.design/) - components for build ui part

  ## Application Structure

The application consists of two main Angular components:

- **InputComponent** – This component provides a simple user interface for entering mathematical expressions and displaying the result. It includes buttons for basic arithmetic operations and a display area for the current input and calculated output.

- **HistoryComponent** – This component maintains and displays a list of previously calculated expressions along with their results. It allows users to review their past calculations during the current session.

These components are organized to demonstrate separation of concerns and component-based architecture in Angular. State management is handled locally, and communication between components is achieved using Angular services.
## Features – InputComponent

The `InputComponent` is designed to collect user input for performing basic arithmetic operations. It includes the following features:

- **Reactive Form** – A Reactive Angular form is used for structured and efficient data handling and validation.
- **Three Input Fields**:
  - **First Operand** – for entering the first number.
  - **Second Operand** – for entering the second number.
  - **Operation Selector** – a dropdown or button group to select the desired operation: addition (`+`), subtraction (`-`), multiplication (`×`), or division (`÷`).
- **Validation** – The form includes basic validation rules to ensure that operands are valid numbers and that an operation is selected before calculation.
- **Live Operation Display** – A dynamic text element shows the current operation in real time, e.g. `5 + 3`, helping users clearly see what calculation is being prepared before submission.
  - **Submit & Calculate Flow**:
  - On form submission, the input data is sent to an Angular **CalculationService**.
  - The service prepares and formats the data.
  - It then communicates with the **Electron main process** using IPC (Inter-Process Communication).
  - The actual calculation is performed on the Electron side, which simulates how a real desktop backend might work.
  - The result is returned back to the Angular component and displayed, while also being sent to the history list.
**## Features – HistoryComponent

The `HistoryComponent` is responsible for displaying a list of all previously performed calculations and managing their removal. Its main features include:

- **Dynamic History List** – Displays a real-time list of all calculations performed during the session. Each list item shows:
  - The full operation (e.g. `5 × 4 = 20`)
  - A **Delete** button next to it

- **Delete Operation Flow**:
  - When the **Delete** button is clicked, a **modal dialog** appears to confirm the deletion.
  - The modal contains:
    - A **title**: `Delete Operation`
    - A **message**: _"Are you sure you want to delete this operation from history?"_
    - The **specific operation** that is about to be deleted, for clarity.
    - Two buttons: `Cancel` and `Continue`

- **Electron Integration**:
  - If the user clicks `Continue`, a request is sent from Angular to the Electron main process to remove the selected operation from the stored history.
  - Once the deletion is confirmed on the Electron side, the updated history is fetched and re-rendered in the component.
  - If the user clicks `Cancel`, the modal simply closes and no changes are made.

This flow demonstrates component communication, service handling, modals, and frontend-backend sync using Angular + Electron.

## Development Requirements

This project is intended for educational use, and each student should follow these development guidelines:

- **Separate Development Branch** – Students must create and work in a personal Git branch with a custom name (not `main`). This allows isolated development and avoids conflicts with the main project branch.
- **Clean Commit History** – The branch should contain only the necessary files related to the calculator application. Unrelated system files, temporary files, or `node_modules` must **not** be included in commits.
- **Project Structure Discipline** – Students are encouraged to maintain a clear and modular structure, separating components, services, assets, and configuration files logically.
- **Regular Commits** – Students should commit their progress incrementally with meaningful commit messages that describe the changes made.
