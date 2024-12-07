const { storeData, getAllData } = require("../services/storeData");
const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { label, suggestion } = await predictClassification(model, image);

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const dataToStore = {
    id: id,
    result: label,
    suggestion: suggestion,
    createdAt: createdAt,
  };

  await storeData(id, dataToStore);

  const response = h.response({
    status: "success",
    message: "Model is predicted successfully",
    data: {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt,
    },
  });

  response.code(201);
  return response;
}

async function getPredictHandler(request, h) {
  const data = await getAllData();
  const response = h.response({
    status: "success",
    data: data.map(item => ({
      id: item.id,
      history: {
        result: item.result,
        createdAt: item.createdAt,
        suggestion: item.result === "Non-cancer" 
          ? "Anda sehat!"
          : item.suggestion,
        id: item.id
      }
    }))
  });

  response.code(200); 
  return response;
}

module.exports = { postPredictHandler, getPredictHandler };