import React, { Component } from "react";
import { Card } from "react-bootstrap";

class Local extends Component {
    constructor(props){
        super(props);
        this.state = {
            lat: 0,
            lon: 0,
            datetime: 0,
            city:" ",
            curTemp: null,
            range: null,
            desc: null,
            flagURL: null
        };
        this.getUserLocation = this.getUserLocation.bind(this);
        this.getLocationInfo = this.getLocationInfo.bind(this);
        this.getDateandTime = this.getDateandTime.bind(this);
    }
    async componentDidMount() {
        this.getDateandTime();
        this.getUserLocation();
    }
    //get Current location
    async getLocationInfo() {
        try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lon}&units=metric&appid=3b6864aba291bb12fdff92ba63aefe6f`)
        const data = await res.json();
        let flagURL = "http://openweathermap.org/images/flags/" + data.sys.country.toLowerCase() + ".png";
        this.setState({
            city: data.name + ", " + data.sys.country,
            curTemp: data.main.temp + " ℃",
            desc: data.weather[0].description,
            range: data.main.temp_min + " ℃ / " + data.main.temp_max + " ℃",
            flagURL: flagURL
        });
        } catch (err) {console.log("ERROR: " + err)};
        
    }
    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                }, () => this.getLocationInfo())
            });
        } else {
            console.log("cannot find loc");
        }
    }
    getDateandTime() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const date = new Date(position.timestamp);
                const formattedDate = date.toLocaleDateString();
                this.setState({ datetime: formattedDate });
            });
        } else {
            console.log("cannot find loc");
        }
    }
    render() {
        return (
            <div >
                <Card id="theLocal" border="secondary"> 
                <Card.Title id="card-title">{this.state.city} <img id="flag" src={this.state.flagURL}/></Card.Title>
                <p id="Ltime">{this.state.datetime}</p>
                <p id="curTemp">{this.state.curTemp}</p>
                <p id="desc">{this.state.desc}</p>
                <p id="desc">{this.state.range}</p>
                </Card>
            </div>
        )
    }
}
export default Local;