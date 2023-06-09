import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain-100.png';
import './Logo.css';

const Logo = () =>{
	return(
	<div className='ma4 mt0'>
		<Tilt className='Tilt br2 shadow-2' options={{ max : 25 }} style={{ height: 150, width: 150 }}>
		    <div className='Tilt-inner pa3'>
		       <div><img alt='logo' src={brain}/></div>
		    </div>
	    </Tilt>
    </div>
		);
}

export default Logo;