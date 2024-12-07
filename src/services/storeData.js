const { Firestore } = require("@google-cloud/firestore");
require("dotenv").config();

if (!process.env.PROJECT_ID) {
  throw new Error("PROJECT_ID tidak ditemukan di .env file");
}

const db = new Firestore({
  projectId: process.env.PROJECT_ID,
});

async function storeData(id, data) {
  const predictionsRef = db.collection('predictions');
  
  await predictionsRef.doc(id).set(data);
  console.log(`Data prediksi dengan ID ${id} telah disimpan ke Firestore`);
}

async function getAllData() {
  const predictionsRef = db.collection('predictions');
  const snapshot = await predictionsRef.get();
  
  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => doc.data());
}

module.exports = { storeData, getAllData };
