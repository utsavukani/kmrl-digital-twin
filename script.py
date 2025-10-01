# Create comprehensive KMRL system data for digital twin
import json
import random
from datetime import datetime, timedelta
import numpy as np

# KMRL Station Data based on research
kmrl_stations = [
    {"id": 1, "name": "Aluva", "code": "ALV", "chainage": 0.098, "lat": 10.1098, "lon": 76.3496, "type": "terminal", "height": 12.5},
    {"id": 2, "name": "Pulinchodu", "code": "PLN", "chainage": 1.827, "lat": 10.095120, "lon": 76.346661, "type": "intermediate", "height": 12.5},
    {"id": 3, "name": "Companypady", "code": "CMP", "chainage": 2.796, "lat": 10.087293, "lon": 76.342840, "type": "intermediate", "height": 12.5},
    {"id": 4, "name": "Ambattukavu", "code": "AMB", "chainage": 3.779, "lat": 10.079372, "lon": 76.339004, "type": "intermediate", "height": 12.5},
    {"id": 5, "name": "Muttom", "code": "MUT", "chainage": 4.716, "lat": 10.0727, "lon": 76.3337, "type": "intermediate", "height": 12.5},
    {"id": 6, "name": "Kalamassery", "code": "KLM", "chainage": 6.768, "lat": 10.058400, "lon": 76.321926, "type": "interchange", "height": 12.5},
    {"id": 7, "name": "Cochin University", "code": "CUSAT", "chainage": 8.147, "lat": 10.046879, "lon": 76.318377, "type": "intermediate", "height": 12.5},
    {"id": 8, "name": "Pathadipalam", "code": "PTH", "chainage": 9.394, "lat": 10.035948, "lon": 76.314371, "type": "intermediate", "height": 12.5},
    {"id": 9, "name": "Edapally", "code": "EDP", "chainage": 10.787, "lat": 10.0266556, "lon": 76.3092583, "type": "intermediate", "height": 12.5},
    {"id": 10, "name": "Changampuzha Park", "code": "CHP", "chainage": 12.023, "lat": 10.02, "lon": 76.30, "type": "intermediate", "height": 12.5},
    {"id": 11, "name": "Palarivattom", "code": "PLR", "chainage": 13.071, "lat": 10.015, "lon": 76.295, "type": "intermediate", "height": 12.5},
    {"id": 12, "name": "JLN Stadium", "code": "JLN", "chainage": 14.126, "lat": 10.01, "lon": 76.29, "type": "intermediate", "height": 12.5},
    {"id": 13, "name": "Kaloor", "code": "KLR", "chainage": 15.221, "lat": 10.005, "lon": 76.285, "type": "intermediate", "height": 12.5},
    {"id": 14, "name": "Town Hall", "code": "TNH", "chainage": 15.711, "lat": 10.0, "lon": 76.28, "type": "intermediate", "height": 12.5},
    {"id": 15, "name": "M.G Road", "code": "MGR", "chainage": 16.899, "lat": 9.995, "lon": 76.275, "type": "intermediate", "height": 12.5},
    {"id": 16, "name": "Maharaja's College", "code": "MJC", "chainage": 18.103, "lat": 9.99, "lon": 76.27, "type": "intermediate", "height": 12.5},
    {"id": 17, "name": "Ernakulam South", "code": "EKS", "chainage": 19.332, "lat": 9.985, "lon": 76.265, "type": "intermediate", "height": 12.5},
    {"id": 18, "name": "Kadavanthra", "code": "KDV", "chainage": 20.185, "lat": 9.98, "lon": 76.26, "type": "intermediate", "height": 12.5},
    {"id": 19, "name": "Elamkulam", "code": "ELM", "chainage": 21.341, "lat": 9.975, "lon": 76.255, "type": "intermediate", "height": 12.5},
    {"id": 20, "name": "Vyttila", "code": "VYT", "chainage": 22.447, "lat": 9.97, "lon": 76.25, "type": "intermediate", "height": 12.5},
    {"id": 21, "name": "Thykoodam", "code": "TKD", "chainage": 23.703, "lat": 9.965, "lon": 76.245, "type": "intermediate", "height": 12.5},
    {"id": 22, "name": "Petta", "code": "PET", "chainage": 24.822, "lat": 9.96, "lon": 76.24, "type": "intermediate", "height": 12.5},
    {"id": 23, "name": "Vadakkekotta", "code": "VDK", "chainage": 25.5, "lat": 9.955, "lon": 76.235, "type": "intermediate", "height": 12.5},
    {"id": 24, "name": "SN Junction", "code": "SNJ", "chainage": 26.5, "lat": 9.95, "lon": 76.23, "type": "intermediate", "height": 12.5},
    {"id": 25, "name": "Tripunithura", "code": "TRP", "chainage": 27.96, "lat": 9.945, "lon": 76.225, "type": "terminal", "height": 12.5}
]

