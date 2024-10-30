const local = {
  BACKEND_URL: "http://localhost:3000",
  PROVIDER_URL: "localhost:8545",
  EXPLORER_URL: "https://polygonscan.com",
};

const dev = {
  BACKEND_URL:
    "https://validator-backend-bzhra0fhh9epeacc.eastus2-01.azurewebsites.net",
  PROVIDER_URL: "https://rpc-amoy.polygon.technology/",
  EXPLORER_URL: "https://amoy.polygonscan.com",
};

const prod = {
  BACKEND_URL:
    //"https://validator-backend-bzhra0fhh9epeacc.eastus2-01.azurewebsites.net",
    "http://localhost:3000",
  PROVIDER_URL: "https://polygon-rpc.com/",
  EXPLORER_URL: "https://polygonscan.com",
};

const urls = {
  local,
  dev,
  prod,
};

export const environment = urls["prod"];
