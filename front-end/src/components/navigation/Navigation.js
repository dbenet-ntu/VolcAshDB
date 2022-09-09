import React, { useCallback } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { NavigationStyles } from './Navigation.styles';
import { useNavigate } from 'react-router-dom';
import {Link} from "react-router-dom"

export default function Navigation() {
  const classes = NavigationStyles();
  const navigate = useNavigate();
  function changeLocation(placeToGo){
    navigate(placeToGo, { replace: true });
    window.location.reload();
  }
  return (
    <>
    <AppBar position='static'>
      <Toolbar> 
        <Link to="/" className={classes.navLogo}> Volcanic Ash <br/> DataBase </Link>
        <div className={classes.navMenu}>
          <Button
            className={classes.navBtn}
            color='inherit'
            onClick={() => changeLocation('/')}
          >   
            Home
          </Button>
          <Button
            className={classes.navBtn}
            color='inherit'
            onClick={() => changeLocation('/about')}
          >
            About Us
          </Button>
          <Button
            className={classes.navBtn}
            color='inherit'
            onClick={() => changeLocation('/catalogue')}
          >
            Catalogue 
          </Button>
          <Button
            className={classes.navBtn}
            color='inherit'
            onClick={() => changeLocation('/analytic')}
          >
            Analytic 
          </Button>
        </div>
        
      </Toolbar>
    </AppBar>
    </>
  );
}
