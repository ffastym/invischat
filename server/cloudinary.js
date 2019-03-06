import cloudinary from 'cloudinary'

cloudinary.config({
    cloud_name: 'dfgkgr7ui',
    api_key: '378214187267952',
    api_secret: 'n83CrrO9e9lGS50UW2Dt25_oAgU'
});

/**
 * Cloudinary API
 *
 * @type {{removeImage: Cloudinary.removeImage, removeAllUploads: Cloudinary.removeAllUploads}}
 */
const Cloudinary = {
    /**
     * Remove last uploaded image
     *
     * @param img
     */
    removeImage: (img) => {
        cloudinary.v2.uploader.destroy(img, {invalidate: true}, (error) => {
            //try again if error occur
            if (error) {
                setTimeout(() => {
                    cloudinary.v2.uploader.destroy(img)
                }, 60000)
            }
        });
    },

    /**
     * Remove all uploaded images
     */
    removeAllUploads: () => {
        cloudinary.v2.api.delete_all_resources({invalidate: true}, (error, result) => {
            error && console.log(error);
        })
    }
};

export default Cloudinary
