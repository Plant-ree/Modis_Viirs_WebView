# Source - https://stackoverflow.com/a/57906124
# Posted by TheSmartMonkey, modified by community. See post 'Timeline' for change history
# Retrieved 2026-10-22, License - CC BY-SA 4.0


#to activate the virtual environment, cd (folder of project) and then .venv\Scripts\activate
from flask import Flask, request, jsonify, after_this_request
from flask_cors import CORS

import earthaccess
import os
#import cartopy.crs as ccrs
import matplotlib.colors
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap, BoundaryNorm
from matplotlib.patches import Patch
#from cartopy.mpl.gridliner import LatitudeFormatter, LongitudeFormatter
import numpy as np
import h5py


app = Flask(__name__)
CORS(app)


#send back data so js can process it furhter
@app.route('/data', methods=['GET'])
def data():
    @after_this_request
    def add_header(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    
    jsonResp = {'jack': 4098, 'sape': 4139}
    return jsonify(jsonResp)

#you can receive polygon coordinates with post, I just don't have it implemented here but I've tried it.
@app.route('/coords', methods=['POST'])
def coords():

    content = request.json
    #content['vector'].append(content['vector'][0])
    contentVect = []
    for x in content['vector']:
        contentVect.append([x['lng'], x['lat']])


    #Sorting contentVect so it's always counter-clockwise, YOU HAVE TO DO THIS, IT'S STILL AN ISSUE. do it afterwards
    def sort_coordinates(list_of_xy_coords):
        x, y = np.transpose(list_of_xy_coords)
        angles = np.arctan2(x-content['center'][1], y-content['center'][0])
        indices = np.argsort(-angles)
        temp_list = list_of_xy_coords[:]
        i = 0
        for x in indices:
            list_of_xy_coords[i] = temp_list[x]
            i = i + 1
        return list_of_xy_coords
    
    contentVect = sort_coordinates(contentVect)
    contentVect.append(contentVect[0])
    print("{} {}".format(content['center'][0], content['center'][1]))
    print("\n")
    print(contentVect)
    
    #getting nc files
    results = earthaccess.search_data(
    short_name="VNP14IMG",
    polygon=contentVect,
    temporal=(content['date'], content['date']),
    count=-1
    )
    earthaccess.login(persist=True)

    #temp code, reading .nc files
    
    #files = ["VNP14IMG.A2026294.1630.002.2026295184557.nc", "VNP14IMG.A2026294.1624.002.2026295184605.nc"]
    
    if len(results) != 0:
        files = os.listdir(os.getcwd() + "/ViirsDownloadedFiles")
        for file in files:                  
            os.remove(os.getcwd() + "/ViirsDownloadedFiles/" + file)
        earthaccess.download(results, os.getcwd() + "/ViirsDownloadedFiles")
        files = os.listdir(os.getcwd() + "/ViirsDownloadedFiles")
        print(files)
        results_fin = []
    
        for file_name in files:
            with h5py.File("./ViirsDownloadedFiles/" + file_name, mode="r") as f:
                # Read data.
                name = "FP_T5"
                data = f[name][:]

                # Get the geolocation data
                lat = f["/FP_latitude"][:]
                lon = f["/FP_longitude"][:]
        
            colors = ['#808080', '#808080', '#808080', '#808080', '#808080', '#808080', '#808080', '#FF9500', '#FF0000', '#8B0000']
            cmap = ListedColormap(colors)

            norm = matplotlib.colors.Normalize()
            tempData = norm(data)
            rgba = cmap(tempData)
            hex_colors = [matplotlib.colors.to_hex(c) for c in rgba]

            result_array = np.column_stack((hex_colors, lon, lat)).astype(object)
            result_list = result_array.tolist()
            
            for x in result_list:
                if x[0] != '#808080':
                    results_fin.insert(-1, x)
        return jsonify(results_fin)
    return jsonify([]);



if __name__ == '__main__':
    app.run(host='localhost', port=8000) 