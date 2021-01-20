from osgeo import gdal
import sys

ds=gdal.Open(sys.argv[1])
print(ds.GetProjection())