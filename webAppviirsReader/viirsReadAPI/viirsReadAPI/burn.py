import sys
import os
import earthaccess as ea
import datetime
from getTile import getCoordsFromSubTile
#print(sys.prefix)

import numpy as np
from osgeo import gdal


data = dict()

cwd = os.getcwd()
print(cwd)

gdal.UseExceptions()

#print('a')

#file = "a.hdf"
p1 = [(0, 5),(-5, 5),(-5, 0),(0, 0),(0,5)]
t1 = ("2001-02-02", "2001-02-04")
t2 = ("2003-01-01", "2003-01-01")
#try:
 #  dataset = gdal.Open(file,gdal.GA_ReadOnly) # ,gdal.GA_ReadOnly
#except:
 #  print("no")
 #  sys.exit()
ea.login(persist=True)

def markus(p,t):
   #ea.login(persist=True)
   getDataTerra(p,t)
   getDataAqua(p,t)

   return data
def getDataTerra(p,t):
   
   results = ea.search_data(
    short_name='MOD14A1',
    polygon=p,  
    temporal=t,
    count=-1
   )

   ea.download(results,cwd + "/tmp")
   openFiles(t[0])

def getDataAqua(p,t):
   
   results2 = ea.search_data(
          short_name='MYD14A1',
          polygon=p,  
          temporal=t,
          count=-1
         )
      
   ea.download(results2,cwd + "/tmp")
   openFiles(t[0])




#files = ea.open(results)

def dateConv(d):
  
   year = int(d[0]+d[1]+d[2]+d[3])
   month = int(d[5]+d[6])
   day = int(d[8]+d[9])
   doy = datetime.datetime(year,month,day).timetuple().tm_yday
   return doy

def process(g,h,v,isInitial=False):
   print(isInitial)
   data1 = []
   
   i1 = 0
   j1 = 0
   for i in g:
      for j in i:
         if j >= 7:
            coords = getCoordsFromSubTile(h,v,i1,j1)
            #data.append([int(j),coords[0],coords[1]])
            if data.get((h,v,i1,j1)) == None:
               if isInitial:
                  data[(h,v,i1,j1)] = j
               #else:
                  #print("change0")
                  
            else:
               data[(h,v,i1,j1)] = min(data[(h,v,i1,j1)],j)
               #print("change")
            #ma1 = max(ma1,coords[0])
            #mi1 = min(mi1,coords[0])
            #ma2 = max(ma2,coords[1])
            #mi2 = min(mi2,coords[1])
         elif data.get((h,v,i1,j1)) != None:
            del data[(h,v,i1,j1)]
            #print("change2")
         j1+=1
      
      i1 += 1
      j1 = 0
   #print(ma2)
   #print(mi2)
   #return data1

def mod14(d,date,h,v):
   doy = dateConv(date)
   day = (doy - 1) % 8
   sub = d.GetSubDatasets()
   #for i in sub:
    #  print(i[1])
   file = gdal.Open(sub[0][0])
   grid = file.ReadAsArray()[day]
   process(grid,h,v,True)

def myd14(d,date,h,v):
   doy = dateConv(date)
   day = (doy - 1) % 8
   sub = d.GetSubDatasets()
   #for i in sub:
    #  print(i[1])
   file = gdal.Open(sub[0][0])
   grid = file.ReadAsArray()[day]
   process(grid,h,v,False)


def openFiles(date):
   #os.listdir(cwd + "/tmp")
   #data = []
   for f in os.listdir(cwd + "/tmp"):
      print(f)
      if(f.find("MOD14A1") >= 0 and f.find("A" + date[0]+date[1]+date[2]+date[3]) >= 0):
         d = gdal.Open(cwd + "/tmp/" + f,gdal.GA_ReadOnly)
         h = int(f[18] + f[19])
         v = int(f[21] + f[22])
         #data.append(mod14(d,date,h,v))
         mod14(d,date,h,v)
         d = None
      if(f.find("MYD14A1") >= 0 and f.find("A" + date[0]+date[1]+date[2]+date[3]) >= 0):
         d = gdal.Open(cwd + "/tmp/" + f,gdal.GA_ReadOnly)
         h = int(f[18] + f[19])
         v = int(f[21] + f[22])
         #data.append(myd14(d,date,h,v))
         myd14(d,date,h,v)
         d = None
      os.remove(cwd + "/tmp/" + f)
   #print(data)
   #return data


getDataTerra(p1,t2)
getDataAqua(p1,t2)
print(data)
#print(dateConv("2000-12-31"))



#print(data)







#files = None



#d1 = sub[0]
#handle = gdal.Open(d1[0])
#print(handle)
#arr = handle.ReadAsArray()
#print(arr)
#print(np.shape(arr))







