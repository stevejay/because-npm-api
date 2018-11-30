import clientWrapper from "dynamodb-doc-client-wrapper";

const config = process.env.IS_OFFLINE ? getDevOptions() : null;

function getDevOptions() {
  return {
    connection: {
      region: "localhost",
      endpoint: "http://localhost:4569"
    }
  };
}

export default clientWrapper(config);
