import React, { Component } from "react";
import Local from "./Local";
import data from './component/city_list.json';
import { Card, CardDeck } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button';
import ReactPaginate from 'react-paginate';
import ListGroup from "react-bootstrap/ListGroup";
import Form from 'react-bootstrap/Form';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mount: true,
            input: null,
            errMsg: " ",
            pageData: null,
            jsonData: [],
            res: null,
            reslength: null,
            offset: 0,
            perPage: 3,
            currentPage: 1,
            pageCount: 0,
            origData: null,
            items: [],
            dataloaded: false,
            visitedCities: []
        };
        this.SubmitHandler = this.SubmitHandler.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.getData = this.getData.bind(this);
        this.storeData = this.storeData.bind(this);
        this.display = this.display.bind(this);
        this.doPages = this.doPages.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.loadMoreData = this.loadMoreData.bind(this);
        this.callHistory = this.callHistory.bind(this);
    }
    onChange(e) {

        this.setState({ input: e.target.value, errMsg: " " });
    }
    SubmitHandler = (event) => {
        event.preventDefault();
        if (this.state.input == null)
            this.setState({ errMsg: <Alert variant="danger">Please enter a valid city</Alert> });
        else {
            this.getData(this.state.input);
        }
    }
    handleInput(e) {
        if (e.key === 'Enter') {
            this.SubmitHandler(e);
        }
    }
    storeData = () => {
        const newdata = data.map((data) => {
            return ({ id: data.id, name: data.name, country: data.country })
        });
        this.setState({ jsonData: newdata });
    }
    componentDidMount() {
        this.setState({ mount: true }, () => {
            this.storeData();
        });

    }

    getData(query) {
        query = query.toLowerCase().trim();
        var n = query.indexOf(",");
        var ids = [];
        if (n == -1) //user just enter city
        {
            this.state.jsonData.map((data) => {
                if (data.name.toLowerCase() === query) {
                    ids.push(data.id);
                }
            });
        } else {
            this.state.jsonData.map((data) => {
                var city = query.substring(0, n).trim();
                var country = query.substring(n + 1).trim();
                if (data.name.toLowerCase() === city && data.country.toLowerCase() === country) {
                    ids.push(data.id);
                }
            });
        }
        
        fetch(`https://api.openweathermap.org/data/2.5/group?id=${ids}&units=metric&appid=3b6864aba291bb12fdff92ba63aefe6f`)
            .then((res) => {
                if (res.status == 404) {
                    throw "Please enter a valid city!"
                }
                res.json().then((res) => {
                    if (res.count == 0) {
                        throw "Please enter a valid city!"
                    }
                    this.setState({
                        res: res.list,
                        reslength: res.list.length,
                        dataloaded: true,
                        mount: false
                    }, () => this.display());
                }).catch((err) => {
                    console.log("ERROR: " + err);
                    this.setState({ errMsg: err, dataloaded: false });
                })
            }).catch((err) => {
                console.log("ERROR: " + err);
                this.setState({ errMsg: <Alert variant="danger">{err}</Alert>, dataloaded: false });
            })
    }
    display() {
        var arr = this.state.res.map(loc => {
            let sr = new Date(loc.sys.sunrise * 1000).toLocaleTimeString();
            let ss = new Date(loc.sys.sunset * 1000).toLocaleTimeString();
            let flag = "http://openweathermap.org/images/flags/" + loc.sys.country.toLowerCase() + ".png";
            let icon = "http://openweathermap.org/img/w/" + loc.weather[0].icon + ".png";
            return (
                <Accordion>
                    <Card id="results" border="secondary" key={loc.id}>
                        <Card.Title id="card-title">{loc.name}, {loc.sys.country} <img id="flag" src={flag} /></Card.Title>

                        <Card.Text>
                            <span id="curTemp">{loc.main.temp}</span>&#8451; <br />
                            <img id="icon" src={icon} /> {loc.weather[0].description}<br />
                            <p id="feels">FEELS LIKE {loc.main.feels_like} &#8451; </p>
                            <br />
                        </Card.Text>

                        <Accordion.Toggle as={Button} variant="link" eventKey="0" onClick={() => this.callHistory(loc)}>
                            View more/less
                </Accordion.Toggle>

                        <Accordion.Collapse eventKey="0">
                            <ListGroup variant="flush">
                                <ListGroup.Item><span>Expected weather from</span> {loc.main.temp_min}℃ <span>to</span> {loc.main.temp_max}℃</ListGroup.Item>
                                <ListGroup.Item><span>Sunrise:</span> {sr} <span>Sunset:</span> {ss}</ListGroup.Item>
                                <ListGroup.Item><span>Clouds:</span> {loc.weather[0].description} <span>Humidity:</span> {loc.main.humidity}% Pressure: {loc.main.pressure} hPa</ListGroup.Item>
                                <ListGroup.Item><span>Wind:</span> {loc.wind.speed} m/s</ListGroup.Item>
                                <ListGroup.Item><span>Geo Location:</span> {loc.coord.lon}, {loc.coord.lat}</ListGroup.Item>
                            </ListGroup>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            )
        });
        if (this.state.reslength <= 3) {
            this.setState({ pageData: arr });
        } else {
            this.doPages(arr);
        }
    }
    callHistory(loc) {
        let tmp = this.state.visitedCities.filter(obj => obj.id == loc.id);
        if (tmp.length == 0) {
            this.setState(prevState => ({
                visitedCities: [...prevState.visitedCities,
                {
                    "id": loc.id,
                }]
            }));
            this.props.updateCities(loc);
        }
    }
    handlePageClick(e) {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreData()
        });
    }
    loadMoreData() {
        const data = this.state.origData;

        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage);
        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            pageData: slice
        });
    }
    doPages(arr) {
        const slice = arr.slice(this.state.offset, this.state.offset + this.state.perPage);

        this.setState({
            pageCount: Math.ceil(arr.length / this.state.perPage),
            origData: arr,
            pageData: slice
        });
    }

    render() {
        return (
            <div className="container" >
                <Form id="main" inline>
                    <Form.Control type="text" placeholder="Search" className="mr-sm-2" onChange={this.onChange} onKeyDown={this.handleInput} />
                    <Button variant="outline-warning" onClick={this.SubmitHandler}>Search</Button>
                </Form><br />
                <div id="main"> {this.state.errMsg}  </div><br />
                <div id="main">
                    {this.state.mount ? <Local /> : null}
                    {this.state.dataloaded ? <CardDeck>
                        {this.state.pageData}
                    </CardDeck> : null}
                </div>
                <br /><br />
                {this.state.reslength > 3 ? <ReactPaginate
                    previousLabel={"←"}
                    nextLabel={"→"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    nextLinkClassName={"pagination__link"}
                    previousLinkClassName={"pagination__link"}
                    activeClassName={"pagination__link--active"}
                    disabledClassName={"pagination__link--disabled"} /> : null}
            </div>
        );
    }
}
export default Home;