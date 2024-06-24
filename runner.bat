@echo off
REM Navigate to the React Native project directory
cd C:\Users\AMINE\Desktop\Project\JsFramework\React\ttt

REM Open the project in Visual Studio Code
start code .

REM Start the React Native development server in a new Command Prompt window
start cmd /k "npm start"

REM Give the server some time to start (e.g., 10 seconds)
REM timeout /t 10 /nobreak >nul

REM Close the Command Prompt window
REM taskkill /IM cmd.exe /F

REM Uncomment the following line to run the app on an Android emulator or connected device
REM start cmd /k "npx react-native run-android"
