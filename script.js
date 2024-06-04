window.onload = function () {
  let age_calculator = document.querySelector(".age-calculator");
  let agebtn = document.getElementById("agebtn");
  let mytime = document.querySelectorAll(".time");
  let online = document.querySelectorAll(".online");
  let mybattry = document.querySelectorAll(".battry");
  let age = document.getElementById("age");
  let inputdob = document.getElementById("dob");
  let startvioce = document.querySelectorAll(".startvoice");
  let startvioceimg = document.querySelectorAll(".startvoiceimg");
  let endvoice = document.querySelectorAll(".endvoice");
  let speechbox = document.getElementById("speechbox");
  let consoleOutput = document.getElementById("consolelist");
  let commandlist = document.getElementById("commandlist");
  let music = document.getElementById("music");
  let news_list = document.getElementById("news-list");
  let news_country = document.getElementById("country");
  let news_catagory = document.getElementById("catagory");
  let all_news_list = document.getElementById("news");
  let news_search_btn = document.getElementById("searchbtn");
  let all_weather_list = document.getElementById("weather-list");
  let weather_list = document
    .getElementById("weather-list")
    .querySelectorAll("*");

  // time function....................
  mytime.forEach((time) => {
    setInterval(() => {
      time.innerHTML = `<i class="fa-solid fa-clock" style="margin-right: 5px;"></i> ${new Date().toLocaleTimeString()}`;
    }, 1000);
  })

  // battry function....................
  setInterval(() => {
    let battery = navigator.getBattery();
    battery.then((data) => {
      let level = Math.round(data.level * 100);
      mybattry.forEach((battry) => {
        if (level < 20) {
          battry.innerHTML = `<i class="fa-solid fa-battery-quarter" style="margin-right: 5px;"></i> ${level}%`;
        } else if (level < 50) {
          battry.innerHTML = `<i class="fa-solid fa-battery-half" style="margin-right: 5px;"></i> ${level}%`;
        } else if (level < 80) {
          battry.innerHTML = `<i class="fa-solid fa-battery-three-quarters" style="margin-right: 5px;"></i> ${level}%`;
        } else {
          battry.innerHTML = `<i class="fa-solid fa-battery-full" style="margin-right: 5px;"></i> ${level}%`;
        }
      })
    });
  }, 1000);

  // online function....................
  online.forEach((online) => {
    setInterval(() => {
      if (navigator.onLine) {
        online.innerHTML = `<i class="fa-solid fa-wifi" style="margin-right: 5px;"></i> Online`;
      } else {
        online.innerHTML = `<i class="fa-solid fa-wifi-slash" style="margin-right: 5px;"></i> Offline`;
      }
    }, 1000);
  })

  // calling console............................
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  // Function to append logs to the div
  function appendToConsoleOutput(type, args) {
    const message = args
      .map((arg) =>
        typeof arg === "object" ? JSON.stringify(arg) : String(arg)
      )
      .join(" ");
    const logItem = document.createElement("div");
    logItem.textContent = `[${type.toUpperCase()}] ${message}`;
    consoleOutput.appendChild(logItem);
  }

  // Override console.log
  console.log = function (...args) {
    appendToConsoleOutput("log", args);
    originalLog.apply(console, args);
  };

  // Override console.error
  console.error = function (...args) {
    appendToConsoleOutput("error", args);
    originalError.apply(console, args);
  };

  // Override console.warn
  console.warn = function (...args) {
    appendToConsoleOutput("warn", args);
    originalWarn.apply(console, args);
  };
  // Capture global errors
  window.onerror = function (message, source, lineno, colno, error) {
    appendToConsoleOutput("error", [
      message,
      "at",
      source,
      "line",
      lineno,
      "column",
      colno,
      "stack:",
      error.stack,
    ]);
  };

  // calling news api.......................
  async function newapi(country, catagory) {
    let allNews = "";
    let response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${catagory}&apiKey=553cf41bf1614e7eb0b2c0f36e740540`
    );
    let data = await response.json();
    console.log(data);
    data.articles.map((item, index) => {
      console.log(item);
      item.content = JSON.stringify(item.content).replace('"', "");
      return (allNews += `
      <div class="card" key=${index}>
        <img src="${
          item.urlToImage == null
            ? "https://cdn.pixabay.com/photo/2018/05/31/15/06/see-no-evil-3444212_1280.jpg"
            : item.urlToImage
        }" alt="img" />
          <div class="body">
            <div class="title">${
              item.title.length > 50
                ? item.title.slice(0, 50) + "..."
                : item.title
            }</div>
            <div class="content">${
              item.content.length > 100
                ? item.content.slice(0, 100) + "..."
                : item.content
            }</div>
            <div class="url"><a href="${
              item.url
            }" target="_blank">Read More</a></div>
            <div class="footer">
            <div class="time">${item.publishedAt}</div>
            <div class="auther">${item.author}</div>
        </div>
      </div>
    </div>`);
    });
    all_news_list.innerHTML = allNews;
  }

  // search news by country and catagory..................
  news_search_btn.addEventListener("click", () => {
    if (news_country.value != "" && news_catagory.value != "") {
      newapi(news_country.value, news_catagory.value);
    } else {
      speechvoice("please select country and catagory in news list");
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

  // search weather by only city name. singal weather data................
  async function Weatherapi(city) {
    const url = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "a8a828df03msh863899cf1ba614ap137aafjsn90a5d1a8c059",
        "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
      },
    };
    let response = await fetch(url, options);
    let weatherdata = await response.json();
    speechvoice(`${city} temprature is ${weatherdata.temp}`);
  }

  // age calculator..................
  function calculateAge() {
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
  }

  // calling music api....................
  // let musicstart = false;
  let musicplay = () => {
    // musicstart = false;
    music.play();
  };

  let musicstop = () => {
    // musicstart = true;
    music.pause();
  };

  let musicPlay = (btns) => {
    if (btns == "play") {
      musicplay();
    } else if (btns == "stop") {
      musicstop();
    }
  };

  let allsong = [
    {
      songnames:
        "audeos/geceler_song_dj.geceler_song_dj_remix.geceler_kapkara_günler_her_anim_original_song_dj_remix..(360p).mp3",
    },
    {
      songnames:
        "audeos/Khayala_Tovuzlu_-_Derdim_2020_(Darkness_at_night)(240p).mp3",
    },
    {
      songnames:
        "audeos/KHKOLI_KHKOLI_DA_SWABI__Pashto_HD_Film__BADMASHI_DA_KHYALA_KAWA_song__Arbaz_Khan_&_Jiya_Butt(128k).mp3",
    },
    {
      songnames: "audeos/dj music.mp3",
    },
    {
      songnames: "audeos/banjara.mp3",
    },
    {
      songnames: "audeos/dunya da gam.mp3",
    },
    {
      songnames: "audeos/bom degy bom.mp3",
    },
    {
      songnames: "audeos/dil ko karar.mp3",
    },
    {
      songnames: "audeos/Arbix remix.mp3",
    },
    {
      songnames: "audeos/chor dyaa.mp3",
    },
    {
      songnames: "audeos/February 22, 2023.mp3",
    },
    {
      songnames:
        "audeos/Free_Adventure_Background_Music_for_Travel_Vlog_YouTube_Videos_No_Copyright_Royalty_Free(128k).mp3",
    },
    {
      songnames:
        "audeos/Laung_Laachi_Title_Song_Mannat_Noor__Ammy_Virk,_Neeru_Bajwa,Amberdeep__Latest_Punjabi_Movie_2018(128k).mp3",
    },
    {
      songnames:
        "audeos/Main_Tera_Hero__Galat_Baat_Hai_Full_Video_Song__Varun_Dhawan,_Ileana_D'Cruz,_Nargis_Fakhri(128k).mp3",
    },
    {
      songnames:
        "audeos/Mere_Mehboob_Qayamat_Hogi__Sad_Songs__Heart_Touching_Love_Story__Aaj_Ruswa_Teri_Galiyon_Mein(128k).mp3",
    },
    {
      songnames:
        "audeos/Mujhko_Barsaat_Bana_Lo_Full_Song_(Audio)_Junooniyat__Pulkit_Samrat,_Yami_Gautam__T-Series(240p).mp3",
    },
    {
      songnames:
        "audeos/Nazia_Iqbal_&_Shahsawar_Pashto_Songs_2018__Pashto_music_1080p_music_video(128k).mp3",
    },
    {
      songnames:
        "audeos/Night_in_Dubai_❌_Arabic_❌_Remix_❌_Song_2021_❌_Bass_Bosted_(ALL_Music_MIX)(360p)_mp3.mp3",
    },
    {
      songnames: "audeos/No Love   Slowed+Reverb   AP Bass Boosted.mp3",
    },
    {
      songnames:
        "audeos/Pashto_HD_Film_Zandan_New_Song_-_CHARSYAN_by_Wisal(128k).mp3",
    },
    {
      songnames: "audeos/Pashto_saaz_(All_TV)(360p).mp3",
    },
    {
      songnames: "audeos/qarara rasha.mp3",
    },
    {
      songnames:
        "audeos/Saanson Ko (LYRICS) - Arijit Singh I  SubhamMix Lyrics.mp3",
    },
    {
      songnames: "audeos/Sanam_Teri_Kasam_+_Lirik(48k).mp3",
    },
    {
      songnames: "audeos/Randall_-_Wahran_(_remix_)(48k).mp3",
    },
    {
      songnames:
        "audeos/Pashto_songs_2020__Shah_Farooq_And_Nazia_Iqbal__Shrang_Warka_Bangro__song___پشتو_music(128k).mp3",
    },
    {
      songnames:
        "audeos/TERI_MERI_LYRICS___SHREYA_GHOSHAL,_RAHAT_FATEH_ALI_KHAN__SALMAN_K_,_KAREENA_K(240p)_mp3.mp3",
    },
    {
      songnames: "audeos/Yara_Taar_Aghe_Kali_Ta_Ma_Raza,,,(128k).mp3",
    },
    {
      songnames: "audeos/yelili_yelila_song(360p)_mp3.mp3",
    },
  ];

  let loadsong = (allsong) => {
    music.src = allsong.songnames;
  };

  songindex = 0;
  let nextsongbtn = () => {
    songindex = (songindex + 1) % allsong.length;
    loadsong(allsong[songindex]);
    musicplay("play");
  };

  let backsongbtn = () => {
    songindex = (songindex - 1 + allsong.length) % allsong.length;
    loadsong(allsong[songindex]);
    musicplay("play");
  };

  // voice recognition setup.............
  let speechrecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = new speechrecognition();
  
  recognition.onstart = function () {
    console.log("sr start...");
    // recognition.continuous = true;
    // speechvoice("Listening...");
    // startvioceimg.forEach((elements) => {
    //   elements.classList.add("startvoicesimg");
    // })
    startvioce.forEach((elements) => {
      elements.classList.add("startvoices");
    });
  };

  recognition.onend = function () {
    console.log("sr end...");
    // speechvoice("End...");
    // startvioceimg.forEach((elements) => {
    //   elements.classList.remove("startvoicesimg");
    // })
    startvioce.forEach((elements) => {
      elements.classList.remove("startvoices");
    });
  };

  startvioce.forEach((elements) => {
    elements.addEventListener("click", () => {
      recognition.start();
    });
  });
  startvioceimg.forEach((elements) => {
    elements.addEventListener("click", () => {
      recognition.start();
    });
  });

  endvoice.forEach((elements) => {
    elements.addEventListener("click", () => {
      recognition.stop();
    });
  });

  let all_tabs =[];

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
      let url = window.open("https://www.youtube.com");
      all_tabs.push(url);
    } else if (transcript.includes("your name")) {
      speechvoice("My name is Siri");
    } else if (transcript.includes("thanks") || transcript.includes("nice")) {
      speechvoice("You welcome sir.");
    } else if (transcript.includes("i am fine")) {
      speechvoice("Ok sir. How can i help you.");
    } else if (transcript.includes("you from")) {
      speechvoice("I am from swabi.");
    } else if (transcript.includes("open console")) {
      speechvoice("opening console sir.");
      consoleOutput.style.display = "flex";
      appendToConsoleOutput();
    } else if (transcript.includes("close console")) {
      speechvoice("closing console sir.");
      consoleOutput.style.display = "none";
      appendToConsoleOutput();
    } else if (
      transcript.includes("open news") ||
      transcript.includes("open news list")
    ) {
      speechvoice("opening news sir");
      news_list.style.display = "flex";
    } else if (
      transcript.includes("close news") ||
      transcript.includes("close news list")
    ) {
      speechvoice("Closing news sir");
      news_list.style.display = "none";
    } else if (transcript.includes("open whatsapp")) {
      speechvoice("opening whatsapp sir");
      let url = window.open("https://web.whatsapp.com/");
      all_tabs.push(url);
    } else if (
      transcript.includes("my age") ||
      transcript.includes("open age calculator")
    ) {
      speechvoice("Opening Age Calculator sir.");
      age_calculator.style.display = "flex";
      calculateAge();
    } else if (transcript.includes("close age calculator")) {
      speechvoice("Closing Age Calculator sir.");
      age_calculator.style.display = "none";
    } else if (transcript.includes("old are you")) {
      speechvoice("I created in 30 May in 2024.");
    } else if (
      transcript.includes("what is the time") ||
      transcript.includes("time")
    ) {
      speechvoice("It is " + mytime[1].textContent);
    } else if (
      transcript.includes("are you online") ||
      transcript.includes("are you there")
    ) {
      if (window.navigator.onLine) {
        speechvoice("Yes sir. How can i help you.");
      } else {
        speechvoice("No sir. I am offline.");
      }
    }
     else if (transcript.includes("open instagram")) {
      speechvoice("opening Instagram sir.");
      let url = window.open("https://www.instagram.com/");
      all_tabs.push(url);
    } else if (transcript.includes("open facebook")) {
      speechvoice("opening Facebook sir.");
      let url = window.open("https://www.facebook.com");
      all_tabs.push(url);
    } else if (transcript.includes("developer name")) {
      speechvoice("I have been made by Muhammad Tayyeb.");
    } else if (transcript.includes("muhammad tayyab")) {
      speechvoice("Muhammad Tayyeb is web developer.");
    } else if (transcript.includes("close all tabs")) {
      speechvoice("closing all tabs sir");
      console.log(all_tabs);
      all_tabs.forEach((tab) => {
        tab.close();
      })
    }
     else if (transcript.includes("play music")) {
      speechvoice("playing music sir");
      musicPlay("play");
    } else if (transcript.includes("stop music")) {
      speechvoice("stopping music sir");
      musicPlay("stop");
    } else if (transcript.includes("next music")) {
      speechvoice("playing next music sir");
      nextsongbtn();
    } else if (transcript.includes("previous music")) {
      speechvoice("playing previous music sir");
      backsongbtn();
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
      let url = window.open(`https://www.google.com/search?q=${input}`);
      all_tabs.push(url);
    } else if (transcript.includes("search bing")|| transcript.includes("search being")) {
      speechvoice("Searching please wait sir");
      let input = transcript;
      if(input.includes("search bing"){
        input = input.replace("search bing", "").trim();
      }else if(input.includes("search being"){
        input = input.replace("search being", "").trim();
      }
      input.split(" ").join("+");
      let url = window.open(`https://www.bing.com/search?q=${input}`);
      all_tabs.push(url);
    }
     else if (transcript.includes("search youtube")) {
      speechvoice("Searching please wait sir");
      let input = transcript;
      input = input.replace("search youtube", "").trim();
      input.split(" ").join("+");
      let url = window.open(`https://www.youtube.com/results?search_query=${input}`);
      all_tabs.push(url);
    } else if (
      transcript.includes("search weather") &&
      transcript.includes("city")
    ) {
      speechvoice("Searching weather please wait.");
      let city = transcript;
      let fined_index = city.indexOf("city");
      city = city.slice(fined_index + 4);
      Weatherapi(city);
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
