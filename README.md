# Automatic Number Plate Recognition (ANPR) Project

This project is designed to recognize vehicle number plates using advanced image processing techniques and integrate user authentication using Firebase.

---

## Features

- Automatic detection and recognition of vehicle number plates.
- User authentication using Firebase.
- Modular and scalable codebase for easy maintenance.

---

## Prerequisites

- Python 3.11.4
- Firebase account and project setup
- `loginpage-firebase-adminsdk.json` from Firebase

---

## Setup Instructions

### 1. Clone the Repository

```bash```
 - git clonehttps://github.com/CYBASH/Automatic-Number-Plate-Recognition.git
 - cd Automatic-Number-Plate-Recognition

### 2. Create Python Virtual Environment

 - python3.11.4 -m venv venv
 - source venv/bin/activate    # On Linux/MacOS
 - venv\Scripts\activate       # On Windows

### 3. Install Dependencies
 - pip install -e .
 - pip install -r requirements.txt

### 4. Firebase Setup
Go to the Firebase Console and create a new project.
Navigate to Project Settings > Service accounts and generate a new private key.
Download the loginpage-firebase-adminsdk.json file and place it in the main directory of your project.

### 5. Integrate Firebase Admin SDK
Add the following code in your firebase_database.py

### 6. Set `use_gpu` to `true` in `main.py` if you have a GPU. 

### 7. Run main.py
 - python main.py

