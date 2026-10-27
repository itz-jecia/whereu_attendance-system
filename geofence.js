// ============================================================
//  HAVERSINE DISTANCE FORMULA
//  Used for 10-meter Classroom Geofence and Anti-Spoofing
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
//  ANTI-SPOOFING CHECK
// ============================================================

function checkGPSSpoofing(lat, lng, accuracy, previousRecord) {
    if (!previousRecord || !previousRecord.latitude || !previousRecord.timestamp) {
        return { suspicious: false, reason: null };
    }

    const prevLat = previousRecord.latitude;
    const prevLng = previousRecord.longitude;
    const prevTime = new Date(previousRecord.timestamp).getTime();
    const nowTime = Date.now();
    const timeDiffHours = (nowTime - prevTime) / 3600000;

    if (timeDiffHours > 0) {
        const distanceMeters = haversineDistance(prevLat, prevLng, lat, lng);
        const speedKmh = (distanceMeters / 1000) / timeDiffHours;
        if (speedKmh > 50) {
            return { suspicious: true, reason: 'Impossible speed: ' + speedKmh.toFixed(1) + ' km/h' };
        }
    }

    if (accuracy !== null && accuracy !== undefined && accuracy < 1) {
        return { suspicious: true, reason: 'Unrealistic GPS accuracy: ' + accuracy + 'm' };
    }

    if (timeDiffHours > 2 && prevLat === lat && prevLng === lng) {
        return { suspicious: true, reason: 'Location frozen for over 2 hours' };
    }

    return { suspicious: false, reason: null };
}

// ============================================================
//  DEVICE IDENTIFICATION (FINGERPRINT)
//  Used to prevent bypassing the system via Incognito mode
// ============================================================

function getDeviceID() {
    let deviceID = localStorage.getItem('whereU_deviceID');
    if (!deviceID) {
        // Create a fingerprint based on hardware and browser settings
        const fingerprint = navigator.userAgent + 
                            screen.width + 'x' + screen.height + 
                            navigator.language + 
                            new Date().getTimezoneOffset();
        
        // Hash the fingerprint into a short ID
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            hash = ((hash << 5) - hash) + fingerprint.charCodeAt(i);
            hash |= 0;
        }
        deviceID = 'dev-' + Math.abs(hash);
        localStorage.setItem('whereU_deviceID', deviceID);
    }
    return deviceID;
}
