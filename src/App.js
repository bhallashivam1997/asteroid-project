import './App.css';
import React , {useState} from 'react';
import axios from "axios";  
 
function App() {

   const [asteroidsData, setAsteroidsData] = useState([]);
   const [temp,setTemp]= useState([]);

   function daysBetweenInput(){
     var date1 = new Date(startDateNew);
     var date2 = new Date(endDateNew);

     var DifferenceInTime = date2.getTime() - date1.getTime();
     if(DifferenceInTime < 0){
       return -1;
     }
     else{
      var DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
      return DifferenceInDays; 
     }
   }

   const submitResult = async () =>{
     setAsteroidsData([]);
     setTemp([]);
     var diffDays = daysBetweenInput();
     console.log(diffDays);
     if(startDate === null || endDate === null || diffDays === -1 || diffDays >=8){
       alert("INVALID INPUT");
     }
     else if(diffDays <=7){
      await axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=9jBJnHYR24uZYqYQyx7m1EG9lm2UkrpyKnuIbEfD`).then(response => {setAsteroidsData(response.data);
      })
      .catch(err =>{
        console.log(err);
        alert("this request is failed. Try Again Later");
      })
     }
   }


  const [startDate,setStartDate] = useState(null);
  const [startDateNew,setStartDateNew] = useState("");
  function getStartDate(val){
    setStartDate(val.target.value);
    var temp1 = val.target.value;
    var ans = "";
    ans += temp1[5];
    ans += temp1[6];
    ans += "/";
    ans += temp1[8];
    ans += temp1[9];
    ans += "/";
    ans += temp1[0];
    ans += temp1[1];
    ans += temp1[2];
    ans += temp1[3];
    setStartDateNew(ans);
    console.log(val.target.value)
    // console.log(ans)
  }

  const [endDate,setEndDate] = useState(null);
  const [endDateNew,setEndDateNew] = useState("");
  function getEndDate(val){
    setEndDate(val.target.value);
    var temp1 = val.target.value;
    // var ans = String(temp[8]+temp[9]+"/"+temp[5]+temp[6]+"/"+temp[0]+temp[1]+temp[2]+temp[3])
    var ans = "";
    ans += temp1[5];
    ans += temp1[6];
    ans += "/";
    ans += temp1[8];
    ans += temp1[9];
    ans += "/";
    ans += temp1[0];
    ans += temp1[1];
    ans += temp1[2];
    ans += temp1[3];
    setEndDateNew(ans);
    console.log(val.target.value)
    // console.log(ans)
  }



  const AsteroidDataLoaded = () =>{
    if(asteroidsData.length !== 0){
      for(var key in asteroidsData.near_earth_objects){
        asteroidsData.near_earth_objects[key].map(val =>
            temp.push([val['id'],(val['estimated_diameter']["kilometers"]["estimated_diameter_min"] + val['estimated_diameter']["kilometers"]["estimated_diameter_max"] )/2.0 , val["close_approach_data"][0].relative_velocity["kilometers_per_hour"] , val["close_approach_data"][0].miss_distance["kilometers"]])
          )
      }
      var totalAvgSize=0.0;
      temp.map(val =>
        totalAvgSize += val[1]
      )

      totalAvgSize /= (temp.length);

      // calculating the maximum speed asteroid
      var maxSpeedAsteroidID = -1;
      var maxSpeedAsteroidSpeed = -1;

      temp.map(val =>{
        if(val[2] > maxSpeedAsteroidSpeed){
          maxSpeedAsteroidSpeed = val[2];
          maxSpeedAsteroidID = val[0];
        }
        return [];
      })

       // calculating closest asteroid 
       var closestAsteroidID = -1;
       var closestAsteroidDist = 100000000000;

       temp.map(val =>{
         if(val[3] < closestAsteroidDist){
           closestAsteroidDist = val[3];
           closestAsteroidID = val[0];
         }
         return [];
       })


      return(
        // <div>{asteroidsData.near_earth_objects['2015-09-07'][0]['id']}</div>
        <div>
          <p>The average size of all asteroids = {totalAvgSize} km<br/>
          The maximum speed of asteroid = {maxSpeedAsteroidSpeed} km/hr , with ID = {maxSpeedAsteroidID}<br/>
          The closest distance of asteroid = {closestAsteroidDist} km , with ID = {closestAsteroidID}
          </p>
        </div>
      );
    }
    else{
      return(
        <div>Please wait...</div>
      );
    }
  }

  console.log(asteroidsData);
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="navbar-brand" href="#">Asteroid - Neo Stats</div>
    </nav>
    <div>
        <div className="start-date">
          <label>Start-Date</label>
          {/* <h1>{startDate}</h1> */}
          <input type="date" className="form-control" onChange={getStartDate}></input>
        </div>
        <div className="end-date">
          <label>End-Date</label>
          <input type="date" className="form-control" onChange={getEndDate}></input>
        </div>
        <div className="sb-btn">
          <button type="button" class="btn btn-success" onClick={submitResult}>Search</button>
        </div>
      <div className="actualData">
        <AsteroidDataLoaded></AsteroidDataLoaded>
      </div>
    </div>
    </>
  );
}

export default App;
