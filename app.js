// background coloring based on time
var d = new Date();
var n = d.getHours();
if (n >= 19 || n < 6)
  // If time is after 7PM or before 6AM, apply night theme to ‘body’
  document.body.className = "night";

else if (n > 6 && n < 10)
  // If time is between 4PM – 7PM sunset theme to ‘body’
  document.body.className = "morning";
else if (n >= 10 && n < 13)
  // If time is between 4PM – 7PM sunset theme to ‘body’
  document.body.className = "midday";
else if (n >= 16 && n < 19)
  // If time is between 4PM – 7PM sunset theme to ‘body’
  document.body.className = "sunset";
else
  // Else use ‘day’ theme
  document.body.className = "day";


// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const desc2Element = document.querySelector(".temperature-description h2");

const locationElement = document.querySelector(".location p");
const humidityElement = document.querySelector(".humid");
const windspeedElement = document.querySelector(".speed");
const pressureElement = document.querySelector(".pressure");
const todayElement = document.querySelector(".date");
let latitude;
let longitude;
const notificationElement = document.querySelector(".notification");
const quoteElement = document.querySelector(".quote p");

const weatherForecastEl = document.getElementById('weather-forecast');
const weatherhourForecast = document.getElementById('hour-forecast');

// API KEY
const key = "07df77bac76b4abb6e1890d9fd77ee0c";
const today = new Date();
const monthL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const days =['Sunday','Monday',"Tuesday", 'Wednesday','Thursday','Friday','Saturay'];

// Function to get coordinates by IP address
function getCoordinatesByIP(ip) {
    return fetch(`https://ipapi.co/${ip}/latlong/`)
      .then(function(response) {
        return response.text();
      })
      .then(function(data) {
        const [latitude, longitude] = data.split(",");
        console.log("Latitude: " + latitude);
        console.log("Longitude: " + longitude);
        return { latitude, longitude };
      })
      .catch(function(error) {
        console.log(error);
        return null;
      });
  }
  // Function to get IP address using ipapi
function getIPAddress() {
    return fetch('https://ipapi.co/json/')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
      console.log(data.ip);
  
        return data.ip;
      })
      .catch(function(error) {
        console.log(error);
        return null;
      });
  }


    getIPAddress()
      .then(function(ip) {
        if (ip) {
          return getCoordinatesByIP(ip);
        } else {
          showError({ message: "Unable to retrieve IP address" });
          return null;
        }
      })
      .then(function(coordinates) {
        if (coordinates) {
          setPosition(coordinates);
        }
      })
      .catch(function(error) {
        showError(error);
      });
  
 
  

// SET USER'S POSITION
function setPosition(position) {
  latitude = position.latitude;
  longitude = position.longitude;
  console.log("Latitude: " + latitude);
  console.log("Longitude: " + longitude);

  //sports,motivational
  let topic = "motivational";
  getCurrentWeather(latitude, longitude);
  getWeatherForecastData(latitude, longitude);
  getQuote(topic);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

function getQuote(topic) {
  let api = `https://api.quotable.io/random?tags=${topic}`

    fetch(api)
        .then(function(response){
            let data = response.json();
            quoteElement.innerHTML  = data.content;
            return data;
        })
}


function getCurrentWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            console.log(data)
            return data;
        })
        .then(function(data){
            tempElement.innerHTML = `${Math.floor(data.main.temp - 273)}°C`;
            descElement.innerHTML = data.weather[0].description;
            desc2Element.innerHTML = `A Van Gogh painting, showing a sky with ${data.weather[0].description} and green pastures.`;
            locationElement.innerHTML = `${data.name}`;
            humidityElement.innerHTML = `${data.main.humidity} %`;
            windspeedElement.innerHTML  = `${Math.floor(data.wind.speed*1.6)} km/h`;
            pressureElement.innerHTML  = `${data.main.pressure} hPa`;

            document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("pictures/${data.weather[0].icon.slice(0,2)}.png")`;
            document.body.style.backgroundRepeat = 'repeat';
            document.body.style.backgroundSize = '2120px';
            document.body.style.backgroundPositionX = 'center';
            document.getElementById("picture").src = `pictures/${data.weather[0].icon.slice(0,2)}.png`;

        });
}


function getQuote(topic){
    let api = `https://api.quotable.io/random?tags=${topic}`

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            quoteElement.innerHTML  = data.content;
        });
}


function getWeatherForecastData (latitude,longitude) {
    
    let api =`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&appid=${key}`
        
    fetch(api)
        .then(function(response){
            let data = response.json();
            console.log(data)
            return data;
        })
        .then(function(data){

            let otherDayForcast = ''
            let otherHourForecast=''

            todayElement.innerHTML  = ` ${monthS[today.getMonth()]}, ${today.getDate()}`;

            for (let step = 1; step < 9; step++) {

                otherHourForecast +=  
                `<div class="hour-forecast-item">
                    <div class="time">${new Date(data.hourly[step].dt*1000).getHours()}.00</div>
                    <img src="http://openweathermap.org/img/wn/${data.hourly[step].weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                    <div class="temp">${Math.floor(data.hourly[step].temp)}&#176;C</div>
                </div>`
            }
            //rain probability
//            pressureElement.innerHTML  = `Pressure: ${data.main.pressure} hPa`;


            data.daily.forEach((day, idx) => {

                if(idx !== 0){
                    today.setDate(today.getDate() + idx)
                    let futureDateString = today.toDateString()
                    let firstThreeLetters = futureDateString.slice(0, 3)

                    otherDayForcast += 
                    `<div class="weather-forecast-item">
                        <div class="dayday">${firstThreeLetters}</div>    
                        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                        <div class="temp1">${Math.floor(day.temp.max)}</div>  
                        <div class="divide">/</div>  
                        <div class="temp2">${Math.floor(day.temp.min)}&#176;</div>
                        <div class="description">${day.weather[0].description}</div>   
                    </div>`                    
                    today.setDate(today.getDate() - idx)

                }

            })

        weatherForecastEl.innerHTML = otherDayForcast;
        weatherhourForecast.innerHTML= otherHourForecast; 

        });
    }


