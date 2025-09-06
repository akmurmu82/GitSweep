UI/UX to be built:

- Add screenshots of the dashboard on the landing page.

Performance:

- Instead of raw console.log, use a proper logger:
    - Add logger utility
    ```
        // logger.js
        const isDev = process.env.NODE_ENV !== "production";

        const logger = {
        log: (...args) => {
            if (isDev) console.log(...args);
        },
        error: (...args) => {
            console.error(...args); // keep errors always
        },
        warn: (...args) => {
            if (isDev) console.warn(...args);
        }
        };

        export default logger;

    ```

    winston
    – very popular, configurable

    pino
    – very fast, production-grade

