# Source - https://stackoverflow.com/a/57906124
# Posted by TheSmartMonkey, modified by community. See post 'Timeline' for change history
# Retrieved 2026-10-22, License - CC BY-SA 4.0


#to activate the virtual environment, cd (folder of project) and then .venv\Scripts\activate
from flask import Flask, request, jsonify, after_this_request
from flask_cors import CORS

#import nc libs
import os
import cartopy.crs as ccrs
import matplotlib.colors
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap, BoundaryNorm
from matplotlib.patches import Patch
from cartopy.mpl.gridliner import LatitudeFormatter, LongitudeFormatter
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

    #temp code, reading .nc files
    FILE_NAME = "VNP14IMG.A2026294.1630.002.2026295184557.nc"
    files = ["VNP14IMG.A2026294.1630.002.2026295184557.nc", "VNP14IMG.A2026294.1624.002.2026295184605.nc"]
    results_fin = []
    
    for file_name in files:
        with h5py.File(file_name, mode="r") as f:
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
        results_fin.insert(-1, result_list)
        
    return jsonify(results_fin)



if __name__ == '__main__':
    app.run(host='localhost', port=8000) 