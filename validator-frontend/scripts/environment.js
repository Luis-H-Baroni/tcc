const dev = {
  BACKEND_URL: "http://localhost:3000",
  PROVIDER_URL: "https://rpc-amoy.polygon.technology/",
};

const prod = {
  BACKEND_URL: "http://localhost:3000",
  PROVIDER_URL: "https://rpc-mainnet.maticvigil.com/",
};

const urls = {
  dev,
  prod,
};

export const environment = urls["dev"];
