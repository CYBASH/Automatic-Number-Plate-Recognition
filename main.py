import cv2
from ultralytics import YOLOv10
import numpy as np
import math
import re
import os
from datetime import datetime
from paddleocr import PaddleOCR

import firebase_database

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

ip = "http://192.168.0.102:8080/video"
cap = cv2.VideoCapture(0)

# Attempt to open the IP camera
if not cap.isOpened():
    # print("IP camera not available, using laptop's camera instead.")
    cap = cv2.VideoCapture(0)

#Initialize the YOLOv10 Model
model = YOLOv10("best.pt")
#Initialize the frame count
count = 0
#Class Names
className = ["License"]
#Initialize the Paddle OCR
ocr = PaddleOCR(use_angle_cls = True, use_gpu = True)

def paddle_ocr(frame, x1, y1, x2, y2):
    frame = frame[y1:y2, x1: x2]
    result = ocr.ocr(frame, det=False, rec = True, cls = False)
    text = ""
    for r in result:
        #print("OCR", r)
        scores = r[0][1]
        if np.isnan(scores):
            scores = 0
        else:
            scores = int(scores * 100)
        if scores > 60:
            text = r[0][0]
    pattern = re.compile('[\W]')
    text = pattern.sub('', text)
    text = text.replace("???", "")
    text = text.replace("O", "0")
    text = text.replace("粤", "")
    print(str(text))
    return str(text)

def checkNumberPlatesInFirebase(licensePlates):
    registeredPlates = firebase_database.getVehicleNumbers()
    for plate in licensePlates:
        if plate in registeredPlates:
            print("Vehicle Registered")
            details = firebase_database.getVehicleDetailsByNumber(plate)
            
            # Check if vehicle is entering or exiting
            if checkEntry(plate, details):
                print("Vehicle Entered")
                
                # Create new entry
                vehicle_data = {
                    "image": "https://example.com/image.jpg",
                    "vehicleNumber": details["vehicleNumber"],
                    "ownerName": details["ownerName"],
                    "phoneNumber": details["phoneNumber"],
                    "address": details["address"],
                    "year": details["year"],
                    "semester": details["semester"],
                    "entryTime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "exitTime": ""
                }
                
                # Save new entry
                firebase_database.save_vehicle_entry_details(vehicle_data)
            else:
                print("Vehicle Exited")
                
                # Update exit time of existing entry
                firebase_database.save_exit_time(plate, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                
            quit()

    print("Vehicle Not Registered")

def checkEntry(plate, details):
    try:
        docs = firebase_database.get_all_vehicle_entries()
        
        # If no documents exist, vehicle hasn't entered
        if not docs:
            return True
        
        for doc in docs:
            vehicle_data = doc.to_dict()
            
            # Check if the vehicleNumber matches the plate
            if plate == vehicle_data['vehicleNumber']:
                # If entryTime is present and exitTime is empty, vehicle is already inside
                if vehicle_data.get("entryTime") and vehicle_data.get("exitTime") == "":
                    return False
                
        # If no matching vehicleNumber is found, vehicle hasn't entered
        return True
    
    except Exception as e:
        print(f"Error checking vehicle entry: {e}")
        return False 

startTime = datetime.now()
license_plates = set()
while True:
    ret, frame = cap.read()
    if ret:
        currentTime = datetime.now()
        count += 1
        # print(f"Frame Number: {count}") -------------->
        results = model.predict(frame, conf = 0.45)
        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
                classNameInt = int(box.cls[0])
                clsName = className[classNameInt]
                conf = math.ceil(box.conf[0]*100)/100
                #label = f'{clsName}:{conf}'
                label = paddle_ocr(frame, x1, y1, x2, y2)
                if label:
                    # print(type(label)) ---------->
                    license_plates.add(label)
                textSize = cv2.getTextSize(label, 0, fontScale=0.5, thickness=2)[0]
                c2 = x1 + textSize[0], y1 - textSize[1] - 3
                cv2.rectangle(frame, (x1, y1), c2, (255, 0, 0), -1)
                cv2.putText(frame, label, (x1, y1 - 2), 0, 0.5, [255,255,255], thickness=1, lineType=cv2.LINE_AA)
        if (currentTime - startTime).seconds >= 3:
            endTime = currentTime
            startTime = currentTime
            checkNumberPlatesInFirebase(license_plates)
            license_plates.clear()
        cv2.imshow("Video", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            endTime = currentTime
            startTime = currentTime
            checkNumberPlatesInFirebase(license_plates)
            license_plates.clear()
            break
    else:
        break
cap.release()
cv2.destroyAllWindows()