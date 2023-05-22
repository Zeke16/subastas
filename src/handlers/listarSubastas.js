import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);

const listarSubastas = async (event, context) => {
  try {
    let subastas;

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    const results = await dynamo.send(
      new ScanCommand({
        TableName: "SubastasTable",
      })
    );

    subastas = results.Items;

    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(subastas),
    };

    return response;
  } catch (error) {
    console.log(error.message);
    throw new createError.InternalServerError(error);
  }
};

export const handler = commonMiddleware(listarSubastas);
