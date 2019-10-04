// clears when the server shuts down
const themes = {
  test: {
    keyword: 'test', colorOne: '#FFC000', colorTwo: '#FFA600', colorThree: '#FF8001', colorFour: '#FF5E03', colorFive: '#FF5004',
  },
};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONHead = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

/*
const getNewTheme = (request, response) => {

};

const getNewThemeMeta = (request, response) => {

};
*/

const getThemesMeta = (request, response) => {
  if (!themes) { // if there are no saved themes return with a 404
    return respondJSON(request, response, 404);
  }

  return respondJSON(request, response, 200);
};

const getThemes = (request, response) => {
  if (!themes) { // if there are no saved themes return with a 404
    const responseJSON = {
      message: 'The resource you are looking for was not found.',
      id: 'notFound',
    };

    return respondJSON(request, response, 404, respondJSON);
  }
  
  const respondJSON = {
    themes: themes,
    message: 'Success',
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getSavedThemeMeta = (request, response) => {
  let responseJSON;
  let queryStrings;

  console.log(query);
  if (query != null) {
   queryStrings = query.split('=');
  }

  // setup error handling for key not found
  if (!themes[queryStrings[1]]) {
    // return a 404 
    return respondJSONHead(request, response, 404);
  }

  return respondJSONHead(request, response, 200);
}

const getSavedTheme = (request, response, query) => {
  let responseJSON;
  let queryStrings;

  if (query != null) {
    queryStrings = query.split('=');
  }

  // setup error handling for key not found
  if (themes[queryStrings[1]]) {
    responseJSON = {
      message: 'Success',
      theme: themes[queryStrings[1]],
    };
  } 
  else {
    // create error message for response if theme wasn't found
    responseJSON = {
      message: 'The resource you are looking for was not found.',
      id: 'notFound',
    };

    // return a 404 with an error message
    return respondJSON(request, response, 404, responseJSON);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const addTheme = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: 'A keyword is required.',
  };

  // check for missing params
  if (!body.keyword || !body.colorOne || !body.colorTwo
    || !body.colorThree || !body.colorFour || !body.colorFive) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (themes[body.keyword]) {
    responseCode = 204;
  } else {
    // otherwise create an object with that name
    themes[body.keyword] = {};
  }

  // add or update fields for this user name
  themes[body.keyword].keyword = body.keyword;
  themes[body.keyword].colorOne = body.colorOne;
  themes[body.keyword].colorTwo = body.colorTwo;
  themes[body.keyword].colorThree = body.colorThree;
  themes[body.keyword].colorFour = body.colorFour;
  themes[body.keyword].colorFive = body.colorFive;

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Saved Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  // Response without content if the user already exists
  return respondJSONHead(request, response, responseCode);
};

const notReal = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The resource you are looking for was not found.',
    id: 'notFound',
  };

  // return a 404 with an error message
  return respondJSON(request, response, 404, responseJSON);
};

// function for 404 not found without message
const notRealMeta = (request, response) => {
  // return a 404 without an error message
  respondJSONHead(request, response, 404);
};

module.exports = {
  notReal,
  notRealMeta,
  getSavedTheme,
  getSavedThemeMeta,
  getThemes,
  getThemesMeta,
  addTheme,
};
