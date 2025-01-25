# PumpPal
A react-native application that makes going to the gym a lot more fun and interactive!

## Development environment setup (Assumes Linux/WSL, steps may differ slightly for MacOS) ##

1. Make sure the latest version of NodeJS is installed. Click [this](https://nodejs.org/en/download) link for a guide
2. Make sure Python and `pip` are installed. Click the links for guides for [Python](https://www.python.org/downloads/) and [`pip`](https://pip.pypa.io/en/stable/installation/)
3. Install PostgreSQL. Make sure you install the full RDBMS, not just the client tools (for local testing).
4. Clone the repository. 
5. Make sure the `postgres` user in PSQL has a password.
6. Within, `./src/backend`, create a `.env` file with all the environment variables needed
7. Create a virtual environment and install all dependencies there (you will need this if you want to add python dependencies yourself), or just install all dependencies globally if you prefer with `pip install -r ./src/backend/requirements.txt`.
8. From the root directory, `npm install`.


Steps to Run Backend:

1. Make sure to have psycop and postgresSQL installed
2. apt install postgresql
3. apt install libpq-devipconfig
4. pip install -r requirements.txt

Windows Setup:
Open "Windows Defender Firewall with Advanced Security."
Create a new Inbound Rule:
Rule type: Port.
Protocol: TCP.
Port: 5000.
Action: Allow the connection.
Save and enable the rule

In Powershell Admin:
Run ipconfig command and look for inet entry under ethernet0

In Powershell administrator:

netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=5000 connectaddress=<WSL-IP> connectport=5000 IN WINDOWS where WSL-IP is the entry you just found from abov

In WSL:
flask run --host=0.0.0.0 --port=5000


In CMD/Frontend:
Find IPv4 Address UNDER Wireless LAN adapter Wi-Fi:
Send all requests from frontend to that IP address + port 5000