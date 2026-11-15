import math

modisR = 6371007.181
modisT = 1111950.0
modisW = modisT / 1200.0
xMin = -20015109.0
yMax = 10007555.0

modisEquator = 2 * math.pi * modisR
#print(modisEquator)

def getTile(lat,lon):
    y = lat
    x = lon * math.cos(math.radians(y))
    x += 180.0
    x /= 10.0
    x = math.floor(x)
    y += 90.0
    y /= 10.0
    y = math.floor(y)
    
    y = 17 - y
    if y == 18:
        y -= 1
    if x == 36:
        x -= 1
    return [y,x]

def getSubTile(lat,lon):
    lat1 = math.radians(lat)
    lon1 = math.radians(lon)
    y = modisR * lat1
    x = modisR * lon1 * math.cos(lat1)
    #print(x)
    #print(y)
    h = math.floor((x-xMin)/modisT)
    v = math.floor((yMax-y)/modisT)
    #j = math.floor(((x-xMin)%modisT)/modisW - 0.5)
    #i = math.floor(((yMax-y)%modisT)/modisW - 0.5)
    j = math.floor(((x-xMin)%modisT)/modisW)
    i = math.floor(((yMax-y)%modisT)/modisW)
    return [h,v,i,j]

# lat 34 lon 56


def getSinus(lat,lon):
    y = lat
    x = lon * math.cos(math.radians(y))
    return [y,x]


#print(getTile(80.412500,127.367226))
#print(getTile(89,2))




# y = ax + b
# x = cy + d

# ax + b /// x * cos(ax+b)
# focus on edges
# y /// (cy + d) * cos(y)


def getMODISFile(date,coord):
    tile = getTile(coord[0],coord[1])

def getCoordsFromSubTile(h,v,i,j):
    x = (j+0.5) * modisW + h * modisT + xMin
    y = yMax -((i+0.5) * modisW) - v * modisT 
    #print(x)
    #print(y)
    lat = y / modisR
    lon = x / (modisR * math.cos(lat))
    
    return [math.degrees(lat),math.degrees(lon)]

a = getCoordsFromSubTile(19,8,0,0)
c = getCoordsFromSubTile(19,8,1199,0)
b = getCoordsFromSubTile(19,8,1199,1199)

#print(a)
#print(b)
##print(c)

def gt(a):
    #return getSubTile(a[0],a[1])
    return

#print(gt(a))
#print(gt(b))
##print(gt(c))