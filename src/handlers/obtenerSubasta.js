import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);

export async function obtenerSubastaPorId(id) {
  let subasta;
  try {
    const results = await dynamo.send(
      new GetCommand({
        TableName: "SubastasTable",
        Key: { id },
      })
    );

    subasta = results.Item;
  } catch (error) {
    console.log(error.message);
    throw new createError.InternalServerError(error);
  }

  if (!subasta) {
    throw new createError.NotFound(`Registro con id ${id} no existe`);
  }

  return subasta;
}

const obtenerSubasta = async (event, context) => {
  const { id } = event.pathParameters;
  const subasta = await obtenerSubastaPorId(id);
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  const response = {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify(subasta),
  };

  return response;
};

export const handler = commonMiddleware(obtenerSubasta);
