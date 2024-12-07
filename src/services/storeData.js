const { Firestore } = require("@google-cloud/firestore");
require("dotenv").config();

if (!process.env.PROJECT_ID) {
  throw new Error("PROJECT_ID tidak ditemukan di .env file");
}

const db = new Firestore({
  projectId: process.env.PROJECT_ID,
});

async function storeData(id, data) {
  if (!id || typeof id !== "string") {
    throw new Error("ID harus berupa string yang valid");
  }
  if (!data || typeof data !== "object") {
    throw new Error("Data harus berupa objek yang valid");
  }

  const predictCollection = db.collection("predictions");

  try {
    await predictCollection.doc(id).set(data);
    console.log("Data berhasil disimpan!");
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    throw error;
  }
}

async function getAllData() {
  const predictCollection = db.collection("predictions");

  try {
    const snapshot = await predictCollection.get();

    if (snapshot.empty) {
      console.log("Tidak ada data di koleksi predictions.");
      return [];
    }
    
    return snapshot.docs.map((doc) => ({
      history: doc.data(),
    }));
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    throw error;
  }
}

module.exports = { storeData, getAllData };
