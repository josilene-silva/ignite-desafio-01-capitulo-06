import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";
import { v4 as uuidv4 } from "uuid";

interface ICreateTodo {
    title: string,
    deadline: Date
}

export const handle: APIGatewayProxyHandler = async (event) => {
    const { userid } = event.pathParameters;
    const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

    const id = uuidv4();

    await document.put({
        TableName: "todos",
        Item: {
            id,
            user_id: userid,
            title,
            done: false,
            deadline: new Date(deadline)
        }
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Todo created!",
        }),
        headers: {
            "Content-Type": "application/json",
        },
    };
}