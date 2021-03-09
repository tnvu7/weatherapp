import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Home from "./Home";
import City from "./City";

class Routing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0
        }
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Navbar bg="dark" variant="dark">
                            <Navbar.Brand id="pageName">WeatherJet</Navbar.Brand>
                            <Navbar.Collapse>
                                <Nav className="mr-auto">
                                    <Nav.Link as={Link} to="/" >Home</Nav.Link>
                                    <NavDropdown title="Visited City" id="basic-nav-dropdown" disabled={this.props.userhry.length == 0} >
                                        {this.props.userhry.map(loc => (
                                            <NavDropdown.Item key={loc.id} value={loc.id} as={Link} to={`/cities/${loc.id}`}>{loc.name}, {loc.sys.country}</NavDropdown.Item> 
                                        ))}
                                    </NavDropdown>
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                    </div>
                    <div>
                        <Switch>
                            <Route exact path='/' render={() => (<Home updateCities={this.props.updateCities} />)} />
                            <Route exact path='/cities/:id' render={(props) => (
                            <City key={Date.now()} userhry={this.props.userhry} id={props.match.params.id} />
                        )} />
                            <Route render={function () {
                                return <p>Not found</p>
                            }} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}
export default Routing;