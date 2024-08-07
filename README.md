
# AngelCam Project

A Project to view cameras and their live feed and recordings



## Run Locally

Clone the project

```bash
  git clone https://github.com/ap-jain/AngelCamProject.git
```


## PersonalAccessToken

To run this project, you will need AccessToken

`445877f257829933f30d3ef55f6a0509bb17dad9`



## Running Backend (Django)

Change directory to backend

```bash
cd backend
```

install python virtual env

```bash
python -m pip install virtualenv
```


create virtual env venv

```bash
python -m virtualenv venv
```

open virtual env 

```bash
venv/scripts/activate
or
source venv/scripts/activate


install requirments
```bash
pip install -r requirements.txt
```

make migrations
```bash
python manage.py makemigrations
```


migrate changes
```bash
python manage.py migrate
```


runserver
```bash
python manage.py runserver
```

access server
```bash
http://127.0.0.1:8000/
```


## Running Frontend (React)

Change directory to frontend

```bash
    cd frontend
```

install dependencies

```bash
    npm i
```

start server

```bash
    npm start
```

goto this url to access the page
```bash
http://localhost:3000/
```

Access Token
```bash
445877f257829933f30d3ef55f6a0509bb17dad9
```



