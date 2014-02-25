import math



radiusInMiles = 3959




def getCurrentPosition(Webapp2Instance):
  latlon = Webapp2Instance.request.headers.get('X-AppEngine-CityLatLong')
  latlon = latlon if latlon != None else '42.373611,-71.109722'
  latlon.replace(' ','')
  lat = float(latlon.split(',')[0])
  lon = float(latlon.split(',')[1])
  return {
    'lat': lat,
    'lon': lon
  }




def getDistance(position1, position2):

    # Convert latitude and longitude to 
    # spherical coordinates in radians.
    degrees_to_radians = math.pi/180.0
        
    # phi = 90 - latitude
    phi1 = (90.0 - position1['lat'])*degrees_to_radians
    phi2 = (90.0 - position2['lat'])*degrees_to_radians
        
    # theta = longitude
    theta1 = position1['lon']*degrees_to_radians
    theta2 = position2['lon']*degrees_to_radians
        
    # Compute spherical distance from spherical coordinates.
        
    # For two locations in spherical coordinates 
    # (1, theta, phi) and (1, theta, phi)
    # cosine( arc length ) = 
    #    sin phi sin phi' cos(theta-theta') + cos phi cos phi'
    # distance = rho * arc length
    
    cos = (math.sin(phi1)*math.sin(phi2)*math.cos(theta1 - theta2) + 
           math.cos(phi1)*math.cos(phi2))
    arc = math.acos( cos )

    # Remember to multiply arc by the radius of the earth 
    # in your favorite set of units to get length.
    return arc*radiusInMiles