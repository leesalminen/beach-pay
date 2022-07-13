const baseUrl = process.env.BASE_URL;

exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: baseUrl,
  }
}