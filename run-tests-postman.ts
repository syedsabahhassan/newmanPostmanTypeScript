import newman from "newman";
import fs from "fs";
import path from "path";


let listOfCollections: string[] = [];


const runner = async () => {
    try {
        console.info(`Starting test runner for a new instance
        `);
        const configFile = path.join(__dirname, "..", "environments", "test.postman_environment.json");
        const configData = fs.readFileSync(configFile, "utf8");
        const configDataJson = JSON.parse(configData);
        const testCollections = path.join(__dirname, "..", "apitests");

        let fileExtension = ".postman_collection.json";

        listOfCollections = listOfCollections.concat(
            fs.readdirSync(testCollections).filter((fn) => fn.endsWith(fileExtension))
        )

        listOfCollections.forEach(element => {
            console.info(`Running ${element} collection first`);

            try {
                newman
                    .run({
                        collection: require(path.join(testCollections, element)),
                        environment: configDataJson,
                        insecure: true,
                        reporters: ["cli", "htmlextra"],
                        reporter: {
                            htmlextra: {
                                export: `./reports/${element}-executionResults.html`
                            }
                        }
                    })
                    .on("start", () => {
                        console.info(`****Execution of ${element} collection started`)
                    })
                    .on("done", (err, summary) => {
                        if (err || (summary.run.failures && summary.run.failures.length > 0)) {
                            console.error(`Logging error found for ${element}`);
                        }
                        else {
                            console.info(`Execution of ${element} - Completed`);
                        }
                    })
                    .on("exception", (err) => {
                        console.error(`Exception for ${element}`);
                    })
                    .on("console", (err, logs) => {
                        console.log(logs.messages);
                    });
            } catch (error) {
                console.error(`In inner try catch ${error}`);
            }
        });
    } catch {
        console.log(`Tester Exception found while running collections through Newman`)
    }


};

runner()
    .then(console.log)
    .catch(console.error);










