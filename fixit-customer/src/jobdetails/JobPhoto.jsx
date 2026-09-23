// fixit-customer\src\jobdetails\JobPhoto.jsx

function JobPhoto({
    photos = []
}) {

    if (photos.length <= 0) {
        return(
            <div>
                <div>
                    <i className="fa-solid fa-image"></i>
                </div>
                <div>
                    <i className="fa-solid fa-image"></i>
                </div>
                <div>
                    <i className="fa-solid fa-plus"></i>
                </div>
            </div>
        );
    }
    
    return(
        <div>
            {
                photos.map((photo) => (
                    <div>
                        <img src={photo} alt="" />
                    </div>
                ))
            }
            <div>
                <i className="fa-solid fa-plus"></i>
            </div>
        </div>
    );
}

export default JobPhoto;