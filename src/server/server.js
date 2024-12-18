const Hapi = require("@hapi/hapi");
require("dotenv").config();

const routes = require("../server/routes");
const loadModel = require("../services/loadModel");
const InputError = require("../exceptions/InputError");

(async () => {
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || "localhost";

    const server = Hapi.server({
        port: port,
        host: host,
        routes: {
            cors: {
                origin: ["*"],
            },
        },
    });

    const model = await loadModel();
    server.app.model = model;

    server.route(routes);

    server.ext("onPreResponse", (request, h) => {
        const response = request.response;

        if (response instanceof InputError) {
            const newResponse = h.response({
                status: "fail",
                message: `Terjadi kesalahan dalam melakukan prediksi`,
            });

            newResponse.code(response.statusCode);
            return newResponse;
        }

        if (response.isBoom) {
            const newResponse = h.response({
                status: "fail",
                message: response.message,
            });

            newResponse.code(response.output.statusCode);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();

    console.log(`Server is running at : ${server.info.uri}`);
})();