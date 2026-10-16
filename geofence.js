// ============================================================
//  GEOFENCE: Point-in-Polygon (Ray Casting Algorithm)
// ============================================================

// ============================================================
//  CAMPUS POLYGON
// ============================================================

const campusPolygon = [
    { lat: 7.7050000, lng: 125.9950000 },
    { lat: 7.7049500, lng: 125.9957500 },
    { lat: 7.7049000, lng: 125.9962000 },
    { lat: 7.7043000, lng: 125.9962500 },
    { lat: 7.7038000, lng: 125.9964000 },
    { lat: 7.7039000, lng: 125.9958000 },
    { lat: 7.7040500, lng: 125.9949500 },
    { lat: 7.7044000, lng: 125.9949700 }
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

// ============================================================
//  ANTI-SPOOFING DETECTION
// ============================================================

function checkGPSSpoofing(lat, lng, accuracy, previousRecord) {
    // If no previous record exists, allow it
    if (!previousRecord || !previousRecord.latitude || !previousRecord.timestamp) {
        return { suspicious: false, reason: null };
    }

    const prevLat = previousRecord.latitude;
    const prevLng = previousRecord.longitude;
    const prevTime = new Date(previousRecord.timestamp).getTime();
    const nowTime = Date.now();
    const timeDiffHours = (nowTime - prevTime) / 3600000;

    // RULE 1: Check for impossible speed
    if (timeDiffHours > 0) {
        const distanceMeters = haversineDistance(prevLat, prevLng, lat, lng);
        const speedKmh = (distanceMeters / 1000) / timeDiffHours;

        if (speedKmh > 50) {
            return {
                suspicious: true,
                reason: 'Impossible speed: ' + speedKmh.toFixed(1) + ' km/h'
            };
        }
    }

    // RULE 2: Check for unrealistically perfect accuracy
    if (accuracy !== null && accuracy !== undefined && accuracy < 1) {
        return {
            suspicious: true,
            reason: 'Unrealistic GPS accuracy: ' + accuracy + 'm'
        };
    }

    // RULE 3: Check for frozen location (same coords too long)
    if (timeDiffHours > 2 && prevLat === lat && prevLng === lng) {
        return {
            suspicious: true,
            reason: 'Location frozen for over 2 hours'
        };
    }

    return { suspicious: false, reason: null };
}
