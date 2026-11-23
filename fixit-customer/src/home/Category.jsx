import PropTypes from 'prop-types';

function Category({ icon = 'fa-solid fa-screwdriver-wrench', name = 'General Services', onSelect }) {
    return (
        <button type="button" className="category" onClick={onSelect} aria-label={name}>
            <span className="category-icon" aria-hidden="true">
                <i className={`category-symbol ${icon}`} aria-hidden="true" />
            </span>
            <span className="category-name">{name}</span>
        </button>
    );
}

Category.propTypes = {
    icon: PropTypes.string,
    name: PropTypes.string,
    onSelect: PropTypes.func,
};

export default Category;
