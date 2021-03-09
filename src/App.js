import React from "react";
import Routing from "./Routing";

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userhry: []
        }
        this.updateCities = this.updateCities.bind(this);
    }
    updateCities(newData) {
        let tmp = this.state.userhry.concat(newData);
        this.setState({userhry: tmp}, () => {
            console.log(this.state.userhry); 
        });
    }
    render() {
        return(
            <div>
            <Routing updateCities={this.updateCities} userhry={this.state.userhry}/>
            </div>
        )
    }
}
export default App;