# Generate 25 trains (4-car trainsets)
trains = []
for i in range(1, 26):
    train = {
        "id": f"KMRL-{i:03d}",
        "name": f"Train Set {i}",
        "type": "4-car EMU",
        "capacity": {"seated": 140, "total": 600},
        "manufacturer": "Alstom",
        "status": random.choice(["in_service", "maintenance", "standby", "cleaning"]),
        "current_station": random.choice(kmrl_stations)["id"],
        "direction": random.choice(["northbound", "southbound"]),
        "speed": random.randint(0, 80),  # max 80 kmph
        "mileage": random.randint(50000, 200000),  # km
        "last_maintenance": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
        "fitness_certificate": {
            "valid_until": (datetime.now() + timedelta(days=random.randint(30, 90))).isoformat(),
            "rolling_stock": random.choice(["valid", "expired", "pending"]),
            "signalling": random.choice(["valid", "expired", "pending"]),
            "telecom": random.choice(["valid", "expired", "pending"])
        },
        "branding": {
            "is_wrapped": random.choice([True, False]),
            "advertiser": random.choice(["Coca-Cola", "Samsung", "Kerala Tourism", None]),
            "contract_hours_remaining": random.randint(0, 100) if random.choice([True, False]) else 0
        },
        "health_metrics": {
            "door_system": random.randint(85, 100),
            "braking_system": random.randint(90, 100),
            "hvac_system": random.randint(80, 100),
            "traction_motor": random.randint(85, 100),
            "overall_health": random.randint(85, 100)
        }
    }
    trains.append(train)

# Generate depot information
depots = [
    {
        "id": "muttom_depot",
        "name": "Muttom Depot",
        "location": {"lat": 10.0727, "lon": 76.3337},
        "capacity": {
            "total_tracks": 15,
            "maintenance_bays": 4,
            "cleaning_bays": 3,
            "inspection_bays": 2
        },
        "current_occupancy": {
            "total_trains": random.randint(10, 15),
            "maintenance": random.randint(2, 4),
            "cleaning": random.randint(1, 3),
            "standby": random.randint(5, 8)
        },
        "staff": {
            "total": 150,
            "current_shift": 45,
            "maintenance_crew": 15,
            "cleaning_crew": 10,
            "security": 5
        }
    }
]

# Generate real-time operational data
current_time = datetime.now()
operational_status = {
    "timestamp": current_time.isoformat(),
    "system_status": "operational",
    "total_trains": len(trains),
    "active_trains": len([t for t in trains if t["status"] == "in_service"]),
    "passenger_load": random.randint(15000, 25000),  # current passengers
    "daily_ridership": random.randint(80000, 100000),  # based on 82k average
    "service_frequency": "8 minutes",
    "punctuality": random.uniform(97.5, 99.5),  # percentage
    "incidents": random.randint(0, 2),
    "weather": {
        "condition": random.choice(["sunny", "cloudy", "rainy"]),
        "temperature": random.randint(25, 35),
        "humidity": random.randint(70, 95),
        "visibility": random.randint(8, 15)  # km
    }
}

# Generate maintenance schedules
maintenance_schedule = []
for i, train in enumerate(trains[:10]):  # Schedule for next 10 trains
    schedule = {
        "train_id": train["id"],
        "type": random.choice(["daily_inspection", "weekly_maintenance", "monthly_overhaul"]),
        "scheduled_time": (current_time + timedelta(hours=random.randint(1, 48))).isoformat(),
        "estimated_duration": random.randint(2, 8),  # hours
        "priority": random.choice(["high", "medium", "low"]),
        "maintenance_bay": random.randint(1, 4),
        "crew_assigned": f"Maintenance Team {random.randint(1, 5)}"
    }
    maintenance_schedule.append(schedule)

# Combine all data into digital twin structure
digital_twin_data = {
    "meta": {
        "version": "1.0",
        "last_updated": current_time.isoformat(),
        "system": "KMRL Digital Twin",
        "coverage": "Phase 1 - Aluva to Tripunithura",
        "total_length_km": 27.96
    },
    "infrastructure": {
        "stations": kmrl_stations,
        "depots": depots,
        "track_specifications": {
            "gauge": "1435mm (Standard Gauge)",
            "electrification": "750V DC Third Rail",
            "signalling": "CBTC (Communication Based Train Control)",
            "maximum_speed": 80,  # kmph
            "minimum_headway": 90  # seconds
        }
    },
    "rolling_stock": {
        "trains": trains,
        "fleet_stats": {
            "total_trainsets": len(trains),
            "available": len([t for t in trains if t["status"] in ["in_service", "standby"]]),
            "in_maintenance": len([t for t in trains if t["status"] == "maintenance"]),
            "average_age": "6 years",
            "average_mileage": sum([t["mileage"] for t in trains]) / len(trains)
        }
    },
    "operations": {
        "current_status": operational_status,
        "maintenance_schedule": maintenance_schedule,
        "service_pattern": {
            "weekday_frequency": "8 minutes",
            "weekend_frequency": "10 minutes",
            "first_train": "06:00",
            "last_train": "22:30",
            "peak_hours": ["07:00-09:00", "17:00-19:00"]
        }
    }
}

# Save to JSON file
with open('kmrl_digital_twin.json', 'w') as f:
    json.dump(digital_twin_data, f, indent=2)

print("KMRL Digital Twin Data Generated Successfully!")
print("=" * 50)
print(f"Total Stations: {len(kmrl_stations)}")
print(f"Total Trains: {len(trains)}")
print(f"Active Trains: {operational_status['active_trains']}")
print(f"Current Passenger Load: {operational_status['passenger_load']:,}")
print(f"System Punctuality: {operational_status['punctuality']:.1f}%")
print(f"Maintenance Items Scheduled: {len(maintenance_schedule)}")

# Display sample train data
print("\nSample Train Status:")
for i, train in enumerate(trains[:3]):
    print(f"  {train['id']}: {train['status']} at Station {train['current_station']} ({train['speed']} kmph)")

print(f"\nDigital twin data saved to: kmrl_digital_twin.json")