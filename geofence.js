// ============================================================
//  GEOFENCE: Point-in-Polygon (Ray Casting Algorithm)
//  This file checks if a GPS coordinate is inside the campus.
// ============================================================

// ============================================================
//  CAMPUS POLYGON
//  Replace these coordinates with YOUR actual campus GPS points.
//  Go around the campus in order (clockwise or counter-clockwise).
// ============================================================

const campusPolygon = [
    { lat: 7.7050341, lng: 125.9949556 },  // Point 1 - NW (Northwest)
    { lat: 7.704967, lng: 125.995796 },  // Point 2 - N (North)
    { lat: 7.7049305, lng: 125.9962381 },  // Point 3 - NE (Northeast)
    { lat: 7.7043135, lng: 125.9963115 },  // Point 4 - E (East)
    { lat: 17.7037556, lng: 125.9964553 },  // Point 5 - SE (Southeast)
    { lat: 7.703857, lng: 125.995838 },  // Point 6 - S (South)
    { lat: 7.7040105, lng: 125.9949007 },  // Point 7 - SW (Southwest)
    { lat: 7.7044178, lng: 125.9949241 }   // Point 8 - W (West)
];

// ============================================================
//  POINT-IN-POLYGON ALGORITHM (Ray Casting)
//  Returns true if the point (lat, lng) is inside the polygon.
//  Returns false if outside.
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
//  Returns the distance in meters between two GPS points.
//  Useful for showing how far a student is from campus.
// ============================================================

function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Earth radius in meters
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
//  GET CAMPUS CENTER (for map display)
//  Returns the average lat/lng of all polygon points.
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

// ============================================================
//  GET ACTIVE SUBJECT
//  Returns the subject ID and name based on current time.
// ============================================================

function getActiveSubject(subjects, currentTime) {
    // currentTime is in minutes since midnight (e.g. 8:30 AM = 510)

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

    return null; // No active subject
}