function SpeedDisplaying(){
    const SpeedVal = document.querySelector("#SpeedDisplaying");
    const SpeedInput = document.querySelector("#SpeedRange");
    SpeedVal.textContent = SpeedInput?.value;
    if(SpeedVal.textContent == 2){
        document.getElementById('SpeedDisplaying').innerHTML = "Slow";
    }else if(SpeedVal.textContent == 3){
        document.getElementById('SpeedDisplaying').innerHTML = "Medium";
    }else if(SpeedVal.textContent == 4){
        document.getElementById('SpeedDisplaying').innerHTML = "Fast";
    }
}
function ValueDisplaying(id){
    const Input = document.querySelector(`#${id}`);
    var label = document.querySelector(`label[for="${id}"]`);
    const LabelID = label.id;
    const val = Input?.value;
    document.getElementById( `${LabelID}`).innerHTML = val;
}
function submitFunction(){
    let name = document.getElementById("tripname").value;
    console.log(name);
    document.getElementById("outputname").innerHTML = name;
    
    const startDate = new Date(document.getElementById("start-date").value);
    const endDate = new Date(document.getElementById("end-date").value);
    const oneDay = 24 * 60 * 60 * 1000;
    let startMilliTime = startDate.getTime()
    console.log(startMilliTime);
    let currentDate = new Date(startDate);
    const dates = [];

    var t = 0;
    while (currentDate <= endDate) {
        t++;
      dates.push(new Date(currentDate));
      currentDate.setTime(currentDate.getTime() + oneDay);
    }

    const SpeedInput = document.querySelector("#SpeedRange");
    const SpeedVal = SpeedInput?.value;

    const ArtInput = document.querySelector("#ArtRange");
    const ArtVal = ArtInput?.value;

    const HistoryInput = document.querySelector("#HistoryRange");
    const HistoryVal = HistoryInput?.value;

    const NatureInput = document.querySelector("#NatureRange");
    const NatureVal = NatureInput?.value;

    const ShoppingInput = document.querySelector("#ShoppingRange");
    const ShoppingVal = ShoppingInput?.value;

    const url ='{API_URL}';
    const params = new URLSearchParams(new URL(url).search);
    params.set('art_level',ArtVal);
    params.set('history_level',HistoryVal);
    params.set('nature_level',NatureVal);
    params.set('shopping_level',ShoppingVal);
    params.set('placePerDay',SpeedVal);
    params.set('day',t);
    params.set('milli_start_time',startMilliTime);
    newUrl = `{API_URL}?${params.toString()}`;
    console.log(newUrl);

    const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

    async function fetchAPI(newUrl) {
        sessionStorage.clear();
        await fetch(newUrl, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            sessionStorage.setItem("Result", JSON.stringify(result));
            console.log("Result send data finished!");
        })
        .catch((error) => console.log("error", error));

        sessionStorage.setItem("NewUrl",newUrl);
        sessionStorage.setItem("Day",t);
        sessionStorage.setItem("PalcePerDay",SpeedVal);
        sessionStorage.setItem("StartDay",startMilliTime);
        window.open('displaying.html','_blank')
        console.log("Open new window")
    }
    
    fetchAPI(newUrl);
    
  } 