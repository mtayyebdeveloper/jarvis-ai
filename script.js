window.onload = function () {
  let age_calculator = document.querySelector(".age-calculator");
  let agebtn = document.getElementById("agebtn");
  let age = document.getElementById("age");
  let inputdob = document.getElementById("dob");
  let startvioce = document.querySelectorAll(".startvoice");
  let endvoice = document.querySelectorAll(".endvoice");
  let speechbox = document.getElementById("speechbox");
  let commandlist = document.getElementById("commandlist");

  let news_list = document.getElementById("news-list");
  let news_country = document.getElementById("country");
  let news_catagory = document.getElementById("catagory");
  let all_news_list = document.getElementById("news");
  let news_search_btn = document.getElementById("searchbtn");

  let all_weather_list = document.getElementById("weather-list");
  let weather_list = document
    .getElementById("weather-list")
    .querySelectorAll("*");

  // calling whatsapp api......................
  // async function searchwhatsapp(number) {
  //   const url = `https://whatsapp-data1.p.rapidapi.com/number/${number}`;
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       "X-RapidAPI-Key": "a8a828df03msh863899cf1ba614ap137aafjsn90a5d1a8c059",
  //       "X-RapidAPI-Host": "whatsapp-data1.p.rapidapi.com",
  //     },
  //   };

  //   try {
  //     const response = await fetch(url, options);
  //     const result = await response.json();
  //     console.log(result);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  // searchwhatsapp("923193555605");

  // calling news api.......................
  async function newapi(country, catagory) {
    let allNews = "";
    let response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${catagory}&apiKey=553cf41bf1614e7eb0b2c0f36e740540`
    );
    let data = await response.json();
    data.articles.map((item, index) => {
      console.log(item);
      item.content=JSON.stringify(item.content).replace('"',"")
      return (allNews += `
      <div class="card" key=${index}>
        <img src="${item.urlToImage==null?"https://cdn.pixabay.com/photo/2018/05/31/15/06/see-no-evil-3444212_1280.jpg":item.urlToImage}" alt="img" />
          <div class="body">
            <div class="title">${item.title.length > 50 ? item.title.slice(0, 50) + "..." : item.title}</div>
            <div class="content">${item.content.length>100?item.content.slice(0,100)+"...":item.content}</div>
            <div class="url"><a href="${item.url}" target="_blank">Read More</a></div>
            <div class="footer">
            <div class="time">${item.publishedAt}</div>
            <div class="auther">${item.author}</div>
        </div>
      </div>
    </div>`);
    });
    all_news_list.innerHTML = allNews;
  }

  news_search_btn.addEventListener("click", () => {
    if (news_country.value != "" && news_catagory.value != "") {
      newapi(news_country.value, news_catagory.value);
    } else {
      alert("please select country and catagory in news list");
    }
  });

  // calling weather api.......................
  async function searchWeather(city) {
    let url = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "a8a828df03msh863899cf1ba614ap137aafjsn90a5d1a8c059",
        "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
      },
    };
    let response = await fetch(url, options);
    let weatherdata = await response.json();
    weather_list[0].textContent = `Cloud PCT: ${weatherdata.cloud_pct}`;
    weather_list[1].textContent = `Feels Like: ${weatherdata.feels_like}`;
    weather_list[2].textContent = `Humidity: ${weatherdata.humidity}`;
    weather_list[3].textContent = `Max Temp: ${weatherdata.max_temp}`;
    weather_list[4].textContent = `Min Temp: ${weatherdata.min_temp}`;
    weather_list[5].textContent = `Sunrise: ${weatherdata.sunrise}`;
    weather_list[6].textContent = `Sunset: ${weatherdata.sunset}`;
    weather_list[7].textContent = `Temprature: ${weatherdata.temp}`;
    weather_list[8].textContent = `Wind Degrees: ${weatherdata.wind_degrees}`;
    weather_list[9].textContent = `Wind Speed: ${weatherdata.wind_speed}`;
  }

  // voice recognition setup.............
  let speechrecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = new speechrecognition();

  recognition.onstart = function () {
    console.log("sr start...");
    recognition.continues = true;
    startvioce.forEach((elements) => {
      elements.classList.add("startvoices");
    });
  };

  recognition.onend = function () {
    console.log("sr end...");
    startvioce.forEach((elements) => {
      elements.classList.remove("startvoices");
    });
  };

  recognition.continues = true;
  startvioce.forEach((elements) => {
    elements.addEventListener("click", () => {
      recognition.start();
    });
  });

  endvoice.forEach((elements) => {
    elements.addEventListener("click", () => {
      recognition.stop();
    });
  });

  //voice regnition results..........
  recognition.onresult = function (event) {
    console.log(event.results[0][0].transcript);
    let transcript = event.results[0][0].transcript;
    transcript = transcript.toLowerCase();
    listusermassage(transcript);

    if (transcript.includes("hello") || transcript.includes("hi")) {
      speechvoice("Hello sir. How can i help you.");
    } else if (
      transcript.includes("open youtube") ||
      transcript.includes("open youtub")
    ) {
      speechvoice("opening youtube sir");
      window.open("https://www.youtube.com");
    } else if (transcript.includes("your name")) {
      speechvoice("My name is Siri");
    } else if (transcript.includes("thanks") || transcript.includes("nice")) {
      speechvoice("You welcome sir.");
    } else if (transcript.includes("i am fine")) {
      speechvoice("Ok sir. How can i help you.");
    } else if (transcript.includes("you from")) {
      speechvoice("I am from swabi.");
    } else if (transcript.includes("open whatsapp")) {
    } else if (
      transcript.includes("open news") ||
      transcript.includes("open news list")
    ) {
      speechvoice("opening news sir");
      news_list.style.display = "flex";
    } else if (transcript.includes("open whatsapp")) {
    } else if (
      transcript.includes("close news") ||
      transcript.includes("close news list")
    ) {
      speechvoice("Closing news sir");
      news_list.style.display = "none";
    } else if (transcript.includes("open whatsapp")) {
      speechvoice("opening whatsapp sir");
      window.open("https://web.whatsapp.com/");
    } else if (
      transcript.includes("my age") ||
      transcript.includes("open age calculator")
    ) {
      speechvoice("Opening Age Calculator sir.");
      age_calculator.style.display = "flex";
      agebtn.addEventListener("click", () => {
        let dob = inputdob.value;
        let today = new Date();
        let mydob = new Date(dob);
        let years;
        let months;
        let dates;
        years = today.getFullYear() - mydob.getFullYear();
        months = today.getMonth() - mydob.getMonth();
        if (months < 0) {
          years -= 1;
          months = JSON.stringify(months);
          months = months.replace("-", "");
          months = JSON.parse(months);
          months = 12 - months;
        }
        dates = today.getDate() - mydob.getDate();
        if (dates < 0) {
          months -= 1;
          dates = JSON.stringify(dates);
          dates = dates.replace("-", "");
          dates = JSON.parse(dates);
          dates = 30 - dates;
        }
        let fullage = `Your age is ${years} Years ${months} Months ${dates} Days`;
        age.textContent = fullage;
        speechvoice(fullage);
        if (months == 0 && dates == 0) {
          speechvoice("Happy birthday to you. sir");
        }
      });
    } else if (transcript.includes("close age calculator")) {
      speechvoice("Closing Age Calculator sir.");
      age_calculator.style.display = "none";
    } else if (transcript.includes("old are you")) {
      speechvoice("I created in 30 May in 2024.");
    } else if (transcript.includes("open instagram")) {
      speechvoice("opening Instagram sir.");
      let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        let url =
          "intent://instagram.com/#Intent;scheme=https;package=com.instagram.android;end";
        window.location.replace(url);
      } else {
        window.location.replace("https://www.instagram.com");
      }
    } else if (transcript.includes("open facebook")) {
      speechvoice("opening Facebook sir.");
      window.open("https://www.facebook.com");
    } else if (transcript.includes("developer name")) {
      speechvoice("I have been made by Muhammad Tayyeb.");
    } else if (transcript.includes("muhammad tayyab")) {
      speechvoice("Muhammad Tayyeb is web developer.");
    } else if (transcript.includes("how are you")) {
      speechvoice("I am fine sir. how are you too.");
    } else if (transcript.includes("stop")) {
      speechvoice("ok sir.");
      recognition.stop();
    } else if (transcript.includes("open commands")) {
      speechvoice("Opening commands.");
      commandlist.style.display = "flex";
    } else if (transcript.includes("close commands")) {
      speechvoice("Closing commands.");
      commandlist.style.display = "none";
    } else if (transcript.includes("search google")) {
      speechvoice("Searching please wait sir");
      let input = transcript;
      input = input.replace("search google", "").trim();
      input.split(" ").join("+");
      window.open(`https://www.google.com/search?q=${input}`);
    } else if (transcript.includes("search youtube")) {
      speechvoice("Searching please wait sir");
      let input = transcript;
      input = input.replace("search youtube", "").trim();
      input.split(" ").join("+");
      window.open(`https://www.youtube.com/results?search_query=${input}`);
    } else if (
      transcript.includes("search weather") &&
      transcript.includes("city")
    ) {
      speechvoice("Searching weather please wait.");
      let city = transcript;
      let fined_index = city.indexOf("city");
      city = city.slice(fined_index + 4);
      Weatherapi(city);
      async function Weatherapi(city) {
        const url = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city}`;
        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key":
              "a8a828df03msh863899cf1ba614ap137aafjsn90a5d1a8c059",
            "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
          },
        };
        let response = await fetch(url, options);
        let weatherdata = await response.json();
        speechvoice(`${city} temprature is ${weatherdata.temp}`);
      }
    } else if (
      transcript.includes("open weather list") &&
      transcript.includes("city")
    ) {
      speechvoice("opening weather list please wait.");
      let city = transcript;
      let fined_index = city.indexOf("city");
      city = city.slice(fined_index + 4);
      searchWeather(city);
      all_weather_list.style.display = "flex";
    } else if (transcript.includes("close weather list")) {
      speechvoice("Closing weather list.");
      all_weather_list.style.display = "none";
    } else {
      speechvoice("Sorry sir I don't understand your speech.");
    }
  };

  // speech recongnition setup.....
  function speechvoice(massage) {
    listjarvismassage(massage);
    let speech = window.speechSynthesis;
    let utternce = new SpeechSynthesisUtterance();
    utternce.rate = 1;
    utternce.text = massage;
    speech.speak(utternce);
  }

  function listjarvismassage(massage) {
    let li = document.createElement("li");
    li.classList.add("jarviselist");
    li.innerHTML = `Siri: ${massage}`;
    let divs = document.createElement("div");
    divs.classList.add("jarvisdivs");
    divs = divs.innerHTML = li;
    speechbox.appendChild(divs);
  }
  function listusermassage(massage) {
    let li = document.createElement("li");
    li.classList.add("userlist");
    li.innerHTML = `You: ${massage}`;
    let divs = document.createElement("div");
    divs.classList.add("userdivs");
    divs = divs.innerHTML = li;
    speechbox.appendChild(divs);
  }
};
