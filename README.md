# Setting up local development for Volcash for MacOS

## Install NodeJS

Install NodeJS by entering below commands to terminal

```shell
brew update && brew install node
```

Check if NodeJS and NPM are installed 

```shell
node -v 
npm -v
```

## Setting code base and required data

- Clone Volcash github repo 

    ```shell
    git clone git@github.com:dbenet-ntu/VolcAshDB.git
    ```

- Modify `front-end/src/Constants.js` to set `PROXY` variable. This `PROXY` variable is the address of the back-end of the site.

    ```javascript
    export const PROXY = "http://localhost:5001"
    ```
    
    Notes: On production server, this variable is set differently.

## Install required dependencies

- Install required dependencies for `back-end`

    ```shell
    cd back-end
    npm install
    ```

- Install required dependies for `front-end`
    ```shell
    cd front-end
    npm install
    ```

## Start development server

- Start `back-end` service

    ```shell
    cd back-end 
    npm start
    ```

- Opening a different terminal, start `front-end` developement enviroment

    ```shell
    cd front-end
    npm start
    ```



