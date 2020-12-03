# CivilRightsOnlineArchive

An archive and timeline for the Black Lives Matter movement of early 2020, the present, and the future.

##Installing dependencies

### Debian Linux
#### Install Node.JS
Run as root (`sudo -s`):
`curl -sL https://deb.nodesource.com/setup_current.x | bash -`

return to normal user (`exit`):
`sudo apt-get install -y nodejs`

#### Install Mongodb
Download:
`sudo apt install mongodb`

Start mongodb process:
`sudo systemctl enable mongodb
sudo systemctl start mongodb`


### Windows 10
#### Install Node.js
Go to https://nodejs.org/en/ and download the recommended (left) installer.
Run through the installer with default settings.

#### Install MongoDB
Go to https://www.mongodb.com/try/download/community and install with installer.

(Optional) Install MongoDB Compass for a GUI to browse the database: https://www.mongodb.com/try/download/compass
To set up, go to the "New Connection" page and input the url to which 'global.dburl' is assigned in the 'app.js' file.

## Set up application
### Set up Node.js Application
In a terminal, navigate to the directory containing 'app.js' (should be CivilRightsOnlineArchive/App).
Run 'npm install'; this will download the node packages required by the application

### Start Application
#### Linux
(Optional) Install tmux to allow the server to run as a background process. Useful for implementation on RPi over ssh
`sudo apt install tmux`

Initializing tmux session:
`tmux`

Navigate to the directory containing app.js (should be CivilRightsOnlineArchive/App)
`node app.js`
Wait until it reports that the server is open and listening
You can now safely detach from the tmux session and from the over all terminal session

#### Windows
In a terminal, navigate to the directory containing 'app.js' (should be CivilRightsOnlineArchive/App).
Run 'node app.js'


### Use the app through a browser
Open a browser and navigate to 'localhost:8001'
Alternatively, any device on the LAN can connect via 'server_ip:8001'

## All Done!
