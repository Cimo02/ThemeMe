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

const createRandomColor = () => {
  // within okay looking color boundaries
  const R = Math.trunc(Math.random() * 175) + 25;
  const G = Math.trunc(Math.random() * 175) + 25;
  const B = Math.trunc(Math.random() * 175) + 25;

  const colorString = `rgb(${R}, ${G}, ${B})`;
  return colorString;
};

const createTwoTone = () => {
  const ROne = Math.trunc(Math.random() * 255);
  const GOne = Math.trunc(Math.random() * 255);
  const BOne = Math.trunc(Math.random() * 255);

  const colorOneString = `rgb(${ROne}, ${GOne}, ${BOne})`;
  const colorTwoString = `rgb(${ROne + 20}, ${GOne + 20}, ${BOne + 20})`;

  const RTwo = Math.trunc(Math.random() * 255);
  const GTwo = Math.trunc(Math.random() * 255);
  const BTwo = Math.trunc(Math.random() * 255);

  const colorThreeString = `rgb(${RTwo}, ${GTwo}, ${BTwo})`;
  const colorFourString = `rgb(${RTwo + 20}, ${GTwo + 20}, ${BTwo + 20})`;
  const colorFiveString = `rgb(${RTwo + 40}, ${GTwo + 40}, ${BTwo + 40})`;

  const theme = {
    colorOne: colorOneString,
    colorTwo: colorTwoString,
    colorThree: colorThreeString,
    colorFour: colorFourString,
    colorFive: colorFiveString,
  };
  return theme;
};

const createSingleColor = () => {
  const R = Math.trunc(Math.random() * 255);
  const G = Math.trunc(Math.random() * 255);
  const B = Math.trunc(Math.random() * 255);

  const colorOneString = `rgb(${R - 60}, ${G - 60}, ${B - 60})`;
  const colorTwoString = `rgb(${R - 30}, ${G - 30}, ${B - 30})`;
  const colorThreeString = `rgb(${R}, ${G}, ${B})`;
  const colorFourString = `rgb(${R + 30}, ${G + 30}, ${B + 30})`;
  const colorFiveString = `rgb(${R + 60}, ${G + 60}, ${B + 60})`;

  const theme = {
    colorOne: colorOneString,
    colorTwo: colorTwoString,
    colorThree: colorThreeString,
    colorFour: colorFourString,
    colorFive: colorFiveString,
  };
  return theme;
};

const getSavedThemeMeta = (request, response, query) => {
  let queryStrings;

  if (query != null) {
    queryStrings = query.split('=');
  }

  // setup error handling for key not found
  if (!themes[queryStrings[1]]) {
    // return a 404
    return respondJSONHead(request, response, 404);
  }

  return respondJSONHead(request, response, 200);
};

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
  } else {
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

// create a new random theme
const getNewTheme = (request, response, query) => {
  let baseColor;
  let type;
  const typeIndex = 1;
  const baseColorIndex = 1;

  if (query != null) {
    const queryStrings = query.split('&');
    type = queryStrings[0].split('=')[typeIndex];
    baseColor = queryStrings[1].split('=')[baseColorIndex];
  }

  let theme = {
    colorOne: '',
    colorTwo: '',
    colorThree: '',
    colorFour: '',
    colorFive: '',
  };

  let colorOne = createRandomColor();
  if (baseColor !== '') { colorOne = baseColor; }

  switch (type) {
    case 'fiveColor': // five random colors
      theme = {
        colorOne,
        colorTwo: createRandomColor(),
        colorThree: createRandomColor(),
        colorFour: createRandomColor(),
        colorFive: createRandomColor(),
      };
      break;
    case 'twoTone': // two random colors
      theme = createTwoTone();
      break;
    case 'singleColor':
      theme = createSingleColor();
      break;
    default:
      theme = createTwoTone();
      break;
  }

  const responseJSON = {
    message: 'Success',
    theme,
  };
  // get most popular color here
  // switch statement to check type and assign colors

  return respondJSON(request, response, 200, responseJSON);
};

const getNewThemeMeta = (request, response, query) => {
  let url;
  const urlIndex = 1;

  if (query != null) {
    const queryStrings = query.split('&');
    url = queryStrings[1].split('=')[urlIndex];
  }

  if (!url) {
    return respondJSON(request, response, 400);
  }

  return respondJSON(request, response, 200);
};

const getThemesMeta = (request, response) => {
  if (themes.length < 1) { // if there are no saved themes return with a 404
    return respondJSON(request, response, 404);
  }

  return respondJSON(request, response, 200);
};

const getThemes = (request, response) => {
  if (themes.length < 1) { // if there are no saved themes return with a 404
    const responseJSON = {
      message: 'The resource you are looking for was not found.',
      id: 'notFound',
    };

    return respondJSON(request, response, 404, responseJSON);
  }

  const responseJSON = {
    themes,
    message: 'Success',
  };

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
  getNewTheme,
  getNewThemeMeta,
};
