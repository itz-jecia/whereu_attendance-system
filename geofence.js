// ============================================================
//  GEOFENCE: Point-in-Polygon (Ray Casting Algorithm)
// ============================================================

// ============================================================
//  CAMPUS POLYGON
// ============================================================

const campusPolygon = [
    { lat: 7.7050341, lng: 125.9949556 },  // Point 1 - NW
    { lat: 7.704967,  lng: 125.995796 },   // Point 2 - N
    { lat: 7.7049305, lng: 125.9962381 },  // Point 3 - NE
    { lat: 7.7043135, lng: 125.9963115 },  // Point 4 - E
    { lat: 7.7037556, lng: 125.9964553 },  // Point 5 - SE
    { lat: 7.703857,  lng: 125.995838 },   // Point 6 - S
    { lat: 7.7040105, lng: 125.9949007 },  // Point 7 - SW
    { lat: 7.7044178, lng: 125.9949241 }   // Point 8 - W
];

function isInsideGeofence(lat, lng) {
    let inside = false;
    for (let i = 0, j = campusPolygon.length - 1; i < campusPolygon.length; j = i++) {
        const xi = campusPolygon[i].lng;
        const yi = campusPolygon[i].lat;
        const xj = campusPolygon[j].lng;
        const yj = campusPolygon[j].lat;

        if (((yi > lat) !== (yj > lat)) &&
            (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
            inside = !inside;
        }
    }
    return inside;
}

// ===== SELF-TEST (runs once when file loads) =====
console.log("=== GEOFENCE SELF-TEST ===");
console.log("campusPolygon has", campusPolygon.length, "points");
console.log("Center (7.7045, 125.9955):", isInsideGeofence(7.7045, 125.9955));
console.log("NW corner (7.7050341, 125.9949556):", isInsideGeofence(7.7050341, 125.9949556));
console.log("SE corner (7.7037556, 125.9964553):", isInsideGeofence(7.7037556, 125.9964553));
console.log("Far away (7.7000, 125.9900):", isInsideGeofence(7.7000, 125.9900));
console.log("=== END TEST ===");

// ============================================================
//  POINT-IN-POLYGON ALGORITHM
// ============================================================

function isInsideGeofence(lat, lng) {
    let inside = false;
    for (let i = 0, j = campusPolygon.length - 1; i < campusPolygon.length; j = i++) {
        const xi = campusPolygon[i].lat;
        const yi = campusPolygon[i].lng;
        const xj = campusPolygon[j].lat;
        const yj = campusPolygon[j].lng;

        const intersect = ((yi > lng) !== (yj > lng)) &&
            (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }
    return inside;
}

// ============================================================
//  HAVERSINE DISTANCE
// ============================================================

function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const toRad = (deg) => deg * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// ============================================================
//  GET CAMPUS CENTER
// ============================================================

function getCampusCenter() {
    let latSum = 0, lngSum = 0;
    campusPolygon.forEach(point => {
        latSum += point.lat;
        lngSum += point.lng;
    });
    return {
        lat: latSum / campusPolygon.length,
        lng: lngSum / campusPolygon.length
    };
}  // ← CLOSING BRACE FIXED

// ============================================================
//  GET ACTIVE SUBJECT
// ============================================================

function getActiveSubject(subjects, currentTime) {
    for (const subjectID in subjects) {
        const subject = subjects[subjectID];
        const [startH, startM] = subject.start.split(':').map(Number);
        const [endH, endM] = subject.end.split(':').map(Number);

        const startTime = startH * 60 + startM;
        const endTime = endH * 60 + endM;

        if (currentTime >= startTime && currentTime <= endTime) {
            return { id: subjectID, name: subject.name };
        }
    }
    return null;
}
