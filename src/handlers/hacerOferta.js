import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";
import { obtenerSubastaPorId } from "./obtenerSubasta";

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);

const hacerOferta = async (event, context) => {
  let subastaActualizada;
  let { id } = event.pathParameters;
  const { cantidad } = event.body;
  
  const subasta = await obtenerSubastaPorId(id);
  if(subasta.estado !== "ABIERTA"){
    throw new createError.Forbidden(
      `La subasta con id $ ${subasta.id} no esta abierta`
    );
  }

  if (cantidad <= subasta.ofertaMayor.cantidad) {
    throw new createError.Forbidden(
      `La oferta debe ser mayor a la oferta actual: $ ${subasta.ofertaMayor.cantidad}`
    );
  }

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const results = await dynamo.send(
      new UpdateCommand({
        TableName: "SubastasTable",
        Key: { id },
        UpdateExpression: "SET ofertaMayor.cantidad = :cantidad",
        ExpressionAttributeValues: {
          ":cantidad": cantidad,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    subastaActualizada = results.Attributes;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  const response = {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify(subastaActualizada),
  };

  return response;
};

export const handler = commonMiddleware(hacerOferta);
