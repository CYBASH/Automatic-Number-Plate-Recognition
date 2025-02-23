import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# Initialize Firebase Admin SDK
cred = credentials.Certificate('./loginpage-6a191-firebase-adminsdk-vzzye-0aaa528855.json')  # Replace with your service account key file path
firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.client()

# Retrieve all documents from the "vehicles" collection
vehicles_ref = db.collection('vehicles')
documents = vehicles_ref.get()

def getVehicleNumbers():
    try:
        vehicles_ref = db.collection('vehicles')
        documents = vehicles_ref.get()
        
        vehicleNumbers = []
        
        # print("Vehicle Numbers:")
        for doc in documents:
            data = doc.to_dict()
            if 'vehicleNumber' in data:
                vehicleNumbers.append(data['vehicleNumber'])
            else:
                print("- No vehicle number found in this document.")
        return vehicleNumbers
    except Exception as e:
        print(f"Error retrieving vehicle numbers: {e}")

def getVehicleDetailsByNumber(vehicle_number):
    try:
        # Get the document where the document ID is the vehicle number
        doc_ref = db.collection('vehicles').document(vehicle_number)
        doc = doc_ref.get()
        
        if doc.exists:
            vehicle_data = doc.to_dict()
            return vehicle_data
        else:
            print("No vehicle found with that number.")
            
    except Exception as e:
        print(f"Error retrieving vehicle details: {e}")



def save_vehicle_entry_details(vehicle_data):
    try:
        vehicle_number = vehicle_data["vehicleNumber"]
        
        # Save vehicle data with document ID as the vehicle number
        db.collection('vehicle_entries').add(vehicle_data)
        
        print("Vehicle details saved successfully!")
    except Exception as e:
        print(f"Error saving vehicle details: {e}")

def get_all_vehicle_entries():
    try:
        # Get all documents from the vehicle_entries collection
        docs = db.collection('vehicle_entries').get()

        # Check if there are any documents
        if not docs:
            print("No vehicle entries found.")
            return
        
        # Iterate through each document and print its details
        # for doc in docs:
        #     vehicle_data = doc.to_dict()
        #     print(f"Document ID: {doc.id}")
        #     for key, value in vehicle_data.items():
        #         print(f"{key}: {value}")
        #     print("-" * 30)  # Separator for each document
        
        return docs
            
    except Exception as e:
        print(f"Error retrieving vehicle details: {e}")

def save_exit_time(vehicle_number, exit_time):
    try:
        # Get all documents from vehicle_entries collection
        docs = db.collection('vehicle_entries').get()
        
        # If no documents exist, return False
        if not docs:
            print("No documents found.")
            return False
        
        # Iterate through all documents
        for doc in docs:
            vehicle_data = doc.to_dict()
            
            # Check if the vehicleNumber matches
            if vehicle_number == vehicle_data['vehicleNumber']:
                # Check if entryTime is present and exitTime is empty
                if vehicle_data.get("entryTime") and vehicle_data.get("exitTime") == "":
                    # Reference the specific document by its ID
                    doc_ref = db.collection('vehicle_entries').document(doc.id)
                    
                    # Update the exit time
                    doc_ref.update({
                        "exitTime": exit_time
                    })
                    print(f"Exit time updated successfully for vehicle: {vehicle_number}")
                    print(f"Doc ID: {doc.id}")
                    return True
        
        # If no matching vehicle is found
        print(f"No entry found for vehicle number: {vehicle_number}")
        return False
    
    except Exception as e:
        print(f"Error updating exit time: {e}")
        return False




# Example vehicle data


if __name__ == "__main__":
    from pprint import pprint
    # pprint(getVehicleDetailsByNumber("R183JF"))
    # {'address': 'singhnagar',
    # 'ownerName': 'Sivaram',
    # 'phoneNumber': '8008760311',
    # 'semester': 'II',
    # 'timestamp': DatetimeWithNanoseconds(2025, 2, 22, 10, 38, 31, 173000, tzinfo=datetime.timezone.utc),
    # 'userId': 'ZT3qYDpcbBPhGjZJ6kJO3e0APDz2',
    # 'vehicleNumber': 'R183JF',
    # 'year': 'III'}
    
    # vehicle_data = {
    # "image": "https://example.com/image.jpg",
    # "vehicleNumber": "ABC1234",
    # "ownerName": "John Doe",
    # "phoneNumber": "1234567890",
    # "address": "123 Main St",
    # "year": "2022",
    # "department": "Engineering",
    # "entryTime": "2025-02-22T10:00:00.000Z",
    # "exitTime": ""
    # }
    
    # save_vehicle_entry_details(vehicle_data=vehicle_data)
    
    x = get_all_vehicle_entries()
    # print(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    