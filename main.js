
//  || TOGGLE HAMBURGER BAR
const hamburger = document.querySelector('.hamburger');
const slidebar = document.querySelector('.slidebar');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    slidebar.classList.toggle('active');
})

// || copyrights
const copyright = document.getElementById('copyright');


// || MAIN WEATHER FUNCTIONALITY

// Navigation
const city = document.getElementById('city');
const country = document.getElementById('country');
const searchCity = document.getElementById('search');

// box-1
const cityTemp = document.getElementById('temp');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('description');
const weatherPressure = document.getElementById('pressure');
const weatherVisibilty = document.getElementById('visibility');
const weatherHumidity = document.getElementById('humidity');

// box-2
const sunriseTime = document.getElementById('sunrise-time');
const sunsetTime = document.getElementById('sunset-time');
const uviRays = document.getElementById('uvi-rays');
const uviConcernLevel = document.querySelector('.uvi-level');
const uviConcernLevel2 = document.querySelector('.uvi-level2');

// Hours report
const completeDay = document.querySelector('.today-at')

// Days temperature
const daysIcon = document.querySelectorAll('.days-icon');
const nextDay = document.querySelectorAll('.prediction-day');
const predictionDesc = document.querySelectorAll('.prediction-desc');
const daysTemp = document.querySelectorAll('.days-temp');
const futurePrediction = document.querySelector('.weather-prediction')

// Time and dates 
const currentTime = document.querySelector('.time');
const currentDate = document.querySelector('.date')
const aqi = document.querySelector('.aqi');

// || GLOBAL constIABLES
let weatherApi;
let responseData;
const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// || FUNCTION FOR GET WEATHER REPORT
async function weatherReport(searchCity) {

    weatherApi = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=da2103b2c4ce4f95af051626232503&q=${searchCity}&days=7&aqi=yes&alerts=no`);
    responseData = await weatherApi.json();
    todayWeatherReport();

    // Hours
    hoursWeatherReport();
    // Days
    forecastdayReport();
}


// || By default city


function getUserCurrentLocation() {
    let userCoords = {};

    navigator.geolocation.getCurrentPosition(function (coord) {
        userCoords.latitude = coord.coords.latitude
        userCoords.longitude = coord.coords.longitude

    })

    return userCoords

}

async function getLocation() {


    const coords = getUserCurrentLocation()

    const location = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`)

    const userLocation = await location.json()

    if (userLocation) {
        weatherReport(userLocation.city);

    }
    else {
        weatherReport("Delhi");

    }


}

getLocation();

function todayWeatherReport() {
    city.innerHTML = responseData.location.name;
    country.innerHTML = ' <i class="fa-sharp fa-solid fa-location-dot"></i>' + responseData.location.country;

    // Box-1
    cityTemp.innerHTML = responseData.current.temp_c;
    weatherDescription.innerHTML = responseData.current.condition.text;
    weatherIcon.setAttribute('src', responseData.current.condition.icon);
    weatherPressure.innerHTML = responseData.current.pressure_mb + 'mb'
    weatherVisibilty.innerHTML = responseData.current.vis_km + ' km'
    weatherHumidity.innerHTML = responseData.current.humidity + '%'

    // Box-2
    sunriseTime.innerHTML = responseData.forecast.forecastday[0].astro.sunrise;
    sunsetTime.innerHTML = responseData.forecast.forecastday[0].astro.sunset;
    uviRays.innerHTML = responseData.current.uv + ' UVI';
    aqi.innerHTML = Math.round(responseData.current.air_quality.pm2_5)

    checkUVraysIndex();
    time()
}


// // || Functions for do some task
function checkUVraysIndex() {

    let uviLevel = Number.parseInt(uviRays.textContent);
    if (uviLevel <= 2) {
        checkUviValue('Good', '#6ae17c');
    }
    else if (uviLevel <= 5) {
        checkUviValue('Moderate', '#CCE16A');
    }
    else if (uviLevel <= 7) {
        checkUviValue('Hight', '#d4b814');
    }
    else if (uviLevel <= 10) {
        checkUviValue('Very hight', '#d43114');
    }
    else {
        checkUviValue('Etreme hight', '#dc15cf');
    }

}

function checkUviValue(level, color) {

    uviConcernLevel.innerHTML = level;
    uviConcernLevel.style.backgroundColor = color;
    uviConcernLevel2.innerHTML = level;

}


// // || Hourse 
function hoursWeatherReport() {


    let html='';
    responseData.forecast.forecastday[0].hour.forEach(function (hour, index) {

    let day = hour.condition.icon.includes('day')

        let time = hour.time.split(' ')[1]

        html += `<div class="hours-box">
          <p class="hours">${time} ${day?'PM' : 'AM'}</p>
           <img class="hourly-icon" src=${hour.condition.icon} alt="icon">
          <p class="hours-temp">${hour.temp_c} °c</p>
          </div>`
        
    })

    completeDay.innerHTML = html;
}

// // Days
function forecastdayReport() {


    let markup='';
    responseData.forecast.forecastday.forEach((data, index) => {

        let weekdate = new Date(responseData.forecast.forecastday[index].date).getDate();
        let weekday = weekDays[new Date(responseData.forecast.forecastday[index].date).getDay()];


        markup += `<div class="days-box">
        <div>
            <img class="days-icon" src=${data.day.condition.icon} alt="">
            <div class="days">
                 <div class="prediction-day">${weekday} ${weekdate}</div>
                <div class="prediction-desc">${data.day.condition.text}</div>

            </div>
        </div>

        <div class="days-temp">${Math.round(data.day.maxtemp_c) + '°c'} <span>/</span> ${Math.round(data.day.mintemp_c) + '°c'} </div>
    </div>
    `
    })

    futurePrediction.innerHTML = markup;

}

function time() {
    const timezone = responseData.location.tz_id;;
    const now = new Date().toLocaleTimeString('en-US', { timeZone: timezone });
    currentTime.innerHTML = now;

    const today = new Date(responseData.forecast.forecastday[0].date);
    currentDate.innerHTML = `${today.getDate()} ${monthName[today.getMonth()]} ${today.getFullYear()}, ${weekDays[today.getDay()]}`

}

setInterval(() => {
    time();
}, 1000)



document.querySelector('#search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    weatherReport(searchCity.value)

})


