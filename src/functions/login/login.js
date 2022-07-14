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

  event.body = JSON.parse(event.body)

  const email = event.body.email
  const password = event.body.password

  if(!email) {
    return getError('Invalid email')
  }

  if(!password) {
    return getError('No password provided')
  }

  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + "/usermanager/api/v1/users",
      headers: {
        "X-Api-Key": apiKey,
      },
    })

    const user = response.data.find(el => el.email.toLowerCase().trim() === email.toLowerCase().trim() && el.password === password)

    if(!user) {
      throw "Username or password incorrect"
    }

    delete user.password

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        error: false,
        data: user,
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