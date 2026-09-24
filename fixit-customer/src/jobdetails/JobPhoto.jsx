function JobPhoto({ photos = [] }) {
    const visiblePhotos = photos.slice(0, 4);
    const emptySlots = Math.max(0, 4 - visiblePhotos.length);

    return (
        <div className="job-photo-grid">
            {visiblePhotos.map((photo, index) => (
                <div className="job-photo" key={`${photo}-${index}`}>
                    <img src={photo} alt={`Job photo ${index + 1}`} />
                </div>
            ))}
            {Array.from({ length: emptySlots }).map((_, index) => (
                <button type="button" className="job-photo empty" key={`empty-${index}`} aria-label="Add job photo">
                    <i className="fa-solid fa-plus"></i>
                </button>
            ))}
        </div>
    );
}

export default JobPhoto;
