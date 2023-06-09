import React, {Component} from 'react';
import ParticlesBg from 'particles-bg';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';




const initialState = {
      input: '',
      imageUrl: '',
      box: {}, 
      route: 'signin',
      isSignedIn: false,
      user:{
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
      }
    }

class App extends Component{
  constructor(){
    super();
    this.state = initialState
  }

  loadUser = (data) =>{
  this.setState(
    {user:{
          id: data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined
        }}
    )
}

  componentDidMount(){
    fetch('http://localhost:3000').then(response => response.json()).then(console.log)
  }

  faceLocation = (data) =>{
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: face.left_col*width,
      topRow: face.top_row*height,
      rightCol: width - face.right_col*width,
      bottomRow: height - face.bottom_row*height
    };  
  }

  displayFaceBox = (box) =>{
    console.log(box);
    this.setState({box: box});
  }

  onInputChange=(event)=>{
    this.setState({input: event.target.value});
  }
  onSubmit=()=>{
    this.setState({imageUrl: this.state.input});
        fetch('http://localhost:3000/imageurl',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
            })
        })
        .then(response => response.json())
        .then(response=>{
          if (response){
            fetch('http://localhost:3000/image',{
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
              })
            })
            .then(response => response.json())
            .then(count=>{
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
          }
          this.displayFaceBox(this.faceLocation(response))
        })
        .catch(err=>console.log(err));
  }


  onRouteChange =(route)=>{
    if(route === 'signout'){
      this.setState(initialState);
    }
    else if(route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render(){
      return (
        <div className="App">
          <ParticlesBg color="#FFFAFA" num={50} type="cobweb" bg={true} />
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
          {this.state.route === 'home'
           ?<div>
              <Logo/>
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange = {this.onInputChange} onSubmit={this.onSubmit}/>
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div>

           :(this.state.route === 'signin'
            ?<SignIn loadUser={this.loadUser} onRouteChange ={this.onRouteChange}/>
            :<Register loadUser={this.loadUser} onRouteChange ={this.onRouteChange}/>

           )
          }
          
        </div>
      );
    }
  }


export default App;
