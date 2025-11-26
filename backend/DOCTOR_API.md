# Doctor API Endpoints

## Public Routes

### Get All Doctors
```
GET /api/doctors
```

### Get Single Doctor
```
GET /api/doctors/:id
```

## Protected Doctor Routes (JWT Required + Doctor Role)

### Profile Management
```
PUT /api/doctors/profile
Body: { name?, specialization?, experience?, fees?, profilePic? }
```

### Dashboard
```
GET /api/doctors/dashboard
Response: {
  stats: { totalAppointments, totalPatients, averageRating, todayAppointments },
  todayAppointments: [...]
}
```

### Appointments
```
GET /api/doctors/appointments?status=PENDING&date=2024-01-15
Response: { appointments with patient and treatment details }
```

### Reviews
```
GET /api/doctors/reviews
Response: {
  reviews: [...],
  stats: { averageRating, totalReviews }
}
```

### Treatment Management
```
GET /api/doctors/treatments
POST /api/doctors/treatments
Body: { name, description?, category, duration, price }

PUT /api/doctors/treatments/:id
Body: { name?, description?, category?, duration?, price? }

DELETE /api/doctors/treatments/:id
```

### Schedule Management
```
PUT /api/doctors/schedule
Body: {
  schedules: [
    { day: "MONDAY", isOff: false, offSlots: ["09:00", "14:00"] },
    { day: "TUESDAY", isOff: true, offSlots: [] }
  ]
}
```

## Treatment Categories
- CLEANING
- FILLING
- ROOT_CANAL
- EXTRACTION
- ORTHODONTICS
- COSMETIC
- SURGERY

## Days
- MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY