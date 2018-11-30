import _ from "lodash";

export default function withErrorHandling(
  handler: (
    event: AWSLambda.APIGatewayProxyEvent
  ) => Promise<{
    readonly statusCode: number;
    readonly body?: string;
  }>
) {
  return async (event: AWSLambda.APIGatewayEvent) => {
    try {
      return await handler(event);
    } catch (error) {
      return createErrorResponse(error);
    }
  };
}

function createErrorResponse(error: any) {
  const messageStatusCodeMatch = (error.message || "").match(/^\[(\d\d\d)\]\s/);
  const messageStatusCodeStr = messageStatusCodeMatch
    ? messageStatusCodeMatch[1]
    : null;
  const possibleStatusCode = parsePossibleStatusCode(
    error.statusCode,
    error.status,
    messageStatusCodeStr
  );
  const statusCode = possibleStatusCode || 500;
  const message =
    `${statusCode}` === messageStatusCodeStr
      ? error.message
      : `[${statusCode}] ${error.message || "Unknown error"}`;
  return { statusCode, body: JSON.stringify({ error: message }) };
}

function parsePossibleStatusCode(...values: any[]): number | null {
  const value = _.find(values, value => !!value);
  if (!value) {
    return null;
  }
  if (_.isFinite(value)) {
    return value;
  }
  if (/^\d+$/.test(value)) {
    const statusCode = Number(value);
    return statusCode >= 100 && statusCode < 600 ? statusCode : null;
  }
  return null;
}
