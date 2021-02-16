import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Home from "./Home";

const VisitedCity = () => <h1>number</h1>
class Routing extends Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Link to='/'>Home</Link>
                        <br/>
                        <Link to='/vc'>VisitedCity</Link>
                        <br/>
                    </div>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route exact path='/vc' component={VisitedCity}/>
                        <Route render={() => ( <h1>Not Found</h1> )} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}
export default Routing;