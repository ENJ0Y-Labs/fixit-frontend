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
                photos.map((photo, index) => (
                    <div key={photo}>
                        <img src={photo} alt={`Job photo ${index + 1}`} />
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
