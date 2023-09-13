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
  
  return (
    <>
    <AppBar position='static'>
      <Toolbar> 
        <Link to="/" className={classes.navLogo}> VolcashDB </Link>
        <div className={classes.navMenu}>
          <Button
            className={classes.navBtn}
            color='inherit'
            onClick={() => navigate('/')}
          >   
            Home
          </Button>
          <Button
            className={classes.navBtn}
            color='inherit'
            onClick={() => navigate('/about')}
          >
            About VolcashDB
          </Button>
          <Button
            className={classes.navBtn}
            color='inherit'
            onClick={() => navigate('/catalogue')}
          >
            Catalogue 
          </Button>
          <Button
            className={classes.navBtn}
            color='inherit'
            onClick={() => navigate('/analytic')}
          >
            Plots 
          </Button>
          {/* <Button
            className={classes.navBtn}
            color='inherit'
            onClick={() => changeLocation('/contribute')}
          >
            Contribute 
          </Button> */}
        </div>
        
      </Toolbar>
    </AppBar>
    </>
  );
}
