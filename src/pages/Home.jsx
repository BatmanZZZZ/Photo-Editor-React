import React, { useState } from 'react'
import { Icon } from '@iconify/react'

const Home = () => {

    const [selectedImage, setSelectedImage] = useState('');
    const [filtername, setFilterName] = useState('');
    const [filterSlider, setFilterSlider] = useState('');
    const [currentFilter, setCurrentFilter] = useState('');
    const [Brightness, setBrightness] = useState(100);
    const [Saturation, setSaturation] = useState(100);
    const [Inversion, setInversion] = useState(0);
    const [Grayscale, setGrayscale] = useState(0);
    const [imageStyles, setImageStyles] = useState({});
    const [rotationAngle, setRotationAngle] = useState(0);
    const [flippedHorizontal, setFlippedHorizontal] = useState(false);
    const [flippedVertical, setFlippedVertical] = useState(false);
    const [filterStyles, setFilterStyles] = useState({});



    const handleFilterSlider = (e) => {
        let styles = { ...filterStyles };
        if (currentFilter === 'Brightness') {
            styles.filter = `brightness(${Brightness}%)`;
            setBrightness(e.target.value);
        } else if (currentFilter === 'Saturation') {
            styles.filter = `saturate(${Saturation}%)`;
            setSaturation(e.target.value);
        } else if (currentFilter === 'Inversion') {
            styles.filter = `invert(${Inversion}%)`;
            setInversion(e.target.value);
        } else if (currentFilter === 'Grayscale') {
            styles.filter = `grayscale(${Grayscale}%)`;
            setGrayscale(e.target.value);
        }
        setFilterSlider(e.target.value);
        setFilterStyles(styles);
    };


    const handleFileInput = () => {
        const fileInput = document.getElementById('file-input');
        fileInput.click();
    }

    const handleImgInput = (e) => {
        const file = e.target.files[0];
        setSelectedImage(URL.createObjectURL(file));
        setCurrentFilter('Brightness'); // Set the current filter to "Brightness"
        setFilterName('Brightness');    // Set the filter name to "Brightness"
        setFilterSlider(Brightness);
    }

    const resetFilters = () => {
        setFilterName('');
        setFilterSlider('');
        setCurrentFilter('');
        setBrightness(100);
        setSaturation(100);
        setInversion(0);
        setGrayscale(0);
        setImageStyles({});
        setRotationAngle(0);
        setFlippedHorizontal(false);
        setFlippedVertical(false);
    };

    const handleFilterButtonClick = (filter) => {
        setCurrentFilter(filter);
        setFilterName(filter);

        let styles = { ...filterStyles };

        // Update filter values based on the selected filter
        let sliderValue = 0;
        if (filter === 'Brightness') {
            sliderValue = Brightness;
        } else if (filter === 'Saturation') {
            sliderValue = Saturation;
        } else if (filter === 'Inversion') {
            sliderValue = Inversion;
        } else if (filter === 'Grayscale') {
            sliderValue = Grayscale;
        }

        setFilterSlider(sliderValue);

        // Update the styles based on the selected filter's value
        styles.filter = `
            brightness(${Brightness}%)
            saturate(${Saturation}%)
            invert(${Inversion}%)
            grayscale(${Grayscale}%)`;

        // Handle rotation and flipping
        let newRotationAngle = rotationAngle;
        let newFlippedHorizontal = flippedHorizontal;
        let newFlippedVertical = flippedVertical;

        if (filter === 'RotateLeft') {
            newRotationAngle -= 90;
        } else if (filter === 'RotateRight') {
            newRotationAngle += 90;
        } else if (filter === 'FlipHorizontal') {
            newFlippedHorizontal = !newFlippedHorizontal;
        } else if (filter === 'FlipVertical') {
            newFlippedVertical = !newFlippedVertical;
        }

        setImageStyles({
            ...styles,
            transform: `rotate(${newRotationAngle}deg)${newFlippedHorizontal ? ' scaleX(-1)' : ''}${newFlippedVertical ? ' scaleY(-1)' : ''}`,
        });

        setRotationAngle(newRotationAngle);
        setFlippedHorizontal(newFlippedHorizontal);
        setFlippedVertical(newFlippedVertical);
    };

    const generateEditedImageDataURL = () => {
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.src = selectedImage;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.filter = `
                brightness(${Brightness}%)
                saturate(${Saturation}%)
                invert(${Inversion}%)
                grayscale(${Grayscale}%)`;

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((Math.PI / 180) * rotationAngle);
            ctx.scale(flippedHorizontal ? -1 : 1, flippedVertical ? -1 : 1);
            ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);

            const editedDataURL = canvas.toDataURL();

            const link = document.createElement('a');
            link.href = editedDataURL;
            link.download = 'edited_image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    };









    return (
        <div id='Main Panel' className=' w-[1050px] h-[500px] bg-[#fff] drop-shadow-lg rounded-lg'>
            <h2 className='text-xl pt-2 pl-4 mb-2 font-medium'>Photo Lab</h2>
            <div id='wrapper' className='flex '>
                <div id='editor-panel' className='w-96 p-4 ml-4  rounded-md border border-solid border-gray-300'>
                    <div id='Filters'>
                        <label id='Filter' className='text-lg font-medium mb-2 pb-4 '>Filters</label>
                        <div id='Filter-Buttons' className='flex flex-wrap justify-between mt-2'>
                            <button
                                className={`${currentFilter === 'Brightness' ? 'bg-green-400' : 'bg-blue-400'
                                    } mb-2 active:bg-green-400 hover:bg-gray-200 rounded-md text-md font-medium w-36 h-10 ${selectedImage ? '' : 'opacity-50 cursor-not-allowed'
                                    }`}
                                onClick={() => handleFilterButtonClick('Brightness')}
                                disabled={!selectedImage}
                            >
                                Brightness
                            </button>
                            <button
                                className={`${currentFilter === 'Saturation' ? 'bg-green-400' : 'bg-blue-400'
                                    } mb-2 active:bg-green-400 hover:bg-gray-200 rounded-md text-md font-medium w-36 h-10 ${selectedImage ? '' : 'opacity-50 cursor-not-allowed'
                                    }`}
                                onClick={() => handleFilterButtonClick('Saturation')}
                                disabled={!selectedImage}
                            >
                                Saturation
                            </button>
                            <button
                                className={`${currentFilter === 'Inversion' ? 'bg-green-400' : 'bg-blue-400'
                                    } active:bg-green-400 hover:bg-gray-200 rounded-md text-md font-medium w-36 h-10 ${selectedImage ? '' : 'opacity-50 cursor-not-allowed'
                                    }`}
                                disabled={!selectedImage}
                                onClick={() => handleFilterButtonClick('Inversion')}
                            >
                                Inversion
                            </button>
                            <button
                                className={`${currentFilter === 'Grayscale' ? 'bg-green-400' : 'bg-blue-400'
                                    } active:bg-green-400 hover:bg-gray-200 rounded-md text-md font-medium w-36 h-10 ${selectedImage ? '' : 'opacity-50 cursor-not-allowed'
                                    }`}
                                disabled={!selectedImage}
                                onClick={() => handleFilterButtonClick('Grayscale')}
                            >
                                Grayscale
                            </button>

                        </div>
                        <div id='Filter-Slider'>
                            <div id='slider-info' className='flex justify-between mt-6'>
                                <p id='filter-name'>{filtername ? filtername : 'Brightness'}</p>
                                <p id='Filter-value'>{filterSlider ? filterSlider : '100'}</p>
                            </div>
                            <input
                                onChange={(e) => handleFilterSlider(e)}
                                className={`w-full ${selectedImage ? '' : 'opacity-50 cursor-not-allowed'}`}
                                disabled={!selectedImage}
                                type="range"
                                id="filter-range"
                                min="0"
                                max="200"
                                value={filterSlider} // Add this line to bind the slider value
                            />

                        </div>
                    </div>
                    <div id='rotate' className='mt-4'>
                        <label id='rotate-buttons' className='text-md font-medium '>Rotate & Flip</label>
                        <div id='Rotate-Buttons' className='flex justify-between pt-4'>
                            <button
                                className={`bg-gray-100 hover:bg-gray-500 rounded-md h-10 w-14 ${selectedImage ? '' : 'opacity-50 cursor-not-allowed'
                                    }`}
                                disabled={!selectedImage}
                                onClick={() => handleFilterButtonClick('RotateLeft')}
                            >
                                <Icon className='ml-4 text-2xl' icon='lucide:rotate-ccw' color='blue' />
                            </button>
                            <button
                                className={`bg-gray-100 hover:bg-gray-500 rounded-md h-10 w-14 ${selectedImage ? '' : 'opacity-50 cursor-not-allowed'
                                    }`}
                                disabled={!selectedImage}
                                onClick={() => handleFilterButtonClick('RotateRight')}
                            >
                                <Icon className='ml-4 text-2xl' icon='lucide:rotate-cw' color='blue' />
                            </button>
                            <button
                                className={`bg-gray-100 hover:bg-gray-500 rounded-md h-10 w-14 ${selectedImage ? '' : 'opacity-50 cursor-not-allowed'
                                    }`}
                                disabled={!selectedImage}
                                onClick={() => handleFilterButtonClick('FlipHorizontal')}
                            >
                                <Icon className='ml-4 text-2xl' icon='mdi:pan-vertical' color='blue' />
                            </button>
                            <button
                                className={`bg-gray-100 hover:bg-gray-500 rounded-md h-10 w-14 ${selectedImage ? '' : 'opacity-50 cursor-not-allowed'
                                    }`}
                                disabled={!selectedImage}
                                onClick={() => handleFilterButtonClick('FlipVertical')}
                            >
                                <Icon className='ml-4 text-2xl' icon='mdi:pan-horizontal' color='blue' />
                            </button>

                        </div>
                    </div>
                </div>
                <div id='preview-img' className='ml-14 mr-2'>
                    <img
                        className='w-[600px] h-96 rounded-md object-contain'
                        src={selectedImage ? selectedImage : '../../public/placeholderimage.webp'}
                        alt='Photo'
                        style={{
                            ...imageStyles,
                            filter: `brightness(${Brightness}%) saturate(${Saturation}%) invert(${Inversion}%) grayscale(${Grayscale}%)`,
                            transform: `rotate(${rotationAngle}deg)${flippedHorizontal ? ' scaleX(-1)' : ''}${flippedVertical ? ' scaleY(-1)' : ''}`,
                        }}
                    />

                </div>
            </div>
            <div id="controls" className='flex justify-between mt-4'>
                <button id="reset-filters" className={`bg-gray-100 hover:bg-gray-500 rounded-md h-10 w-36 ml-4 ${selectedImage ? '' : 'opacity-50 cursor-not-allowed'}`} disabled={!selectedImage} onClick={resetFilters}>Reset Filters</button>
                <div id="img-selection">
                    <input type="file" name="" id="file-input" onChange={(e) => { handleImgInput(e) }} accept='image/*' className='hidden' />
                    <button id="choose-img" onClick={() => { handleFileInput() }} className='bg-gray-500 hover:bg-gray-300 rounded-md h-10 w-36 mr-4'>Choose Image</button>
                    <button id="save-img" className={`bg-blue-500 hover:bg-gray-300 rounded-md h-10 w-36 mr-10 ${selectedImage ? '' : 'opacity-50 cursor-not-allowed'}`} onClick={generateEditedImageDataURL} disabled={!selectedImage}>Save Image</button>
                </div>
            </div>
        </div>
    )
}

export default Home