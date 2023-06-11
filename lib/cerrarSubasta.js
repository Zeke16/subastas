import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);

export async function cerrarSubasta(subasta) {
  const params = {
    TableName: "SubastasTable",
    Key: {id: subasta.id},
    UpdateExpression: "SET estado = :estado",
    ExpressionAttributeValues: {
      ":estado": "CERRADA",
    },
  };

  const results = await dynamo.send(new UpdateCommand(params));
  return results;
};
