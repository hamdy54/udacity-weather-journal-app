/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString(); // to get a better date format than it was written

// URL to retrieve weather info from api and the default country is USA
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
// personal api key and adding to it "&units=metric" to get the tempreture in celsius unit
const apiKey = ",&appid=43fec62a8d6f0c1e4dd2c266d79261f0&units=metric";

// server link to post data
const server = "http://localhost:5500";

/* Functions */
const generateData = () => {
  // value that the user types into the input and textarea
  const zip = document.querySelector("#zip").value,
    feeling = document.querySelector("#feelings").value;

  // weatherData return promise
  weatherData(zip).then((data) => {
    if (data) {
      const {
        main: { temp },
        name: city,
        weather: [{ description, icon }],
      } = data;
      const info = {
        newDate,
        temp: Math.round(temp),
        city,
        description,
        feeling,
        icon,
      };
      postData(`${server}/add`, info);
      // calling updateUI function
      updateUI();
    }
  });
};
// to get weather data from api
const weatherData = async (zip) => {
  try {
    const res = await fetch(`${baseURL}${zip}${apiKey}`);
    const data = await res.json();
    if (data.cod != 200) {
      alert(data.message);
    }
    return data;
  } catch (error) {
    console.log(`error: ${error}`);
  }
};

// postData function
const postData = async (url = "", info = {}) => {
  const res = await fetch(url, {
    method: "POST",
    // credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info), // body data type must match "Content-Type" header
  });

  try {
    const newData = await res.json();
    console.log("New Data: ", newData);
    return newData;
  } catch (error) {
    console.log(`error: ${error}`);
  }
};

// function to get project data and update UI using this data
const updateUI = async () => {
  // const res = await fetch(server + "/all");
  const res = await fetch(`${server}/all`);
  try {
    const finalData = await res.json();
    document.querySelector("#date").innerHTML = finalData.newDate;
    document.querySelector("#temp").innerHTML = `<img src="https://openweathermap.org/img/w/${finalData.icon}.png" alt"" /> ${finalData.temp}&deg;C`;
    document.querySelector("#city").innerHTML = finalData.city;
    document.querySelector("#desc").innerHTML = finalData.description;
    document.querySelector("#content").innerHTML = finalData.feeling;
  } catch (error) {
    console.log(`error: ${error}`);
  }
};

/* Event Listener */
// event listener to execute the generateData function when user click on the button
document.querySelector("#generate").addEventListener("click", generateData);
