import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);

export async function obtenerSubastasFinalizadas() {
  const now = new Date();
  const params = {
    TableName: "SubastasTable",
    IndexName: "estadoFechaFinIndex",
    KeyConditionExpression: "estado = :estado AND fechaFin <= :now",
    ExpressionAttributeValues: {
      ":estado": "ABIERTA",
      ":now": now.toISOString(),
    },
  };

  const results = await dynamo.send(new QueryCommand(params));
  return results.Items;
};
