let uri = './data.json';
let req = new Request(uri, {method:'GET'});
let container, df;
let log = console.log
document.addEventListener('DOMContentLoaded', init);

function init(){
    container = document.getElementById('container');
    df = new DocumentFragment();
    
    fetch(req)
    .then((response)=>{
        if(response.ok){
            return response.json();
        }else{
            throw new Error('BAD HTTP');
        }
    })
    .then((json)=>{
        // log(json)
        //create the weather grid
        json.hourly.data.forEach((hour)=>{
            //to show the temp
            let div = document.createElement('div');
            div.classList.add('hour');
            let timestamp = hour.time;
            div.id = 'ts_' + timestamp.toString();
            let temp = parseInt(hour.temperature);
            div.textContent = temp.toString().concat('\u00B0');
            div.title = hour.summary;
            
            //to show the time
            let span = document.createElement('span');
            let timmy = new Date(timestamp * 1000);
            span.textContent = timmy.getHours().toString().concat(":00");
            
            div.appendChild(span);
            df.appendChild(div);
        });
        container.appendChild(df);
        
        //highlight the times when it will be raining

        json.hourly.data.filter((hour)=>{
            if(hour.precipProbability > 0.5){
                return true
            }
            return false
        }).map((hour)=>{
            return hour.time
        }).forEach((timestamp)=>{
            let id  = "ts_".concat(timestamp)
            document.getElementById(id).classList.add("precip")
        })
        //highest temp
        let highObj =  json.hourly.data.reduce((accumulater,hour)=>{
            if(hour.temperature > accumulater.temp){
                return {temp : hour.temperature , time: hour.time}
            } else{
                return accumulater
            }           
        },{temp: -100 ,time :1000 })
        let id = 'ts_' + highObj.time;
        document.getElementById(id).classList.add('hot');
    })
    .catch((err)=>{
        console.log( err.message );
    })
}