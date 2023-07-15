# Log: 09/05/22 | Added skew | slope
# Log: 12/07/22 | Added HSV
# Log: 05/09/22 | Added Major ellipse axis
# Log: 15/09/22 | Added patches, angles and distances at GLCM and removed skew

#%%%
import os, cv2
import pandas as pd, seaborn as sns
from operator import itemgetter
from scipy import stats

from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import confusion_matrix

from skimage import measure
from skimage.morphology import convex_hull_image
from skimage.measure import label, regionprops, regionprops_table
from skimage.feature import greycomatrix, greycoprops
from skimage.draw import rectangle,polygon,ellipse_perimeter
from skimage.color import rgb2gray
from skimage.util import img_as_ubyte
from skimage import img_as_float

import argparse
parser = argparse.ArgumentParser()
parser.add_argument("-vo", "--volcano", help="First two characters of the volcano", type=str)
args = parser.parse_args()
vo = args.volcano

from helper import *

#os.chdir('/home/damia001/process')
directory = '/home/damia001/relabeled'
os.chdir(directory)

if not os.path.exists(os.path.join(directory, 'results')):
	os.mkdir(os.path.join(directory, 'results'))

def mask(ch4):

	alpha_ch = ch4[...,3]
	rgb_image = ch4[...,:3]
	global thr
	ret, thr = cv2.threshold(alpha_ch, 120, 255, cv2.THRESH_BINARY)
	global height
	global width
	height, width = thr.shape

	contours, hier = cv2.findContours(thr, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
	global contour
	contour = max(contours, key = len)
	part_mask = np.zeros(rgb_image.shape)
	part_mask = cv2.drawContours(part_mask, [contour], -1,(255,255,255), -1)

	rgb_masked = rgb_image.copy()
	rgb_masked[np.logical_not(part_mask)] = 0        

	return part_mask[...,0], rgb_masked

def shape(alpha_ch):
	# find contour and image moments

	M = cv2.moments(contour)
	minRect = cv2.minAreaRect(contour)
	_, (w, l), _ = minRect		 
	# skimage function to select a roi
	major_ellipse_axis = props.major_axis_length
	minor_ellipse_axis = props.minor_axis_length
	# particle descriptives
	global y_centroid
	global x_centroid
	y_centroid, x_centroid = props.centroid
	part_perim = props.perimeter    
	area = props.area
	# calculate hull
	hull = convex_hull_image(alpha_ch)
	hull_perim = measure.perimeter(hull)

	# measure properties
	eccentricity_moments = eccentricity_from_moments(M)
	eccentricity_ellipse = eccentricity_from_ellipse(contour)
	eccentricity = props.eccentricity
	#asp_rat is imported from helper.py and uses width and height, which is not as precise as Dminferret and Dmaxferret in Liu
	aspect_rat = aspect_ratio(contour) # (Leibrandt and Le Pennec, 2015)
	solidity = props.solidity # Area / Area_hull # Liu et al., 2015
	convexity = hull_perim / part_perim #  usually the value is not greater than 1 # (Liu et al., 2015)
	circ_func = lambda r: (4 * math.pi * r.area) / (r.perimeter * r.perimeter)
	circ_cioni = circ_func(props) # or FF in Liu et al., 2015
	circ_dellino = part_perim/(2*math.sqrt(math.pi*area)) # P/C in Partisan (Durig et al., 2018)
	rectangularity = part_perim / (2*l + 2*w) # (Dellino and La Volpe, 1996)
	compactness = area / (l * w) # (Dellino and La Volpe, 1996)
	elongation = (props.feret_diameter_max ** 2) / area # (Liu et al., 2015)
	roundness = 4*area / (math.pi * (props.feret_diameter_max ** 2)) # (Liu et al., 2015)
	# important factors
	circ_rect = circ_dellino * rectangularity
	comp_elon = compactness * elongation
	circ_elon = circ_dellino * elongation
	rect_comp = rectangularity * compactness
	shape_dict = {'convexity':convexity,'rectangularity':rectangularity, 'elongation':elongation, 'roundness':roundness, 'circularity_cioni':circ_cioni, 'circularity_dellino':circ_dellino, 'eccentricity_moments':eccentricity_moments,'eccentricity_ellipse':eccentricity_ellipse,'solidity':solidity, 'aspect_rat':aspect_rat, 'compactness':compactness, 'circ_rect':circ_rect, 'comp_elon':comp_elon, 'circ_elon':circ_elon, 'rect_comp':rect_comp}
	return shape_dict

def texture(image):
	gray = rgb2gray(image)
	image = img_as_ubyte(gray) 
	bins = np.array([0, 16, 32, 48, 64, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 240, 255]) #16-bit
	inds = np.digitize(image, bins) # makes bins for the pixel range from 0 to 15  
	max_value = inds.max()+1

	PATCH_SIZE = int(props.major_axis_length/10) # this is about 500 pixels for this image
	STEP = int(props.major_axis_length/20)
	thetas = [0, np.pi/8, np.pi/4, np.pi/2, 3*np.pi/4, np.pi, np.pi+np.pi/4, np.pi+np.pi/2, np.pi+3*np.pi/4, 
	np.pi/4 + np.pi/8, np.pi/2 + np.pi/8, 3*np.pi/4 + np.pi/8, np.pi + np.pi/8, np.pi+np.pi/4 + np.pi/8, 
	np.pi+np.pi/2 + np.pi/8, np.pi+3*np.pi/4 + np.pi/8]

	# define locations within the particle at a given step
	locs = [(int(y_centroid), int(x_centroid))]

	for theta in thetas:
		for ii in range(1000):
			i = ii+1
			new_y = int(y_centroid-np.sin(theta)*STEP*i)
			new_x = int(x_centroid+np.cos(theta)*STEP*i)
			if new_x < width and new_x > 0 and new_y < height and new_y > 0:
				co = (new_y, new_x)
				if thr[co]>0:
					locs.append(co)
			else: break

	# take patches that are fully within the particle at a PATCH_SIZE
	locs_no_background = []
	patches = []

	for idx, loc in enumerate(locs):
			patch = (thr[loc[0]:loc[0] + PATCH_SIZE, loc[1]:loc[1] + PATCH_SIZE])
			
			if patch.min() > 0:
				glcm_patch = (inds[loc[0]:loc[0] + PATCH_SIZE,loc[1]:loc[1] + PATCH_SIZE])
				locs_no_background.append((loc[0], loc[1]))
				patches.append(glcm_patch)

	# define distances at which the target pixel will be compared to the origin pixel for the glcm
	distances = [1]

	for i in range(5):
		d = int((i+1)/5 * PATCH_SIZE)
		distances.append(d)


	# init lists for texture features
	contrast_patches = []
	dissimilarity_patches = []
	homogeneity_patches = []
	energy_patches = []
	correlation_patches = []
	asm_patches = []

	for idx, patch in enumerate(patches):
		# this checks whether at an angle theta the target pixel is not out of the particle
		#print(f'Computing GLCM of patch {idx}/{len(patches)} located at {locs[idx]}')
		matrix_coocurrence = greycomatrix(patch, distances, thetas, levels=max_value, normed=False, symmetric=False)
		contrast = greycoprops(matrix_coocurrence, 'contrast')
		contrast_mean = contrast.mean()   
		contrast_patches.append(contrast_mean)
		dissimilarity = greycoprops(matrix_coocurrence, 'dissimilarity')    
		dissimilarity_mean = dissimilarity.mean()   
		dissimilarity_patches.append(dissimilarity_mean)
		homogeneity = greycoprops(matrix_coocurrence, 'homogeneity')
		homogeneity_mean = homogeneity.mean()   
		homogeneity_patches.append(homogeneity_mean)
		energy = greycoprops(matrix_coocurrence, 'energy')
		energy_mean = energy.mean()
		energy_patches.append(energy_mean)
		correlation = greycoprops(matrix_coocurrence, 'correlation')
		correlation_mean = correlation.mean()   
		correlation_patches.append(correlation_mean)
		asm = greycoprops(matrix_coocurrence, 'ASM')
		asm_mean = asm.mean()
		asm_patches.append(asm_mean)

	# average the results from each patch
	contrast_averaged = sum(contrast_patches)/len(contrast_patches)  
	dissimilarity_averaged = sum(dissimilarity_patches)/len(dissimilarity_patches) 
	homogeneity_averaged = sum(homogeneity_patches)/len(homogeneity_patches) 
	energy_averaged = sum(energy_patches)/len(energy_patches) 
	correlation_averaged = sum(correlation_patches)/len(correlation_patches)  
	asm_averaged = sum(asm_patches)/len(asm_patches)  

	texture_dict = {'contrast':contrast_averaged,'dissimilarity':dissimilarity_averaged,'homogeneity':homogeneity_averaged,'energy':energy_averaged,'correlation':correlation_averaged,'asm':asm_averaged}
	return texture_dict

def color(image):
	color_dict = {}
	for i, c in enumerate(['blue','green','red']):
		channel = image[...,i]
		values = channel[channel>0] # this is to remove the background
		color_dict[f'{c}_mean'] = values.mean() 
		color_dict[f'{c}_std'] = values.std()
		color_dict[f'{c}_mode'] = int(stats.mode(values)[0]) 
		#color_dict[f'{c}_skew'] = int(stats.skew(values))

		hist,_ = np.histogram(values, bins=255)
		hist = zeros2midpoints(hist)
		
		slopes = []
		for i, v in enumerate(hist):
			if i > 0:
				curr = hist[i]
				prev = hist[i-1]
				slope = abs(curr-prev)
				slopes.append(slope)

		no_pixels = len(values)
		#color_dict[f'{c}_slope'] = ((sum(slopes)/len(slopes))/no_pixels)*100

	hsv_image = cv2.cvtColor(image[...,::-1], cv2.COLOR_BGR2HSV) # [...,::-1] to flip rgb to bgr
	for i, c in enumerate(['hue','saturation','value']):
		channel = hsv_image[...,i]
		values = channel[channel>0] # this is to remove the background. Black has a hue angle of 0 degrees, a saturation of 0% and a lightness of 0%.
		color_dict[f'{c}_mean'] = values.mean() 
		color_dict[f'{c}_std'] = values.std()
		color_dict[f'{c}_mode'] = int(stats.mode(values)[0]) 

	return color_dict


def main(filenames):  
	'''Returns shape, color and texture for a normalized image collection'''
	qia_dict = {}

	total = 0
	for idx, filename in enumerate(filenames):
		# eg filename is ./CV/CV-DB1/particles/black_background/CV-DB1_8_b_phi0phi1_5x_01_30_blackbackground.png

		ch4 = cv2.imread(filename, cv2.IMREAD_UNCHANGED)
		alpha_ch, rgb_masked = mask(ch4)
		
		root = '/'.join(filename.split('/')[:4])
		name = filename.split('.')[0].split('/')[-1] # 'CV-DB1_8_b_phi0phi1_5x_01_30_'
		#alpha_ch = cv2.imread(f'{root}/alpha/{name}_alpha.png', cv2.IMREAD_UNCHANGED)
		#alpha_ch = alpha_ch[:,:,-1]        
		label_image = label(alpha_ch)
		regions = regionprops(label_image)
		area = [ele.area for ele in regions] 
		largest_region_idx = np.argmax(area)
		global props
		props = regions[largest_region_idx]

		if props.area < 50000:

			plt.imshow(thr)
			plt.savefig(f'./results/{name}_thr.png')
			plt.close()
			for i, region in enumerate(regions):
				plt.imshow(region.image)
				plt.savefig(f'./results/{name}_region{i}.png')
			
		else:
			total += 1
			dict1 = shape(alpha_ch)
			dict2 = texture(rgb_masked)
			dict3 = color(rgb_masked)


			qia_dict[name] = {**dict1, **dict2, **dict3}
	df = pd.DataFrame.from_dict(qia_dict, orient='index')
	df.to_csv('./results/qia_final.csv', mode='a', header=True) 
	print(f'Processed images {total}/{len(filenames)}')
	return qia_dict

filenames = [f for f in os.listdir(directory) if f[:2] == vo]
main(filenames)


