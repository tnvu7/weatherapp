import React from "react";
import { Card } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";

class City extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loc: {},
            ss: "",
            sr: "",
            flag: "",
            icon: "",
            mounted: false
        }
    }
    componentDidMount(){
        //get city ids, compare to userhry.
        var foundObj = this.props.userhry.filter(obj => obj.id == this.props.id);
            let sr = new Date(foundObj[0].sys.sunrise * 1000).toLocaleTimeString();
            let ss = new Date(foundObj[0].sys.sunset * 1000).toLocaleTimeString();
            let flag = "http://openweathermap.org/images/flags/" + foundObj[0].sys.country.toLowerCase() + ".png";
            let icon = "http://openweathermap.org/img/w/" + foundObj[0].weather[0].icon + ".png";
        this.setState({loc: foundObj[0], ss: ss, sr: sr, flag: flag, icon: icon, mounted: true});
    }
    render() {
        return(
            <div id="main">
                {this.state.mounted ? <Card id="theLocal" border="secondary" key={this.state.loc.id}> 
                    <Card.Title id="card-title">{this.state.loc.name}, {this.state.loc.sys.country} <img id="flag" src={this.state.flag}/></Card.Title>
                    
                    <Card.Text>
                    <span id="curTemp">{this.state.loc.main.temp}&#8451;</span> <br/>
                    <img id="icon" src={this.state.icon}/><span id="desc"> {this.state.loc.weather[0].description}</span><br/>
                    <p id="feels">FEELS LIKE {this.state.loc.main.feels_like} &#8451;</p> 
                        <br />
                    </Card.Text>

                        <ListGroup variant="flush">
                            <ListGroup.Item><span>Expected weather from</span> {this.state.loc.main.temp_min}℃ <span>to</span> {this.state.loc.main.temp_max}℃</ListGroup.Item>
                            <ListGroup.Item><span>Sunrise:</span> {this.state.sr} <span>Sunset:</span> {this.state.ss}</ListGroup.Item>
                            <ListGroup.Item><span>Clouds:</span> {this.state.loc.weather[0].description} <span>Humidity:</span> {this.state.loc.main.humidity}% Pressure: {this.state.loc.main.pressure} hPa</ListGroup.Item>
                            <ListGroup.Item><span>Wind:</span> {this.state.loc.wind.speed} m/s</ListGroup.Item>
                            <ListGroup.Item><span>Geo Location:</span> {this.state.loc.coord.lon}, {this.state.loc.coord.lat}</ListGroup.Item>
                        </ListGroup>
                </Card> : null}
               
            </div>
        )
    }
}
export default City;