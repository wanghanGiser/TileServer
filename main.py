import gdal2tiles
import sys
from osgeo import gdal
def main():
    options={
        'webviewer':'none',
        'profile':'mercator',
        'webviewer':'openlayers',
        'nb_processes':4
    }
    if sys.argv[3]=="":
        options['srcnodata']=None
    else:
        options['srcnodata']=sys.argv[3]
    gdal2tiles.generate_tiles(
        sys.argv[1], sys.argv[2], **options)
if __name__ == '__main__':
    main()