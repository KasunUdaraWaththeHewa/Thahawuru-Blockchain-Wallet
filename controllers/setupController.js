require("dotenv").config();
const axios = require("axios");
const {
  setIdentitiesToBlockchain,
  setLicensesToBlockchain,
} = require("../functions/functions");

const addInitialLicensesAndIdentities = async (req, res) => {
  const token = process.env.DEP_TOKEN;

  try {
    const [identityResponse, licenseResponse] = await Promise.all([
      axios.get("http://localhost:9000/api/v1/identities/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      axios.get("http://localhost:9000/api/v1/licenses/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    const identities = identityResponse.data;
    const licenses = licenseResponse.data;

    const identityResult = await setIdentitiesToBlockchain(identities);
    const licenseResult = await setLicensesToBlockchain(licenses);

    res.status(200).json({
      message: "Operation completed.",
      identityResult,
      licenseResult,
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      message: "Error fetching or processing data.",
      error: error.message,
    });
  }
};

module.exports = {
  addInitialLicensesAndIdentities,
};
