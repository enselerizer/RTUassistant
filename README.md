# About RTUAssistant

RTUAssistant is an Angular-based voice assistant app for information desks at universities developed at the Russian Technological University for internal use. It uses Yandex.Speechkit API for speech recognition and the Electron framework for standalone running.

# Warning!

:construction: The project is currently under development. Most of the functionality has not yet been implemented.

## Run

Run `npm run electron` to run the project.

## How it works

The application uses a clap recognition algorithm for offline detection of an activation command. As soon as this happened, the application starts transmitting speech to Yandex.Speechkit servers in streaming mode, while simultaneously receiving and displaying intermediate recognition results.

The end of the command phrase is determined by the Yandex.Speechkit API, after which the application analyzes the final result and passes it to RTUAssistantBackend, from where it receives the requested data.




