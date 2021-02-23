import React, {Component} from "react";
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Home from "./Home";

const VisitedCity = () => <h1>number</h1>
class Jnk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: this.props.input,
            visitedArray: null
        }
    }
    
    render() {
        return(
            <div>
                <form>
                    <input type="text" placeholder="Search.." onChange={this.onChange} onKeyDown={this.state.handleInput} />
                    <button type='submit' onClick={this.SubmitHandler}>Submit</button>
                </form>
                <form>
                    <input type="text" placeholder="Search.." onChange={this.onChange} onKeyDown={this.handleInput} />
                    <button type='submit' onClick={this.SubmitHandler}>Submit</button>
                <BrowserRouter>
                    <div>
                        <Link to='/'>Home</Link>
                        <br />
                        <Link to='/cities'>VisitedCity</Link>
                        <br />
                        <div>
                        <select value="Visited City" onChange={e => this.props.history.push(`/cities/${e.target.value}`)}>
                            {this.props.userhry.map(loc => (
                                <option key={loc.id} value={loc.id} as={Link} to={`/cities/${loc.id}`}>{loc.id}</option>
                            ))}
                        </select>
                    </div>
                    </div>
                    <Switch>
                        <Route exact path='/' component={() => (<Home key={Date.now()} updateCities={this.updateCities}/>)} />
                        <Route exact path='/cities' component={VisitedCity} />
                        <Route exact path='/cities/:id' render={() => (<City userhry={this.props.userhry} />)} />
                        <Route render={() => (<h1>Not Found</h1>)} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}
export default Jnk;

