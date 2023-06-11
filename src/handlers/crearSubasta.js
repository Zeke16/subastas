import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);

const crearSubasta = async (event, context) => {
  try {
    const subasta = event.body;
    const now = new Date();
    const fechaFin = new Date();
    fechaFin.setHours(now.getHours() + 1);

    const newSubasta = {
      ...subasta,
      estado: "ABIERTA",
      fechaInicio: now.toISOString(),
      fechaFin: fechaFin.toISOString(),
      id: uuid(),
      ofertaMayor: {
        cantidad: 0,
      },
    };

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(newSubasta),
    };

    await dynamo.send(
      new PutCommand({
        TableName: "SubastasTable",
        Item: newSubasta,
      })
    );

    return response;
  } catch (error) {
    console.log(error.message);
    throw new createError.InternalServerError(error);
  }
};

export const handler = commonMiddleware(crearSubasta);
