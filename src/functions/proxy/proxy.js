const axios = require('axios')

const baseUrl = process.env.BASE_URL
const apiKey = process.env.API_KEY
const adminId = process.env.ADMIN_ID

exports.handler = async function (event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
    }
  }

  if(!event.body) {
    return getError('Invalid body')
  }

  const data = JSON.parse(event.body)

  if(!data) {
    return getError('Invalid body')
  }

  if(!data.method) {
    return getError('Missing method')
  }

  if(!data.path) {
    return getError('Missing path')
  }

  if(data.data.admin_id) {
    data.data.admin_id = adminId
  }

  if(!data.headers) {
    data.headers = {
      "X-Api-Key": apiKey,
    }
  }

  try {
    const response = await axios({
      method: data.method,
      url: baseUrl + data.path,
      data: data.data,
      headers: data.headers,
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        error: false,
        status: response.status,
        data: response.data,
      }),
    }
  } catch (err) {
    return getError(err)
  }
}

const getError = (err) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: false,
      error: true,
      message: err,
    })
  }
}