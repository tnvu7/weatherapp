import React, { Component } from "react";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: null,
            errMsg: " ",
            lat: 0,
            lon: 0,
            datetime: 0,
            name:" "
        };
        this.SubmitHandler = this.SubmitHandler.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.getUserLocation = this.getUserLocation.bind(this);
        this.getLocationInfo = this.getLocationInfo.bind(this);
        this.displayCurrent = this.displayCurrent.bind(this);
        this.getData = this.getData.bind(this);
    }
    onChange(e) {
        this.setState({ city: e.target.value, errMsg: " " });
    }
    SubmitHandler = (event) => {
        event.preventDefault();
        if (this.state.input == "")
            this.setState({ errMsg: "Please enter a valid city" });
        else
            this.getData(this.state.input); //display
    }
    handleInput(e) {
        if (e.keycode == 13)
            this.SubmitHandler(e);
    }
    //get Current location
    getLocationInfo() {
        console.log("inside get Local info");
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lon}&appid=3b6864aba291bb12fdff92ba63aefe6f`)
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                this.displayCurrent(res);           
            }).catch(err => {
                console.log("Error reading data: " + err);
            });
    }
    getData(city) {

    }
    displayCurrent(res) {
        let name=res.name;
        let country=res.sys.country;
        let temp=res.main.temp-273.15;
        let temp_max=res.main.temp_max;
        let temp_min=res.main.temp_min;
        let desc=res.weather[0].description;
        let icon=res.weather[0].icon;
    }
    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    datetime: position.timestamp
                }, () => this.getLocationInfo())
            });
        } else {
            console.log("cannot find loc");
        }
    }
    async componentDidMount() {
        this.getUserLocation();

        console.log("Home mounted");
    }
    render() {
        return (
            <div>
                <form onClick={this.SubmitHandler}>
                    <input type="text" placeholder="Search.." onChange={this.onChange} onKeyDown={this.handleInput} /> {this.state.errMsg}
                    <button type='submit'>Submit</button>
                </form>
            </div>
        );
    }
}
export default Home;